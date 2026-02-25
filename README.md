# WebClaw Skill Hub

**The official skill repository for [WebClaw by NakamaCyber](https://github.com/YourNakama/WebClaw).**

Skills extend WebClaw's AI assistant with specialized behaviors — from documentation writing styles to multi-step vault automation workflows. This repo is the single trusted source for all community skills.

## What is WebClaw?

WebClaw is a free, browser-based markdown vault that syncs with your GitHub repository. It includes an AI assistant (bring your own model: Claude, OpenAI, Ollama) that can read, create, edit, and organize your files. Skills let the community teach the assistant new tricks without writing code.

## What are Skills?

A skill is **pure data** — a JSON manifest + an optional Markdown prompt. No code execution, no arbitrary plugins, no npm packages. Skills can only interact with files through 8 sandboxed tools, and every file mutation requires the user's explicit approval.

There are 3 types:

| Type | What it does | When to use |
|------|-------------|-------------|
| **Tool** | Injects specialized instructions into the AI assistant | You want the AI to follow specific rules when writing, formatting, or organizing |
| **Template** | Generates documents from a structured prompt | You want one-click document creation (proposals, reports, meeting notes) |
| **Agent** | Multi-step workflow with checkpoints and user approval | You want automated sequences: scan, analyze, propose, then apply changes |

## Available Skills

| Skill | Type | Description |
|-------|------|-------------|
| [doc-writer](./doc-writer/) | Tool | Writes quality, humanized documentation with YAML frontmatter, proper structure, and smart file placement. Follows the DocLifecycle + Humanizer + QualityGate methodology. |

## How to Install a Skill

1. Open WebClaw in your browser
2. Go to **Settings** (gear icon) > **Skills** tab
3. The registry loads automatically from this repo
4. Click **Install** on the skill you want
5. Toggle the **enable/disable** switch to activate it

That's it. Tool and Template skills take effect immediately in the AI assistant. Agent skills appear in the Bot dropdown in the AI panel.

## Repository Structure

```
skills/                        (this repo)
├── README.md                  you're here
├── registry.json              central registry — lists all available skills
├── doc-writer/                one folder per skill
│   ├── skill.json             manifest (required)
│   └── prompt.md              AI instructions (optional)
├── another-skill/
│   ├── skill.json
│   └── prompt.md
└── ...
```

Each skill lives in its own folder. The folder name **must** match the `id` in `skill.json`.

## Creating a Skill

Want to contribute? Here's the full spec.

### 1. The Manifest (`skill.json`)

Every skill needs a `skill.json` at its root:

```json
{
  "id": "my-skill",
  "name": "My Skill",
  "description": "One sentence describing what the skill does.",
  "version": "1.0.0",
  "author": "YourName",
  "category": "tool",
  "icon": "FileText",
  "tags": ["writing", "productivity"],
  "hasPrompt": true
}
```

#### Required fields

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Lowercase kebab-case (`a-z0-9-` only), max 64 characters. Must match the folder name. |
| `name` | string | Human-readable name, max 100 characters |
| `description` | string | One clear sentence, max 500 characters |
| `version` | string | Semver format (`1.0.0`), max 20 characters |
| `author` | string | Your name or organization, max 100 characters |
| `category` | string | One of: `"tool"`, `"template"`, `"agent"` |

#### Optional fields

| Field | Type | Description |
|-------|------|-------------|
| `icon` | string | [Lucide](https://lucide.dev/icons) icon name (e.g. `"FileText"`, `"Wand2"`, `"Bot"`), max 50 chars |
| `tags` | string[] | Up to 10 tags, each max 30 characters |
| `hasPrompt` | boolean | Set to `true` if you include a `prompt.md` file |
| `maxToolLoops` | number | Max tool calls per workflow step (1-5, default 5) |
| `maxSteps` | number | Max workflow steps (1-10, default 10) |
| `workflow` | object | Workflow definition — **agent type only** (see below) |

### 2. The Prompt (`prompt.md`)

For **tool** and **template** skills, `prompt.md` contains the instructions injected into the AI's system prompt. Write it as clear directives for an LLM.

**Limits:**
- Maximum **5,000 characters**
- No HTML or `<script>` tags (stripped automatically)
- Markdown formatting is preserved

**Tips for good prompts:**
- Be specific and directive — "You MUST..." works better than "You should consider..."
- Include concrete examples of what the AI should produce
- List explicit DO and DO NOT rules
- Structure with headings for readability

### 3. Agent Workflows (Agent Type Only)

Agent skills define a `workflow` with sequential steps. Each step tells the AI what to do, which tools it can use, and whether the user must approve before proceeding.

```json
{
  "id": "vault-cleanup",
  "name": "Vault Cleanup",
  "category": "agent",
  "workflow": {
    "steps": [
      {
        "id": "scan",
        "name": "Scan vault",
        "description": "Identify issues across all files",
        "instruction": "Use list_files and read_file to scan all .md files. Look for: missing frontmatter, empty files, broken links. Report findings as a summary.",
        "requiresApproval": false,
        "allowedTools": ["list_files", "read_file", "search_content"]
      },
      {
        "id": "fix",
        "name": "Apply fixes",
        "description": "Fix the identified issues",
        "instruction": "Apply fixes using edit_file. Add missing frontmatter, fix formatting issues.",
        "requiresApproval": true,
        "allowedTools": ["read_file", "edit_file"]
      }
    ]
  }
}
```

#### Workflow step fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique within the workflow, max 50 chars |
| `name` | Yes | Step name shown to the user, max 100 chars |
| `description` | Yes | What this step does, max 500 chars |
| `instruction` | Yes | Directive for the AI, max 2,000 chars |
| `requiresApproval` | No | If `true` (default), pauses for user approval before running |
| `allowedTools` | No | Restricts the step to specific tools (see list below) |

### 4. Register in `registry.json`

Add your skill to `registry.json` at the repo root:

```json
{
  "skills": [
    {
      "id": "my-skill",
      "name": "My Skill",
      "description": "What it does.",
      "version": "1.0.0",
      "author": "YourName",
      "category": "tool",
      "icon": "FileText",
      "tags": ["writing"]
    }
  ]
}
```

## Available Tools

Skills can only reference these 8 sandboxed tools. No other APIs, endpoints, or system calls are available:

| Tool | Description | Mutates files? |
|------|-------------|----------------|
| `read_file` | Read a file's content by path | No |
| `create_file` | Create a new file with content | **Yes** — requires user confirmation |
| `edit_file` | Edit a file (find & replace or full rewrite) | **Yes** — requires user confirmation |
| `delete_file` | Delete a file | **Yes** — requires user confirmation |
| `search_files` | Find files by name or path pattern | No |
| `search_content` | Search text across all vault files | No |
| `list_files` | List files in a directory | No |
| `get_current_file` | Get the file currently open in the editor | No |

Mutating tools (`create_file`, `edit_file`, `delete_file`) **always** require explicit user approval, even inside agent workflows. There's no way to bypass this.

## Safety & Limits

WebClaw enforces strict safety boundaries on all skills:

| Constraint | Limit |
|------------|-------|
| Manifest size | 10 KB max |
| Prompt size | 5,000 characters max |
| Workflow steps | 10 max per skill |
| Tool calls per step | 5 max |
| Total tool calls per workflow | 50 max |
| Allowed tools | Only the 8 listed above |
| Code execution | **None** — skills are pure data (JSON + Markdown) |
| Network access | **None** — skills can't make HTTP requests |
| File system access | Only through the 8 sandboxed tools |
| Single source | Only skills from this repo are loaded — no arbitrary URLs |

Skills are validated server-side before reaching the client. A skill will be rejected if:

- Required fields are missing or exceed size limits
- The manifest `id` doesn't match the folder name
- The category isn't `tool`, `template`, or `agent`
- Workflow steps reference tools not in the allowed list
- Step IDs contain duplicates

## Contributing

We welcome community contributions. Here's how to propose a skill:

### Option 1: Pull Request (preferred)

1. Fork this repository
2. Create your skill folder with `skill.json` and optionally `prompt.md`
3. Add your skill to `registry.json`
4. Open a Pull Request with:
   - A clear description of what the skill does
   - Example use cases
   - Screenshots if relevant (especially for agent workflows)

### Option 2: Issue

Don't want to write the manifest yourself? [Open an issue](https://github.com/YourNakama/WebClaw/issues) describing the skill you'd like and we'll build it.

### Review criteria

Skills are reviewed before merging. We check for:

- **Usefulness** — Does it solve a real problem for vault users?
- **Quality** — Is the prompt well-written and specific?
- **Safety** — No attempts to exfiltrate data, no prompt injection, no abuse of tools
- **Scope** — Skills should focus on one clear job, not try to do everything
- **Naming** — Clear, descriptive `id` and `name` that don't conflict with existing skills

### Skill ideas we'd love to see

Looking for inspiration? Here are some skills we think the community would benefit from:

- **Zettelkasten Builder** — Enforces atomic note-taking with `[[wiki-links]]` and proper index files
- **Meeting Notes Formatter** — Standardizes meeting notes with participants, decisions, and action items
- **API Doc Generator** — Generates REST API documentation from structured input
- **Changelog Writer** — Maintains a structured CHANGELOG.md following Keep a Changelog format
- **Vault Cleanup Agent** — Scans for empty files, missing frontmatter, broken links, and fixes them
- **Weekly Review Agent** — Summarizes the week's journal entries and extracts pending tasks
- **Translation Agent** — Translates documents while preserving formatting and frontmatter

## License

MIT — Skills contributed to this repo are shared under the MIT license for free community use.

## Links

- **WebClaw** (the app): [github.com/YourNakama/WebClaw](https://github.com/YourNakama/WebClaw)
- **NakamaCyber**: [github.com/YourNakama](https://github.com/YourNakama)
- **Support the project**: [ko-fi.com/nakamacyber](https://ko-fi.com/nakamacyber)
