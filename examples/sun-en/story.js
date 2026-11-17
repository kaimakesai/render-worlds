// Render Worlds demo 1 (original premise): "In this town, the sun rises once every four years... Thousands of eyes."
import { V, lerp, lerpV, clamp, eio, eo, run, look, dof, gradeSet, setTOD, flash, handheld, C, wi, onReset, CAM, box, mat, at, scene, faceOf, shadowAt } from './core.js';
import { cast, pose, POSES, crowd, crowdPose } from './kits/characters.js';
import { town, clouds } from './kits/sets.js';
import { beast } from './kits/creatures.js';
import { countdown, textPanel } from './kits/props.js';
import { weather, orb, twinkle } from './kits/fx.js';

// ---- world (built once) ----
const T = town(0, 0, { night: true }); clouds();
const POST = V(0, 0, -14);
const post = at(box(.6, 9, .6, mat('#2b2b33')), POST.x, 4.5, POST.z); scene.add(post);
const clock = countdown({ w: 4.6 }); clock.position.set(POST.x, 10.2, POST.z + .4); clock.material.emissiveIntensity = .55; scene.add(clock);
const sign = textPanel('LAST SUNRISE\n4 YEARS AGO', { w: 5, h: 2.6, size: 120, bg: '#f4ead2', col: '#3a1d12', post: 1.6 });
sign.position.set(14, 0, 22); sign.rotation.y = -.71; scene.add(sign);
const hero = cast('hero', { acc: ['crown'] }); hero.position.set(0, 0, 4); hero.rotation.y = Math.PI;
const folk = crowd(54, POST, 9, 27, { hats: .3 });
const eyes = beast({ eyes: 140, tentacles: 8, scale: 4.2, eye: '#ffd23f' });
eyes.userData.eyes.forEach(e => { const m = e.children[0].material; m.emissiveIntensity = 1.1; });
const nearHide = (z = 1) => folk.forEach(c => c.visible = c.position.z < z);
const snow = weather({ kind: 'snow' }); const sunGlow = orb(); const tw = twinkle();

const t3 = C(wi('three')), t2 = C(wi('two')), t1 = C(wi('one')), tBut = C(wi('but')), tSun2 = C(wi('sun', 2)), tSome = C(wi('something')), tThou = C(wi('thousands'));
onReset(t => {
  eyes.visible = false; hero.visible = true; folk.forEach(c => c.visible = true);
  const secs = t < t3 ? 4 : t < t2 ? 3 : t < t1 ? 2 : t < tBut ? 1 : 0; clock.userData.set(secs, secs ? '#ffd27a' : '#ff5a4a');
});
const COLD = (k = 0) => { setTOD('night', 'golden', k); gradeSet(lerp(.92, 1.15, k), 1.1, [lerp(.9, 1.05, k), lerp(.93, .98, k), lerp(1.1, .95, k)], .38); shadowAt(0, 0, 60); };
const waitPose = t => { crowdPose(folk, t, 'idle'); pose(hero, { e: 'worried', hx: -.12 }); };
const lookUp = (t, e = 'worried') => { crowdPose(folk, t, 'up'); pose(hero, { ...POSES.lookUp(t), e }); };

// ---- shots: [start, end, (t, u) => {}] ----
const S = [
  // "In this town," fly-over of the snowy night town
  [0, C(wi('sun')), (t, u) => { COLD(); waitPose(t); snow.at(t, V(0, 0, 0));
    CAM.fly(u, V(-140, 80, 200), V(-36, 24, 52), V(0, 0, -20), V(0, 6, -6), 44); dof(lerp(220, 60, u), .0004); }],
  // "the sun rises" tilt up from the roofs to an empty dark horizon
  [C(wi('sun')), C(wi('once')), (t, u) => { COLD(); waitPose(t); snow.at(t, V(0, 0, 20));
    nearHide(); CAM.tiltUp(u, V(6, 3.2, 30).add(handheld(t, .6)), V(0, 4, 0), V(0, 34, -200), 52); dof(60, .0004); }],
  // "once every four years." insert on the sign
  [C(wi('once')), C(wi('everyone')), (t, u) => { COLD(); waitPose(t); snow.at(t, V(14, 0, 22));
    const k = eo(u); look(lerpV(V(3.6, 3.4, 34.6), V(5.2, 3, 32.7), k).add(handheld(t, .4)), V(14, 2.5, 22), 36); dof(lerp(16.3, 13.8, k), .003); }],
  // "Everyone waits in the" orbit around the waiting crowd, hero in front
  [C(wi('everyone')), C(wi('square')), (t, u) => { COLD(); waitPose(t); snow.at(t, V(0, 0, 0));
    CAM.orbit(u, V(0, 0, 0), 22, 2.6, 3.4, 11, 2.5, 44); dof(24, .0012); }],
  // "square for the countdown." crane down onto the square, the countdown post in frame
  [C(wi('square')), t3, (t, u) => { COLD(); waitPose(t); snow.at(t, V(0, 0, 0));
    CAM.dolly(u, V(4, 32, 34), V(2, 6, 14), V(0, 0, -6), V(0, 9, -14), 46); dof(lerp(40, 25, u), .0008); }],
  // "Three." insert on the countdown
  [t3, t2, (t, u) => { COLD(); waitPose(t);
    CAM.push(u, V(.5, 9.8, 0), V(.2, 10, -3.6), V(0, 10.2, -13.6), 40); dof(lerp(14, 10.4, eo(u)), .004); }],
  // "Two." punch-in on the hero's face, countdown blurred behind
  [t2, t1, (t, u) => { COLD(); lookUp(t); const f = faceOf(hero);
    const k = eo(u); nearHide(-7); look(V(f.x - .5, f.y - .7, f.z - lerp(7.2, 5.8, k)).add(handheld(t, .5)), f, lerp(34, 30, k)); dof(lerp(7.2, 5.8, k), .007); }],
  // "One. But this time," wide low angle: the horizon starts to glow, then dies on "but"
  [t1, tSun2, (t, u) => { const up = clamp((t - t1) / (tBut - t1 + .15)), down = clamp((t - tBut - .1) / .45), g = up * (1 - down);
    COLD(.45 * g); lookUp(t, 'determined'); sunGlow.at(V(0, 6 + 10 * g, -320), 10 + 40 * g, 0);
    nearHide(-9); look(V(-6, 3.2, 6).add(handheld(t, .5)), V(0, 10 + 4 * u, -120), 56); dof(70, .0004); snow.at(t, V(0, 0, 10)); }],
  // "the sun didn't come up." hero blank, colors drain
  [tSun2, tSome, (t, u) => { setTOD('night', 'storm', .5 * u); gradeSet(lerp(.85, .6, u), 1.15, [.9, .92, 1.08], .5); shadowAt(0, 0, 60);
    lookUp(t, 'worried'); const f = faceOf(hero); nearHide(-7); look(V(f.x + .6, f.y - .3, f.z - lerp(6.8, 5.8, eo(u))).add(handheld(t, .4)), f, 30); dof(6.3, .007); snow.at(t, V(0, 0, 4)); }],
  // "Something else did." the mass rises behind the houses, low angle
  [tSome, tThou, (t, u) => { setTOD('night'); gradeSet(.6, 1.2, [.85, .88, 1.12], .55); shadowAt(0, 0, 60); crowdPose(folk, t, 'scared'); pose(hero, { ...POSES.scared(t), e: 'scared' }); nearHide(-10);
    eyes.visible = true; eyes.position.set(0, lerp(-30, 30, eio(u)), -125); eyes.userData.tick(t, V(0, 4, 4));
    look(V(4, 5, 10).add(handheld(t, 1)), V(0, lerp(18, 30, u), -120), 58); dof(80, .0003); snow.at(t, V(0, 0, 14)); }],
  // "Thousands of eyes." hero in the foreground, tilt up as the eyes fill the sky
  [tThou, 99, (t, u) => { setTOD('night'); gradeSet(.7, 1.2, [.86, .86, 1.12], .5); nearHide(-10); shadowAt(0, 0, 60); crowdPose(folk, t, 'scared');
    hero.rotation.y = Math.PI; pose(hero, { e: 'shock', hx: -.5, aL: [0, 0, .12], aR: [0, 0, -.12] });
    const u2 = clamp((t - tThou) / 2.2), k = eio(u2);
    eyes.visible = true; eyes.position.set(0, lerp(30, 40, k), -110); eyes.userData.tick(t, V(0, 4.6, 4));
    look(V(3.6, lerp(2.8, 2, k), lerp(12, 14, k)).add(handheld(t, 1.2)), V(0, lerp(6, 40, k), lerp(-4, -110, k)), lerp(50, 66, k)); dof(lerp(10, 90, k), lerp(.003, .0004, k));
    snow.at(t, V(0, 0, 12)); }],
];
run(S, { tail: 1.6 });
