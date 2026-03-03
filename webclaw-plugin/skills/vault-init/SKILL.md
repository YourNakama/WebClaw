---
name: vault-init
description: Initialize a new vault with a recommended folder structure, templates, and starter files.
---

# /webclaw:vault-init

Set up a fresh vault with a professional structure.

## Instructions

When the user invokes this skill:

1. Ask the user what kind of vault they want (or use default):
   - **Personal knowledge base** — journal, notes, projects, references
   - **Team documentation** — guides, decisions, meetings, runbooks
   - **Project docs** — architecture, API docs, changelog, onboarding
2. Create the folder structure and starter files using `webclaw_create_file` for each file.

## Default structure (Personal knowledge base)

```
README.md                     — Vault overview
journal/                      — Daily journal entries
  .gitkeep
notes/                        — Quick notes and ideas
  .gitkeep
projects/                     — Project-specific docs
  .gitkeep
references/                   — External references, bookmarks
  .gitkeep
templates/                    — Document templates
  note.md
  meeting.md
  guide.md
.templates/                   — WebClaw page templates
  note.md
  meeting.md
```

## Starter files content

### README.md
```markdown
---
title: "My Vault"
tags: [vault, index]
created_at: "{today}"
type: index
---

# My Vault

Welcome to your knowledge base. This vault is synced to GitHub and managed with WebClaw.

## Structure

- **journal/** — Daily journal entries
- **notes/** — Quick notes and ideas
- **projects/** — Project documentation
- **references/** — External references
- **templates/** — Document templates
```

### templates/note.md
```markdown
---
title: "{{title}}"
tags: []
created_at: "{{date}}"
type: note
---

# {{title}}

{content}
```

## Output format

- List each created file with a checkmark
- Show the total count
- End with: "Your vault is ready. You can now use the other WebClaw tools to browse, search, and manage your files."
