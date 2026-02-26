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

A vault = a GitHub repo where your documents live. After signing in, WebClaw asks you to:

- **Select an existing repo** if you already have one with Markdown files
- **Create a new repo** dedicated to your vault

Pick an option, choose the branch (default: `main`), and confirm. Your vault is ready.

## Step 4 — Explore the interface

Your vault opens with:

- **File tree** on the left — navigate, create folders and files
- **Markdown editor** in the center — write with syntax highlighting and autocomplete
- **Live preview** on the right — see your Markdown rendered in real time (Mermaid diagrams, tables, code)
- **Toolbar** at the top — global search, settings, print, light/dark theme

Every save automatically creates a commit in your GitHub repo. Your full history is preserved.

## Step 5 (optional) — Connect an AI

To use the AI assistant and skills, set up an AI provider:

1. Click the **gear icon** (Settings)
2. In the **General** tab, pick a provider (Claude, OpenAI, OpenRouter, Ollama, Custom)
3. Enter your API key
4. Click **Save**

Your key is encrypted and stored only in your browser. Full guide: [Connect your AI](./03-connect-your-ai.md)

## Step 6 (optional) — Install skills

Skills make the AI assistant better at specific tasks:

1. Go to Settings > **Skills** tab
2. Browse available skills
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

**What happens to my data if WebClaw disappears?**
Nothing. Your files are in your GitHub repo. You can read, edit, and manage them with any Markdown tool, forever.

---

**Next** → [Authentication & security](./02-authentication.md)
