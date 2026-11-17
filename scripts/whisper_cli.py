"""Stand-in for whisper.cpp's whisper-cli, built on faster-whisper (already on this PC).
Accepts the flags voice.py sends (-m -l -f -ml 1 -sow -oj -of <base> --prompt <text>)
and writes <base>.json in whisper.cpp format: {"transcription": [{"text": " word", "offsets": {"from": ms, "to": ms}}]}."""
import json, sys
from faster_whisper import WhisperModel
a = sys.argv[1:]; arg = lambda k, d=None: a[a.index(k) + 1] if k in a else d
lang = arg('-l', 'en'); wav = arg('-f'); base = arg('-of'); prompt = arg('--prompt')
model = WhisperModel('medium.en' if lang == 'en' else 'medium', device='cpu', compute_type='int8')
import soundfile as sf, numpy as np
aud, sr = sf.read(wav, dtype="float32", always_2d=True); aud = aud.mean(1).astype(np.float32)
segs, _ = model.transcribe(aud, language=lang, word_timestamps=True, initial_prompt=prompt, beam_size=5)
out = [{'text': w.word if w.word.startswith(' ') else ' ' + w.word, 'offsets': {'from': int(w.start * 1000), 'to': int(w.end * 1000)}} for s in segs for w in s.words]
open(base + '.json', 'w', encoding='utf-8').write(json.dumps({'transcription': out}, ensure_ascii=False))
print(f'{len(out)} words')
