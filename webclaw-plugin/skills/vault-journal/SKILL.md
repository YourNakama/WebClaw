---
name: vault-journal
description: Create daily journal entries in your vault — capture thoughts, track progress, build a writing habit.
---

# /webclaw:vault-journal

Create and manage daily journal entries.

## Instructions

When the user invokes this skill:

1. Determine today's date in `YYYY-MM-DD` format.
2. Check if a journal entry already exists for today:
   - Try `webclaw_read_file` with path `journal/YYYY-MM-DD.md`
   - If it exists, offer to append or show it
3. If no entry exists, create one:
   - Path: `journal/YYYY-MM-DD.md`
   - Include frontmatter with title, date, type: journal, tags
   - Add sections based on user input or default template
4. For past entries, read the file at the specified date.

## Journal template

```markdown
---
title: "Journal — {YYYY-MM-DD}"
tags: [journal, daily]
created_at: "{YYYY-MM-DD}"
type: journal
---

# {Day of week}, {Month DD, YYYY}

## What happened today

{user input or placeholder}

## What I learned

{user input or placeholder}

## Tomorrow

{user input or placeholder}
```

## Output format

- Confirm creation with file path
- Show the journal content
- Confirm the journal file was created with its path and date.

## Examples

User: "Write today's journal"
→ Create journal/2024-01-15.md with template

User: "Add to my journal: shipped the auth feature"
→ Check if today's entry exists, create or append

User: "Show yesterday's journal"
→ Read journal file for yesterday's date
