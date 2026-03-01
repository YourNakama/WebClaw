# Creating a skill

Complete guide to creating and contributing your own skills to the WebClaw Skill Hub.

## Skill structure

Each skill lives in its own folder at the root of this repo. The folder name **must** match the `id` in the manifest.

```
my-skill/
├── skill.json     # Manifest (required)
└── prompt.md      # AI instructions (optional)
```

## The manifest (`skill.json`)

The manifest describes your skill to the system. It's the only strictly required file.

```json
{
  "id": "my-skill",
  "name": "My Skill",
  "description": "One clear sentence describing what the skill does.",
  "version": "1.0.0",
  "author": "YourName",
  "category": "tool",
  "icon": "FileText",
  "tags": ["documentation", "productivity"],
  "hasPrompt": true
}
```

### Required fields

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Lowercase kebab-case (`a-z0-9-` only), max 64 chars. **Must match the folder name.** |
| `name` | string | Human-readable name, max 100 chars |
| `description` | string | One clear sentence, max 500 chars |
| `version` | string | Semver format (`1.0.0`), max 20 chars |
| `author` | string | Your name or organization, max 100 chars |
| `category` | string | `"tool"`, `"template"`, or `"agent"` |

### Optional fields

| Field | Type | Description |
|-------|------|-------------|
| `icon` | string | [Lucide](https://lucide.dev/icons) icon name (e.g. `"FileText"`, `"Wand2"`, `"Bot"`), max 50 chars |
| `tags` | string[] | Up to 10 tags, each max 30 chars |
| `hasPrompt` | boolean | `true` if you include a `prompt.md` file |
| `maxToolLoops` | number | Max tool calls per workflow step (1-5, default 5) |
| `maxSteps` | number | Max workflow steps (1-10, default 10) |
| `workflow` | object | Workflow definition — **agent type only** |

## The prompt (`prompt.md`)

For **tool** and **template** skills, `prompt.md` contains the instructions injected into the AI's system prompt. Write it as clear directives for an LLM.

### Limits

- Maximum **8,000 characters**
- No HTML or `<script>` tags (stripped automatically)
- Markdown formatting is preserved

### Tips for writing a good prompt

**Be directive** — The AI responds better to clear instructions.

```markdown
# Bad
You might consider adding YAML frontmatter...

# Good
Every document MUST start with YAML frontmatter containing: type, title, status, date, tags.
```

**Give concrete examples** — Show exactly what you expect.

```markdown
# Bad
Write professionally.

# Good
## Voice
- Use natural contractions: "it's", "don't", "we'll"
- Vary sentence length — mix short punchy sentences with longer explanatory ones
- Address the reader directly: "You'll want to..." not "One must..."

### Banned (detectable AI patterns):
- "It's important to note that..."
- "In today's fast-paced..."
- "Let's dive into..."
- "Robust", "Seamless", "Cutting-edge"
```

**Structure with headings** — The LLM follows well-organized instructions better.

**Include DO / DO NOT rules** — Explicit lists of what to do and what to avoid.

## Creating a Tool skill

A Tool skill injects its prompt into the AI assistant. The user chats normally and the AI automatically applies your instructions.

### Minimal example

**`meeting-notes/skill.json`:**

```json
{
  "id": "meeting-notes",
  "name": "Meeting Notes",
  "description": "Formats meeting notes with participants, decisions, and action items.",
  "version": "1.0.0",
  "author": "YourName",
  "category": "tool",
  "icon": "ClipboardList",
  "tags": ["meeting", "notes", "productivity"],
  "hasPrompt": true
}
```

**`meeting-notes/prompt.md`:**

```markdown
# Meeting Notes — Structured formatting

When the user asks to create or format meeting notes, follow these rules:

## Required structure

Every report MUST contain:

1. **YAML frontmatter**: type: meeting, date, participants (list)
2. **Context**: 1 paragraph summarizing the meeting purpose
3. **Topics discussed**: one `##` per topic with summary
4. **Decisions**: Markdown table (decision | owner | deadline)
5. **Action items**: checklist `- [ ]` with owner and deadline
6. **Next meeting**: date and tentative agenda

## File location

Place the file in `meetings/YYYY-MM-DD-topic.md`.
```

## Creating a Template skill

A Template skill generates complete documents from a structured prompt.

The difference from a Tool: a Template is designed to produce a one-shot document, not to change the AI's conversational behavior.

The `prompt.md` of a Template describes the exact structure of the document to generate.

## Creating an Agent skill

An Agent skill defines a multi-step workflow. It's the most powerful type.

### Workflow definition

The workflow is defined directly in `skill.json`:

```json
{
  "id": "vault-audit",
  "name": "Vault Audit",
  "description": "Audits the vault and suggests structural improvements.",
  "version": "1.0.0",
  "author": "YourName",
  "category": "agent",
  "icon": "Search",
  "tags": ["audit", "organization"],
  "workflow": {
    "steps": [
      {
        "id": "scan",
        "name": "Scan files",
        "description": "Read all files and analyze their structure",
        "instruction": "Use list_files to list all vault files. Then use read_file to read each .md file. Analyze: frontmatter presence, heading quality, length, internal links.",
        "requiresApproval": false,
        "allowedTools": ["list_files", "read_file", "search_content"]
      },
      {
        "id": "report",
        "name": "Audit report",
        "description": "Generate a report with identified issues",
        "instruction": "Create a file reports/vault-audit.md with a table summarizing each audited file: name, issues found, quality score (1-5). Add global recommendations.",
        "requiresApproval": true,
        "allowedTools": ["create_file"]
      },
      {
        "id": "fix",
        "name": "Apply fixes",
        "description": "Fix identified issues file by file",
        "instruction": "For each file with issues from the report, use edit_file to fix: add missing frontmatter, correct heading levels, add introductions to sections that lack them.",
        "requiresApproval": true,
        "allowedTools": ["read_file", "edit_file"]
      }
    ]
  }
}
```

### Step fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique within the workflow, max 50 chars |
| `name` | Yes | Name shown to the user, max 100 chars |
| `description` | Yes | What this step does, max 500 chars |
| `instruction` | Yes | Directive for the AI, max 2,000 chars |
| `requiresApproval` | No | If `true` (default), pauses before running |
| `allowedTools` | No | Restricts the step to specific tools |

### Best practices for workflows

1. **Start with reading** — First steps should scan and analyze without modifying anything.
2. **Report before action** — Show the user what you found before changing anything.
3. **Step granularity** — Each step = one logical action. Don't mix scanning and fixing in the same step.
4. **Restrict tools** — Read-only steps should only have access to `list_files`, `read_file`, `search_content`.

## Publishing your skill

### 1. Add to the registry

Edit `registry.json` at the repo root and add your skill:

```json
{
  "skills": [
    {
      "id": "my-skill",
      "name": "My Skill",
      "description": "What the skill does.",
      "version": "1.0.0",
      "author": "YourName",
      "category": "tool",
      "icon": "FileText",
      "tags": ["documentation"]
    }
  ]
}
```

### 2. Open a Pull Request

1. Fork this repo
2. Create your skill folder
3. Add the entry to `registry.json`
4. Open a PR with:
   - Description of what the skill does
   - Example use cases
   - Screenshots if relevant

### 3. Review

Your skill will be reviewed on:
- **Usefulness** — Solves a real problem
- **Quality** — Prompt is well-written and specific
- **Security** — No injection, no data exfiltration
- **Scope** — One skill = one clear job
- **Naming** — Descriptive ID and name

## Validation and limits

Your skill will be rejected if:
- Required fields are missing or exceed size limits
- The manifest `id` doesn't match the folder name
- The category isn't `tool`, `template`, or `agent`
- Workflow steps reference unauthorized tools
- Step IDs contain duplicates
- The prompt exceeds 8,000 characters

---

**Next** → [Mobile, PWA & offline](./07-mobile-and-offline.md) | **Back** → [README](../README.md)
