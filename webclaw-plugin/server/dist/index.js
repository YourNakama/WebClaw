#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { tryLoadConfig, saveConfig, getConfigPath, createOctokit } from "./config.js";
import { getRepoTree, getFileContent, createOrUpdateFile, deleteFile, getFileSha, getFileHistory, } from "./github.js";
import { parseFrontmatter, extractTags } from "./frontmatter.js";
import { extractTasks } from "./tasks.js";
// --- Mutable state: config can be set at runtime via webclaw_setup ---
let config = tryLoadConfig();
let octokit = config ? createOctokit(config.token) : null;
function requireConfig() {
    if (!config || !octokit) {
        throw new Error("WebClaw is not configured yet. " +
            "Please use the webclaw_setup tool first to connect your GitHub vault.\n\n" +
            "I need: your GitHub token, repo owner, repo name, and branch.");
    }
    return { octokit, owner: config.owner, repo: config.repo, branch: config.branch };
}
const server = new McpServer({
    name: "webclaw",
    version: "1.0.0",
});
// === Prompts ===
server.prompt("webclaw_onboarding", "Guide the user through initial WebClaw setup when not configured", () => {
    if (config) {
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `WebClaw is already configured for ${config.owner}/${config.repo} (branch: ${config.branch}). All tools are ready to use.`,
                    },
                },
            ],
        };
    }
    return {
        messages: [
            {
                role: "user",
                content: {
                    type: "text",
                    text: "WebClaw is not configured yet. To connect your GitHub vault, I need:\n\n" +
                        "1. **GitHub Personal Access Token** — Create one at https://github.com/settings/tokens with 'repo' scope\n" +
                        "2. **Repository owner** — Your GitHub username or org\n" +
                        "3. **Repository name** — The repo used as your vault\n" +
                        "4. **Branch** — Usually 'main'\n\n" +
                        "You can either:\n" +
                        "- Set these in the plugin's environment variables (Connecteurs → webclaw → Modifier)\n" +
                        "- Or tell me your credentials and I'll use the webclaw_setup tool\n\n" +
                        "Please provide your GitHub token, repo owner, and repo name.",
                },
            },
        ],
    };
});
// === Helpers ===
function buildTree(items, directory) {
    const filtered = directory
        ? items.filter((i) => i.path.startsWith(directory + "/") || i.path === directory)
        : items;
    const roots = [];
    const map = new Map();
    for (const item of filtered) {
        const node = {
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
            const parent = map.get(parentPath);
            if (!parent.children)
                parent.children = [];
            parent.children.push(node);
        }
        else {
            roots.push(node);
        }
    }
    return roots;
}
function formatTree(files, indent = "") {
    let out = "";
    for (const f of files) {
        const icon = f.type === "dir" ? "📁" : "📄";
        out += `${indent}${icon} ${f.name}\n`;
        if (f.children) {
            out += formatTree(f.children, indent + "  ");
        }
    }
    return out;
}
// === Tool 0: webclaw_setup ===
server.tool("webclaw_setup", "Configure WebClaw with your GitHub vault credentials. Creates ~/.webclaw/config.json. This is required before using any other WebClaw tool.", {
    token: z
        .string()
        .describe("GitHub Personal Access Token with 'repo' scope. Create one at https://github.com/settings/tokens"),
    owner: z.string().describe("GitHub username or organization that owns the vault repo"),
    repo: z.string().describe("GitHub repository name used as your vault"),
    branch: z
        .string()
        .optional()
        .default("main")
        .describe("Branch to use (default: main)"),
}, async ({ token, owner, repo, branch }) => {
    // Validate the credentials by testing the API
    const testOctokit = createOctokit(token);
    try {
        await testOctokit.repos.get({ owner, repo });
    }
    catch (err) {
        const status = err instanceof Error && "status" in err
            ? err.status
            : 0;
        if (status === 401) {
            return {
                content: [
                    {
                        type: "text",
                        text: "❌ Invalid GitHub token. Make sure your token has the 'repo' scope.\n" +
                            "Create one at: https://github.com/settings/tokens",
                    },
                ],
            };
        }
        if (status === 404) {
            return {
                content: [
                    {
                        type: "text",
                        text: `❌ Repository ${owner}/${repo} not found. Check the owner and repo name, and make sure your token has access.`,
                    },
                ],
            };
        }
        throw err;
    }
    // Save config
    const newConfig = { token, owner, repo, branch: branch || "main" };
    saveConfig(newConfig);
    // Activate in current session
    config = newConfig;
    octokit = testOctokit;
    return {
        content: [
            {
                type: "text",
                text: `✅ WebClaw configured successfully!\n\n` +
                    `  Vault: ${owner}/${repo} (${branch || "main"})\n` +
                    `  Config: ${getConfigPath()}\n\n` +
                    `You can now use all WebClaw tools to browse, read, write, and search your vault.`,
            },
        ],
    };
});
// === Tool 1: webclaw_list_files ===
server.tool("webclaw_list_files", "List files and directories in the vault. Returns a tree view of the repository.", {
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
}, async ({ directory, recursive, extension }) => {
    const ctx = requireConfig();
    const items = await getRepoTree(ctx.octokit, ctx.owner, ctx.repo, ctx.branch);
    let filtered = items;
    if (directory) {
        filtered = items.filter((i) => i.path.startsWith(directory + "/") || i.path === directory);
    }
    if (!recursive) {
        const prefix = directory ? directory + "/" : "";
        filtered = filtered.filter((i) => {
            const rel = prefix ? i.path.replace(prefix, "") : i.path;
            return !rel.includes("/");
        });
    }
    if (extension) {
        filtered = filtered.filter((i) => i.type === "tree" || i.path.endsWith(extension));
    }
    const tree = buildTree(filtered, directory);
    const text = formatTree(tree);
    const fileCount = filtered.filter((i) => i.type === "blob").length;
    const dirCount = filtered.filter((i) => i.type === "tree").length;
    return {
        content: [
            {
                type: "text",
                text: `📂 ${ctx.owner}/${ctx.repo} ${directory ? `/ ${directory}` : ""}\n` +
                    `${fileCount} files, ${dirCount} folders\n\n` +
                    text,
            },
        ],
    };
});
// === Tool 2: webclaw_read_file ===
server.tool("webclaw_read_file", "Read the content of a file from the vault.", {
    path: z.string().describe("Path to the file in the vault"),
}, async ({ path }) => {
    const ctx = requireConfig();
    const { content, sha } = await getFileContent(ctx.octokit, ctx.owner, ctx.repo, path);
    const frontmatter = parseFrontmatter(content);
    let header = `📄 ${path} (sha: ${sha.substring(0, 7)})\n`;
    if (frontmatter) {
        header += `Frontmatter: ${JSON.stringify(frontmatter, null, 2)}\n`;
    }
    header += "---\n\n";
    return {
        content: [{ type: "text", text: header + content }],
    };
});
// === Tool 3: webclaw_create_file ===
server.tool("webclaw_create_file", "Create a new file in the vault. Commits directly to the configured branch.", {
    path: z.string().describe("Path for the new file"),
    content: z.string().describe("File content"),
    message: z
        .string()
        .optional()
        .describe("Commit message (auto-generated if omitted)"),
}, async ({ path, content, message }) => {
    const ctx = requireConfig();
    const commitMsg = message || `Create ${path}`;
    const sha = await createOrUpdateFile(ctx.octokit, ctx.owner, ctx.repo, path, content, commitMsg);
    return {
        content: [
            {
                type: "text",
                text: `✅ Created ${path}\n` +
                    `Commit: ${commitMsg}\n` +
                    `SHA: ${sha.substring(0, 7)}`,
            },
        ],
    };
});
// === Tool 4: webclaw_update_file ===
server.tool("webclaw_update_file", "Update an existing file in the vault. Supports full replacement or partial text substitution. Fetches the latest SHA to prevent conflicts.", {
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
}, async ({ path, content, old_text, new_text, message }) => {
    const ctx = requireConfig();
    const current = await getFileContent(ctx.octokit, ctx.owner, ctx.repo, path);
    let newContent;
    if (content !== undefined) {
        newContent = content;
    }
    else if (old_text !== undefined && new_text !== undefined) {
        if (!current.content.includes(old_text)) {
            return {
                content: [
                    {
                        type: "text",
                        text: `❌ Could not find the specified text in ${path}. No changes made.`,
                    },
                ],
            };
        }
        newContent = current.content.replace(old_text, new_text);
    }
    else {
        return {
            content: [
                {
                    type: "text",
                    text: "❌ Provide either 'content' for full replacement, or 'old_text' + 'new_text' for partial update.",
                },
            ],
        };
    }
    const commitMsg = message || `Update ${path}`;
    let sha;
    try {
        sha = await createOrUpdateFile(ctx.octokit, ctx.owner, ctx.repo, path, newContent, commitMsg, current.sha);
    }
    catch (err) {
        if (err instanceof Error &&
            "status" in err &&
            err.status === 409) {
            const freshSha = await getFileSha(ctx.octokit, ctx.owner, ctx.repo, path);
            sha = await createOrUpdateFile(ctx.octokit, ctx.owner, ctx.repo, path, newContent, commitMsg, freshSha);
        }
        else {
            throw err;
        }
    }
    return {
        content: [
            {
                type: "text",
                text: `✅ Updated ${path}\n` +
                    `Commit: ${commitMsg}\n` +
                    `SHA: ${sha.substring(0, 7)}`,
            },
        ],
    };
});
// === Tool 5: webclaw_delete_file ===
server.tool("webclaw_delete_file", "Delete a file from the vault.", {
    path: z.string().describe("Path to the file to delete"),
    message: z.string().optional().describe("Commit message"),
}, async ({ path, message }) => {
    const ctx = requireConfig();
    const sha = await getFileSha(ctx.octokit, ctx.owner, ctx.repo, path);
    const commitMsg = message || `Delete ${path}`;
    await deleteFile(ctx.octokit, ctx.owner, ctx.repo, path, commitMsg, sha);
    return {
        content: [
            {
                type: "text",
                text: `🗑️ Deleted ${path}\nCommit: ${commitMsg}`,
            },
        ],
    };
});
// === Tool 6: webclaw_search_content ===
server.tool("webclaw_search_content", "Search for text across vault files. Scans file contents in batches.", {
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
}, async ({ query, directory, extension, max_results }) => {
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
    const results = [];
    const queryLower = query.toLowerCase();
    const batchSize = 5;
    for (let i = 0; i < files.length && results.length < limit; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const contents = await Promise.all(batch.map(async (f) => {
            try {
                return {
                    path: f.path,
                    ...(await getFileContent(ctx.octokit, ctx.owner, ctx.repo, f.path)),
                };
            }
            catch {
                return null;
            }
        }));
        for (const file of contents) {
            if (!file || results.length >= limit)
                continue;
            const lines = file.content.split("\n");
            const matches = [];
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
                    type: "text",
                    text: `🔍 No results for "${query}" in ${directory || "vault"}`,
                },
            ],
        };
    }
    let text = `🔍 Found "${query}" in ${results.length} file(s):\n\n`;
    for (const r of results) {
        text += `📄 ${r.path}\n${r.matches.join("\n")}\n\n`;
    }
    return { content: [{ type: "text", text }] };
});
// === Tool 7: webclaw_get_tasks ===
server.tool("webclaw_get_tasks", "Extract checkbox tasks (- [ ] / - [x]) from vault files.", {
    directory: z.string().optional().describe("Limit to a subdirectory"),
    status: z
        .enum(["all", "pending", "completed"])
        .optional()
        .default("all")
        .describe("Filter by completion status"),
}, async ({ directory, status }) => {
    const ctx = requireConfig();
    const items = await getRepoTree(ctx.octokit, ctx.owner, ctx.repo, ctx.branch);
    let files = items.filter((i) => i.type === "blob" && i.path.endsWith(".md"));
    if (directory) {
        files = files.filter((i) => i.path.startsWith(directory + "/"));
    }
    const allTasks = [];
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const contents = await Promise.all(batch.map(async (f) => {
            try {
                const { content } = await getFileContent(ctx.octokit, ctx.owner, ctx.repo, f.path);
                const tags = extractTags(content);
                return { path: f.path, tasks: extractTasks(content, f.path, tags) };
            }
            catch {
                return null;
            }
        }));
        for (const file of contents) {
            if (!file)
                continue;
            allTasks.push(...file.tasks);
        }
    }
    let filtered = allTasks;
    if (status === "pending")
        filtered = allTasks.filter((t) => !t.completed);
    if (status === "completed")
        filtered = allTasks.filter((t) => t.completed);
    const pending = allTasks.filter((t) => !t.completed).length;
    const completed = allTasks.filter((t) => t.completed).length;
    const total = allTasks.length;
    let text = `✅ Tasks in ${directory || "vault"}\n`;
    text += `Total: ${total} | Pending: ${pending} | Completed: ${completed}\n`;
    if (total > 0) {
        text += `Progress: ${Math.round((completed / total) * 100)}%\n`;
    }
    text += "\n";
    for (const t of filtered) {
        const check = t.completed ? "☑" : "☐";
        text += `${check} ${t.text}  (${t.filePath}:${t.line})\n`;
    }
    return { content: [{ type: "text", text }] };
});
// === Tool 8: webclaw_get_tags ===
server.tool("webclaw_get_tags", "Extract tags from frontmatter across vault files, sorted by frequency.", {
    directory: z.string().optional().describe("Limit to a subdirectory"),
}, async ({ directory }) => {
    const ctx = requireConfig();
    const items = await getRepoTree(ctx.octokit, ctx.owner, ctx.repo, ctx.branch);
    let files = items.filter((i) => i.type === "blob" && i.path.endsWith(".md"));
    if (directory) {
        files = files.filter((i) => i.path.startsWith(directory + "/"));
    }
    const tagCounts = new Map();
    const tagFiles = new Map();
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const contents = await Promise.all(batch.map(async (f) => {
            try {
                const { content } = await getFileContent(ctx.octokit, ctx.owner, ctx.repo, f.path);
                return { path: f.path, tags: extractTags(content) };
            }
            catch {
                return null;
            }
        }));
        for (const file of contents) {
            if (!file)
                continue;
            for (const tag of file.tags) {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
                if (!tagFiles.has(tag))
                    tagFiles.set(tag, []);
                tagFiles.get(tag).push(file.path);
            }
        }
    }
    const sorted = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: "🏷️ No tags found in vault frontmatter.",
                },
            ],
        };
    }
    let text = `🏷️ Tags in ${directory || "vault"} (${sorted.length} unique)\n\n`;
    for (const [tag, count] of sorted) {
        text += `  #${tag}  ×${count}  (${tagFiles.get(tag).slice(0, 3).join(", ")}${count > 3 ? "…" : ""})\n`;
    }
    return { content: [{ type: "text", text }] };
});
// === Tool 9: webclaw_file_history ===
server.tool("webclaw_file_history", "Get the commit history for a file in the vault.", {
    path: z.string().describe("Path to the file"),
    limit: z
        .number()
        .optional()
        .default(10)
        .describe("Number of commits to return (default: 10)"),
}, async ({ path, limit }) => {
    const ctx = requireConfig();
    const history = await getFileHistory(ctx.octokit, ctx.owner, ctx.repo, path, limit || 10);
    if (history.length === 0) {
        return {
            content: [
                { type: "text", text: `📜 No history found for ${path}` },
            ],
        };
    }
    let text = `📜 History for ${path} (${history.length} commits)\n\n`;
    for (const h of history) {
        const date = h.date ? new Date(h.date).toLocaleDateString() : "unknown";
        text += `  ${h.sha.substring(0, 7)} | ${date} | ${h.author} | ${h.message}\n`;
    }
    return { content: [{ type: "text", text }] };
});
// === Tool 10: webclaw_vault_stats ===
server.tool("webclaw_vault_stats", "Get an overview of the vault: file counts, types, tags, tasks summary.", {}, async () => {
    const ctx = requireConfig();
    const items = await getRepoTree(ctx.octokit, ctx.owner, ctx.repo, ctx.branch);
    const files = items.filter((i) => i.type === "blob");
    const dirs = items.filter((i) => i.type === "tree");
    const extCounts = new Map();
    for (const f of files) {
        const ext = f.path.includes(".")
            ? "." + f.path.split(".").pop()
            : "(no ext)";
        extCounts.set(ext, (extCounts.get(ext) || 0) + 1);
    }
    const mdFiles = files.filter((f) => f.path.endsWith(".md"));
    let totalTasks = 0;
    let completedTasks = 0;
    const allTags = new Set();
    const batchSize = 5;
    for (let i = 0; i < mdFiles.length; i += batchSize) {
        const batch = mdFiles.slice(i, i + batchSize);
        const contents = await Promise.all(batch.map(async (f) => {
            try {
                const { content } = await getFileContent(ctx.octokit, ctx.owner, ctx.repo, f.path);
                const tags = extractTags(content);
                const tasks = extractTasks(content, f.path, tags);
                return { tags, tasks };
            }
            catch {
                return null;
            }
        }));
        for (const file of contents) {
            if (!file)
                continue;
            for (const tag of file.tags)
                allTags.add(tag);
            totalTasks += file.tasks.length;
            completedTasks += file.tasks.filter((t) => t.completed).length;
        }
    }
    const extList = [...extCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([ext, count]) => `  ${ext}: ${count}`)
        .join("\n");
    let text = `📊 Vault Overview — ${ctx.owner}/${ctx.repo}\n\n`;
    text += `Files: ${files.length} | Folders: ${dirs.length}\n`;
    text += `Markdown files: ${mdFiles.length}\n\n`;
    text += `By type:\n${extList}\n\n`;
    text += `Tags: ${allTags.size} unique (${[...allTags].slice(0, 10).map((t) => `#${t}`).join(", ")}${allTags.size > 10 ? "…" : ""})\n\n`;
    text += `Tasks: ${totalTasks} total | ${completedTasks} completed | ${totalTasks - completedTasks} pending\n`;
    if (totalTasks > 0) {
        text += `Progress: ${Math.round((completedTasks / totalTasks) * 100)}%\n`;
    }
    text += `\n---\n`;
    text += `Vault managed by WebClaw plugin.`;
    return { content: [{ type: "text", text }] };
});
// === Start server ===
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("WebClaw MCP server running on stdio");
    if (!config) {
        console.error("⚠️  No config found — webclaw_setup tool is available for initial configuration");
    }
}
main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map