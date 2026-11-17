"""Install and check Render Worlds on this PC. Run once after unzipping:

    python scripts/setup.py

It installs what is missing (Python packages, node packages, the Chromium that renders the 3D),
then renders one test frame and tells you which graphics card did the work.
"""
import importlib.util, shutil, subprocess, sys, tempfile
from pathlib import Path
SK = Path(__file__).resolve().parent.parent
ok = True
def say(mark, msg): print(f'[{mark}] {msg}')
def sh(cmd, **kw): return subprocess.run(cmd, cwd=SK, capture_output=True, text=True, encoding='utf-8', errors='replace', shell=isinstance(cmd, str), **kw)

# 1. Python packages
need = {'numpy': 'numpy', 'scipy': 'scipy', 'soundfile': 'soundfile', 'PIL': 'pillow', 'edge_tts': 'edge-tts', 'faster_whisper': 'faster-whisper'}
miss = [pip for mod, pip in need.items() if importlib.util.find_spec(mod) is None]
if miss:
    say('..', 'installing ' + ' '.join(miss)); r = sh([sys.executable, '-m', 'pip', 'install', *miss])
    if r.returncode: ok = False; say('X', 'pip install failed:\n' + r.stderr[-1500:])
say('ok' if not miss else '+', f'Python {sys.version.split()[0]} packages')

# 2. ffmpeg and node
for tool in ('ffmpeg', 'node', 'npm'):
    if shutil.which(tool): say('ok', tool)
    else: ok = False; say('X', f'{tool} not found. Install it (ffmpeg: winget install Gyan.FFmpeg, node: winget install OpenJS.NodeJS.LTS), then run setup again.')
if not ok: sys.exit('setup stopped: fix the [X] lines above')

# 3. node packages + Chromium
if not (SK / 'node_modules' / 'playwright').exists():
    say('..', 'npm install'); r = sh('npm install')
    if r.returncode: sys.exit('npm install failed:\n' + r.stderr[-1500:])
r = sh('npx playwright install chromium')
if r.returncode: sys.exit('Chromium install failed:\n' + r.stderr[-1500:])
say('ok', 'three.js + Playwright Chromium')

# 4. test render: one frame of the example story, and the graphics card that drew it
tmp = Path(tempfile.mkdtemp(prefix='rw-setup-')) / 'test'
sh([sys.executable, str(SK / 'scripts' / 'new.py'), str(tmp), '--from', 'sun-en'])
shutil.copy(SK / 'examples' / 'sun-en' / 'timing.json', tmp / 'web' / 'timing.json')
r = sh(['node', str(SK / 'scripts' / 'render.mjs'), str(tmp), 'stills', '1.0'])
gpu = next((l[5:].strip() for l in r.stdout.splitlines() if l.startswith('GPU:')), None)
if r.returncode or not gpu: sys.exit('test render failed. Paste this to Claude:\n' + (r.stdout + r.stderr)[-2000:])
if 'swiftshader' in gpu.lower():
    say('!', f'rendering on the CPU ({gpu}). It works but is about 10x slower. Update your graphics driver.')
else: say('ok', f'graphics card: {gpu}')
shutil.rmtree(tmp.parent, ignore_errors=True)
print('\nRender Worlds is ready. Ask Claude: "Use Render Worlds and give me ten In this world ideas."')
