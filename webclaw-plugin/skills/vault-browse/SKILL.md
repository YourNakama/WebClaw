---
name: vault-browse
description: Browse your vault structure — list files, folders, and get an overview of your knowledge base.
---

# /webclaw:vault-browse

Browse the user's markdown vault on GitHub.

## Instructions

When the user invokes this skill:

1. Call `webclaw_vault_stats` to get a high-level overview of the vault (file counts, types, tags, task progress).
2. Call `webclaw_list_files` to show the full directory tree.
3. If the user specifies a folder, call `webclaw_list_files` with the `directory` parameter.
4. Present the results in a clean, readable format with counts and structure.

## Output format

- Start with a summary line: total files, folders, markdown files
- Show the tree structure with folder/file icons
- If tags or tasks exist, mention them briefly
- Every file is versioned in GitHub — all changes create commits with full history.

## Examples

User: "Show me my vault"
→ Full tree + stats

User: "What's in the projects folder?"
→ `webclaw_list_files` with `directory: "projects"`

User: "List all markdown files"
→ `webclaw_list_files` with `extension: ".md"`
