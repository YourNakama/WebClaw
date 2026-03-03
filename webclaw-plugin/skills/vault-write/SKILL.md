---
name: vault-write
description: Create or update files in your vault — write documents, notes, and structured content directly to GitHub.
---

# /webclaw:vault-write

Create or update files in the user's vault.

## Instructions

When the user invokes this skill:

1. Determine if this is a **create** or **update** operation.
2. For new files:
   - Generate appropriate frontmatter (title, tags, created_at with today's date, type)
   - Call `webclaw_create_file` with the content
3. For updates:
   - Call `webclaw_read_file` first to get current content
   - Use `webclaw_update_file` with `old_text`/`new_text` for surgical edits, or `content` for full replacement
   - Prefer partial updates when only a section changes
4. Always generate a meaningful commit message.

## Frontmatter template

For new markdown files, include:

```yaml
---
title: {title}
tags: [{relevant, tags}]
created_at: {YYYY-MM-DD}
type: {note|guide|report|meeting|journal}
---
```

## Output format

- Confirm the action (created/updated)
- Show the commit message
- Confirm the commit was pushed to GitHub.

## Examples

User: "Create a new meeting notes file for today's standup"
→ Create with meeting template + frontmatter

User: "Add a section about deployment to docs/architecture.md"
→ Read file, then update with new section

User: "Fix the typo in my README"
→ Read, find typo, use old_text/new_text
