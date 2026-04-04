---
name: editor-pro-max
source_url: https://github.com/Hainrixz/editor-pro-max
source_type: github
category: automation
safety_rating: caution
date_added: 2026-04-04
version: 1.0.0
tags: [video, remotion, react, typescript, ffmpeg, whisper, tiktok, instagram, youtube, ai-video]
---

# Editor Pro Max — AI Video Editor

## Description

AI-powered video editor built with Remotion + Claude Code that turns natural language descriptions into professional MP4 videos. Users either describe a video concept (Claude writes React/Remotion composition code → preview in Remotion Studio → render to MP4) or upload existing footage (Claude extracts audio, transcribes with Whisper.cpp, detects silence, and creates an auto-edited composition). Includes 25 reusable components, 10 pre-built templates (TikTok, Instagram, YouTube, presentations, testimonials), and 7 AI skills for motion design. Everything runs locally — no external API keys required.

## Security Analysis

- **Rating**: caution
- **Allowed Tools**: Bash, Write, Read
- **Findings**:
  1. **Process spawning** — runs FFmpeg, Whisper.cpp, and Remotion CLI commands (`npm run dev`, `npx remotion render`) for video processing
  2. **File system writes** — generates React composition files and rendered MP4 outputs in project directory; paths are scoped
  3. **System tool dependencies** — requires FFmpeg and Whisper.cpp installed on the system; these are standard open-source tools
  4. **No network calls** — all processing is local; no external API calls or data exfiltration
  5. **No destructive commands** — no `rm -rf` on user data; no pipe-to-shell execution
  6. **No credential access** — explicitly noted "without requiring API keys"
  7. **Description accuracy** — 25 components, 10 templates, 7 AI skills match documentation

## Install Command

```bash
git clone https://github.com/Hainrixz/editor-pro-max.git
cd editor-pro-max
npm install
claude
# Describe your video or upload existing footage
```

## Original SKILL.md Content

<details>
<summary>Click to expand original SKILL.md</summary>

```markdown
# Editor Pro Max — AI Video Editor

Built with Remotion + Claude Code. Natural language → MP4.

Two workflows:
1. Create from scratch: Describe video → Claude writes React code → Remotion Studio preview → Render MP4
2. Edit existing footage: Upload video → FFmpeg audio extract → Whisper.cpp transcription →
   silence detection → auto-edited composition

Components: 25 reusable (text animations, backgrounds, overlays, media, layouts, transitions)
Templates: 10 (TikTok, Instagram, YouTube, presentations, testimonials, and more)
AI Skills: 7 (motion design + video processing best practices)
Pipeline scripts: 5 (analyze, transcribe, edit footage)

Stack: Remotion, React 19, TypeScript, Whisper.cpp, FFmpeg
License: MIT — @soyenriquerocha
```

</details>

## Notes

Requires Node.js 18+, FFmpeg, and Whisper.cpp installed on your system. All rendering is local — no cloud uploads. The 10 templates cover the most popular short-form and long-form video formats.
