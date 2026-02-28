# Real-world examples

Detailed use cases showing what you can accomplish with WebClaw and its skills in a professional context. All of these work today at [webclaw.nakamacyber.ai](https://webclaw.nakamacyber.ai).

---

## 1. Technical guide for a client's stack

**Context:** You're a consultant and need to write a development guide for a client team starting a React 19 + Next.js 16 + Tailwind CSS 4 project.

**Skill used:** `doc-writer`

### Steps

1. Enable the **doc-writer** skill in Settings > Skills
2. Open the AI panel (`Ctrl+K`)
3. Send the following prompt:

```
Create a comprehensive development guide for a React 19 + Next.js 16 + Tailwind CSS 4 stack.

The guide should cover:
- Project architecture (App Router, folder structure)
- Naming conventions and code organization
- State management (Server Components vs Client Components)
- Styling with Tailwind CSS 4 (new features, CSS tokens)
- Testing (Vitest + Testing Library)
- Deployment to Vercel
- Performance best practices

Target: junior to mid-level developers. The guide must be self-contained — someone
reading it should be able to start the project without outside help.
```

### Expected result

The AI (with doc-writer active) produces a 25-40 page document with:
- Complete YAML frontmatter (`type: guide`, `status: draft`, relevant tags)
- Table of contents with anchor links
- Mermaid architecture diagram (App Router, data flow)
- Every section introduced by a contextual paragraph
- 60% prose / 40% code ratio — not a command listing
- Natural consultant voice, no AI-speak
- "Next Steps" section at the end

4. Confirm the file creation when the AI proposes it
5. Iterate with follow-up prompts:

```
In the Testing section, add a concrete example of testing a Server Component
with the act() pattern and fetch mocks.
```

---

## 2. RFP digestion and response

**Context:** You received an 80-page RFP (Request for Proposal) PDF for a web portal redesign. You need a summary, a compliance matrix, and a response plan.

### Steps

#### Phase 1 — Import and analyze

1. Drag and drop the RFP PDF into your vault
2. Open the AI panel and send:

```
Read the file rfp-web-portal-2026.pdf and produce a structured summary.

Structure:
- Context and subject of the contract
- Functional requirements (numbered list)
- Technical requirements (architecture, tech, performance)
- Administrative requirements (deadlines, budget, deliverables)
- Evaluation criteria and weighting
- Key risks and attention points
```

#### Phase 2 — Compliance matrix

```
From the summary, create a compliance matrix as a Markdown table.

Columns:
- Ref (requirement number)
- Requirement (one-sentence summary)
- Category (functional / technical / administrative)
- Our response (Compliant / Partially / Non-compliant)
- Comment (our positioning in 1-2 sentences)

Leave "Our response" and "Comment" with [TO COMPLETE] placeholders
where you can't evaluate.
```

#### Phase 3 — Response plan

```
Create a response plan for the technical proposal, structured by section.

For each section:
- Section title
- RFP requirements covered (references)
- Key points to develop
- Deliverables to include (diagrams, tables, screenshots)
- Estimated volume (page count)
```

#### Phase 4 — Drafting

```
Draft the "Proposed Technical Architecture" section.

Context: we're proposing a Next.js + API microservices architecture on Kubernetes.
Include a Mermaid architecture diagram, justified tech choices,
and a component matrix.
```

### Result

You end up with 4 documents in your vault:
- `rfp/summary-portal-2026.md` — Complete summary
- `rfp/compliance-matrix.md` — Requirement-by-requirement table
- `rfp/response-plan.md` — Technical proposal structure
- `rfp/sections/technical-architecture.md` — First drafted section

All versioned in GitHub, shareable with your team.

---

## 3. Architecture documentation

**Context:** You're documenting a microservices authentication system for your team.

### Prompt

```
Create an architecture document for our authentication microservices system.

The system includes:
- An API Gateway (Kong)
- An Auth service (Node.js, JWT + refresh tokens)
- A Users service (Go, PostgreSQL)
- A Notifications service (Python, Redis pub/sub)
- A message broker (RabbitMQ)

Include:
- Overall architecture diagram (Mermaid flowchart)
- Sequence diagram for the authentication flow
- Sequence diagram for the refresh token flow
- Service communication matrix
- Security considerations (injection, MITM, token theft)
- Disaster recovery plan
```

### Expected result

A document with 3+ Mermaid diagrams, concrete attack scenarios for each vulnerability, and a technical but accessible voice.

---

## 4. Meeting minutes

**Context:** You just left a 2-hour meeting with raw notes.

### Steps

1. Create a file `meetings/2026-02-27-raw.md` with your rough notes
2. Open the AI panel and send:

```
Read meetings/2026-02-27-raw.md and turn these raw notes into
a structured professional report.

Format:
- Frontmatter (type: meeting, date, participants)
- Meeting context (1 paragraph)
- Topics discussed (section per topic with summary)
- Decisions made (table: decision | owner | deadline)
- Action items (Markdown checklist)
- Next meeting (date, tentative agenda)
```

---

## 5. Team knowledge base

**Context:** Your 8-person dev team has hundreds of unorganized documents in a shared vault.

### Steps

1. Ask the AI to scan your vault:

```
List all files in the vault and analyze their content. Suggest a
reorganization by category with a clear folder structure.
```

2. Validate the proposed structure, then:

```
Create an INDEX.md at the vault root with:
- Table of contents by domain
- Links to every document
- One-line summary per document
- Most frequent tags
```

3. To enrich the knowledge base:

```
Create a technical glossary for our team based on technical terms
found across vault documents. Format: table with term, definition,
and links to documents that use it.
```

---

## 6. Tech watch

**Context:** You maintain a technology watch for your team.

### Prompt

```
Create a tech watch brief on React 19 Server Components.

Structure:
- Executive summary (3 sentences for a non-technical decision-maker)
- What it is (accessible explanation)
- Before/after comparison (table with code)
- Impact on our current stack
- Migration: estimated effort and risks
- Recommendation (adopt / wait / ignore)
- Reference sources and links
```

---

## 7. Security audit report

**Context:** You completed a security audit and need to produce a structured report.

### Prompt

```
Create a security audit report for our web application.

Vulnerabilities found:
1. Stored XSS in comments (high severity)
2. IDOR on /api/users/:id endpoints (high severity)
3. Missing rate limiting on /api/auth/login (medium severity)
4. Missing security headers (low severity)
5. npm dependencies with known CVEs (medium severity)

For each vulnerability, include:
- Technical description
- Concrete exploitation scenario
- Vulnerable code (anonymized) vs fixed code
- Remediation recommendation
- Estimated effort (in days)

End with a risk matrix and a prioritized remediation plan.
```

---

## 8. Project management with tasks and database view

**Context:** You manage a project with multiple deliverables and want to track progress across your vault.

### Steps

#### Phase 1 — Set up task tracking

Create files with Markdown checkboxes to track deliverables:

```markdown
---
type: project
status: in-progress
priority: high
tags: [client-acme, q1-2026]
---

# Project ACME — Deliverables

- [ ] Architecture document
- [ ] API specification
- [x] Kickoff meeting notes
- [ ] Security audit report
- [ ] Final presentation
```

#### Phase 2 — Use the Task Panel

Click the **checkmark icon** in the toolbar to open the Task Panel. You'll see all tasks across your vault:
- Filter by **Open** / **Done** tabs
- Search tasks by text or filename
- Click a task to jump to the file
- Click the checkbox to toggle it — the source file and GitHub are updated instantly

#### Phase 3 — Use the Database View

Click the **project folder name** in the file tree. A table appears with all files in the folder:
- Columns are auto-detected from frontmatter (`status`, `priority`, `tags`, etc.)
- Click a column header to sort
- Use the search bar to filter
- Double-click a cell to edit inline — changes save to GitHub

This gives you a Notion-like database view of your project files, powered by your YAML frontmatter.

---

## 9. Using templates for recurring documents

**Context:** You create meeting notes every week with the same structure.

### Steps

#### Phase 1 — Create a custom template

Add a `.templates/` folder to your repo root with a file like `weekly-standup.md`:

```markdown
---
type: meeting
date: {{date}}
participants: []
tags: [standup, weekly]
---

# Weekly Standup — {{date}}

## Updates

### Team member 1
-

### Team member 2
-

## Blockers

-

## Action Items

- [ ]
- [ ]

## Next Meeting

-
```

#### Phase 2 — Use the template

1. Press `Ctrl+N` (or click the `+` button)
2. The **Template Picker** opens — you'll see your custom template under "Custom"
3. Hover to preview the content
4. Click it, name the file (e.g. `meetings/2026-02-28-standup.md`)
5. The file is created with `{{date}}` replaced by today's date

---

## 10. Rich documentation with callouts and toggles

**Context:** You're writing a technical guide and want to highlight important information clearly.

### Using callouts

In your Markdown file, write:

```markdown
> [!NOTE]
> This API requires authentication. See the auth guide for setup.

> [!WARNING]
> Rate limiting is enforced at 100 requests/minute. Exceeding this will result in a 429 response.

> [!TIP]
> Use the `/v2/batch` endpoint to reduce the number of API calls.
```

In the preview, these render as colored blocks with icons — blue for NOTE, amber for WARNING, green for TIP.

### Using collapsible toggles

For long content that doesn't need to be visible by default:

```markdown
<details>
<summary>Full error response schema</summary>

| Field | Type | Description |
|-------|------|-------------|
| code | number | HTTP status code |
| message | string | Human-readable error |
| details | object | Machine-readable context |

</details>
```

The content is hidden by default and expands on click.

### Using slash commands

Instead of memorizing the syntax, type `/` in the editor:
- `/callout` → inserts a NOTE callout
- `/warning` → inserts a WARNING callout
- `/tip` → inserts a TIP callout
- `/toggle` → inserts a collapsible block
- `/checklist` → inserts task checkboxes
- `/mermaid` → inserts a diagram template

---

## Tips for better results

1. **Be specific** — The more detail in your prompt, the better the output. Include context, audience, and desired format.

2. **Iterate** — Don't aim for perfection in one prompt. Ask for a first draft, then refine section by section.

3. **Use vault context** — The AI has access to all your files. Reference them: *"Following the style of docs/api-guide.md..."*

4. **Combine skills** — Enable `doc-writer` for writing quality + a specific template skill for structure.

5. **Think in phases** — For complex tasks (RFPs, audits), break into steps: analyze → summarize → plan → draft.

---

**Next** → [Create a skill](./06-creating-a-skill.md)
