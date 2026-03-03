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

Le plugin se connecte automatiquement au **serveur MCP distant** (`mcp.webclaw.nakamacyber.ai`). La VM Cowork n'a pas besoin d'acces internet — c'est l'infrastructure Anthropic qui fait le pont vers le serveur externe.

> **Acces reseau requis** : le domaine `mcp.webclaw.nakamacyber.ai` doit etre autorise dans votre configuration reseau. Sur un plan **Team ou Enterprise**, allez dans **Admin Settings → Capabilities** et ajoutez `mcp.webclaw.nakamacyber.ai` a la liste blanche des domaines autorises.

> **Transparence** : le serveur distant execute exactement le code de ce repo public. Pas de build prive, pas de code cache. Tout est verifiable et auditable par n'importe qui. Voir la section [Security](#security).

### Connexion manuelle (sans marketplace)

Si vous preferez ajouter le MCP manuellement sans passer par le marketplace :

**Claude Code :**
```bash
claude mcp add --transport http webclaw https://mcp.webclaw.nakamacyber.ai/mcp
```

Pour autoriser le domaine dans Claude Code, ajoutez-le dans votre config (`~/.claude/settings.json` ou projet) :
```json
{
  "permissions": {
    "allowedUrls": ["mcp.webclaw.nakamacyber.ai"]
  }
}
```

**Claude.ai / Cowork :** ajouter via l'interface des connecteurs MCP distants avec l'URL :
```
https://mcp.webclaw.nakamacyber.ai/mcp
```

### First use — connect your vault

**Mode remote (Cowork / Claude.ai) — MCP OAuth :**

L'authentification se fait automatiquement via le standard MCP OAuth. Quand vous utilisez un outil WebClaw pour la premiere fois, le client MCP (Claude Code, Cowork, Claude.ai) declenche le flow OAuth :

1. Le client decouvre les endpoints OAuth via `/.well-known/oauth-authorization-server`
2. Vous etes redirige vers GitHub pour autoriser l'application
3. Le token GitHub est retourne au client via le protocole OAuth standard
4. Tous les appels suivants incluent le token dans le header `Authorization: Bearer`

Aucune action manuelle requise — pas de code a copier-coller, pas de Device Flow. L'auth survit aux pertes de session : meme si le serveur redemarre, le token est dans chaque requete HTTP.

Apres l'auth, utilisez **`webclaw_select_repo`** pour choisir votre vault.

**Mode local (Claude Code stdio) — Device Flow :**

1. **`webclaw_connect`** — Ouvre votre navigateur pour l'authentification GitHub (OAuth Device Flow). Pas de token a copier-coller.
2. **`webclaw_select_repo`** — Liste vos repos pour choisir lequel utiliser comme vault.

La config est sauvegardee dans `~/.webclaw/config.json` (chmod 600).

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
| `webclaw_connect` | Authenticate with GitHub. En mode remote, detecte l'auth OAuth automatique. En mode local, lance le Device Flow. |
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

**Mode remote (HTTP + MCP OAuth) — Claude.ai / Cowork / tout client MCP :**

```
┌─────────────────────┐     ┌──────────────────┐     ┌────────────┐
│  Claude.ai          │     │   WebClaw MCP    │     │   GitHub   │
│  Claude Cowork      │────▶│   Remote Server  │────▶│    API     │
│  Claude Code        │HTTPS│   (Railway)      │     │ (your repo)│
└─────────────────────┘     └──────────────────┘     └────────────┘
         │                          │
  Authorization: Bearer       OAuth Provider
  (token dans chaque          (proxy GitHub)
   requete HTTP)
```

**Flow OAuth du mode remote :**

```
Client → POST /mcp                        → 401 Unauthorized
Client → GET /.well-known/oauth-*         → decouvre les endpoints
Client → POST /register (DCR)             → obtient un client_id
Client → GET /authorize                   → redirige vers GitHub
User   → autorise sur GitHub              → GitHub redirige vers /github/callback
Server → echange code+secret avec GitHub  → redirige vers le callback du client
Client → POST /token                      → recoit le token GitHub
Client → POST /mcp + Authorization:Bearer → TOUS les appels suivants ont le token
```

- **Your vault** = a GitHub repo with markdown files
- **This plugin** = an MCP server that reads/writes via the GitHub API
- **WebClaw** = the browser app for the same vault (visual editing, Dashboard, Task Panel)
- **Mode local** : le serveur tourne sur votre machine, token stocke en local via Device Flow
- **Mode remote** : le serveur utilise MCP OAuth. Le token GitHub voyage dans chaque requete HTTP (`Authorization: Bearer`). Meme si le serveur perd la session, l'auth survit au prochain appel.

Same repo, same files, same GitHub history — terminal, browser, or remote, your choice.

---

## Security

- **Mode remote — MCP OAuth** : l'authentification utilise le standard OAuth 2.1 (RFC 6749 / MCP spec). Le token GitHub est obtenu via un flow OAuth classique (code + secret cote serveur) et voyage dans le header `Authorization: Bearer` a chaque requete. Pas de session cote serveur pour l'auth — le token est dans la requete.
- **Mode local — Device Flow** : authentification via navigateur, pas de token a copier-coller ou stocker dans des env vars. Token dans `~/.webclaw/config.json` (chmod 600).
- No telemetry, no analytics
- Every write operation creates a GitHub commit — full audit trail
- **Code public = code deploye** : le serveur MCP distant deploye sur Railway utilise exactement le code de ce repo public. Pas de build prive, pas de code cache. Tout est verifiable et auditable par n'importe qui
- **Client ID public** : le `GITHUB_CLIENT_ID` est visible dans le code source (meme pattern que le CLI `gh` de GitHub). Ce n'est pas un secret — la securite repose sur l'autorisation explicite de l'utilisateur dans son navigateur
- **Client Secret** : le `GITHUB_CLIENT_SECRET` est stocke cote serveur uniquement (variable d'environnement Railway). Il n'est jamais expose au client. C'est le secret de l'OAuth App GitHub qui permet d'echanger les authorization codes contre des tokens.
- HTTPS fourni automatiquement par Railway (TLS)
- **PKCE** : le flow OAuth utilise PKCE (Proof Key for Code Exchange) pour prevenir les attaques d'interception de code. Le SDK MCP gere automatiquement la validation code_verifier/code_challenge.

### Acces reseau

Le plugin utilise un seul domaine externe : `mcp.webclaw.nakamacyber.ai`

| Environnement | Configuration requise |
|---|---|
| **Claude Code** (local stdio) | Aucune — le serveur tourne sur votre machine |
| **Claude Code** (remote HTTP) | Ajouter `mcp.webclaw.nakamacyber.ai` dans `permissions.allowedUrls` de votre `settings.json` |
| **Cowork / Claude.ai** (Team/Enterprise) | Ajouter `mcp.webclaw.nakamacyber.ai` dans **Admin Settings → Capabilities** (liste blanche domaines) |
| **Cowork / Claude.ai** (Free/Pro) | Aucune configuration reseau necessaire |

---

## Hebergement — Railway

Le serveur MCP distant est heberge sur [Railway](https://railway.com) via un Dockerfile. Voici comment tout est configure, de A a Z.

### 1. GitHub OAuth App

Le serveur a besoin d'une **GitHub OAuth App** (pas une GitHub App) pour authentifier les utilisateurs.

**Creer l'OAuth App :**

1. Aller sur [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**
2. Remplir :
   - **Application name** : `WebClaw MCP` (ou ce que vous voulez)
   - **Homepage URL** : `https://webclaw.nakamacyber.ai`
   - **Authorization callback URL** : `https://mcp.webclaw.nakamacyber.ai/github/callback`
3. Cliquer **Register application**
4. Noter le **Client ID** (visible directement)
5. Cliquer **Generate a new client secret** et le noter immediatement (il ne sera plus visible apres)

> **Pourquoi un callback fixe ?** GitHub n'accepte qu'UN seul callback URL par OAuth App. Notre serveur recoit le callback de GitHub, echange le code contre un token, puis redirige vers le client MCP (Cowork, Claude.ai, etc.) avec notre propre authorization code. Ca marche avec n'importe quel client MCP.

### 2. Deploiement Railway

1. Creer un nouveau service depuis le repo GitHub `YourNakama/WebClaw`
2. Dans **Settings** du service :
   - **Root Directory** : `webclaw-plugin`
   - **Builder** : `Dockerfile` (pas Railpack)
3. Railway build et deploie automatiquement a chaque push sur le repo

### 3. Variables d'environnement Railway

| Variable | Requis | Description |
|----------|--------|-------------|
| `PORT` | Auto | Fourni automatiquement par Railway |
| `SERVER_URL` | Oui | URL publique du serveur, ex: `https://mcp.webclaw.nakamacyber.ai` |
| `GITHUB_CLIENT_ID` | Oui | Client ID de l'OAuth App GitHub (ex: `Ov23ctlK0eSRxyelzeNs`) |
| `GITHUB_CLIENT_SECRET` | Oui | Client Secret de l'OAuth App GitHub |

> **Note** : si `GITHUB_CLIENT_ID` n'est pas defini, le serveur utilise le client ID par defaut embarque dans le code (`Ov23ctlK0eSRxyelzeNs`). Pour la production, utilisez votre propre OAuth App.

### 4. Domaine custom (optionnel)

Sur Railway, vous pouvez attacher un domaine custom :
1. **Settings** → **Networking** → **Custom Domain**
2. Ajouter `mcp.webclaw.nakamacyber.ai`
3. Configurer le CNAME DNS chez votre registrar vers le domaine Railway

### 5. Architecture du Dockerfile

Le Dockerfile utilise un **multi-stage build** :

```dockerfile
# Stage 1 : build TypeScript + bundle esbuild
FROM node:20-alpine AS builder
# npm ci, tsc, esbuild → remote.mjs

# Stage 2 : runtime ultra-leger
FROM node:20-alpine
COPY --from=builder /app/dist/remote.mjs ./remote.mjs
CMD ["node", "remote.mjs"]
```

Image finale : ~60 MB (Node Alpine + un seul fichier JS). Pas de `node_modules` a runtime (tout est bundle).

### 6. Endpoints du serveur

| Endpoint | Methode | Description |
|----------|---------|-------------|
| `/health` | GET | Health check — retourne `{"status":"ok","version":"1.6.0","sessions":N}` |
| `/.well-known/oauth-authorization-server` | GET | Metadata OAuth (decouverte des endpoints) |
| `/.well-known/oauth-protected-resource` | GET | Metadata de la ressource protegee |
| `/register` | POST | Dynamic Client Registration (DCR) |
| `/authorize` | GET | Debut du flow OAuth → redirige vers GitHub |
| `/github/callback` | GET | Callback OAuth GitHub → echange code, redirige vers le client |
| `/token` | POST | Echange authorization code → token |
| `/mcp` | POST/GET/DELETE | Endpoint MCP protege par `Authorization: Bearer` |

### 7. Tester en local

```bash
cd webclaw-plugin/server
npm install && npm run build

# Definir les variables (utiliser votre propre OAuth App ou celle par defaut)
export SERVER_URL=http://localhost:3000
export GITHUB_CLIENT_SECRET=your_secret_here

npm run start:remote
# → http://localhost:3000/health
# → http://localhost:3000/.well-known/oauth-authorization-server
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
| Starts without config | Yes — auth via MCP OAuth (remote) ou `webclaw_connect` (local) |
| Cowork compatible | Yes — serveur externe + MCP OAuth standard |

---

## License

MIT — [NakamaCyber](https://github.com/YourNakama)
