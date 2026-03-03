#!/usr/bin/env bash
set -euo pipefail

CONFIG_DIR="$HOME/.webclaw"
CONFIG_FILE="$CONFIG_DIR/config.json"

echo ""
echo "  🕸️  WebClaw — Claude Code Plugin Setup"
echo "  ═══════════════════════════════════════"
echo ""
echo "  This wizard creates ~/.webclaw/config.json"
echo "  so Claude can access your GitHub vault."
echo ""

# Check if config already exists
if [ -f "$CONFIG_FILE" ]; then
  echo "  ⚠️  Config already exists at $CONFIG_FILE"
  read -rp "  Overwrite? (y/N): " overwrite
  if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
    echo "  Keeping existing config. Done."
    exit 0
  fi
  echo ""
fi

# GitHub token
echo "  1/4  GitHub Personal Access Token"
echo "  ──────────────────────────────────"
echo "  Create one at: https://github.com/settings/tokens"
echo "  Required scopes: repo (full control of private repos)"
echo ""
read -rsp "  Token: " token
echo ""
if [ -z "$token" ]; then
  echo "  ❌ Token is required."
  exit 1
fi

# Owner
echo ""
echo "  2/4  Repository Owner"
echo "  ─────────────────────"
echo "  Your GitHub username or organization."
echo ""
read -rp "  Owner: " owner
if [ -z "$owner" ]; then
  echo "  ❌ Owner is required."
  exit 1
fi

# Repo
echo ""
echo "  3/4  Repository Name"
echo "  ────────────────────"
echo "  The GitHub repo that serves as your vault."
echo ""
read -rp "  Repo: " repo
if [ -z "$repo" ]; then
  echo "  ❌ Repo is required."
  exit 1
fi

# Branch
echo ""
echo "  4/4  Branch (default: main)"
echo "  ───────────────────────────"
read -rp "  Branch [main]: " branch
branch="${branch:-main}"

# Write config
mkdir -p "$CONFIG_DIR"
cat > "$CONFIG_FILE" <<EOF
{
  "token": "$token",
  "owner": "$owner",
  "repo": "$repo",
  "branch": "$branch"
}
EOF
chmod 600 "$CONFIG_FILE"

echo ""
echo "  ✅ Config saved to $CONFIG_FILE"
echo "  📁 Vault: $owner/$repo ($branch)"
echo ""
echo "  Next steps:"
echo "    cd webclaw-plugin/server && npm install && npm run build"
echo "    claude --plugin-dir ./webclaw-plugin"
echo ""
echo "  🚀 Try the full visual experience at webclaw.nakamacyber.ai"
echo ""
