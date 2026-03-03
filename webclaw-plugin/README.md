<p align="center">
  <a href="https://webclaw.nakamacyber.ai"><img src="https://img.shields.io/badge/Try%20WebClaw-webclaw.nakamacyber.ai-7c3aed?style=for-the-badge" alt="Try WebClaw"></a>
</p>

# WebClaw — Claude Plugin

**Turn any GitHub repo into an organized markdown vault, directly from Claude.**

Browse, read, write, search, and manage tasks across your files — every change is committed to GitHub. Works with **Claude Code** (terminal), **Claude Cowork** (desktop), and **Claude.ai** (web). Pair with [WebClaw](https://webclaw.nakamacyber.ai) for the full visual experience.

---

## Installation

### From the plugin directory (recommended)

The plugin is pre-built and ready to use — no terminal, no build step.

**Claude Code:**
```bash
/plugin marketplace add YourNakama/WebClaw
/plugin install webclaw@webclaw-marketplace
```

**Claude Cowork:**
1. Open the **Cowork** tab in Claude Desktop
2. Click **Customize** in the sidebar
3. Click **+** → **Add marketplace from GitHub**
4. Enter `YourNakama/WebClaw`
5. Install `webclaw` from the list

Le plugin se connecte automatiquement au **serveur MCP distant** heberge sur Railway. La VM Cowork n'a pas besoin d'acces internet — c'est l'infrastructure Anthropic qui fait le pont vers le serveur externe.

> **Transparence** : le serveur distant execute exactement le code de ce repo public. Pas de build prive, pas de code cache. Tout est verifiable et auditable par n'importe qui. Voir la section [Security](#security).

### Connexion manuelle (sans marketplace)

Si vous preferez ajouter le MCP manuellement sans passer par le marketplace :

**Claude Code :**
```bash
claude mcp add --transport http webclaw https://mcp.webclaw.nakamacyber.ai/mcp
```

**Claude.ai / Cowork :** ajouter via l'interface des connecteurs MCP distants avec l'URL :
```
https://mcp.webclaw.nakamacyber.ai/mcp
```

### First use — connect your vault

On first use, Claude will detect that no vault is configured and guide you through the setup:

1. **`webclaw_connect`** — Opens your browser for GitHub authentication (OAuth Device Flow). No token to copy-paste.
2. **`webclaw_select_repo`** — Lists your repositories so you can pick which one to use as your vault.

En mode **local** (Claude Code stdio), la config est sauvegardee dans `~/.webclaw/config.json` (chmod 600). En mode **remote** (Cowork / Claude.ai), les tokens restent en memoire sur le serveur — rien n'est ecrit sur disque.

<details>
<summary>Fallback: environment variables (optional)</summary>

Environment variables still work as a fallback if you prefer manual configuration:

```bash
export WEBCLAW_GITHUB_TOKEN="ghp_..."
export WEBCLAW_OWNER="your-username"
export WEBCLAW_REPO="your-vault-repo"
export WEBCLAW_BRANCH="main"
```

</details>

### Local development

If you're contributing to the plugin or testing changes:

```bash
git clone https://github.com/YourNakama/WebClaw
cd WebClaw/webclaw-plugin/server
npm install && npm run build
claude --plugin-dir ../
```

---

## Tools (12 MCP tools)

The plugin exposes 12 tools to Claude via the Model Context Protocol:

| Tool | Description |
|------|-------------|
| `webclaw_connect` | Authenticate with GitHub via Device Flow — opens browser, no token needed. |
| `webclaw_select_repo` | List your repos or select one as your vault. |
| `webclaw_list_files` | List files and directories (tree view) |
| `webclaw_read_file` | Read file content with frontmatter parsing |
| `webclaw_create_file` | Create a new file (commits to GitHub) |
| `webclaw_update_file` | Update a file (full or partial, with 409 conflict retry) |
| `webclaw_delete_file` | Delete a file |
| `webclaw_search_content` | Full-text search across vault files (batched) |
| `webclaw_get_tasks` | Extract checkbox tasks (`- [ ]` / `- [x]`) |
| `webclaw_get_tags` | Frontmatter tags sorted by frequency |
| `webclaw_file_history` | Git commit history for a file |
| `webclaw_vault_stats` | Vault overview: file counts, types, tags, task progress |

---

## Skills (9 slash commands)

| Command | What it does |
|---------|-------------|
| `/webclaw:vault-connect` | Authenticate with GitHub and select your vault repo |
| `/webclaw:vault-browse` | Browse your vault structure with stats |
| `/webclaw:vault-read` | Read a file with frontmatter display |
| `/webclaw:vault-write` | Create or update files with proper frontmatter |
| `/webclaw:vault-tasks` | View and toggle tasks across the vault |
| `/webclaw:vault-search` | Search content, tags, or file names |
| `/webclaw:vault-journal` | Create daily journal entries |
| `/webclaw:vault-cleanup` | Audit vault for structural issues |
| `/webclaw:vault-init` | Initialize a new vault with folder structure and templates |

---

## Agents

| Agent | Mode | Description |
|-------|------|-------------|
| `vault-auditor` | Read-only | Scans for missing frontmatter, empty files, naming issues. Produces a severity report. |
| `vault-organizer` | Read/write | Fixes issues identified by the auditor — adds frontmatter, renames files, moves content. |

---

## Examples

```
You: Show me my vault
Claude: 📂 your-username/vault — 47 files, 8 folders, 35 markdown files
        📁 journal/
        📁 notes/
        📁 projects/
        📄 README.md

You: What tasks are pending?
Claude: ✅ Tasks — 12 total | 8 pending | 4 completed (33%)
        ☐ Review architecture doc  (docs/architecture.md:15)
        ☐ Update onboarding guide  (guides/onboarding.md:8)

You: Create today's journal entry
Claude: 📔 Created journal/2026-03-01.md

You: Set up a new vault for my team
Claude: 🚀 Initialized vault with 10 starter files
```

---

## How it works

**Mode local (stdio) — Claude Code / plugin local :**

```
┌─────────────────────┐     ┌──────────────┐     ┌────────────┐
│  Claude Code / CLI  │     │   WebClaw    │     │   GitHub   │
│  Claude Cowork/GUI  │────▶│  MCP Server  │────▶│    API     │
│  (you talk here)    │stdio│  (this plugin)│     │ (your repo)│
└─────────────────────┘     └──────────────┘     └────────────┘
                                   │
                            ~/.webclaw/config.json
                            (token, owner, repo, branch)
```

**Mode remote (HTTP) — Claude.ai / Cowork / tout client MCP :**

```
┌─────────────────────┐     ┌──────────────────┐     ┌────────────┐
│  Claude.ai          │     │   WebClaw MCP    │     │   GitHub   │
│  Claude Cowork      │────▶│   Remote Server  │────▶│    API     │
│  Claude Code        │HTTPS│   (Railway)      │     │ (your repo)│
└─────────────────────┘     └──────────────────┘     └────────────┘
                                     │
                              Tokens en memoire
                              (session ephemere)
```

- **Your vault** = a GitHub repo with markdown files
- **This plugin** = an MCP server that reads/writes via the GitHub API
- **WebClaw** = the browser app for the same vault (visual editing, Dashboard, Task Panel)
- **Mode local** : le serveur tourne sur votre machine, token stocke en local
- **Mode remote** : le serveur tourne sur Railway, chaque utilisateur = une session en memoire

Same repo, same files, same GitHub history — terminal, browser, or remote, your choice.

---

## Security

- **OAuth Device Flow** — authenticate via browser, no token to copy-paste or store in env vars
- **Mode local** : token stocke dans `~/.webclaw/config.json` (chmod 600) — jamais envoye ailleurs que l'API GitHub
- **Mode remote** : tokens en memoire cote serveur uniquement, jamais persistes sur disque. Un restart du serveur efface toutes les sessions
- No telemetry, no analytics
- Every write operation creates a GitHub commit — full audit trail
- **Code public = code deploye** : le serveur MCP distant deploye sur Railway utilise exactement le code de ce repo public. Pas de build prive, pas de code cache. Tout est verifiable et auditable par n'importe qui
- **Client ID public** : le `GITHUB_CLIENT_ID` est visible dans le code source (meme pattern que le CLI `gh` de GitHub). Ce n'est pas un secret — la securite repose sur l'autorisation explicite de l'utilisateur dans son navigateur
- HTTPS fourni automatiquement par Railway (TLS)

---

## Self-hosting (Railway)

Vous pouvez deployer votre propre instance du serveur MCP distant. Le Dockerfile est inclus dans le repo.

**Deploy sur Railway :**

1. Creer un nouveau service depuis le repo GitHub `YourNakama/WebClaw`
2. Dans **Settings** du service :
   - **Root Directory** : `webclaw-plugin`
   - **Builder** : `Dockerfile` (pas Railpack)
3. Variables d'environnement (optionnel) :
   - `GITHUB_CLIENT_ID` — pour utiliser votre propre OAuth App GitHub
   - `PORT` — fourni automatiquement par Railway
4. Deploy — Railway build et deploie automatiquement a chaque push

Le Dockerfile utilise un **multi-stage build** : compilation TypeScript + bundling esbuild dans un premier stage, puis une image finale ultra-legere (Node Alpine + un seul fichier `remote.mjs`).

```bash
# Tester en local
cd webclaw-plugin/server
npm install && npm run build
npm run start:remote
# → http://localhost:3000/mcp
```

---

## What is WebClaw?

[WebClaw](https://webclaw.nakamacyber.ai) is a free, browser-based AI document workspace:

- Rich markdown preview with callouts, Mermaid diagrams, and toggle blocks
- Cross-vault Task Panel with progress tracking
- Database View — browse folders as sortable, filterable tables
- Dashboard with recent files, favorites, and tag cloud
- Full-text search with `Cmd+Shift+F`
- Bring your own AI (Claude, OpenAI, Ollama, and more)
- Page templates with variable resolution (`{{date}}`, `{{title}}`)

This plugin and WebClaw are two interfaces to the same vault. Use Claude for automation, use WebClaw for visual editing.

---

## Marketplace compatibility

This plugin is distributed as a pre-built artifact — no `npm install` or build step required on the user's machine. The `server/dist/` directory is committed to the repository so marketplace installation works out of the box.

| Requirement | Status |
|-------------|--------|
| Pre-built (no build on install) | Yes — `dist/` committed |
| `plugin.json` manifest | `.claude-plugin/plugin.json` |
| `marketplace.json` catalog | Root `.claude-plugin/marketplace.json` |
| MCP server config | `.mcp.json` — remote HTTP (serveur Railway) |
| No reserved marketplace names | `webclaw-marketplace` |
| Valid category | `productivity` |
| Starts without config | Yes — `webclaw_connect` tool available |
| Cowork compatible | Yes — serveur externe, pas besoin d'internet dans la VM |

---

## License

MIT — [NakamaCyber](https://github.com/YourNakama)
