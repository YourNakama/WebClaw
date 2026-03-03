# Claude plugin — manage your vault from the terminal or desktop

WebClaw has a plugin for **Claude Code** (terminal) and **Claude Cowork** (desktop app). It connects Claude directly to your GitHub vault — browse files, write documents, search content, track tasks, and more. Every change creates a Git commit.

---

## What you get

The plugin installs 11 MCP tools, 8 slash commands, and 2 specialized agents:

| Category | What's included |
|----------|----------------|
| **Tools** | List files, read, create, update, delete, search content, get tasks, get tags, file history, vault stats, setup |
| **Slash commands** | `/webclaw:vault-browse`, `/webclaw:vault-read`, `/webclaw:vault-write`, `/webclaw:vault-tasks`, `/webclaw:vault-search`, `/webclaw:vault-journal`, `/webclaw:vault-cleanup`, `/webclaw:vault-init` |
| **Agents** | vault-auditor (read-only scan for issues), vault-organizer (auto-fix problems) |

You interact with your vault through natural language — Claude calls the right tools behind the scenes.

---

## Install

### Claude Code (terminal)

```bash
/plugin marketplace add YourNakama/WebClaw
/plugin install webclaw@webclaw-marketplace
```

That's it. The plugin is pre-built — no `npm install`, no build step.

### Claude Cowork (desktop)

1. Open the **Cowork** tab in Claude Desktop
2. Click **Customize** in the sidebar
3. Click **+** → **Add marketplace from GitHub**
4. Enter `YourNakama/WebClaw`
5. Install `webclaw` from the list

### Local development

If you're contributing or testing changes:

```bash
git clone https://github.com/YourNakama/WebClaw
cd WebClaw/webclaw-plugin/server
npm install && npm run build
claude --plugin-dir ../
```

---

## Connect your vault

On first use, Claude detects that no vault is configured. It asks you directly in the conversation:

> "To connect your vault, I need your GitHub token, repo owner, and repo name."

You reply in the chat. Claude calls the `webclaw_setup` tool, validates the credentials against the GitHub API, and saves the config to `~/.webclaw/config.json`. No terminal needed — works in both Claude Code and Cowork.

### What you need

| Field | Description | Where to get it |
|-------|-------------|-----------------|
| **GitHub token** | Personal access token with `repo` scope | [github.com/settings/tokens](https://github.com/settings/tokens) |
| **Owner** | Your GitHub username or organization | Your GitHub profile |
| **Repo** | The repository name used as your vault | Any existing repo, or create a new one |
| **Branch** | Branch to read/write (default: `main`) | Usually `main` |

### Alternative: environment variables

If you prefer not to use the interactive setup:

```bash
export WEBCLAW_GITHUB_TOKEN="ghp_..."
export WEBCLAW_OWNER="your-username"
export WEBCLAW_REPO="your-vault-repo"
export WEBCLAW_BRANCH="main"
```

### Alternative: setup script (Claude Code only)

```bash
bash webclaw-plugin/scripts/setup.sh
```

The script prompts for each value and writes `~/.webclaw/config.json` with restricted permissions (`chmod 600`).

---

## Using the plugin

Once connected, you can talk to Claude naturally. Here are the main workflows.

### Browse your vault

```
You: Show me my vault
Claude: 📂 your-username/vault — 47 files, 8 folders
        📁 journal/
        📁 notes/
        📁 projects/
        📄 README.md
```

Or use the slash command: `/webclaw:vault-browse`

### Read a file

```
You: Read docs/architecture.md
Claude: 📄 docs/architecture.md (sha: a3f2c1b)
        Frontmatter: { title: "Architecture", tags: ["tech", "architecture"] }
        ---
        # Architecture
        [file content...]
```

### Write and edit files

```
You: Create a meeting notes file for today's standup
Claude: ✅ Created meetings/2026-03-01-standup.md
        Commit: Create meetings/2026-03-01-standup.md

You: Add a "Decisions" section to that file
Claude: ✅ Updated meetings/2026-03-01-standup.md
        Commit: Add Decisions section
```

Every write creates a Git commit with a descriptive message.

### Search across files

```
You: Find all mentions of "authentication" in the docs folder
Claude: 🔍 Found "authentication" in 4 files:
        📄 docs/architecture.md
          L45: ## Authentication flow
          L52: The authentication service uses OAuth 2.0...
        📄 guides/security.md
          L12: Authentication is handled by...
```

### Track tasks

```
You: What tasks are pending?
Claude: ✅ Tasks in vault
        Total: 12 | Pending: 8 | Completed: 4
        Progress: 33%

        ☐ Review architecture doc  (docs/architecture.md:15)
        ☐ Update onboarding guide  (guides/onboarding.md:8)
        ☑ Set up CI pipeline  (projects/infra.md:22)
```

You can also toggle tasks:

```
You: Mark "Review architecture doc" as done
Claude: ✅ Updated docs/architecture.md
        Commit: Complete task "Review architecture doc"
```

### Daily journal

```
You: Write today's journal — shipped the auth feature, learned about OAuth PKCE
Claude: 📄 Created journal/2026-03-01.md
        ---
        title: "Journal — 2026-03-01"
        tags: [journal, daily]
        ---
        # Sunday, March 01, 2026
        ## What happened today
        Shipped the auth feature...
```

### Initialize a new vault

```
You: /webclaw:vault-init
Claude: What kind of vault do you want?
        1. Personal knowledge base
        2. Team documentation
        3. Project docs

You: Personal
Claude: ✅ Created README.md
        ✅ Created journal/.gitkeep
        ✅ Created notes/.gitkeep
        ✅ Created projects/.gitkeep
        ✅ Created references/.gitkeep
        ✅ Created templates/note.md
        ...
        Your vault is ready.
```

### Audit and fix issues

```
You: /webclaw:vault-cleanup
Claude: 🔍 Vault Audit Report
        ══════════════════════
        Scanned: 47 files in 8 folders

        Critical (2)
          ❌ notes/draft.md — Empty file (0 bytes)
          ❌ references/links.md — No frontmatter

        Warning (5)
          ⚠️ docs/My Notes.md — Spaces in filename
          ⚠️ projects/api.md — Missing tags
        ...

        Health score: 78%
```

The vault-auditor agent is read-only — it never modifies files. To fix issues, use the vault-organizer agent or fix them manually through `/webclaw:vault-write`.

---

## Slash commands reference

| Command | What it does | Tools used |
|---------|-------------|------------|
| `/webclaw:vault-browse` | Show vault structure with stats | `list_files`, `vault_stats` |
| `/webclaw:vault-read` | Read a file with frontmatter display | `read_file` |
| `/webclaw:vault-write` | Create or update files with proper frontmatter | `create_file`, `update_file` |
| `/webclaw:vault-tasks` | View and toggle tasks across the vault | `get_tasks`, `update_file` |
| `/webclaw:vault-search` | Search content, tags, or file names | `search_content`, `list_files`, `get_tags` |
| `/webclaw:vault-journal` | Create daily journal entries | `create_file`, `read_file` |
| `/webclaw:vault-cleanup` | Audit vault for structural issues | Delegates to vault-auditor agent |
| `/webclaw:vault-init` | Initialize a new vault with folders and templates | `create_file` (multiple calls) |

---

## MCP tools reference

These are the low-level tools Claude uses behind the scenes. You don't need to call them directly — Claude picks the right tool based on your request.

| Tool | Input | Description |
|------|-------|-------------|
| `webclaw_setup` | token, owner, repo, branch? | Configure vault credentials. Validates against GitHub API. |
| `webclaw_list_files` | directory?, recursive?, extension? | List files and directories as a tree |
| `webclaw_read_file` | path | Read file content with frontmatter parsing |
| `webclaw_create_file` | path, content, message? | Create a new file (commits to GitHub) |
| `webclaw_update_file` | path, content or old_text+new_text, message? | Update a file — full replacement or surgical edit |
| `webclaw_delete_file` | path, message? | Delete a file |
| `webclaw_search_content` | query, directory?, extension?, max_results? | Full-text search across vault files |
| `webclaw_get_tasks` | directory?, status? | Extract checkbox tasks (`- [ ]` / `- [x]`) |
| `webclaw_get_tags` | directory? | Frontmatter tags sorted by frequency |
| `webclaw_file_history` | path, limit? | Git commit history for a file |
| `webclaw_vault_stats` | — | Vault overview: counts, types, tags, task progress |

---

## Agents

### vault-auditor

Read-only agent that scans every file in your vault and produces a severity report. Checks for:

- **Critical** — Empty files, missing frontmatter, broken structure
- **Warning** — Missing title or tags, filename issues (spaces, uppercase), no creation date, large files
- **Info** — Missing type field, unused tags, orphaned folders

Invoked automatically by `/webclaw:vault-cleanup`.

### vault-organizer

Read/write agent that fixes issues found by the auditor:

- Adds missing frontmatter based on filename and content analysis
- Fixes missing titles (converts filename to Title Case)
- Suggests and adds relevant tags
- Renames files to kebab-case
- Moves misplaced files to the correct location

Each fix is a separate commit. The agent asks for confirmation before bulk changes (more than 3 files).

---

## How it works

```
┌─────────────────────┐     ┌──────────────┐     ┌────────────┐
│  Claude Code (CLI)  │     │   WebClaw    │     │   GitHub   │
│  Claude Cowork (UI) │────▶│  MCP Server  │────▶│    API     │
│  (you talk here)    │ MCP │  (this plugin)│     │ (your repo)│
└─────────────────────┘     └──────────────┘     └────────────┘
                                   │
                            ~/.webclaw/config.json
                            (token, owner, repo, branch)
```

- **Your vault** = a GitHub repo with markdown files
- **This plugin** = an MCP server that reads and writes via the GitHub API
- **MCP** (Model Context Protocol) = the standard protocol Claude uses to communicate with external tools

The MCP server runs locally on your machine via stdio. No network server is exposed. Your GitHub token stays in `~/.webclaw/config.json` (chmod 600) and is only sent to the GitHub API.

---

## Security

| Concern | How it's handled |
|---------|-----------------|
| GitHub token storage | `~/.webclaw/config.json` with `chmod 600` — only your user can read it |
| Token transmission | Sent only to `api.github.com` via HTTPS — never to any other endpoint |
| Telemetry | None. No analytics, no tracking, no phone-home. |
| Audit trail | Every write creates a GitHub commit — full version history |
| Network exposure | MCP server runs on stdio — no ports opened, no HTTP server |
| Data processing | All processing happens locally on your machine |

---

## Troubleshooting

**"WebClaw is not configured yet"**
Run the setup by telling Claude: "Connect my vault" or "Set up WebClaw". It will ask for your GitHub token, owner, and repo.

**"Invalid GitHub token"**
Your token might have expired or lack the `repo` scope. Create a new one at [github.com/settings/tokens](https://github.com/settings/tokens) with the `repo` checkbox enabled.

**"Repository not found"**
Check the owner and repo name. The token must have access to this repository — if it's in an organization, make sure the token is authorized for that org.

**409 Conflict on update**
Another process changed the file between your read and write. The plugin retries automatically with the latest SHA. If it keeps happening, try again.

**Plugin not showing up in Cowork**
Make sure you added the marketplace first (Customize → + → Add marketplace from GitHub → `YourNakama/WebClaw`), then installed the `webclaw` plugin from the list.

**Tools not available after install**
Restart Claude Code or Cowork. The MCP server loads on startup — a restart ensures the new plugin is picked up.

## FAQ

**Does this work without the WebClaw web app?**
Yes. The plugin is standalone — it connects Claude directly to your GitHub repo. You don't need to use the web app at all.

**Can I use it with any GitHub repo?**
Yes. Any repo with markdown files works. The plugin doesn't require a specific structure — though `/webclaw:vault-init` can set one up for you.

**Is this the same vault as the web app?**
If you point both to the same GitHub repo, yes. They share the same files and the same Git history. Changes made in Claude show up in the web app, and vice versa.

**What happens if I delete a file?**
It creates a Git commit deleting the file. You can always restore it from the Git history.

**Can multiple people use the plugin on the same repo?**
Yes. Each person configures their own `~/.webclaw/config.json` with their own GitHub token. The plugin uses the GitHub API, so standard GitHub permissions and branch protections apply.

**What model do I need?**
Any Claude model works — Haiku, Sonnet, or Opus. The plugin exposes MCP tools that work with all models.

---

**Previous** → [Mobile, PWA & offline](./07-mobile-and-offline.md) | **Start** → [Getting started](./01-getting-started.md)
