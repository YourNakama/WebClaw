---
name: vault-connect
description: Authenticate with GitHub and select your vault repository. No token needed — uses browser-based OAuth Device Flow.
---

# /webclaw:vault-connect

Connect your GitHub account and select a vault repository.

## Instructions

When the user invokes this skill:

1. Call `webclaw_connect` (no parameters).
   - If already connected, it will confirm the current user. Skip to step 4.
   - If not, it returns a **URL** and a **code**. Show them clearly to the user.
2. **Wait for the user to authorize in their browser.** Do NOT call the next step until the user confirms they have entered the code.
3. Call `webclaw_connect` again with `device_code="<the device_code from step 1>"` to complete authentication.
4. Call `webclaw_select_repo` (no parameters) to list available repositories.
5. Ask the user which repo to use as their vault.
6. Call `webclaw_select_repo` with `repo_name="owner/repo"` to activate it.

## Important

- Step 1 returns immediately with a code — do NOT skip showing it to the user.
- Step 3 will poll GitHub until the user authorizes — only call it after the user says they entered the code.

## Output format

- Show connection status (connected as who)
- List repos with visibility (public/private) and last update
- Confirm vault selection with branch info

## Examples

User: "Connect my vault"
-> `webclaw_connect` -> show code -> user authorizes -> `webclaw_connect(device_code=...)` -> `webclaw_select_repo`

User: "Switch to a different repo"
-> `webclaw_select_repo` to list, then select
