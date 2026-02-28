# Getting started

Start using WebClaw in 2 minutes. Nothing to install.

## What you need

- A **web browser** (Chrome, Firefox, Safari, Edge — any will do)
- A **GitHub account** (free at [github.com](https://github.com))

That's it. No terminal, no downloads, no technical setup.

## Step 1 — Open WebClaw

Go to **[webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai)** in your browser. You'll see the landing page.

## Step 2 — Sign in with GitHub

Click **Connect with GitHub**. You'll be redirected to GitHub to authorize the app.

- WebClaw needs access to your repositories to store your documents
- Your access token is encrypted and stored only in your browser
- No data passes through our servers

Click **Authorize** on the GitHub page. You're redirected back to WebClaw, signed in.

More details: [Authentication & security](./02-authentication.md)

## Step 3 — Set up your vault

A vault = a GitHub repo where your documents live. After signing in, you have two options:

### Option A — Create a new vault (recommended for new users)

1. Click the **Create a new vault** button at the top of the setup page
2. Enter a name for your repository (e.g. `my-vault`)
3. Add an optional description
4. Choose **Private** or **Public**
5. Click **Create & Open**

WebClaw creates the repo on your GitHub and scaffolds a complete folder structure:

```
your-vault/
├── journal/              Daily notes
├── 00-inbox/             Quick capture, unsorted notes
├── 01-personal/          Personal notes & ideas
├── 02-references/        External sources, links, quotes
├── 03-projects/          Project-specific docs
├── 04-dev/               Technical documentation
├── 05-resources/         Reusable assets & templates
├── 06-meetings/          Meeting notes & minutes
├── 07-clients/           Client-specific docs
└── 08-planning/          Goals, roadmaps, reviews
```

Each folder contains an `_index.md` with naming conventions and usage tips.

### Option B — Select an existing repo

If you already have a GitHub repo with Markdown files:

1. Browse or search the list of your repositories
2. Click a repo to select it
3. Choose the branch (default: `main`)
4. Confirm — your vault opens with your existing files

## Step 4 — Explore the interface

Your vault opens with:

- **File tree** on the left — navigate, create folders and files
- **Markdown editor** in the center — write with syntax highlighting and autocomplete
- **Live preview** on the right — see your Markdown rendered in real time (Mermaid diagrams, tables, code)
- **Toolbar** at the top — view mode toggle (Code / Split / Preview), new file, save, settings
- **View mode toggle** centered in the toolbar:
  - **Code** — full-width editor
  - **Split** — editor + live preview side by side
  - **Preview** — rendered Markdown only

Every save automatically creates a commit in your GitHub repo. Your full history is preserved.

## Step 5 (optional) — Connect an AI

To use the AI assistant and skills, set up an AI provider:

1. Click the **gear icon** (⚙) in the top-right corner
2. Select **WebClaw Settings**
3. Go to the **AI Assistant** tab
4. Pick a provider:
   - **Claude** — API key or OAuth (Claude Code, uses your Pro/Max subscription)
   - **OpenAI** — API key (pay-per-use)
   - **OpenRouter** — API key (200+ models with one key)
   - **Ollama** — free, runs locally on your machine (requires CORS)
   - **Custom** — any OpenAI-compatible endpoint
5. Follow the guided steps shown in the dialog
6. Click **Test Connection** to verify
7. Click **Save**

Your credentials are encrypted and stored only in your browser.

Full guide: [Connect your AI](./03-connect-your-ai.md)

## Step 6 (optional) — Install skills

Skills make the AI assistant better at specific tasks:

1. Go to WebClaw Settings → **Skills** tab
2. Browse available skills from the community
3. Click **Install**, then toggle the switch to enable

Full guide: [Install & use skills](./04-install-use-skills.md)

## Summary

| Step | Time |
|------|------|
| Open WebClaw | 0 seconds — it's a website |
| Sign in with GitHub | 30 seconds |
| Set up the vault | 30 seconds |
| Connect an AI | 30 seconds |
| Install a skill | 10 seconds |

**Total time to be up and running: ~2 minutes.**

## FAQ

**Is WebClaw free?**
Yes. WebClaw is donationware — all features are free for everyone. If it helps you, you can choose to support the project via [Ko-fi](https://ko-fi.com/nakamacyber).

**Does my data pass through your servers?**
No. Your documents live in your own GitHub repo. Communication happens directly between your browser and the GitHub API. Our server only handles the OAuth handshake.

**Can I use WebClaw without AI?**
Absolutely. WebClaw is a great Markdown editor with GitHub sync, live preview, print, and file management — even without AI.

**Can I use my Claude Pro or ChatGPT Pro subscription?**
For **Claude**, yes — via Claude Code OAuth, you can use your Pro/Max subscription instead of a pay-per-use API key. For **OpenAI**, no — ChatGPT/Codex subscriptions cannot be used with third-party apps; you need an API key from [platform.openai.com](https://platform.openai.com). See [Connect your AI](./03-connect-your-ai.md) for details.

**What happens to my data if WebClaw disappears?**
Nothing. Your files are in your GitHub repo. You can read, edit, and manage them with any Markdown tool, forever.

---

**Next** → [Authentication & security](./02-authentication.md)
