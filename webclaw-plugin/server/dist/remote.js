import express from "express";
import rateLimit from "express-rate-limit";
import { randomUUID, createHash } from "crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { mcpAuthRouter } from "@modelcontextprotocol/sdk/server/auth/router.js";
import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";
import { GitHubOAuthProvider } from "./oauth.js";
import { registerTools } from "./tools.js";
import { createOctokit } from "./config.js";
// --- Session limits (DoS protection) ---
const MAX_SESSIONS = 1000;
const SESSION_IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const sessions = new Map();
// Secondary index: ownerHash → sessionId
// Allows session lookup when Mcp-Session-Id header is missing (e.g. Cowork)
const ownerIndex = new Map();
// Periodic session cleanup (every 5 min)
const sessionCleanup = setInterval(() => {
    const now = Date.now();
    for (const [id, entry] of sessions) {
        if (now - entry.lastActivity > SESSION_IDLE_TIMEOUT) {
            entry.state.octokit = null;
            entry.state.config = null;
            sessions.delete(id);
            // Clean ownerIndex if it points to this session
            if (ownerIndex.get(entry.ownerHash) === id) {
                ownerIndex.delete(entry.ownerHash);
            }
        }
    }
}, 5 * 60_000);
sessionCleanup.unref();
// --- OAuth provider ---
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${process.env.PORT || "3000"}`;
const provider = new GitHubOAuthProvider();
// --- Helpers ---
function hashToken(token) {
    return createHash("sha256").update(token).digest("hex");
}
// --- Create a new MCP session ---
function createSession(githubToken) {
    const oh = hashToken(githubToken);
    // Replace any existing session for the same owner (1 active session per user)
    const oldSessionId = ownerIndex.get(oh);
    if (oldSessionId) {
        const old = sessions.get(oldSessionId);
        if (old) {
            old.state.octokit = null;
            old.state.config = null;
        }
        sessions.delete(oldSessionId);
        ownerIndex.delete(oh);
    }
    const mcpServer = new McpServer({
        name: "webclaw",
        version: "1.6.2",
    });
    const octokit = createOctokit(githubToken);
    const sessionState = { config: null, octokit };
    registerTools(mcpServer, () => sessionState, (patch) => { Object.assign(sessionState, patch); }, { isRemote: true });
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
            sessions.set(sessionId, entry);
            ownerIndex.set(oh, sessionId);
            console.log(`[session] created (owner=${oh.slice(0, 8)}…)`);
        },
        onsessionclosed: (sessionId) => {
            const closing = sessions.get(sessionId);
            if (closing) {
                closing.state.octokit = null;
                closing.state.config = null;
                if (ownerIndex.get(closing.ownerHash) === sessionId) {
                    ownerIndex.delete(closing.ownerHash);
                }
            }
            sessions.delete(sessionId);
            console.log("[session] closed");
        },
    });
    const entry = {
        transport,
        server: mcpServer,
        state: sessionState,
        ownerHash: oh,
        lastActivity: Date.now(),
    };
    return entry;
}
// --- Express app ---
const app = express();
// Trust Railway's reverse proxy (fixes X-Forwarded-For / rate-limit errors)
app.set("trust proxy", 1);
// JSON body parsing with size limit
app.use(express.json({ limit: "100kb" }));
// Security headers
app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    next();
});
// CORS middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
    if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
    }
    next();
});
// Rate limiting
const globalLimiter = rateLimit({
    windowMs: 60_000, // 1 minute
    max: 120, // 120 req/min per IP
    standardHeaders: true,
    legacyHeaders: false,
});
const authLimiter = rateLimit({
    windowMs: 60_000,
    max: 20, // 20 req/min per IP on auth endpoints
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);
app.use(["/authorize", "/token", "/register", "/github/callback"], authLimiter);
// OAuth routes: /.well-known/*, /authorize, /token, /register
app.use(mcpAuthRouter({
    provider,
    issuerUrl: new URL(SERVER_URL),
    serviceDocumentationUrl: new URL("https://webclaw.nakamacyber.ai"),
}));
// GitHub OAuth callback (our server is the registered callback, not the client)
app.get("/github/callback", async (req, res) => {
    const { code, state } = req.query;
    // Validate types (Express query params can be arrays)
    if (typeof code !== "string" || typeof state !== "string" || !code || !state) {
        res.status(400).json({ error: "Missing or invalid parameters" });
        return;
    }
    try {
        await provider.handleGitHubCallback(code, state, res);
    }
    catch {
        res.status(500).json({ error: "Internal error" });
    }
});
// MCP endpoint — protected by Bearer auth
// resourceMetadataUrl tells the client WHERE to discover OAuth endpoints on 401
const bearerAuth = requireBearerAuth({
    verifier: provider,
    resourceMetadataUrl: `${SERVER_URL}/.well-known/oauth-protected-resource`,
});
app.all("/mcp", bearerAuth, async (req, res) => {
    const githubToken = req.auth.token;
    const tokenHash = hashToken(githubToken);
    const sessionId = req.headers["mcp-session-id"];
    // Path 1: explicit session ID → verify ownership, refresh octokit
    if (sessionId && sessions.has(sessionId)) {
        const entry = sessions.get(sessionId);
        if (entry.ownerHash !== tokenHash) {
            res.status(403).json({ error: "Session belongs to a different user" });
            return;
        }
        entry.state.octokit = createOctokit(githubToken);
        entry.lastActivity = Date.now();
        await entry.transport.handleRequest(req, res, req.body);
        return;
    }
    // Path 2: no session ID (or stale) — fallback via ownerIndex
    // Cowork doesn't propagate Mcp-Session-Id, so we look up by token owner
    if (req.method === "POST") {
        const existingSessionId = ownerIndex.get(tokenHash);
        if (existingSessionId && sessions.has(existingSessionId)) {
            const entry = sessions.get(existingSessionId);
            // Check if this is a re-initialization request (client lost session context)
            const body = req.body;
            const isInit = body?.method === "initialize" ||
                (Array.isArray(body) && body.some((m) => m.method === "initialize"));
            if (isInit) {
                // Client wants to re-initialize → create a fresh session (Path 3 below)
                // createSession will replace the old one via ownerIndex
            }
            else {
                // Inject the session ID so the SDK transport accepts the request
                // Both headers (Express) and rawHeaders (Hono/SDK adapter) must be set
                req.headers["mcp-session-id"] = existingSessionId;
                req.rawHeaders.push("mcp-session-id", existingSessionId);
                entry.state.octokit = createOctokit(githubToken);
                entry.lastActivity = Date.now();
                await entry.transport.handleRequest(req, res, req.body);
                return;
            }
        }
        // Path 3: truly new session (or re-initialization)
        if (sessions.size >= MAX_SESSIONS) {
            res.status(503).json({ error: "Server busy, try again later" });
            return;
        }
        const entry = createSession(githubToken);
        await entry.server.connect(entry.transport);
        await entry.transport.handleRequest(req, res, req.body);
        return;
    }
    // GET or DELETE with unknown/missing session → 404
    res.status(404).json({ error: "Session not found" });
});
// Health check (no sensitive info)
app.get(["/health", "/"], (_req, res) => {
    res.json({
        status: "ok",
        server: "webclaw-mcp",
        version: "1.6.2",
    });
});
// Global error handler — never leak stack traces
app.use((err, _req, res, _next) => {
    console.error("[error]", err.message);
    res.status(500).json({ error: "Internal server error" });
});
// --- Start ---
const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
    console.log(`WebClaw MCP remote server v1.6.2 listening on port ${PORT}`);
});
