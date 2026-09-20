import fs from 'fs';
import path from 'path';

function buildLevel1Beatmap() {
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
  const bpm = 118, offset = 0.12, beatSec = 60 / bpm;
  const events = [];
  let id = 1;

  for (let bar = 2; bar <= 12; bar += 2) {
    events.push({
      id: `l2_tap_${id++}`,
      cueTime: Number((offset + (bar * 4) * beatSec - beatSec * 0.5).toFixed(3)),
      time: Number((offset + (bar * 4) * beatSec).toFixed(3)),
      action: 'tap',
      cue: 'clap',
      promptText: 'TAP',
      bar,
      beat: 1,
    });
    const hStart = offset + (bar * 4 + 1) * beatSec;
    const hEnd = offset + (bar * 4 + 3) * beatSec;
    events.push({
      id: `l2_hold_${id++}`,
      cueTime: Number((hStart - beatSec * 0.5).toFixed(3)),
      time: Number(hStart.toFixed(3)),
      endTime: Number(hEnd.toFixed(3)),
      action: 'hold',
      cue: 'scratch',
      promptText: 'HOLD & SCRATCH!',
      bar,
      beat: 2,
    });
  }
  return { bpm, offset, duration: 36, events };
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
