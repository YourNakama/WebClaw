import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createOctokit } from "./config.js";
import {
  getRepoTree,
  getFileContent,
  createOrUpdateFile,
  deleteFile,
  getFileSha,
  getFileHistory,
  listUserRepos,
} from "./github.js";
import { requestDeviceCode, pollForAccessToken, openBrowser } from "./auth.js";
import { parseFrontmatter, extractTags } from "./frontmatter.js";
import { extractTasks } from "./tasks.js";
import type { VaultConfig, VaultFile, GitHubTreeItem, SessionState } from "./types.js";
import { Octokit } from "@octokit/rest";

// === Helpers ===

function buildTree(items: GitHubTreeItem[], directory?: string): VaultFile[] {
  const filtered = directory
    ? items.filter(
        (i) => i.path.startsWith(directory + "/") || i.path === directory
      )
    : items;

  const roots: VaultFile[] = [];
  const map = new Map<string, VaultFile>();

  for (const item of filtered) {
    const node: VaultFile = {
      name: item.path.split("/").pop() || item.path,
      path: item.path,
      type: item.type === "tree" ? "dir" : "file",
      sha: item.sha,
      size: item.size,
    };
    map.set(item.path, node);
  }

  for (const [path, node] of map) {
    const parentPath = path.includes("/")
      ? path.substring(0, path.lastIndexOf("/"))
      : null;
    if (parentPath && map.has(parentPath)) {
      const parent = map.get(parentPath)!;
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function formatTree(files: VaultFile[], indent = ""): string {
  let out = "";
  for (const f of files) {
    const icon = f.type === "dir" ? "\u{1F4C1}" : "\u{1F4C4}";
    out += `${indent}${icon} ${f.name}\n`;
    if (f.children) {
      out += formatTree(f.children, indent + "  ");
    }
  }
  return out;
}

// === Register all tools ===

export function registerTools(
  server: McpServer,
  getState: () => SessionState,
  setState: (patch: Partial<SessionState>) => void,
  options: {
    isRemote: boolean;
    loadTokenOnly?: () => string | null;
    saveToken?: (token: string, method: VaultConfig["auth_method"]) => void;
    saveConfig?: (config: VaultConfig) => void;
    getConfigPath?: () => string;
    tryLoadConfig?: () => VaultConfig | null;
  }
): void {
  function requireConfig(): { octokit: Octokit; owner: string; repo: string; branch: string } {
    const state = getState();
    if (!state.config || !state.octokit) {
      throw new Error(
        "WebClaw is not configured yet. " +
        "Use webclaw_connect to authenticate with GitHub, then webclaw_select_repo to choose your vault."
      );
    }
    return { octokit: state.octokit, owner: state.config.owner, repo: state.config.repo, branch: state.config.branch };
  }

  // === Tool 0: webclaw_connect ===

  server.tool(
    "webclaw_connect",
    "Authenticate with GitHub using Device Flow. Step 1: call without params to get a code. Step 2: tell the user to open the URL and enter the code. Step 3: call again with device_code to complete authentication.",
    {
      device_code: z
        .string()
        .optional()
        .describe("Device code from step 1. Omit to start a new auth flow."),
    },
    async ({ device_code }, extra) => {
      const state = getState();

      // In remote OAuth mode, auth is already handled by the Bearer middleware
      if (options.isRemote && state.octokit && !device_code) {
        try {
          const { data: user } = await state.octokit.users.getAuthenticated();
          return {
            content: [{
              type: "text" as const,
              text: `Already authenticated as **${user.login}** via MCP OAuth.\n` +
                (state.config
                  ? `Current vault: ${state.config.owner}/${state.config.repo}`
                  : `Use **webclaw_select_repo** to choose your vault.`),
            }],
          };
        } catch {
          // Token invalid — fall through to Device Flow
        }
      }

      // Check if already connected with a valid token
      const existingToken = options.isRemote
        ? state.config?.token ?? null
        : options.loadTokenOnly?.() ?? null;

      if (existingToken && !device_code) {
        try {
          const testOctokit = createOctokit(existingToken);
          const { data: user } = await testOctokit.users.getAuthenticated();
          if (!state.octokit) setState({ octokit: testOctokit });
          return {
            content: [
              {
                type: "text" as const,
                text:
                  `Already connected as **${user.login}**.\n\n` +
                  (state.config
                    ? `Current vault: ${state.config.owner}/${state.config.repo} (${state.config.branch})\nAll tools are ready.`
                    : `Use **webclaw_select_repo** to choose your vault.`),
              },
            ],
          };
        } catch {
          // Token invalid — proceed with Device Flow
        }
      }

      // Step 2: Poll for token (user already has the code)
      if (device_code) {
        const tokenResponse = await pollForAccessToken(
          device_code,
          5,
          900,
          extra.signal
        );

        if (!options.isRemote) {
          options.saveToken?.(tokenResponse.access_token, "oauth_device_flow");
        }

        const newOctokit = createOctokit(tokenResponse.access_token);
        const { data: user } = await newOctokit.users.getAuthenticated();

        setState({ octokit: newOctokit });

        if (!options.isRemote) {
          const reloaded = options.tryLoadConfig?.() ?? null;
          if (reloaded) {
            setState({ config: reloaded });
          }
        }

        return {
          content: [
            {
              type: "text" as const,
              text:
                `Connected as **${user.login}**.\n` +
                `Use **webclaw_select_repo** to choose your vault repository.`,
            },
          ],
        };
      }

      // Step 1: Start Device Flow — return code immediately
      const deviceCodeResponse = await requestDeviceCode();

      if (!options.isRemote) {
        openBrowser(deviceCodeResponse.verification_uri);
      }

      return {
        content: [
          {
            type: "text" as const,
            text:
              `Go to: **${deviceCodeResponse.verification_uri}**\n` +
              `Enter the code: **${deviceCodeResponse.user_code}**\n\n` +
              `Once authorized, call webclaw_connect again with device_code="${deviceCodeResponse.device_code}" to complete.`,
          },
        ],
      };
    }
  );

  // === Tool 0b: webclaw_select_repo ===

  server.tool(
    "webclaw_select_repo",
    "Select a GitHub repository as your vault. Without repo_name, lists your repos. With repo_name (owner/repo format), selects it.",
    {
      repo_name: z
        .string()
        .optional()
        .describe("Repository in 'owner/repo' format. Omit to list available repos."),
      branch: z
        .string()
        .optional()
        .describe("Branch to use (default: repo's default branch)"),
      filter: z
        .string()
        .optional()
        .describe("Filter repos by name (substring match)"),
    },
    async ({ repo_name, branch, filter }) => {
      const state = getState();

      // Need a token first
      const token = options.isRemote
        ? state.config?.token ?? (state.octokit ? "__from_octokit__" : null)
        : options.loadTokenOnly?.() ?? null;

      // In remote mode, we get the octokit from state directly
      if (!token && !state.octokit) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Not authenticated yet. Use **webclaw_connect** first.",
            },
          ],
        };
      }

      const kit = state.octokit || (token && token !== "__from_octokit__" ? createOctokit(token) : null);
      if (!kit) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Not authenticated yet. Use **webclaw_connect** first.",
            },
          ],
        };
      }
      if (!state.octokit) setState({ octokit: kit });

      // List mode: no repo_name provided
      if (!repo_name) {
        let repos = await listUserRepos(kit, 30);

        if (filter) {
          const f = filter.toLowerCase();
          repos = repos.filter((r) => r.full_name.toLowerCase().includes(f));
        }

        if (repos.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: filter
                  ? `No repos matching "${filter}". Try without filter or check your access.`
                  : "No repositories found. Check your GitHub permissions.",
              },
            ],
          };
        }

        let text = `Your repositories (${repos.length}):\n\n`;
        for (const r of repos) {
          const vis = r.private ? "private" : "public";
          const desc = r.description ? ` \u2014 ${r.description}` : "";
          text += `  ${r.full_name} (${vis}, ${r.default_branch})${desc}\n`;
        }
        text += `\nUse webclaw_select_repo with repo_name="owner/repo" to select one.`;

        return { content: [{ type: "text" as const, text }] };
      }

      // Select mode: repo_name provided
      const parts = repo_name.split("/");
      if (parts.length !== 2) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Invalid format. Use "owner/repo" (e.g. "johndoe/my-vault").`,
            },
          ],
        };
      }

      const [owner, repo] = parts;

      // Validate access
      try {
        const { data: repoData } = await kit.repos.get({ owner, repo });
        const selectedBranch = branch || repoData.default_branch;

        // Get token from octokit auth (for remote mode, we need to extract it)
        let tokenForConfig: string;
        if (options.isRemote) {
          // In remote mode, get token from the authenticated octokit
          const auth = await kit.auth() as { token?: string };
          tokenForConfig = auth.token || "";
        } else {
          tokenForConfig = options.loadTokenOnly?.() || "";
        }

        const newConfig: VaultConfig = {
          token: tokenForConfig,
          owner,
          repo,
          branch: selectedBranch,
          auth_method: state.config?.auth_method || "oauth_device_flow",
        };

        if (!options.isRemote) {
          options.saveConfig?.(newConfig);
        }

        setState({ config: newConfig });

        const configInfo = options.isRemote
          ? ""
          : `\nConfig saved to: ${options.getConfigPath?.() ?? "~/.webclaw/config.json"}`;

        return {
          content: [
            {
              type: "text" as const,
              text:
                `Vault configured: **${owner}/${repo}** (${selectedBranch})` +
                configInfo +
                `\n\nAll WebClaw tools are now active.`,
            },
          ],
        };
      } catch (err: unknown) {
        const status =
          err instanceof Error && "status" in err
            ? (err as { status: number }).status
            : 0;
        if (status === 404) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Repository ${owner}/${repo} not found or no access. Check the name and your permissions.`,
              },
            ],
          };
        }
        throw err;
      }
    }
  );

  // === Tool 1: webclaw_list_files ===

  server.tool(
    "webclaw_list_files",
    "List files and directories in the vault. Returns a tree view of the repository.",
    {
      directory: z.string().optional().describe("Subdirectory to list (default: root)"),
      recursive: z
        .boolean()
        .optional()
        .default(true)
        .describe("Include subdirectories recursively"),
      extension: z
        .string()
        .optional()
        .describe("Filter by file extension (e.g. '.md')"),
    },
    async ({ directory, recursive, extension }) => {
      const ctx = requireConfig();
      const items = await getRepoTree(ctx.octokit, ctx.owner, ctx.repo, ctx.branch);

      let filtered = items;
      if (directory) {
        filtered = items.filter(
          (i) => i.path.startsWith(directory + "/") || i.path === directory
        );
      }
      if (!recursive) {
        const prefix = directory ? directory + "/" : "";
        filtered = filtered.filter((i) => {
          const rel = prefix ? i.path.replace(prefix, "") : i.path;
          return !rel.includes("/");
        });
      }
      if (extension) {
        filtered = filtered.filter(
          (i) => i.type === "tree" || i.path.endsWith(extension)
        );
      }

      const tree = buildTree(filtered, directory);
      const text = formatTree(tree);
      const fileCount = filtered.filter((i) => i.type === "blob").length;
      const dirCount = filtered.filter((i) => i.type === "tree").length;

      return {
        content: [
          {
            type: "text" as const,
            text:
              `\u{1F4C2} ${ctx.owner}/${ctx.repo} ${directory ? `/ ${directory}` : ""}\n` +
              `${fileCount} files, ${dirCount} folders\n\n` +
              text,
          },
        ],
      };
    }
  );

  // === Tool 2: webclaw_read_file ===

  server.tool(
    "webclaw_read_file",
    "Read the content of a file from the vault.",
    {
      path: z.string().describe("Path to the file in the vault"),
    },
    async ({ path }) => {
      const ctx = requireConfig();
      const { content, sha } = await getFileContent(ctx.octokit, ctx.owner, ctx.repo, path);
      const frontmatter = parseFrontmatter(content);

      let header = `\u{1F4C4} ${path} (sha: ${sha.substring(0, 7)})\n`;
      if (frontmatter) {
        header += `Frontmatter: ${JSON.stringify(frontmatter, null, 2)}\n`;
      }
      header += "---\n\n";

      return {
        content: [{ type: "text" as const, text: header + content }],
      };
    }
  );

  // === Tool 3: webclaw_create_file ===

  server.tool(
    "webclaw_create_file",
    "Create a new file in the vault. Commits directly to the configured branch.",
    {
      path: z.string().describe("Path for the new file"),
      content: z.string().describe("File content"),
      message: z
        .string()
        .optional()
        .describe("Commit message (auto-generated if omitted)"),
    },
    async ({ path, content, message }) => {
      const ctx = requireConfig();
      const commitMsg = message || `Create ${path}`;
      const sha = await createOrUpdateFile(
        ctx.octokit,
        ctx.owner,
        ctx.repo,
        path,
        content,
        commitMsg
      );

      return {
        content: [
          {
            type: "text" as const,
            text:
              `\u2705 Created ${path}\n` +
              `Commit: ${commitMsg}\n` +
              `SHA: ${sha.substring(0, 7)}`,
          },
        ],
      };
    }
  );

  // === Tool 4: webclaw_update_file ===

  server.tool(
    "webclaw_update_file",
    "Update an existing file in the vault. Supports full replacement or partial text substitution. Fetches the latest SHA to prevent conflicts.",
    {
      path: z.string().describe("Path to the file to update"),
      content: z
        .string()
        .optional()
        .describe("Full replacement content (use this OR old_text+new_text)"),
      old_text: z
        .string()
        .optional()
        .describe("Text to find and replace (use with new_text)"),
      new_text: z
        .string()
        .optional()
        .describe("Replacement text (use with old_text)"),
      message: z.string().optional().describe("Commit message"),
    },
    async ({ path, content, old_text, new_text, message }) => {
      const ctx = requireConfig();
      const current = await getFileContent(ctx.octokit, ctx.owner, ctx.repo, path);
      let newContent: string;

      if (content !== undefined) {
        newContent = content;
      } else if (old_text !== undefined && new_text !== undefined) {
        if (!current.content.includes(old_text)) {
          return {
            content: [
              {
                type: "text" as const,
                text: `\u274C Could not find the specified text in ${path}. No changes made.`,
              },
            ],
          };
        }
        newContent = current.content.replace(old_text, new_text);
      } else {
        return {
          content: [
            {
              type: "text" as const,
              text: "\u274C Provide either 'content' for full replacement, or 'old_text' + 'new_text' for partial update.",
            },
          ],
        };
      }

      const commitMsg = message || `Update ${path}`;

      let sha: string;
      try {
        sha = await createOrUpdateFile(
          ctx.octokit, ctx.owner, ctx.repo, path, newContent, commitMsg, current.sha
        );
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          "status" in err &&
          (err as { status: number }).status === 409
        ) {
          const freshSha = await getFileSha(ctx.octokit, ctx.owner, ctx.repo, path);
          sha = await createOrUpdateFile(
            ctx.octokit, ctx.owner, ctx.repo, path, newContent, commitMsg, freshSha
          );
        } else {
          throw err;
        }
      }

      return {
        content: [
          {
            type: "text" as const,
            text:
              `\u2705 Updated ${path}\n` +
              `Commit: ${commitMsg}\n` +
              `SHA: ${sha.substring(0, 7)}`,
          },
        ],
      };
    }
  );

  // === Tool 5: webclaw_delete_file ===

  server.tool(
    "webclaw_delete_file",
    "Delete a file from the vault.",
    {
      path: z.string().describe("Path to the file to delete"),
      message: z.string().optional().describe("Commit message"),
    },
    async ({ path, message }) => {
      const ctx = requireConfig();
      const sha = await getFileSha(ctx.octokit, ctx.owner, ctx.repo, path);
      const commitMsg = message || `Delete ${path}`;
      await deleteFile(ctx.octokit, ctx.owner, ctx.repo, path, commitMsg, sha);

      return {
        content: [
          {
            type: "text" as const,
            text: `\u{1F5D1}\uFE0F Deleted ${path}\nCommit: ${commitMsg}`,
          },
        ],
      };
    }
  );

  // === Tool 6: webclaw_search_content ===

  server.tool(
    "webclaw_search_content",
    "Search for text across vault files. Scans file contents in batches.",
    {
      query: z.string().describe("Text to search for (case-insensitive)"),
      directory: z.string().optional().describe("Limit search to a subdirectory"),
      extension: z
        .string()
        .optional()
        .default(".md")
        .describe("File extension filter (default: .md)"),
      max_results: z
        .number()
        .optional()
        .default(20)
        .describe("Maximum results to return (default: 20, max: 50)"),
    },
    async ({ query, directory, extension, max_results }) => {
      const ctx = requireConfig();
      const items = await getRepoTree(ctx.octokit, ctx.owner, ctx.repo, ctx.branch);
      let files = items.filter((i) => i.type === "blob");

      if (directory) {
        files = files.filter((i) => i.path.startsWith(directory + "/"));
      }
      if (extension) {
        files = files.filter((i) => i.path.endsWith(extension));
      }

      const limit = Math.min(max_results || 20, 50);
      const results: Array<{ path: string; matches: string[] }> = [];
      const queryLower = query.toLowerCase();
      const batchSize = 5;

      for (let i = 0; i < files.length && results.length < limit; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const contents = await Promise.all(
          batch.map(async (f) => {
            try {
              return {
                path: f.path,
                ...(await getFileContent(ctx.octokit, ctx.owner, ctx.repo, f.path)),
              };
            } catch {
              return null;
            }
          })
        );

        for (const file of contents) {
          if (!file || results.length >= limit) continue;
          const lines = file.content.split("\n");
          const matches: string[] = [];
          for (let ln = 0; ln < lines.length; ln++) {
            if (lines[ln].toLowerCase().includes(queryLower)) {
              matches.push(`  L${ln + 1}: ${lines[ln].trimStart().substring(0, 120)}`);
            }
          }
          if (matches.length > 0) {
            results.push({ path: file.path, matches: matches.slice(0, 5) });
          }
        }
      }

      if (results.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `\u{1F50D} No results for "${query}" in ${directory || "vault"}`,
            },
          ],
        };
      }

      let text = `\u{1F50D} Found "${query}" in ${results.length} file(s):\n\n`;
      for (const r of results) {
        text += `\u{1F4C4} ${r.path}\n${r.matches.join("\n")}\n\n`;
      }
      return { content: [{ type: "text" as const, text }] };
    }
  );

  // === Tool 7: webclaw_get_tasks ===

  server.tool(
    "webclaw_get_tasks",
    "Extract checkbox tasks (- [ ] / - [x]) from vault files.",
    {
      directory: z.string().optional().describe("Limit to a subdirectory"),
      status: z
        .enum(["all", "pending", "completed"])
        .optional()
        .default("all")
        .describe("Filter by completion status"),
    },
    async ({ directory, status }) => {
      const ctx = requireConfig();
      const items = await getRepoTree(ctx.octokit, ctx.owner, ctx.repo, ctx.branch);
      let files = items.filter(
        (i) => i.type === "blob" && i.path.endsWith(".md")
      );
      if (directory) {
        files = files.filter((i) => i.path.startsWith(directory + "/"));
      }

      const allTasks: Array<{
        filePath: string;
        line: number;
        text: string;
        completed: boolean;
      }> = [];

      const batchSize = 5;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const contents = await Promise.all(
          batch.map(async (f) => {
            try {
              const { content } = await getFileContent(ctx.octokit, ctx.owner, ctx.repo, f.path);
              const tags = extractTags(content);
              return { path: f.path, tasks: extractTasks(content, f.path, tags) };
            } catch {
              return null;
            }
          })
        );

        for (const file of contents) {
          if (!file) continue;
          allTasks.push(...file.tasks);
        }
      }

      let filtered = allTasks;
      if (status === "pending") filtered = allTasks.filter((t) => !t.completed);
      if (status === "completed") filtered = allTasks.filter((t) => t.completed);

      const pending = allTasks.filter((t) => !t.completed).length;
      const completed = allTasks.filter((t) => t.completed).length;
      const total = allTasks.length;

      let text = `\u2705 Tasks in ${directory || "vault"}\n`;
      text += `Total: ${total} | Pending: ${pending} | Completed: ${completed}\n`;
      if (total > 0) {
        text += `Progress: ${Math.round((completed / total) * 100)}%\n`;
      }
      text += "\n";

      for (const t of filtered) {
        const check = t.completed ? "\u2611" : "\u2610";
        text += `${check} ${t.text}  (${t.filePath}:${t.line})\n`;
      }

      return { content: [{ type: "text" as const, text }] };
    }
  );

  // === Tool 8: webclaw_get_tags ===

  server.tool(
    "webclaw_get_tags",
    "Extract tags from frontmatter across vault files, sorted by frequency.",
    {
      directory: z.string().optional().describe("Limit to a subdirectory"),
    },
    async ({ directory }) => {
      const ctx = requireConfig();
      const items = await getRepoTree(ctx.octokit, ctx.owner, ctx.repo, ctx.branch);
      let files = items.filter(
        (i) => i.type === "blob" && i.path.endsWith(".md")
      );
      if (directory) {
        files = files.filter((i) => i.path.startsWith(directory + "/"));
      }

      const tagCounts = new Map<string, number>();
      const tagFiles = new Map<string, string[]>();

      const batchSize = 5;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const contents = await Promise.all(
          batch.map(async (f) => {
            try {
              const { content } = await getFileContent(ctx.octokit, ctx.owner, ctx.repo, f.path);
              return { path: f.path, tags: extractTags(content) };
            } catch {
              return null;
            }
          })
        );

        for (const file of contents) {
          if (!file) continue;
          for (const tag of file.tags) {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            if (!tagFiles.has(tag)) tagFiles.set(tag, []);
            tagFiles.get(tag)!.push(file.path);
          }
        }
      }

      const sorted = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]);

      if (sorted.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "\u{1F3F7}\uFE0F No tags found in vault frontmatter.",
            },
          ],
        };
      }

      let text = `\u{1F3F7}\uFE0F Tags in ${directory || "vault"} (${sorted.length} unique)\n\n`;
      for (const [tag, count] of sorted) {
        text += `  #${tag}  \u00D7${count}  (${tagFiles.get(tag)!.slice(0, 3).join(", ")}${count > 3 ? "\u2026" : ""})\n`;
      }

      return { content: [{ type: "text" as const, text }] };
    }
  );

  // === Tool 9: webclaw_file_history ===

  server.tool(
    "webclaw_file_history",
    "Get the commit history for a file in the vault.",
    {
      path: z.string().describe("Path to the file"),
      limit: z
        .number()
        .optional()
        .default(10)
        .describe("Number of commits to return (default: 10)"),
    },
    async ({ path, limit }) => {
      const ctx = requireConfig();
      const history = await getFileHistory(
        ctx.octokit, ctx.owner, ctx.repo, path, limit || 10
      );

      if (history.length === 0) {
        return {
          content: [
            { type: "text" as const, text: `\u{1F4DC} No history found for ${path}` },
          ],
        };
      }

      let text = `\u{1F4DC} History for ${path} (${history.length} commits)\n\n`;
      for (const h of history) {
        const date = h.date ? new Date(h.date).toLocaleDateString() : "unknown";
        text += `  ${h.sha.substring(0, 7)} | ${date} | ${h.author} | ${h.message}\n`;
      }

      return { content: [{ type: "text" as const, text }] };
    }
  );

  // === Tool 10: webclaw_vault_stats ===

  server.tool(
    "webclaw_vault_stats",
    "Get an overview of the vault: file counts, types, tags, tasks summary.",
    {},
    async () => {
      const ctx = requireConfig();
      const items = await getRepoTree(ctx.octokit, ctx.owner, ctx.repo, ctx.branch);
      const files = items.filter((i) => i.type === "blob");
      const dirs = items.filter((i) => i.type === "tree");

      const extCounts = new Map<string, number>();
      for (const f of files) {
        const ext = f.path.includes(".")
          ? "." + f.path.split(".").pop()
          : "(no ext)";
        extCounts.set(ext, (extCounts.get(ext) || 0) + 1);
      }

      const mdFiles = files.filter((f) => f.path.endsWith(".md"));
      let totalTasks = 0;
      let completedTasks = 0;
      const allTags = new Set<string>();

      const batchSize = 5;
      for (let i = 0; i < mdFiles.length; i += batchSize) {
        const batch = mdFiles.slice(i, i + batchSize);
        const contents = await Promise.all(
          batch.map(async (f) => {
            try {
              const { content } = await getFileContent(ctx.octokit, ctx.owner, ctx.repo, f.path);
              const tags = extractTags(content);
              const tasks = extractTasks(content, f.path, tags);
              return { tags, tasks };
            } catch {
              return null;
            }
          })
        );

        for (const file of contents) {
          if (!file) continue;
          for (const tag of file.tags) allTags.add(tag);
          totalTasks += file.tasks.length;
          completedTasks += file.tasks.filter((t) => t.completed).length;
        }
      }

      const extList = [...extCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([ext, count]) => `  ${ext}: ${count}`)
        .join("\n");

      let text = `\u{1F4CA} Vault Overview \u2014 ${ctx.owner}/${ctx.repo}\n\n`;
      text += `Files: ${files.length} | Folders: ${dirs.length}\n`;
      text += `Markdown files: ${mdFiles.length}\n\n`;
      text += `By type:\n${extList}\n\n`;
      text += `Tags: ${allTags.size} unique (${[...allTags].slice(0, 10).map((t) => `#${t}`).join(", ")}${allTags.size > 10 ? "\u2026" : ""})\n\n`;
      text += `Tasks: ${totalTasks} total | ${completedTasks} completed | ${totalTasks - completedTasks} pending\n`;
      if (totalTasks > 0) {
        text += `Progress: ${Math.round((completedTasks / totalTasks) * 100)}%\n`;
      }
      text += `\n---\n`;
      text += `Vault managed by WebClaw plugin.`;

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
