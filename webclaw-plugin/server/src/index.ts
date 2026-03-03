#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { tryLoadConfig, saveConfig, saveToken, loadTokenOnly, getConfigPath, createOctokit } from "./config.js";
import { registerTools } from "./tools.js";
import type { SessionState } from "./types.js";

// --- Mutable state: config can be set at runtime via webclaw_connect + webclaw_select_repo ---
let state: SessionState = {
  config: tryLoadConfig(),
  octokit: null,
};
if (state.config) state.octokit = createOctokit(state.config.token);

const server = new McpServer({
  name: "webclaw",
  version: "1.3.1",
});

// === Prompts ===

server.prompt(
  "webclaw_onboarding",
  "Guide the user through initial WebClaw setup when not configured",
  () => {
    if (state.config) {
      return {
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `WebClaw is already configured for ${state.config.owner}/${state.config.repo} (branch: ${state.config.branch}). All tools are ready to use.`,
            },
          },
        ],
      };
    }

    return {
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text:
              "WebClaw is not configured yet. To connect your GitHub vault:\n\n" +
              "1. Use **webclaw_connect** — I'll open your browser for GitHub authentication (no token needed)\n" +
              "2. Use **webclaw_select_repo** — Choose which repo to use as your vault\n\n" +
              "Say 'connect my vault' to get started!",
          },
        },
      ],
    };
  }
);

// === Register all tools ===

registerTools(
  server,
  () => state,
  (patch) => { state = { ...state, ...patch }; },
  {
    isRemote: false,
    loadTokenOnly,
    saveToken,
    saveConfig,
    getConfigPath,
    tryLoadConfig,
  }
);

// === Start server ===

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("WebClaw MCP server v1.3.1 running on stdio");
  if (!state.config) {
    console.error("⚠️  No config found — use webclaw_connect to authenticate");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
