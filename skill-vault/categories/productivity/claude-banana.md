---
name: claude-banana
source_url: https://github.com/Hainrixz/claude-banana
source_type: github
category: productivity
safety_rating: caution
date_added: 2026-04-04
version: 1.0.0
tags: [image-generation, prompt-engineering, midjourney, dalle, gemini, creative, ai-art, photography]
---

# Claude Banana — Image Prompt Generator

## Description

AI agent that converts casual plain-language descriptions into detailed, optimized prompts for image generation tools (DALL-E, Midjourney, Google Gemini). Asks clarifying questions before generating, then applies a 7-component formula (subject, style, environment, lighting, action, camera angle, texture) across 9 domain modes (cinema, product photography, portraiture, fashion, UI/web design, logos, landscapes, abstract art, infographics) and 70+ creative techniques. Includes 25 customizable prompt templates and optional direct image generation via Google API.

## Security Analysis

- **Rating**: caution
- **Allowed Tools**: Bash (optional, for Python scripts), WebFetch (optional, for Google API)
- **Findings**:
  1. **Optional API calls** — can call Google's image generation API if configured; requires API key in environment
  2. **Python scripts** — `scripts/` directory contains Python utilities for image generation; bounded and documented
  3. **No destructive commands** — no `rm -rf`, no pipe-to-shell execution
  4. **No credential theft** — API key is user-supplied via environment variable; not exfiltrated
  5. **No obfuscation** — open source, MIT licensed
  6. **File system writes** — saves generated prompts and optionally images to local output directory
  7. **Description accuracy** — 7-component formula and 9 domain modes match documentation

## Install Command

```bash
git clone https://github.com/Hainrixz/claude-banana.git
cd claude-banana
claude
# Describe your image idea in plain language
```

## Original SKILL.md Content

<details>
<summary>Click to expand original SKILL.md</summary>

```markdown
# Claude Banana — Image Prompt Generator

Converts rough ideas into refined image generation prompts using creative techniques.

7-Component Formula: subject · style · environment · lighting · action · camera angle · texture

9 Domain Modes:
- Cinema, Product Photography, Portraiture, Fashion
- UI/Web Design, Logos, Landscapes, Abstract Art, Infographics

70+ Creative Techniques: anime styling, crystal ball worlds, frame-breaking effects,
tilt-shift, and more.

25 customizable templates in templates/examples/
Brand presets in presets/

Optional: Python scripts in scripts/ for direct Google Gemini image generation.
```

</details>

## Notes

Works great without any API keys — prompts alone are the main output. For direct image generation, configure a Google API key in your environment. The 25 templates cover the most common use cases out of the box.
