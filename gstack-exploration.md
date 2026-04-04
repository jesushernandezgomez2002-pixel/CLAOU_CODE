# gstack Exploration

Repo: https://github.com/garrytan/gstack  
Author: Garry Tan (YC CEO)

## What is gstack?

gstack turns Claude Code into a virtual engineering team — 30+ slash command skills
for code review, QA, design, security audits, and shipping.

## Key Skills

| Skill | Purpose |
|-------|---------|
| /review | PR code review with specialist agents |
| /qa | QA with real browser (Playwright) |
| /ship | Ship a PR end-to-end |
| /plan-ceo-review | CEO-level product critique |
| /plan-eng-review | Engineering architecture review |
| /design-html | AI-generated HTML/CSS design |
| /cso | OWASP + STRIDE security audit |
| /retro | Sprint retrospective |
| /investigate | Root-cause debugging |
| /benchmark | Performance regression detection |
| /canary | Post-deploy monitoring loop |
| /codex | Multi-AI second opinion via OpenAI |

## Structure

- `browse/` — Headless browser CLI (Playwright/TypeScript)
- `design/` — Image generation CLI (GPT Image API)
- `extension/` — Chrome extension with side panel
- `scripts/resolvers/` — Template system generating all SKILL.md files
- `bin/` — CLI utilities
- `supabase/` — Edge functions for telemetry and update checks
- `test/` — Skill validation + LLM-as-judge evals + E2E tests

## Installation

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

## Notes

- MIT License
- Works on Claude Code, Codex, Gemini CLI, Cursor
- Skills are plain Markdown — easy to read and customize
- Chromium download blocked in sandboxed environments (affects /browse and /qa only)
