# Install & use skills

Skills extend WebClaw's AI assistant with specialized capabilities. This guide covers installing, activating, and using all three skill types.

## Prerequisites

- A WebClaw account at [webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai) (see [Getting started](./01-getting-started.md))
- An AI provider configured (see [Connect your AI](./03-connect-your-ai.md))

The skill hub is already built into WebClaw — nothing else to configure.

## Browse available skills

1. Open your vault at [webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai)
2. Click the **gear icon** (Settings)
3. Go to the **Skills** tab
4. The registry loads automatically from the Skill Hub

You'll see all available skills with their name, description, type (Tool / Template / Agent), and author.

## Install a skill

1. Find the skill you want
2. Click **Install**
3. The skill is downloaded and stored in your browser (IndexedDB, encrypted)

Skills persist across page reloads. You don't need to reinstall each session.

## Enable / Disable a skill

After installing, a toggle switch appears next to the skill. Enable it for the AI assistant to use it.

You can enable **multiple skills at the same time**. Their prompts are injected in order into the system.

---

## Using Tool skills

Tool skills change how the AI assistant behaves by injecting instructions into its system prompt.

### Example: doc-writer

The **doc-writer** skill turns the assistant into a consultant-grade documentation writer.

**Without doc-writer:**
> "Write a guide on OAuth authentication"
> → Generic StackOverflow-style response

**With doc-writer enabled:**
> "Write a guide on OAuth authentication"
> → Structured document with:
> - YAML frontmatter (type, title, status, date, tags)
> - Summary paragraph up front
> - Table of contents with anchor links
> - Contextual intro to every section
> - 60% prose / 40% code ratio
> - Mermaid diagrams (OAuth flows, architecture)
> - Concrete attack scenarios for security topics
> - Natural consultant voice (no AI-speak)

### How to use

1. Install and enable the skill in Settings > Skills
2. Open the AI panel (`Ctrl+K`)
3. Chat normally — the AI automatically applies the skill's instructions

---

## Using Template skills

Template skills generate complete documents from a structured prompt. They're designed for one-shot generation: you describe what you need, the AI produces a full document.

### Typical usage

1. Enable the Template skill
2. Open the AI panel
3. Describe your need: *"Create meeting minutes for this morning's standup with Alice, Bob, and Charlie"*
4. The AI generates a structured document following the skill's template
5. Confirm the file creation

---

## Using Agent skills

Agent skills are the most powerful type. They run multi-step workflows with checkpoints and your approval at each phase.

### How to launch an Agent workflow

1. Install and enable the Agent skill
2. Open the AI panel
3. Click the **Bot icon** (robot) in the panel header
4. Select the workflow from the dropdown
5. The workflow starts and progresses step by step

### How steps work

Each step in an Agent workflow has a defined behavior:

- **Auto-approval steps** (`requiresApproval: false`): run immediately. Typically used for reading and analysis (scanning files, searching content).

- **Manual approval steps** (`requiresApproval: true`): pause and show **Continue** / **Stop** buttons. You can review results before deciding to proceed.

- **File mutations**: even in an auto-approved step, every `create_file`, `edit_file`, or `delete_file` asks for individual confirmation.

### Example workflow: Vault Cleanup

```
Step 1 — Scan (auto):    Agent reads all .md files in the vault
Step 2 — Analyze (auto): Identifies empty files, missing frontmatter, broken links
Step 3 — Report (pause): Shows a summary of issues found
    → You: [Continue] or [Stop]
Step 4 — Fix (pause):    Proposes fixes file by file
    → Each edit_file asks for your confirmation
```

---

## Uninstall a skill

1. Go to Settings > Skills
2. Click **Uninstall** next to the skill
3. The skill is removed from your browser

Uninstalling doesn't affect your files. Only the skill prompt is removed.

## FAQ

**Can skills access the internet?**
No. Skills can't make network requests. They only have access to the 8 sandboxed vault tools.

**Can a skill modify my files without asking?**
No. Every mutation (create, edit, delete) requires your explicit confirmation, even inside Agent workflows.

**Can I enable multiple Tool skills at the same time?**
Yes. Their prompts are combined in the system. Just avoid enabling skills with contradictory instructions.

**How many skills can I install?**
No limit. Install as many as you want, enable/disable as needed.

---

**Next** → [Real-world examples](./05-real-world-examples.md)
