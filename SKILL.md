---
name: render-worlds
description: kai makes' skill for "In this world…" story Shorts in a blocky-avatar 3D style (original cast, no game logos). Covers the five-beat story formula, a fast narrator voice (free Edge voice, or ElevenLabs / your own recording), word-timed one-word captions, real 3D renders (three.js on the GPU) with depth of field, bloom, whip-pans and motion blur, sound effects ducked under the voice, and a -14 LUFS master. Use it whenever the user says Render Worlds, asks for an "in this world / in this town / what if" story short, a blocky 3D cartoon short, story ideas in that format, even if they only paste a premise or a script.
---

# Render Worlds

A complete kit for 9:16 "In this world…" story Shorts with blocky 3D characters. Made by kai makes. **Read `references/style.md` first** (the look and the checklist), then `references/scripts.md` when writing. Story ideas live in `references/ideas.md`.

Built on the "Maven 3D" kit by Maven, then adapted: free voice by default, a bundled word-timer (no whisper.cpp needed), our own sound library, a one-command setup with a graphics-card check, a signature-hero preset and the `sun-en` example.

**What is in the skill**
- `engine/`: core.js (renderer, lighting presets, camera moves, captions, shot runner) and kits/: characters (21 faces, 16 outfits, 11 hair styles, cast presets), sets (10 worlds: town, party, room, classroom, forest, spooky street, castle, ice world, beach, city), creatures, props (mystery box, magic door, countdown, chest, clock, car, trophy, throne, sign panels), fx. Also three.js, the Poppins ExtraBold font and `gallery.js`, a test of every kit.
- `scripts/`: setup.py, new.py, voice.py, build.py, mix.py, render.mjs, sheet.py, whisper_cli.py.
- `sfx/`: 17 kai makes sound effects made from scratch (whooshes, booms, risers, clicks, thuds, dings), free to share. `LIB:whoosh/whoosh-whip.wav` in cues.
- `examples/`: `sun-en` (10 s, English, "the sun rises once every four years", the Video 3 demo), `dragons-en` (10 s English).
- `templates/`: a blank story, scripts, configs and cues.
- `references/`: style.md, scripts.md (formula, hook bank), ideas.md (50 ideas), kits.md (the API), production.md (shots, sound, checks, troubleshooting).

## Install (once per PC)
```
python <skill>/scripts/setup.py
```
It installs missing Python packages (numpy, scipy, soundfile, pillow, edge-tts, faster-whisper), runs `npm install` and `npx playwright install chromium` in the skill folder, renders one test frame and prints the graphics card. If it prints `[X]` or an error, fix that line (it says how) and run it again. A `[!] rendering on the CPU` line means it works but slowly: update the graphics driver.

## Commands
```
PY = python            # the Python setup.py used
S  = <skill>/scripts   # e.g. ~/.claude/skills/render-worlds/scripts
$PY $S/new.py <folder> [--from sun-en|dragons-en]
$PY $S/voice.py <folder>                  # voice + web/timing.json (--timing-only to re-align)
$PY $S/build.py <folder> shots            # one still per shot -> check/shots.jpg
$PY $S/build.py <folder> stills 1.2,3.4   # chosen moments -> check/sheet.jpg
$PY $S/build.py <folder> all              # 240 fps frames -> mix -> master -> <name>.mp4 + check/final.jpg
$PY $S/build.py <folder> resume 3.0 4.2   # re-render 3.0-4.2 s after a small fix, then final
```
Projects for the channel go in `D:/sckool/videos/<nn>-<slug>/`.
Tools: Edge TTS (free, needs internet), the bundled `whisper_cli.py` (faster-whisper on the CPU, downloads the `medium` model on first use), ffmpeg, node + Playwright Chromium. Override paths with env vars `RW_WHISPER`, `RW_WHISPER_MODEL`, `RW_EDGE_PY`, `RW_KOKORO_PY`/`RW_KOKORO_SAY`, `RW_SFX_LIB` (the old `MAVEN_*` names still work). A missing sound file is skipped with a warning, so a project still builds.

## Signature hero (your channel's brand)
When the user describes their channel's hero ("red hair, a gold crown, a blue hoodie"), add it ONCE to `CAST` in `engine/kits/characters.js` of the skill as `signature: {...}` (fields as the other presets: skin, shirt, kind, pants, shoe, hair, hairCol, acc, face). `new.py` copies the engine into every new project, so `CAST.signature` is in every video from then on. Use it as the lead unless the user says otherwise. Show it once with `build.py stills` before using it.

## Workflow
1. **Script.** Use the formula in `references/scripts.md`: rule, examples, stakes, hook, "then one morning", escalation, twist, payoff. Budget about 3.5-4.0 words/s in English (10 s ≈ 35 words; one minute ≈ 200 English words). Write an original premise; never copy the analysed stories' text. When the user asks for ideas, give ten fresh ones in the formula (see `references/ideas.md` for the bar), each one line starting "In this world/town…". Show the script to the user before voicing if they didn't write it.
2. **Project.** Run `new.py`. Put the script in `script.txt` (lines starting with `#` are notes) and set the voice in `config.json`.
3. **Voice.** Run `voice.py`.
   - The free default is Edge `en-US-AndrewNeural` at rate **+22%** with pauses squeezed to **0.18 s** (about 3.7 words/s, close to the refs).
   - For ElevenLabs or a real recording, set `"engine": "file"` and drop the file at `vo/raw.wav`. **Ask before spending ElevenLabs credits.**
   - Check that the output says `whisper matched N/N`.
4. **Shots.** Edit `web/story.js`.
   - Build the world once (sets, cast, creatures, props, fx), then write a SHOTS list keyed to words with `C(wi('word'))`.
   - One shot per noun, about 1 s each, the camera always moving, and a punch-in on every reaction. The shot vocabulary is in `references/production.md` and the API in `references/kits.md`.
   - Run `build.py shots` and look at `check/shots.jpg` for blocked subjects, blow-outs, the caption over the eyes, a subject too close to the lens, or the camera inside props. List every problem you find to the user, fix them all, and repeat until the sheet is clean. Only then render.
5. **Sound.** Edit `cues.json`, keying cues to words and cuts (`word:dragon+0.4`, `cut:5`).
   - Use the bundled `sfx/` library (`LIB:`), the user's own sound folders, or Mixkit downloads (allowed without asking; report them after). Don't generate new effects on the fly.
   - No sample more than twice. No music unless the user asks (house rule for narrated reels).
   - mix.py prints voice-vs-effects. Keep the worst 100 ms window at 9 dB or more.
6. **Build.** Run `build.py all`. Look at `check/final.jpg`, then run earshot `timeline` on the mp4. Report the measured loudness, true peak and sync, and say that the mix still needs a human listen.
7. **Deliver** `<slug>.mp4` (1080x1920, 60 fps, -14 LUFS / -1.8 dBTP). Mention the size of `frames/` (about 500 MB per 10 s), which can be deleted.

## Rules
- **Every frame is a pure function of time.** Anything a shot hides or moves must be reset in `onReset`, because frames render out of order during resumes and stills.
- **Original look.** Blocky avatars are fine, but never use Roblox names, logos or UI, and never recreate a specific creator's characters (Ryan, Mr Tick and so on) or their exact scenes. The kits are generic on purpose.
- **GPU.** render.mjs warns if Chromium falls back to SwiftShader. A 10 s film is 2400 frames at about 40–60 ms each.
- **Long films** (60 s or more): split the story into chapters of about 20 shots in one story.js. The same pipeline works; frames run about 3 GB a minute at 240 fps, so use `"fps": 120` in config.json to halve that.

## Extending the kit
- New expression: `FACE_DRAW.name = g => {...}` (a 512 canvas).
- New outfit: `OUTFIT.name = (g, o) => {...}`.
- New hair: `HAIR.name = (g, m) => {...}`.
- New preset: `CAST.name = {...}`.
- New set: write a function like those in sets.js that returns a Group at (x, z), and give it its own `TOD` preset if it needs special light.

Run `index.html?story=gallery.js` (with `PAGE="index.html?story=gallery.js" node render.mjs <project> stills 0.5,1.5,…`) to see every kit after changes.
