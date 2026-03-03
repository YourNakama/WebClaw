---
name: vault-read
description: Read a file from your vault — view content, frontmatter, and metadata.
---

# /webclaw:vault-read

Read and display the content of a file from the user's vault.

## Instructions

When the user invokes this skill:

1. If the user provides a file path, call `webclaw_read_file` with that path.
2. If the user gives a partial name or description, first call `webclaw_list_files` to find matching files, then read the best match.
3. Parse and display the frontmatter separately from the content.
4. For markdown files, present the content with proper formatting.

## Output format

- Show file path and SHA (abbreviated)
- If frontmatter exists, display it as a structured summary (title, tags, status, etc.)
- Show the full content
- If the file uses callouts, Mermaid diagrams, or toggle blocks, note that these are rich markdown features that render visually in compatible editors.

## Examples

User: "Read my README"
→ Search for README.md, then read it

User: "Show me docs/architecture.md"
→ Direct `webclaw_read_file` call

User: "What does the meeting notes file say?"
→ Search, find best match, read it
