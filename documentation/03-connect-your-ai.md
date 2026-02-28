# Connect your AI — Bring Your Own Key

WebClaw includes an AI assistant that can read, create, edit, and organize your files. You bring your own API key or OAuth token — WebClaw provides no AI access and never sees your credentials in plain text.

## Supported providers

| Provider | Popular models | What you need |
|----------|---------------|---------------|
| **Anthropic (Claude)** | Claude Opus 4.6, Sonnet 4.6, Haiku 4.5 | API key **or** OAuth via Claude Code |
| **OpenAI** | GPT-5.2, GPT-5.1, o3, o4-mini | API key (pay-per-use) |
| **OpenRouter** | 200+ models (Claude, GPT, Llama, Mistral, Gemini…) | OpenRouter API key |
| **Ollama** | Llama 3.3, DeepSeek R1, Qwen 3, Mistral | Ollama installed + CORS enabled (free) |
| **Custom** | Any OpenAI-compatible API | Endpoint URL + optional API key |

## Setup step by step

### 1. Open WebClaw Settings

In your vault on [webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai), click the **gear icon** (⚙) in the top-right corner, then select **WebClaw Settings**.

### 2. Go to the AI Assistant tab

Click the **AI Assistant** tab. You'll see the provider dropdown and the guided setup steps.

### 3. Pick a provider

Select your provider from the dropdown. The setup instructions adapt automatically.

---

#### Anthropic (Claude)

Claude offers two authentication methods. Use the toggle to pick one:

##### Option A — API Key

1. Go to [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Click **Create Key**, give it a name
3. Copy the key (starts with `sk-ant-api03-...`)
4. Paste it in the **API key** field in WebClaw
5. Pick a model from the dropdown (recommended: **Claude Sonnet 4.6**)

##### Option B — OAuth (Claude Code)

Use your **Claude Pro / Max subscription** instead of a pay-per-use API key.

1. Install [Claude Code](https://docs.anthropic.com/en/docs/claude-code) if you haven't already
2. Run `claude setup-token` in your terminal — it outputs an OAuth token
3. Copy the token and paste it in the **token** field in WebClaw
4. Pick a model from the dropdown

> **Note:** This uses your existing Claude Pro/Max subscription. No separate API billing.

---

#### OpenAI

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **Create new secret key**, give it a name
3. Copy the key (starts with `sk-...`)
4. Paste it in the **API key** field in WebClaw
5. Pick a model from the dropdown (recommended: **GPT-5.2**)

> **Note:** OpenAI requires a pay-per-use API key. Unlike Claude, ChatGPT/Codex subscriptions cannot be used with third-party apps — their OAuth tokens are restricted to the Codex CLI. If you want to avoid per-token billing, consider **OpenRouter** which gives you access to OpenAI models (and 200+ others) with flexible pricing.

---

#### OpenRouter

1. Go to [openrouter.ai/keys](https://openrouter.ai/keys) and create an API key
2. Paste it in the **API key** field
3. Pick from 200+ available models

OpenRouter is great: one account gives you access to Claude, GPT-5, Llama, Mistral, Gemini, and more. Perfect for comparing models or accessing specialized ones.

---

#### Ollama (free, 100% local)

Ollama runs AI models on your own machine. Nothing leaves your computer.

##### Step 1 — Install Ollama

Download from [ollama.com/download](https://ollama.com/download) and install.

##### Step 2 — Pull a model

```bash
ollama pull llama3.2
```

##### Step 3 — Enable CORS

WebClaw connects **directly from your browser** to Ollama on your machine. For this to work, Ollama must allow cross-origin requests.

Start Ollama with CORS enabled:

```bash
OLLAMA_ORIGINS=* ollama serve
```

To make it permanent, add this to your shell profile (`.zshrc`, `.bashrc`, etc.):

```bash
export OLLAMA_ORIGINS="*"
```

> **Why CORS?** WebClaw is a web app at `webclaw.nakamacyber.ai`. When your browser calls `localhost:11434`, that's a cross-origin request. Without CORS enabled, the browser blocks it. This is standard web security — not specific to WebClaw.

##### Step 4 — Configure in WebClaw

1. Set the endpoint (default: `http://localhost:11434`)
2. Click **Refresh models** — WebClaw detects all your installed models
3. Pick a model from the dropdown
4. Click **Test Connection** to verify

| Field | Value |
|-------|-------|
| Endpoint | `http://localhost:11434` (default) |
| Model | Auto-detected from your Ollama install |

---

#### Custom endpoint

For any OpenAI-compatible API (LM Studio, vLLM, llama.cpp, text-generation-webui, Together, Groq, etc.)

##### Step 1 — Enter the base URL

Enter your API endpoint. WebClaw appends `/v1/chat/completions` automatically.

| Field | Value |
|-------|-------|
| Base URL | e.g. `http://localhost:1234` or `https://api.together.xyz` |
| API Key | Optional — depends on the service |
| Model | The model name your API expects |

##### Step 2 — CORS for local models

If your endpoint runs **on your machine** (LM Studio, vLLM, llama.cpp, etc.), you must enable CORS — same reason as Ollama.

| Tool | How to enable CORS |
|------|--------------------|
| **LM Studio** | Settings → Server → enable **Enable CORS** |
| **vLLM** | Start with `--cors-allow-origins "*"` |
| **llama.cpp** | Start the server with `--cors` flag |
| **text-generation-webui** | Add `--cors-allow-origins *` to launch args |

> **Cloud APIs** (Together, Groq, Fireworks, etc.) already handle CORS. No extra config needed.

---

### 4. Test & Save

1. Click **Test Connection** — WebClaw sends a small request to verify the connection
2. If it shows green: click **Save**
3. Your config is encrypted and stored in your browser

## API key security

Your API key follows the exact same security model as your GitHub token:

- **AES-256-GCM encryption** via your browser's native WebCrypto API
- **Stored in IndexedDB** — never in localStorage, sessionStorage, or cookies
- **No server storage** — for Ollama and custom endpoints, the connection goes directly from your browser to the model. For cloud providers (Claude, OpenAI, OpenRouter), the API call is relayed through the server but your key is never stored

## Using the AI assistant

Once configured, open the AI panel with `Ctrl+K` (or `Cmd+K` on Mac), or click the **sparkle icon** (✨) in the toolbar.

The assistant can:
- **Read** any file in your vault
- **Search** content across all your files
- **Create** new documents (with your approval)
- **Edit** existing files (with your approval)
- **Organize** your vault (rename, move, delete — with your approval)

Every file mutation asks for your confirmation before executing.

## Custom system prompt

In Settings → AI Assistant, you can add a **custom system prompt** injected into every conversation. Useful for:

- Setting permanent context (*"This vault is for project X for client Y"*)
- Enforcing conventions (*"All documents must have YAML frontmatter"*)
- Setting your tone (*"Always respond in French, concise and professional"*)

## FAQ

**Can I use WebClaw without AI?**
Absolutely. AI is optional. WebClaw works great as a Markdown editor with GitHub sync, preview, print, and search — no AI required.

**Which model do you recommend?**
For professional document work, **Claude Sonnet 4.6** offers the best quality/cost ratio. For maximum capability, **Claude Opus 4.6** or **GPT-5.2**. For free and local, **Ollama with Llama 3.3**, **DeepSeek R1**, or **Qwen 3** are excellent.

**Can I switch AI providers at any time?**
Yes. Settings → change provider and model → Save. The next conversation uses the new config instantly.

**Is my API key safe?**
Yes. It's AES-256-GCM encrypted in your browser. It's never stored in plain text or kept server-side.

**What's the difference between API Key and OAuth?**
For **Claude**, you can choose: an API key (pay-per-use) or an OAuth token via Claude Code (uses your Pro/Max subscription). For **OpenAI**, only API keys are supported — ChatGPT/Codex subscriptions cannot be used with third-party apps. Both methods are equally secure in WebClaw.

**Ollama test connection fails — what do I do?**
Check three things: (1) Ollama is running (`ollama serve`), (2) CORS is enabled (`OLLAMA_ORIGINS=*`), (3) the endpoint URL is correct (default: `http://localhost:11434`).

---

**Next** → [Install & use skills](./04-install-use-skills.md)
