---
name: whatsapp-agentkit
source_url: https://github.com/Hainrixz/whatsapp-agentkit
source_type: github
category: automation
safety_rating: caution
date_added: 2026-04-04
version: 1.0.0
tags: [whatsapp, chatbot, no-code, fastapi, docker, claude, business, automation]
---

# WhatsApp AgentKit

## Description

No-code framework that uses Claude Code to build AI-powered WhatsApp chatbots in under 30 minutes — no programming knowledge required. Claude interviews the user about their business (10 questions), auto-generates a complete FastAPI application with SQLite/PostgreSQL conversation history, allows local terminal simulation testing, and optionally deploys to Railway via Docker. Supports Whapi.cloud, Meta Cloud API, and Twilio as WhatsApp providers.

## Security Analysis

- **Rating**: caution
- **Allowed Tools**: Bash, Write, WebFetch
- **Findings**:
  1. **Environment credentials** — requires WhatsApp provider API keys and Anthropic API key in `.env`; Claude reads these to configure the generated app
  2. **Process spawning** — runs `start.sh`, `uvicorn`, and Docker commands to build and serve the chatbot server
  3. **External deployment** — optionally deploys to Railway (third-party cloud); user controls this step
  4. **No destructive commands** — no `rm -rf`, no pipe-to-shell in the skill itself
  5. **No obfuscation** — open source, MIT licensed
  6. **Network calls** — the generated chatbot communicates with WhatsApp provider APIs and Anthropic API
  7. **Description accuracy** — behavior matches README; credentials stay local in `.env`

## Install Command

```bash
git clone https://github.com/Hainrixz/whatsapp-agentkit.git
cd whatsapp-agentkit
cp .env.example .env
# Fill in your API keys in .env, then:
./start.sh
# Then in Claude Code:
# /build-agent
```

## Original SKILL.md Content

<details>
<summary>Click to expand original SKILL.md</summary>

```markdown
# WhatsApp AgentKit

No-code Claude Code framework to build AI WhatsApp chatbots.

Trigger: /build-agent
- Interviews user (10 questions: business type, name, personality, WhatsApp provider credentials)
- Generates complete FastAPI application
- Configures SQLite/PostgreSQL conversation history
- Enables local testing via terminal simulation
- Optional Railway deployment via Docker

Tech stack: claude-sonnet-4-6, FastAPI, Uvicorn, SQLite/PostgreSQL, Docker
Providers: Whapi.cloud, Meta Cloud API, Twilio
```

</details>

## Notes

Best for restaurants, clinics, real estate, e-commerce, and SaaS customer support. Requires a paid WhatsApp provider account (Whapi.cloud is the easiest to set up). Railway deployment is optional — local self-hosting works fine.
