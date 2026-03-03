---
name: vault-tasks
description: View and manage tasks across your vault — see pending items, check off completed work, track progress.
---

# /webclaw:vault-tasks

View and manage checkbox tasks across the vault.

## Instructions

When the user invokes this skill:

1. Call `webclaw_get_tasks` to retrieve all tasks from the vault.
2. If the user asks about specific tasks, filter by directory or status.
3. To toggle a task (mark complete/incomplete):
   - Read the file with `webclaw_read_file`
   - Toggle the checkbox at the specified line
   - Update with `webclaw_update_file`
4. Present tasks grouped by file with progress indicators.

## Output format

- Summary line: total tasks, pending, completed, progress percentage
- Group tasks by file path
- Use ☐ for pending and ☑ for completed
- Show file path and line number for each task
- Suggest toggling tasks directly from this skill for quick updates.

## Examples

User: "Show my tasks"
→ All tasks, all files

User: "What's pending in the project folder?"
→ `webclaw_get_tasks` with `directory: "project"`, `status: "pending"`

User: "Mark the first task in TODO.md as done"
→ Read file, toggle checkbox, update file
