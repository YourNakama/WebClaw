import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "crypto";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { registerTools } from "./tools.js";
import type { SessionState } from "./types.js";

// --- Per-session state ---

interface SessionEntry {
  transport: StreamableHTTPServerTransport;
  server: McpServer;
  state: SessionState;
}

const sessions = new Map<string, SessionEntry>();

// --- CORS headers for Claude.ai / Cowork ---

function setCorsHeaders(res: ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Mcp-Session-Id, Mcp-Protocol-Version");
  res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
}

// --- Create a new MCP session ---

function createSession(): SessionEntry {
  const mcpServer = new McpServer({
    name: "webclaw",
    version: "1.5.0",
  });

  const sessionState: SessionState = { config: null, octokit: null };

  registerTools(
    mcpServer,
    () => sessionState,
    (patch) => { Object.assign(sessionState, patch); },
    { isRemote: true }
  );

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (sessionId: string) => {
      sessions.set(sessionId, entry);
      console.log(`[session] created: ${sessionId}`);
    },
    onsessionclosed: (sessionId: string) => {
      sessions.delete(sessionId);
      console.log(`[session] closed: ${sessionId}`);
    },
  });

  const entry: SessionEntry = { transport, server: mcpServer, state: sessionState };
  return entry;
}

// --- HTTP server ---

const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  setCorsHeaders(res);

  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (url.pathname === "/health" || url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "ok",
      server: "webclaw-mcp",
      version: "1.5.0",
      sessions: sessions.size,
    }));
    return;
  }

  // MCP endpoint
  if (url.pathname === "/mcp") {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    // Try to find existing session
    if (sessionId && sessions.has(sessionId)) {
      const entry = sessions.get(sessionId)!;
      await entry.transport.handleRequest(req, res);
      return;
    }

    // New session (initialization request — POST without session ID, or with unknown session ID)
    if (req.method === "POST") {
      const entry = createSession();
      await entry.server.connect(entry.transport);
      await entry.transport.handleRequest(req, res);
      return;
    }

    // GET or DELETE with unknown/missing session → 404
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Session not found" }));
    return;
  }

  // 404 for anything else
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

// --- Start ---

const PORT = parseInt(process.env.PORT || "3000", 10);

httpServer.listen(PORT, () => {
  console.log(`WebClaw MCP remote server v1.5.0 listening on port ${PORT}`);
  console.log(`  MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`  Health check: http://localhost:${PORT}/health`);
});
