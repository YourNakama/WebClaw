---
name: vault-cleanup
description: Audit your vault for issues — find empty files, missing frontmatter, inconsistent naming, and misplaced files.
---

# /webclaw:vault-cleanup

Audit the vault for structural issues and suggest fixes.

## Instructions

When the user invokes this skill, delegate to the **vault-auditor** agent which will:

1. Scan all files using `webclaw_list_files` (recursive)
2. Read each markdown file to check for:
   - Missing or incomplete frontmatter (no title, no tags)
   - Empty files (< 10 characters of content after frontmatter)
   - Naming issues (spaces in filenames, uppercase, special characters)
   - Misplaced files (markdown in wrong folders, orphaned files)
   - Duplicate or near-duplicate file names
3. Generate a structured report organized by severity

## Report format

```
🔍 Vault Audit Report
══════════════════════

Critical (X issues)
  ❌ path/file.md — Empty file (0 bytes)
  ❌ path/other.md — No frontmatter

Warning (X issues)
  ⚠️ path/File Name.md — Spaces in filename
  ⚠️ path/file.md — Missing tags in frontmatter

Info (X issues)
  ℹ️ path/file.md — No created_at date

Summary: X files scanned, Y issues found
```

- Summarize total issues found and top recommendations.

## Notes

- This is a **read-only** audit. No files are modified.
- To fix issues, use `/webclaw:vault-write` or the vault-organizer agent.
