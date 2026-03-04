import express from "express";
import { randomUUID, createHash } from "crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { mcpAuthRouter } from "@modelcontextprotocol/sdk/server/auth/router.js";
import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";
import { GitHubOAuthProvider } from "./oauth.js";
import { registerTools } from "./tools.js";
import { createOctokit } from "./config.js";
const sessions = new Map();
// --- OAuth provider ---
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${process.env.PORT || "3000"}`;
const provider = new GitHubOAuthProvider();
// --- Helpers ---
function hashToken(token) {
    return createHash("sha256").update(token).digest("hex");
}
// --- Create a new MCP session ---
function createSession(githubToken) {
    const mcpServer = new McpServer({
        name: "webclaw",
        version: "1.6.1",
    });
    const octokit = createOctokit(githubToken);
    const sessionState = { config: null, octokit };
    registerTools(mcpServer, () => sessionState, (patch) => { Object.assign(sessionState, patch); }, { isRemote: true });
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
            sessions.set(sessionId, entry);
            console.log("[session] created");
        },
        onsessionclosed: (sessionId) => {
            sessions.delete(sessionId);
            console.log("[session] closed");
        },
    });
    const entry = {
        transport,
        server: mcpServer,
        state: sessionState,
        ownerHash: hashToken(githubToken),
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
    // Existing session: verify ownership, then refresh octokit
    if (sessionId && sessions.has(sessionId)) {
        const entry = sessions.get(sessionId);
        // Session must belong to the same user (token hash match)
        if (entry.ownerHash !== tokenHash) {
            res.status(403).json({ error: "Session belongs to a different user" });
            return;
        }
        entry.state.octokit = createOctokit(githubToken);
        await entry.transport.handleRequest(req, res, req.body);
        return;
    }
    // New session (POST without session ID or unknown session ID)
    if (req.method === "POST") {
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
        version: "1.6.1",
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
    console.log(`WebClaw MCP remote server v1.6.1 listening on port ${PORT}`);
});
