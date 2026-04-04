---
name: maia-skill
source_url: https://github.com/Hainrixz/maia-skill
source_type: github
category: research
safety_rating: caution
date_added: 2026-04-04
version: 2.0.0
tags: [investment, finance, multi-agent, crypto, stocks, forex, commodities, dashboard, nextjs, spanish]
---

# Maia Skill — Investment Analysis

## Description

Multi-agent investment research platform that spawns 5 specialized AI agents (4 sector analysts + 1 strategy agent) to analyze crypto, stocks, currencies, and commodities in parallel. Adapts to the user's risk profile (conservative/moderate/aggressive), tracks historical accuracy of previous calls, and generates an interactive Next.js dashboard or HTML report in English and Spanish. Designed for exploratory investment research; not financial advice.

## Security Analysis

- **Rating**: caution
- **Allowed Tools**: WebSearch, WebFetch, Bash, Write
- **Findings**:
  1. **Network calls** — performs 5–8 targeted web searches per sector agent against public financial sites (no raw IPs)
  2. **File system writes** — saves JSON history to `output/history/` and report data to `dashboard/public/data/`; paths are scoped within the project directory
  3. **Process spawning** — runs `npm run dev` on port 3420 or a Python HTTP server as fallback
  4. **No destructive commands** — no `rm -rf`, no pipe-to-shell execution
  5. **No credential access** — does not read SSH keys, AWS tokens, or `.env` files
  6. **No obfuscation** — all logic is plain markdown/prompt instructions
  7. **Description accuracy** — behavior matches documentation; financial disclaimer is included

## Install Command

```bash
git clone https://github.com/Hainrixz/maia-skill.git
cd maia-skill
claude
```

## Original SKILL.md Content

<details>
<summary>Click to expand original SKILL.md</summary>

```markdown
---
name: investment-analysis
version: 2.0.0
user_invocable: true
---

# Tododeia Investment Analysis — Multi-Agent System v2

Orchestrates five specialized agents (4 sector-specific + 1 strategy agent) to conduct investment
analysis across crypto, stocks, currencies, and commodities. Adapts to user risk profiles
(conservative/moderate/aggressive) and generates branded HTML/Next.js reports in English and Spanish.

## 10-Step Workflow

1. Determine risk profile via user question
2. Load agent prompts from references/agent-prompts.md
3. Load historical data from output/history/ for accuracy tracking
4. Spawn 4 sector agents in parallel: Crypto, Stocks, Currencies, Materials
5. Launch Strategy Agent for cross-sector analysis
6. Combine all outputs into unified REPORT_DATA
7. Save to output/history/YYYY-MM-DD.json (keep last 30 files)
8. Generate report via Next.js dashboard or HTML fallback; translate to Spanish
9. Serve via npm run dev on port 3420 or Python HTTP server fallback
10. Offer scheduling options (/loop 24h or /loop 168h)
```

</details>

## Notes

Requires Node.js 18+ for the Next.js dashboard. A Python fallback is included for users without Node. All recommendations include a financial advice disclaimer. Scheduling via `/loop` requires the loop skill.
