import express from "express";
import { randomUUID } from "crypto";
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
// --- Create a new MCP session ---
function createSession(githubToken) {
    const mcpServer = new McpServer({
        name: "webclaw",
        version: "1.6.0",
    });
    const octokit = createOctokit(githubToken);
    const sessionState = { config: null, octokit };
    registerTools(mcpServer, () => sessionState, (patch) => { Object.assign(sessionState, patch); }, { isRemote: true });
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
            sessions.set(sessionId, entry);
            console.log(`[session] created: ${sessionId}`);
        },
        onsessionclosed: (sessionId) => {
            sessions.delete(sessionId);
            console.log(`[session] closed: ${sessionId}`);
        },
    });
    const entry = { transport, server: mcpServer, state: sessionState };
    return entry;
}
// --- Express app ---
const app = express();
// JSON body parsing
app.use(express.json());
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
    const code = req.query.code;
    const state = req.query.state;
    if (!code || !state) {
        res.status(400).json({ error: "Missing code or state parameter" });
        return;
    }
    await provider.handleGitHubCallback(code, state, res);
});
// MCP endpoint — protected by Bearer auth
const bearerAuth = requireBearerAuth({ verifier: provider });
app.all("/mcp", bearerAuth, async (req, res) => {
    const githubToken = req.auth.token;
    const sessionId = req.headers["mcp-session-id"];
    // Existing session: refresh octokit with current token
    if (sessionId && sessions.has(sessionId)) {
        const entry = sessions.get(sessionId);
        entry.state.octokit = createOctokit(githubToken);
        await entry.transport.handleRequest(req, res);
        return;
    }
    // New session (POST without session ID or unknown session ID)
    if (req.method === "POST") {
        const entry = createSession(githubToken);
        await entry.server.connect(entry.transport);
        await entry.transport.handleRequest(req, res);
        return;
    }
    // GET or DELETE with unknown/missing session → 404
    res.status(404).json({ error: "Session not found" });
});
// Health check
app.get(["/health", "/"], (_req, res) => {
    res.json({
        status: "ok",
        server: "webclaw-mcp",
        version: "1.6.0",
        sessions: sessions.size,
    });
});
// --- Start ---
const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
    console.log(`WebClaw MCP remote server v1.6.0 listening on port ${PORT}`);
    console.log(`  MCP endpoint: ${SERVER_URL}/mcp`);
    console.log(`  OAuth:        ${SERVER_URL}/.well-known/oauth-authorization-server`);
    console.log(`  Health check: ${SERVER_URL}/health`);
});
