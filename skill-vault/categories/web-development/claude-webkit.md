---
name: claude-webkit
source_url: https://github.com/Hainrixz/claude-webkit
source_type: github
category: web-development
safety_rating: caution
date_added: 2026-04-04
version: 1.0.0
tags: [landing-page, nextjs, tailwind, vercel, no-code, shadcn, framer-motion, seo, deployment]
---

# Claude Web Builder

## Description

No-code landing page generator that guides users through a 6-phase automated workflow: discovery questionnaire, design system selection, Next.js 15 scaffold, component build with humanized copywriting, local preview + SEO audit, and optional one-click Vercel deployment. Produces mobile-responsive, SEO-optimized pages using Next.js 15+, Tailwind CSS 4, shadcn/ui, TypeScript, and Framer Motion — without requiring any programming knowledge.

## Security Analysis

- **Rating**: caution
- **Allowed Tools**: Bash, Write, WebFetch
- **Findings**:
  1. **Process spawning** — runs `npm install`, `npm run dev`, and Vercel CLI commands during scaffold and deploy phases
  2. **External deployment** — optionally pushes to Vercel (third-party); user explicitly approves this step
  3. **File system writes** — creates a full Next.js project in the working directory; paths are scoped and predictable
  4. **No destructive commands** — no `rm -rf`, no pipe-to-shell execution
  5. **No credential access** — does not read SSH keys or environment secrets; Vercel auth is handled via Vercel CLI interactively
  6. **No obfuscation** — open source, MIT licensed
  7. **Description accuracy** — 6-phase workflow matches documentation

## Install Command

```bash
git clone https://github.com/Hainrixz/claude-webkit.git
cd claude-webkit
claude
# Then follow the 6-phase guided workflow
```

## Original SKILL.md Content

<details>
<summary>Click to expand original SKILL.md</summary>

```markdown
# Claude Web Builder

6-phase automated landing page builder. No coding required.

Phases:
1. Discovery — 4-round questionnaire (business, visual, content, technical)
2. Design System — color/font selection, design archetype
3. Scaffold — Next.js 15 project setup + dependency install
4. Build — component creation with humanized copywriting
5. Preview & QA — local test, SEO audit, quality checks
6. Deploy — optional Vercel deployment with live URL

Stack: Next.js 15+, Tailwind CSS 4, shadcn/ui, TypeScript, Framer Motion
Requirements: Claude Code, Node.js 18+, Git
```

</details>

## Notes

Vercel deployment is free for personal projects. The generated pages are designed to not look AI-generated — humanized copy is part of the build phase. Node.js 18+ required.
