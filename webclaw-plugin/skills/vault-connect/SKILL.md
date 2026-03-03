---
name: vault-connect
description: Authenticate with GitHub and select your vault repository. No token needed — uses browser-based OAuth Device Flow.
---

# /webclaw:vault-connect

Connect your GitHub account and select a vault repository.

## Instructions

When the user invokes this skill:

1. Call `webclaw_connect` (no parameters).
   - If already connected, it will confirm the current user.
   - If not, it will start the GitHub Device Flow: a browser tab opens, the user enters a code, and the token is saved automatically.
2. Once connected, call `webclaw_select_repo` (no parameters) to list available repositories.
3. Ask the user which repo to use as their vault.
4. Call `webclaw_select_repo` with `repo_name="owner/repo"` to activate it.

## Output format

- Show connection status (connected as who)
- List repos with visibility (public/private) and last update
- Confirm vault selection with branch info

## Examples

User: "Connect my vault"
-> `webclaw_connect` then `webclaw_select_repo`

User: "Switch to a different repo"
-> `webclaw_select_repo` to list, then select
