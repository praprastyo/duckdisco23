import fs from 'fs';
import path from 'path';

function buildLevel1Beatmap() {
  const customPath = path.resolve('public/beatmaps/level1.json');
  if (fs.existsSync(customPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(customPath, 'utf8'));
      if (data.events && data.events.length > 60) {
        return data; // Preserve full custom authored beatmap
      }
    } catch {
      // fallback
    }
  }

  const bpm = 79, offset = 0.20, beatSec = 60 / bpm;
  const events = [];
  let id = 1;

  // 4-arrow choreography on the Sunset Duck Beach stage.
  // Phases: Intro tutorial -> Groove combos -> Dance Break -> Final Chorus.
  const patterns = [
    // ---- INTRO (single arrow, lots of reading time) ----
    { bar: 2, dirs: ['left'] },
    { bar: 4, dirs: ['right'] },
    { bar: 6, dirs: ['up'] },
    { bar: 8, dirs: ['down'] },
    { bar: 10, dirs: ['left'] },
    { bar: 11, dirs: ['right'] },

    // ---- GROOVE (3-arrow combinations) ----
    { bar: 13, dirs: ['left', 'up', 'right'] },
    { bar: 15, dirs: ['down', 'right', 'left'] },
    { bar: 17, dirs: ['up', 'down', 'up'] },
    { bar: 19, dirs: ['left', 'right', 'up'] },
    { bar: 21, dirs: ['down', 'down', 'left'] },
    { bar: 23, dirs: ['up', 'left', 'down'] },

    // ---- DANCE BREAK (4-arrow memorised runs) ----
    { bar: 25, dirs: ['left', 'up', 'right', 'down'] },
    { bar: 27, dirs: ['up', 'right', 'down', 'left'] },
    { bar: 29, dirs: ['left', 'right', 'up', 'down'] },
    { bar: 31, dirs: ['down', 'left', 'up', 'right'] },

    // ---- FINAL CHORUS (full dance flurry) ----
    { bar: 34, dirs: ['left', 'up', 'right', 'down', 'up', 'down', 'left', 'right'] },
    { bar: 37, dirs: ['right', 'down', 'left', 'up', 'down', 'left', 'right', 'up'] },
  ];

  const labels = {
    left: 'Duck Slide',
    right: 'Wing Spin',
    up: 'Quack Jump',
    down: 'Low Groove',
  };

  for (const p of patterns) {
    p.dirs.forEach((dir, i) => {
      const targetTime = offset + (p.bar * 4 + i) * beatSec;
      const cueTime = targetTime - beatSec * 2;
      events.push({
        id: `l1_dance_${id++}`,
        cueTime: Number(cueTime.toFixed(3)),
        time: Number(targetTime.toFixed(3)),
        action: 'tap',
        cue: 'quack',
        direction: dir,
        promptText: labels[dir],
        bar: p.bar,
        beat: i + 1,
      });
    });
  }

  return { bpm, offset, duration: 120, events };
}



function buildLevel2Beatmap() {
  const customPath = path.resolve('public/beatmaps/level2.json');
  if (fs.existsSync(customPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(customPath, 'utf8'));
      if (data.events && data.events.length > 50) {
        return data; // Preserve full custom authored beatmap
      }
    } catch {
      // fallback
    }
  }

  const bpm = 146;
  const offset = 0.08;
  const beatSec = 60 / bpm; // ≈ 0.41096s
  const events = [];
  let id = 1;
  let seq = 1;

  function addNote(t, x, y, size = 82) {
    // Keep strictly within safe play area (X: 12-88%, Y: 16-84%)
    const clampedX = Math.max(12, Math.min(88, Math.round(x)));
    const clampedY = Math.max(16, Math.min(84, Math.round(y)));
    events.push({
      id: `l2_${id++}`,
      time: Number(t.toFixed(3)),
      action: 'tap',
      cue: 'pop',
      x: clampedX,
      y: clampedY,
      size,
      seq: seq++,
      promptText: String(seq - 1),
      approachDuration: 0.85,
    });
  }

  // --- SECTION 1: WARM UP (2s - 20s) ---
  // Simple Left - Right patterns, 1 note every 2 beats
  let currTime = 2.0;
  const warmUpCoords = [
    { x: 30, y: 40 },
    { x: 70, y: 40 },
    { x: 30, y: 60 },
    { x: 70, y: 60 },
    { x: 50, y: 30 },
    { x: 50, y: 70 },
    { x: 25, y: 50 },
    { x: 75, y: 50 },
    { x: 35, y: 35 },
    { x: 65, y: 65 },
    { x: 65, y: 35 },
    { x: 35, y: 65 },
  ];

  for (const pos of warmUpCoords) {
    addNote(currTime, pos.x, pos.y, 88);
    currTime += beatSec * 2; // every 2 beats (~0.82s)
  }

  // Brief pause before Section 2
  currTime += beatSec * 2;

  // --- SECTION 2: GROOVE (20s - 50s) ---
  // Zig-Zag and diagonal patterns, 1 note per beat
  const zigZag1 = [
    { x: 20, y: 75 },
    { x: 40, y: 30 },
    { x: 60, y: 75 },
    { x: 80, y: 30 },
  ];
  for (let rep = 0; rep < 2; rep++) {
    for (const p of zigZag1) {
      addNote(currTime, p.x, p.y);
      currTime += beatSec;
    }
  }

  // Reverse Zig-Zag
  const reverseZigZag = [
    { x: 80, y: 35 },
    { x: 60, y: 70 },
    { x: 40, y: 35 },
    { x: 20, y: 70 },
  ];
  for (let rep = 0; rep < 2; rep++) {
    for (const p of reverseZigZag) {
      addNote(currTime, p.x, p.y);
      currTime += beatSec;
    }
  }

  // Diamond formation
  const diamond = [
    { x: 50, y: 25 },
    { x: 75, y: 50 },
    { x: 50, y: 75 },
    { x: 25, y: 50 },
  ];
  for (let rep = 0; rep < 3; rep++) {
    for (const p of diamond) {
      addNote(currTime, p.x, p.y);
      currTime += beatSec;
    }
  }

  // --- SECTION 3: FAST GROOVE & BURSTS (50s - 85s) ---
  // 3-note bursts with half-beat (eighth-note) transitions!
  for (let phrase = 0; phrase < 4; phrase++) {
    // 3-note cluster in a triangle
    const cx = 30 + (phrase % 2) * 40;
    const cy = 35 + (phrase > 1 ? 30 : 0);
    addNote(currTime, cx - 10, cy + 10);
    currTime += beatSec * 0.5; // half beat
    addNote(currTime, cx + 10, cy + 10);
    currTime += beatSec * 0.5; // half beat
    addNote(currTime, cx, cy - 12);
    currTime += beatSec; // full beat pause

    // Jump to opposite corner
    addNote(currTime, 100 - cx, 100 - cy);
    currTime += beatSec;
  }

  // Circular sweep pattern (6-note circle)
  const circleCenter = { x: 50, y: 50 };
  const radius = 26;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = circleCenter.x + Math.cos(angle) * radius;
    const y = circleCenter.y + Math.sin(angle) * radius * 0.75;
    addNote(currTime, x, y);
    currTime += beatSec * 0.75;
  }

  // --- SECTION 4: BREAKDOWN & BREATHING ROOM (85s - 102s) ---
  // Fewer targets, spaced out, emotional disco buildup
  currTime += beatSec * 2;
  const breakdownPoints = [
    { x: 50, y: 48 },
    { x: 25, y: 35 },
    { x: 75, y: 35 },
    { x: 35, y: 68 },
    { x: 65, y: 68 },
    { x: 50, y: 50 },
  ];
  for (const p of breakdownPoints) {
    addNote(currTime, p.x, p.y, 90);
    currTime += beatSec * 2; // slow 2 beats
  }

  // --- SECTION 5: FINAL BURST & DUCK FOOTPRINTS (102s - 125s) ---
  // High intensity, rapid rhythm chains inspired by Duck Footprints!
  const footPrints = [
    // Left foot: heel, left toe, middle toe, right toe
    { x: 30, y: 65 },
    { x: 22, y: 38 },
    { x: 30, y: 32 },
    { x: 38, y: 38 },
    // Right foot: heel, left toe, middle toe, right toe
    { x: 70, y: 65 },
    { x: 62, y: 38 },
    { x: 70, y: 32 },
    { x: 78, y: 38 },
  ];

  for (let rep = 0; rep < 2; rep++) {
    for (const fp of footPrints) {
      addNote(currTime, fp.x, fp.y);
      currTime += beatSec * 0.5; // eighth-note fast steps!
    }
    currTime += beatSec;
  }

  // Grand Finale Staccato Cross
  const finale = [
    { x: 20, y: 20 },
    { x: 80, y: 80 },
    { x: 80, y: 20 },
    { x: 20, y: 80 },
    { x: 50, y: 50 }, // Final golden center note
  ];
  for (let i = 0; i < finale.length; i++) {
    addNote(currTime, finale[i].x, finale[i].y, i === finale.length - 1 ? 96 : 82);
    currTime += i === finale.length - 1 ? beatSec * 2 : beatSec;
  }

  return { bpm, offset, duration: Math.ceil(currTime + 2), events };
}

function buildLevel3Beatmap() {
  const bpm = 126, offset = 0.09, beatSec = 60 / bpm;
  const events = [];
  let id = 1;
  const cues = ['shake', 'spin', 'quack', 'clap'];

  for (let bar = 2; bar <= 13; bar++) {
    const cue = cues[(bar - 2) % cues.length];
    const cueTime = offset + (bar * 4) * beatSec;
    let target = cueTime;
    if (cue === 'shake') target = cueTime + beatSec * 2;
    else if (cue === 'spin') target = cueTime + beatSec;
    else if (cue === 'clap') target = cueTime + beatSec * 1.5;

    events.push({
      id: `l3_cue_${id++}`,
      cueTime: Number(cueTime.toFixed(3)),
      time: Number(target.toFixed(3)),
      action: 'tap',
      cue,
      promptText: cue.toUpperCase(),
      bar,
      beat: 1,
    });
  }
  return { bpm, offset, duration: 36, events };
}

function buildLevel4Beatmap() {
  const bpm = 124, offset = 0.15, beatSec = 60 / bpm;
  const events = [];
  let id = 1;

  for (let bar = 2; bar <= 4; bar++) {
    events.push({
      id: `l4_mix1_${id++}`,
      cueTime: Number((offset + (bar * 4 + 2) * beatSec).toFixed(3)),
      time: Number((offset + (bar * 4 + 3) * beatSec).toFixed(3)),
      action: 'tap',
      cue: 'quack',
      promptText: 'REMIX CHECK-IN',
      bar,
      beat: 4,
    });
  }

  for (let bar = 5; bar <= 7; bar++) {
    const hStart = offset + (bar * 4 + 1) * beatSec;
    const hEnd = offset + (bar * 4 + 3) * beatSec;
    events.push({
      id: `l4_hold_${id++}`,
      cueTime: Number((hStart - beatSec * 0.5).toFixed(3)),
      time: Number(hStart.toFixed(3)),
      endTime: Number(hEnd.toFixed(3)),
      action: 'hold',
      cue: 'scratch',
      promptText: 'TURNTABLE DROP',
      bar,
      beat: 2,
    });
  }

  const finalHitTime = 32.5;
  events.push({
    id: `l4_final_reveal`,
    cueTime: Number((finalHitTime - 1.2).toFixed(3)),
    time: Number(finalHitTime.toFixed(3)),
    action: 'special',
    cue: 'quack',
    promptText: 'FINAL QUACK!',
    bar: 16,
    beat: 1,
  });

  return { bpm, offset, duration: 45, events };
}

const pubDir = path.resolve('public/beatmaps');
const srcDir = path.resolve('src/beatmaps');
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

const maps = [
  { name: 'level1.json', data: buildLevel1Beatmap() },
  { name: 'level2.json', data: buildLevel2Beatmap() },
  { name: 'level3.json', data: buildLevel3Beatmap() },
  { name: 'level4.json', data: buildLevel4Beatmap() },
];

for (const m of maps) {
  const json = JSON.stringify(m.data, null, 2);
  fs.writeFileSync(path.join(pubDir, m.name), json);
  fs.writeFileSync(path.join(srcDir, m.name), json);
  console.log(`Beatmap ${m.name} generated (${m.data.events.length} events)`);
}
