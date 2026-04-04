---
name: humanizalo
source_url: https://github.com/Hainrixz/humanizalo
source_type: github
category: productivity
safety_rating: safe
date_added: 2026-04-04
version: 1.0.0
tags: [writing, humanize, ai-detection, rewriting, bilingual, spanish, english, content]
---

# Humanizalo

## Description

Claude Code skill that detects and eliminates 40 AI writing patterns across 5 categories (content inflation, vocabulary, structure, formatting, communication artifacts), then rewrites the text with authentic human voice. Uses a 3-pass audit loop, a 6-dimension scoring rubric (directness, rhythm, reader trust, authenticity, density, soul), and a 42/60 passing threshold. Supports bilingual output (English/Spanish). The core philosophy: removing machine tells is not enough — genuine personality must be injected.

## Security Analysis

- **Rating**: safe
- **Allowed Tools**: Read, Write (text transformation only)
- **Findings**:
  1. **No shell commands** — purely a text analysis and rewriting skill; no Bash execution
  2. **No network calls** — no curl, wget, WebFetch, or external API calls
  3. **No credential access** — does not read environment variables, SSH keys, or tokens
  4. **No file deletion** — only reads input text and writes transformed output
  5. **No obfuscation** — plain markdown rules, open source, MIT licensed
  6. **No dynamic execution** — no eval, exec, or code generation
  7. **Description accuracy** — 40-pattern detection system matches documentation exactly

## Install Command

```bash
git clone https://github.com/Hainrixz/humanizalo.git
cd humanizalo
claude
```

## Original SKILL.md Content

<details>
<summary>Click to expand original SKILL.md</summary>

```markdown
# Humanizalo — AI Writing Detection & Humanization Framework

Detects and eliminates 40 AI writing patterns organized into 5 categories:
- Category A: Content inflation (P01–P08)
- Category B: Vocabulary (P09–P16)
- Category C: Structure (P17–P24)
- Category D: Formatting (P25–P32) — em dash overuse is the #1 AI tell
- Category E: Communication artifacts (P33–P40)

3-pass audit loop:
1. Draft rewrite — apply all 40 patterns + inject personality
2. Self-interrogation — score across 6 dimensions
3. Final rewrite — address flagged issues; threshold 42/60

Core principle: "Text that passes every pattern check but has no voice is still obviously AI."
Supports bilingual output (English/Spanish).
```

</details>

## Notes

No external dependencies. Works entirely within Claude's context window. Ideal for blog posts, marketing copy, emails, and any content that needs to pass AI detection tools or simply read more naturally.
