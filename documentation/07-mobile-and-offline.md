# Mobile, PWA & offline

WebClaw works on desktop, tablet, and phone. You can install it as an app and read your files even without internet.

---

## Mobile interface

On screens under 640px, WebClaw switches to a mobile-optimized layout:

- **Bottom navigation bar** with 4 actions: Home (dashboard), Files (sidebar), New (create file), AI (assistant)
- **File sidebar** opens as a slide-over sheet from the left — tap a file to open it and the sheet closes automatically
- **AI assistant** opens as a bottom sheet (65% screen height) instead of a side panel
- **Toolbar** is simplified — only essential actions (save, file menu, settings) remain visible

Everything else works the same: editor, preview, slash commands, task panel, tags, search.

### Tips for mobile

- Use **Preview** mode for comfortable reading — tap the view toggle in the toolbar
- Use `Cmd+P` / `Ctrl+P` (or the Files button) to switch files quickly
- The bottom nav provides one-tap access to the dashboard, file tree, new file dialog, and AI assistant
- Resize handles are hidden on mobile — panels use fixed, optimized sizes

---

## Quick Switcher

Press `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux) anywhere in the vault to open the Quick Switcher.

- **Empty input** → shows your recently opened files
- **Type a name** → fuzzy search across all file paths, ranked by relevance
- **Arrow keys** to navigate, **Enter** to open, **Escape** to close
- Matched characters are highlighted in the results

This is different from Global Search (`Ctrl+Shift+F`) which searches inside file contents via the GitHub API. The Quick Switcher searches file names only, is 100% local, and instant.

---

## Demo mode

Want to try WebClaw without creating an account?

1. Go to [webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai)
2. Click **Try Without Account**
3. You enter the vault with sample files pre-loaded

### What works in demo mode

- Browse files in the sidebar
- Read and preview all sample documents
- Open the Quick Switcher (`Cmd+P`)
- View the Dashboard with task stats and recent files
- Explore the Task Panel with pre-populated tasks
- Test slash commands and the floating toolbar
- Open the AI assistant (requires your own API key in Settings)
- Switch between Code, Split, and Preview modes

### What doesn't work in demo mode

- **Saving** — files exist only in your browser session
- **Creating or deleting files** — you'll see a message prompting you to connect GitHub
- **Renaming files** — same restriction
- **GitHub sync** — no repo is connected

A banner at the top reminds you that you're in demo mode and offers a button to connect GitHub.

---

## Install as a PWA

WebClaw is a Progressive Web App. You can install it on any device for a native app experience.

### Chrome / Edge (desktop)

1. Open [webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai)
2. Click the **install icon** in the address bar (or the three-dot menu → "Install WebClaw")
3. Confirm the installation
4. WebClaw opens in its own window — no browser UI, just the app

### Safari (iOS)

1. Open [webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai) in Safari
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add**
5. WebClaw appears on your home screen as a standalone app

### Chrome (Android)

1. Open [webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai)
2. Tap the **three-dot menu** → "Add to Home screen" (or "Install app")
3. Confirm
4. WebClaw appears in your app drawer

Once installed, the app launches in standalone mode — no address bar, no browser tabs. It feels like a native app.

---

## Offline support

WebClaw caches your file tree and opened files locally. If you lose your internet connection:

### What works offline

- **Reading cached files** — any file you've previously opened is available offline
- **Browsing the file tree** — the tree structure is cached after your first sync
- **Quick Switcher** — works fully offline since it uses the cached file tree
- **Preview mode** — cached files render normally

### What doesn't work offline

- **Saving changes** — writes require the GitHub API
- **Creating, deleting, or renaming files** — same restriction
- **Opening files you haven't visited** — content is only cached after the first open
- **AI assistant** — requires an internet connection (except Ollama running locally)
- **Global Search** — searches via GitHub API, not available offline

### How it works

- The **service worker** caches the app shell (HTML, CSS, JS) so the app loads even offline
- The **file tree** is cached in IndexedDB after each successful sync
- **File content** is cached in IndexedDB each time you open a file
- The **status bar** shows an amber "Offline" badge when you're disconnected

When you come back online, everything resumes automatically — no manual sync needed.

---

## FAQ

**Can I edit files offline?**
You can type in the editor, but saving requires a connection. Changes made while offline are not persisted — if you close the tab, unsaved edits are lost.

**How much data is cached?**
The file tree and all opened files. If you've browsed 50 files, those 50 are available offline. Files you've never opened are not cached.

**Does the PWA auto-update?**
Yes. When a new version is deployed, the service worker downloads it in the background. You'll get the update on your next visit.

**Can I use the AI offline?**
Only if you're running a local model via Ollama. Cloud providers (Claude, OpenAI, OpenRouter) require internet.

---

**Previous** → [Create a skill](./06-creating-a-skill.md) | **Start** → [Getting started](./01-getting-started.md)
