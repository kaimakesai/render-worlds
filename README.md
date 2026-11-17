# Render Worlds

A free Claude skill that makes "In this world…" story Shorts in a blocky 3D style: story, voice, word-timed captions, real 3D scenes (three.js), sound effects and a finished 9:16 video.

Made by **kai makes**.

## Install
1. Install [Claude Code](https://claude.com/claude-code), Python 3.10+, Node.js 18+ and ffmpeg.
2. Copy this folder to your skills folder:
   - Windows: `C:\Users\<you>\.claude\skills\render-worlds`
   - macOS / Linux: `~/.claude/skills/render-worlds`
3. Run the setup once:
   ```
   python ~/.claude/skills/render-worlds/scripts/setup.py
   ```
4. Open Claude Code and say: *"Use Render Worlds and give me ten In this world ideas."*

## What's inside
- `engine/`: the 3D renderer, characters, worlds, props and effects
- `scripts/`: setup, new project, voice, build, mix, render
- `sfx/`: 17 sound effects made from scratch, free to use
- `examples/`: `sun-en` and `dragons-en`
- `references/`: style guide, script formula, 50 story ideas, kit API

Read `SKILL.md` for the full workflow.
