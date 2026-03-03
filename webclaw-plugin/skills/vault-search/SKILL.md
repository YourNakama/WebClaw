---
name: vault-search
description: Search across your vault — find content by text, tags, or file patterns.
---

# /webclaw:vault-search

Search for content across the vault.

## Instructions

When the user invokes this skill:

1. For text search: call `webclaw_search_content` with the query.
2. For tag-based search: call `webclaw_get_tags` to find files with specific tags.
3. For file name search: call `webclaw_list_files` and filter results.
4. Combine multiple searches if needed to find the best results.

## Output format

- Show result count and query
- For each match: file path, matching line(s) with line numbers
- Truncate long lines at 120 characters
- Show result count and query summary.

## Examples

User: "Find all mentions of authentication"
→ `webclaw_search_content` with `query: "authentication"`

User: "Which files are tagged with 'architecture'?"
→ `webclaw_get_tags` then filter

User: "Search for TODO in the docs folder"
→ `webclaw_search_content` with `query: "TODO"`, `directory: "docs"`
