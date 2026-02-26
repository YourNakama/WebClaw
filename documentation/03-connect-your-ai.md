# Connect your AI — Bring Your Own Key

WebClaw includes an AI assistant that can read, create, edit, and organize your files. You bring your own API key — WebClaw provides no AI access and never sees your key in plain text.

## Supported providers

| Provider | Popular models | What you need |
|----------|---------------|---------------|
| **Anthropic (Claude)** | Claude Opus 4, Sonnet 4, Haiku 3.5 | Anthropic API key |
| **OpenAI** | GPT-4o, GPT-4o-mini, o1, o3 | OpenAI API key |
| **OpenRouter** | 200+ models (Claude, GPT, Llama, Mistral…) | OpenRouter API key |
| **Ollama** | Llama 3, Mistral, CodeLlama, Phi-3 | Ollama installed on your machine (free) |
| **Custom** | Any OpenAI-compatible API | Endpoint URL + optional API key |

## Setup step by step

### 1. Open Settings

In your vault on [webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai), click the **gear icon** (Settings) in the top bar.

### 2. General tab

Go to the **General** tab. You'll find the AI configuration section.

### 3. Pick a provider

Select your provider from the dropdown. The fields to fill depend on your choice:

#### Anthropic (Claude)

| Field | Value |
|-------|-------|
| API Key | Your `sk-ant-...` key from [console.anthropic.com](https://console.anthropic.com/) |
| Model | Pick from the list (Claude Opus 4, Sonnet 4, etc.) |

#### OpenAI

| Field | Value |
|-------|-------|
| API Key | Your `sk-...` key from [platform.openai.com](https://platform.openai.com/) |
| Model | Pick from the list (GPT-4o, GPT-4o-mini, etc.) |

#### OpenRouter

| Field | Value |
|-------|-------|
| API Key | Your key from [openrouter.ai/keys](https://openrouter.ai/keys) |
| Model | Pick from 200+ available models |

OpenRouter is great: one account gives you access to Claude, GPT-4, Llama, Mistral, and more. Perfect for comparing models or accessing specialized ones.

#### Ollama (free, 100% local)

| Field | Value |
|-------|-------|
| Endpoint | `http://localhost:11434` (default) |
| Model | The name of the model installed locally |

Ollama requires an install on your machine (the only technical prerequisite in all of WebClaw). In return, no data leaves your computer. Zero cost, zero tracking.

Install Ollama: [ollama.ai](https://ollama.ai)

#### Custom endpoint

| Field | Value |
|-------|-------|
| Endpoint | Your API base URL |
| API Key | Optional, depends on your API |
| Model | The model name to use |

Compatible with any API that follows the OpenAI Chat Completions format.

### 4. Save

Click **Save**. Your config is encrypted and stored locally in your browser.

## API key security

Your API key follows the exact same security model as your GitHub token:

- **AES-256-GCM encryption** via your browser's native WebCrypto API
- **Stored in IndexedDB** — never in localStorage, sessionStorage, or cookies
- **No server storage** — the key is only used to relay requests to the AI provider

## Using the AI assistant

Once configured, open the AI panel with `Ctrl+K` (or `Cmd+K` on Mac), or click the AI icon in the toolbar.

The assistant can:
- **Read** any file in your vault (including imported PDFs and DOCX)
- **Search** content across all your files
- **Create** new documents (with your approval)
- **Edit** existing files (with your approval)
- **Organize** your vault (rename, move, delete — with your approval)

Every file mutation asks for your confirmation before executing.

## Custom system prompt

In Settings, you can add a **custom system prompt** injected into every conversation. Useful for:

- Setting permanent context (*"This vault is for project X for client Y"*)
- Enforcing conventions (*"All documents must have YAML frontmatter"*)
- Setting your tone (*"Always respond in French, concise and professional"*)

## FAQ

**Can I use WebClaw without AI?**
Absolutely. AI is optional. WebClaw works great as a Markdown editor with GitHub sync, preview, print, and search — no AI required.

**Which model do you recommend?**
For professional document work, **Claude Sonnet 4** offers the best quality/cost ratio. For free, **Ollama with Llama 3.1** is excellent.

**Can I switch AI providers at any time?**
Yes. Settings > change provider and model > Save. The next conversation uses the new config.

**Is my API key safe?**
Yes. It's AES-256-GCM encrypted in your browser. It's never stored in plain text or kept server-side.

---

**Next** → [Install & use skills](./04-install-use-skills.md)
