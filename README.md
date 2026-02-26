<p align="center">
  <img src="./assets/logo.png" alt="WebClaw by NakamaCyber" width="160" />
</p>

<h1 align="center">WebClaw by NakamaCyber</h1>

<p align="center">
  <strong>The AI-powered document workspace that runs in your browser.</strong><br/>
  Free forever. Secure by design. No install. Bring your own AI.
</p>

<p align="center">
  <a href="https://webclaw.nakamacyber.ai"><img src="https://img.shields.io/badge/Try%20it-webclaw.nakamacyber.ai-7c3aed?style=for-the-badge" alt="Try WebClaw"></a>
</p>

<p align="center">
  <a href="https://ko-fi.com/nakamacyber"><img src="https://img.shields.io/badge/Ko--fi-Support%20the%20project-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white" alt="Ko-fi"></a>
  <img src="https://img.shields.io/badge/model-donationware-brightgreen?style=flat-square" alt="Donationware">
  <img src="https://img.shields.io/badge/app-free%20forever-blue?style=flat-square" alt="Free">
</p>

---

<!-- TODO: Replace with an animated GIF or video showcasing the app -->
<!-- Suggested content: a 30-60s screen recording showing:
     1. Landing page → Connect with GitHub → vault opens
     2. Creating a document with the AI assistant (Ctrl+K)
     3. AI generating a structured guide with Mermaid diagrams
     4. Installing a skill from the hub in Settings
     5. Printing / exporting a polished document
-->
<p align="center">
  <img src="./assets/demo.gif" alt="WebClaw in action — AI document assistant in the browser" width="720" />
  <br/>
  <em>WebClaw in action — try it at <a href="https://webclaw.nakamacyber.ai">webclaw.nakamacyber.ai</a></em>
</p>

---

## What if you could...

- Turn an 80-page RFP into a structured summary + response plan in 10 minutes
- Generate a 30-page technical guide with diagrams, code examples, and a human voice
- Convert raw meeting notes into a professional report with decisions and action items
- Organize months of scattered documents into a searchable knowledge base

**...all from a browser tab. No install. Your data stays yours.**

That's [**WebClaw**](https://webclaw.nakamacyber.ai).

---

## Quick start

> **[webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai)** — open it, sign in with GitHub, start working.

```
1. Go to webclaw.nakamacyber.ai
2. Sign in with GitHub (one click)
3. Create or connect a vault (= a GitHub repo for your documents)
4. Plug in your AI in Settings (Claude, OpenAI, Ollama… your choice)
5. Install skills from the community hub
6. Work.
```

No terminal. No Docker. No `npm install`. No subscription. A browser and a GitHub account — that's it.

Full walkthrough: **[Getting started](./documentation/01-getting-started.md)**

---

## OpenClaw for the browser — simpler and safer

You might know [OpenClaw](https://github.com/openclaw/openclaw), the open-source AI agent phenomenon (191k+ stars) that automates everything on your machine: shell, files, web, messaging. It's incredibly powerful — but you need a terminal, technical knowledge, and you give the AI full access to your system.

**WebClaw takes the best ideas from OpenClaw** — BYOK (Bring Your Own Key), community skills, AI that acts on your files — **and makes them accessible to everyone:**

| | OpenClaw | WebClaw |
|:--|:---------|:--------|
| **To get started** | Terminal + Docker + YAML config | **Open a browser. That's it.** |
| **Who uses it** | Developers, power users | **Everyone** — consultants, researchers, students, managers, writers |
| **What AI can do** | Everything (shell, web, system, APIs) | **Your documents only** — read, write, organize, search |
| **Security** | AI has access to your entire system | **Strict sandbox** — 8 tools, zero system access, approval on every change |
| **Your API keys** | Plain text config file | **AES-256-GCM encrypted** in your browser |
| **Your data** | On your local machine | **In your GitHub** — versioned, portable, yours forever |
| **Pricing** | Open source | **Donationware** — free, community-funded |

WebClaw isn't "OpenClaw but worse". It's OpenClaw **rethought for people who produce documents** — and who don't want to configure a Docker Compose just to write a report.

---

## How WebClaw changes your day

### You're a consultant or freelancer

Monday morning. A client sends you an 80-page RFP. Before, you'd spend the day reading, highlighting, copy-pasting into an Excel sheet. With WebClaw:

1. Drop the PDF into your vault
2. *"Read this RFP and extract all requirements as a compliance matrix"*
3. *"Write a structured response plan with the sections of the technical proposal"*
4. *"Draft the Architecture section based on our Next.js + microservices stack"*

In 2 hours you have a summary, a matrix, a plan, and a first draft. The rest of the day, you refine. Your competitor is still reading page 40.

### You're a developer or tech lead

Your team is growing. Architecture decisions are made in meetings but never documented. New hires ask the same questions. With WebClaw:

- *"Document our auth service architecture with OAuth flows and sequence diagrams"*
- *"Create a development guide for our stack with conventions, testing, and deployment"*
- *"Turn my post-mortem notes into a structured report with timeline and corrective actions"*

Every document is a Markdown file in your GitHub. Versioned. Searchable. Shareable.

### You're a researcher or student

Dozens of reading notes, annotated articles, chapter drafts. With WebClaw:

- *"Organize my reading notes by theme and create a cross-linked index"*
- *"Turn my rough methodology notes into a polished section for my thesis"*
- *"Create a comparative summary of these 3 articles I imported"*

### You manage a team

Meeting minutes, processes, onboarding guides — all buried in emails and scattered Google Docs. With WebClaw:

- *"Format my standup notes as a report with decisions and action items"*
- *"Create an onboarding guide for new developers joining the team"*
- *"Summarize everything documented in the vault this week"*

---

## Skills: superpowers for your AI

Skills are what makes WebClaw unique. They're **specialized instructions** the community creates and shares to make the AI assistant better at specific tasks.

**Example: the `doc-writer` skill** turns the AI into a consultant-grade writer. Without it, ask the AI to write a guide and you get a generic blog post. With it, you get a real professional deliverable: structured frontmatter, table of contents, Mermaid diagrams, natural voice, controlled prose/code ratio.

There are 3 types:

| Type | One-liner | Example |
|------|-----------|---------|
| **Tool** | Changes how the AI writes and thinks | `doc-writer` — consultant-grade documentation |
| **Template** | Generates a complete document in one prompt | Proposal, audit report, meeting minutes |
| **Agent** | Multi-step automated workflow | Scan vault → report issues → fix them |

Skills are **pure data** (JSON + Markdown). No code, no plugins, no npm install. The AI can only act on your files, and every change requires your approval.

**Install a skill:** Settings > Skills > Install > Enable. 10 seconds.

### Available skills

| Skill | Type | Description |
|-------|------|-------------|
| [doc-writer](./doc-writer/) | Tool | Consultant-grade documentation — pedagogical depth, Mermaid diagrams, attack scenarios, natural voice. DocLifecycle + Consultant Voice + QualityGate methodology. |

*More coming soon. You can also [create your own](./documentation/06-creating-a-skill.md).*

---

## Security: not a feature, the foundation

WebClaw is built for people who handle sensitive documents — RFP responses, client data, technical architecture. Security isn't a checkbox, it's the architecture.

**Your secrets never leave your browser.** GitHub token, API keys — everything is AES-256-GCM encrypted via your browser's native WebCrypto API and stored in IndexedDB. No server sees them in plain text. The server does one thing only: the OAuth handshake. Zero vault data passes through it.

**The AI can't do whatever it wants.** It has access to 8 tools. No shell, no network, no system access. And every time it wants to create, edit, or delete a file: it asks you. No shortcut.

**Skills can't be malicious.** They're pure data — JSON and Markdown. No `eval()`, no `import()`, no executable code. They come from a single trusted source (this repo). They're validated before reaching your browser.

<details>
<summary><strong>Technical security details</strong></summary>

### Architecture

```
Browser (100% client-side)
├── GitHub OAuth
├── Token encrypted AES-256-GCM → IndexedDB
├── API keys encrypted AES-256-GCM → IndexedDB
├── Octokit.js — direct GitHub API calls
├── CodeMirror 6 — editor
├── DOMPurify — XSS protection
└── marked.js — Markdown rendering

Server (minimal)
├── Static pages (Next.js)
└── /api/auth/* — OAuth exchange only
```

### Protection layers

| Layer | Protection |
|-------|-----------|
| Tokens & API keys | AES-256-GCM via WebCrypto + IndexedDB |
| XSS (HTML) | DOMPurify with strict allowlist |
| XSS (Links) | `target="_blank"` + `rel="noopener noreferrer"` |
| CSP | `script-src 'self'`, `connect-src` GitHub whitelist, `frame-src 'none'` |
| Headers | HSTS, X-Frame-Options DENY, nosniff, Permissions-Policy |
| OAuth | CSRF protection via state parameter |
| Data transit | Zero vault data on server side |

### Skill limits

| Constraint | Limit |
|------------|-------|
| Code execution | **None** |
| Network access | **None** |
| Allowed tools | 8 sandboxed tools only |
| Manifest size | 10 KB max |
| Prompt size | 8,000 characters max |
| Steps per workflow | 10 max |
| Tool calls per step | 5 max |
| Total per workflow | 50 max |

</details>

---

## Bring your own AI

WebClaw doesn't lock you into a model. You choose, you pay (or don't), you switch whenever you want.

| Provider | What you need | Cost |
|----------|--------------|------|
| **Claude** (Anthropic) | API key | Pay-per-use |
| **OpenAI** (GPT-4o) | API key | Pay-per-use |
| **OpenRouter** | API key (access to 200+ models) | Pay-per-use |
| **Ollama** | Installed on your machine | **Free, 100% local** |
| **Custom** | Any OpenAI-compatible API | Varies |

With **Ollama**, no data leaves your machine. Zero cost, zero tracking, zero cloud dependency.

Setup: Settings > General > pick provider > enter key > Save. 30 seconds.

Full guide: **[Connect your AI](./documentation/03-connect-your-ai.md)**

---

## Documentation

Step-by-step guides to get the most out of [webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai):

| Guide | Description |
|-------|-------------|
| [Getting started](./documentation/01-getting-started.md) | Sign up, create your vault, write your first document |
| [Authentication & security](./documentation/02-authentication.md) | How sign-in works and why it's secure |
| [Connect your AI](./documentation/03-connect-your-ai.md) | Set up Claude, OpenAI, OpenRouter, Ollama, or a custom endpoint |
| [Install & use skills](./documentation/04-install-use-skills.md) | Browse the hub, install, enable, and use skills |
| [Real-world examples](./documentation/05-real-world-examples.md) | Detailed walkthroughs: RFPs, tech guides, reports, knowledge bases |
| [Create a skill](./documentation/06-creating-a-skill.md) | Full spec to contribute your own skills to the community |

---

## This repository

This repo is the **public heart of WebClaw**. It serves two purposes:

1. **Documentation** — Everything you need to learn and master the app at [webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai)
2. **Skill Hub** — The central registry of community skills that the app loads automatically

```
WebClaw/
├── README.md                  ← you are here
├── assets/
│   ├── logo.png
│   └── demo.gif               ← app demo (TODO)
├── registry.json              skill registry
├── documentation/             user guides
│   ├── 01-getting-started.md
│   ├── 02-authentication.md
│   ├── 03-connect-your-ai.md
│   ├── 04-install-use-skills.md
│   ├── 05-real-world-examples.md
│   └── 06-creating-a-skill.md
├── doc-writer/                "Doc Writer" skill
│   ├── skill.json
│   └── prompt.md
└── ...                        future community skills
```

---

## Roadmap & ideas

### Upcoming skills

| Skill | What it will do |
|-------|----------------|
| **Meeting Notes** | Raw notes → structured report with decisions and action items |
| **RFP Response Writer** | RFP digest + compliance matrix + response plan |
| **Vault Cleanup Agent** | Auto-scan for empty files, missing frontmatter, broken links |
| **Translation Agent** | Translate documents while preserving formatting |
| **Zettelkasten Builder** | Atomic note-taking with `[[wiki-links]]` and index files |
| **Weekly Review Agent** | Weekly summary of vault activity + pending tasks |
| **API Doc Generator** | Structured REST API docs from free-form input |
| **Audit Report** | Audit report with risk matrix and recommendations |
| **Onboarding Guide** | Welcome guide for new team members |
| **Changelog Writer** | Automated CHANGELOG.md maintenance |

### App improvements

- **Prompt variables** — `{{project}}`, `{{stack}}`, `{{client}}` to personalize skills
- **Composable skills** — Chain multiple skills in a single workflow
- **Skill versioning** — Update notifications when a new version is available
- **Conversation history** — Save and resume past AI sessions
- **Collaborative mode** — Multi-user editing via GitHub branches + AI-assisted merge
- **Obsidian compatibility** — Bidirectional sync with existing Obsidian vaults
- **Skill import/export** — Share custom skills without going through the hub
- **Community marketplace** — Web interface to browse, rate, and discover skills

**Have an idea?** [Open an issue](https://github.com/YourNakama/WebClaw/issues). We build WebClaw with its community.

---

## Contributing

Two ways to participate:

**Create a skill** — Fork this repo, create your folder with `skill.json` + `prompt.md`, add it to `registry.json`, open a PR. [Full guide here](./documentation/06-creating-a-skill.md).

**Suggest an idea** — Don't want to write the manifest? [Open an issue](https://github.com/YourNakama/WebClaw/issues) describing the skill or feature you'd like.

Contributions are reviewed for: usefulness, prompt quality, security, and naming clarity.

---

## Support the project

WebClaw is **donationware**. The model is simple: everything is free, everything is accessible, and those who benefit can choose to support the project.

No Pro plan to unlock. No document counter. No "your trial expires in 7 days". Ever.

We believe a freelance consultant, a grad student, a three-person nonprofit — everyone deserves professional tools to work with AI. Not just those who can afford a $20/month subscription.

If WebClaw saves you time, you can help it live and grow:

<p align="center">
  <a href="https://ko-fi.com/nakamacyber">
    <img src="https://img.shields.io/badge/Ko--fi-Support%20WebClaw-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Support on Ko-fi">
  </a>
</p>

Ko-fi takes **0% commission** — 100% goes to the developer. Your donations fund development, new skills, hosting, and documentation.

**No feature will ever be locked behind a donation. That's a promise.**

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 + shadcn/ui |
| Auth | GitHub OAuth + CSRF |
| Editor | CodeMirror 6 |
| Preview | marked.js + DOMPurify |
| Diagrams | Mermaid |
| File backend | GitHub Contents API via Octokit |
| Encryption | WebCrypto AES-256-GCM + IndexedDB |
| Animations | Framer Motion |
| AI providers | Claude, OpenAI, OpenRouter, Ollama, Custom |

## License

The WebClaw application is free to use (proprietary). **Skills** in this repository are shared under the MIT license for free community use.

---

<p align="center">
  <a href="https://webclaw.nakamacyber.ai"><strong>Try WebClaw</strong></a> · <a href="./documentation/">Documentation</a> · <a href="https://ko-fi.com/nakamacyber">Support</a> · <a href="https://github.com/YourNakama/WebClaw/issues">Report a bug</a>
  <br/><br/>
  Built with care by <a href="https://github.com/YourNakama"><strong>NakamaCyber</strong></a>
</p>
