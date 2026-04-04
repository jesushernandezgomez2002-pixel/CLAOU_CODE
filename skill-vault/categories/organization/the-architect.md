---
name: the-architect
source_url: https://github.com/Hainrixz/the-architect
source_type: github
category: organization
safety_rating: safe
date_added: 2026-04-04
version: 1.0.0
tags: [blueprint, architecture, planning, saas, meta-agent, nextjs, supabase, mobile, api, no-code, project-design]
---

# The Architect — Software Blueprint Generator

## Description

Claude Code meta-agent that generates complete 16-section software blueprints from a plain-language project idea. The user describes their concept, answers discovery questions across 3 phases, and receives a detailed markdown blueprint that another Claude Code instance can build autonomously. Supports 6 project archetypes (SaaS/Web App, Marketing Site, Mobile App, API/Backend, Internal Tool, Content Platform) and 8 cross-cutting decision guides (auth, database, deployment, API design, frontend stacks, testing, styling, state management). No code is generated — only architecture documents that guide autonomous builds.

## Security Analysis

- **Rating**: safe
- **Allowed Tools**: Read, Write
- **Findings**:
  1. **No shell commands** — purely a planning and document generation agent; no Bash execution
  2. **No network calls** — no curl, WebFetch, or external API calls during blueprint generation
  3. **No credential access** — does not read SSH keys, tokens, or environment variables
  4. **File system writes** — saves generated blueprints to `output/` directory; scoped within the project folder
  5. **No destructive commands** — no deletion, no pipe-to-shell
  6. **No obfuscation** — open source, MIT licensed, all logic in plain markdown templates
  7. **Description accuracy** — 4-phase workflow and 16-section blueprint match documentation exactly

## Install Command

```bash
git clone https://github.com/Hainrixz/the-architect.git
cd the-architect
claude
# Describe your project idea and follow the 3-phase discovery questions
```

## Original SKILL.md Content

<details>
<summary>Click to expand project description (no SKILL.md — uses CLAUDE.md)</summary>

```markdown
# The Architect — Software Blueprint Generator

Meta-agent that generates complete software blueprints via 4 phases:
1. Discovery — classify project type (SaaS, Marketing, Mobile, API, Internal Tool, Content Platform)
2. Deep Dive — ask archetype-specific questions
3. Architecture — propose tech stack from knowledge/building-blocks/
4. Generate — produce 16-section blueprint in output/

16-Section Blueprint:
1. Project Overview    2. Tech Stack         3. Directory Structure
4. Data Model          5. API Design         6. Frontend Architecture
7. Design System       8. Auth & Authorization  9. Build Order (critical)
10. Environment Setup  11. Dependencies      12. Deployment
13. Testing            14. Skills to Use     15. CLAUDE.md (builder instructions)
16. Rules

6 Archetypes (in knowledge/archetypes/):
- SaaS/Web App: Next.js + Supabase + Clerk + Stripe
- Marketing Site: Astro + Tailwind + Sanity
- Mobile App: Expo + React Native + Supabase
- API/Backend: Hono + Drizzle + PostgreSQL
- Internal Tool: Next.js + shadcn/ui + Prisma
- Content Platform: Next.js + Sanity + Algolia

8 Building-Block Guides: auth, database, deployment, API design,
frontend stacks, testing, styling systems, state management

License: MIT — tododeia.com
```

</details>

## Notes

The blueprint output is designed to feed directly into another Claude Code session for autonomous building. Section 9 (Build Order) is the most critical — it defines the dependency chain for safe autonomous construction. Fast-track mode with smart defaults is available for experienced users who want to skip detailed questioning.
