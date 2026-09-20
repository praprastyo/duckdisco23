import fs from 'fs';
import path from 'path';

function buildLevel1Beatmap() {
  const bpm = 81, offset = 0.20, beatSec = 60 / bpm;
  const events = [];
  let id = 1;

  // 3-Lane Rhythm Dodge Sequence at 81 BPM (Left, Mid, Right)
  const pattern = [
    // Intro Tutorial (Beach Ball 🏐)
    { bar: 1, beat: 4, lane: 'mid', type: 'ball', prompt: '🏐 BOLA DI TENGAH!' },
    { bar: 2, beat: 4, lane: 'right', type: 'ball', prompt: '🏐 BOLA DI KANAN!' },
    { bar: 3, beat: 4, lane: 'left', type: 'ball', prompt: '🏐 BOLA DI KIRI!' },
    { bar: 4, beat: 4, lane: 'mid', type: 'crab', prompt: '🦀 KEPITING TENGAH!' },

    // Alternating Dodge (Crab 🦀 & Bucket 🪣)
    { bar: 5, beat: 3, lane: 'right', type: 'crab', prompt: '🦀 KEPITING KANAN!' },
    { bar: 6, beat: 3, lane: 'left', type: 'bucket', prompt: '🪣 EMBER KIRI!' },
    { bar: 7, beat: 3, lane: 'mid', type: 'crab', prompt: '🦀 KEPITING TENGAH!' },
    { bar: 8, beat: 3, lane: 'right', type: 'bucket', prompt: '🪣 EMBER KANAN!' },

    // Wave 🌊 (Covers 2 lanes! Player must choose the 1 safe lane!)
    { bar: 9, beat: 4, lane: 'left', type: 'wave', prompt: '🌊 OMBAK! AMAN DI KIRI!' },
    { bar: 10, beat: 4, lane: 'right', type: 'wave', prompt: '🌊 OMBAK! AMAN DI KANAN!' },

    // Surfboard & Party Rush 🏄
    { bar: 11, beat: 3, lane: 'mid', type: 'surfboard', prompt: '🏄 SURFBOARD TENGAH!' },
    { bar: 12, beat: 2, lane: 'left', type: 'ball', prompt: '🏐 DODGE KIRI!' },
    { bar: 12, beat: 4, lane: 'right', type: 'crab', prompt: '🦀 DODGE KANAN!' },
    { bar: 13, beat: 2, lane: 'mid', type: 'wave', prompt: '🌊 FINALE WAVE!' },
    { bar: 13, beat: 4, lane: 'right', type: 'ball', prompt: '🎉 BEACH DISCO CLEAR!' },
  ];

  for (const p of pattern) {
    const targetTime = offset + (p.bar * 4 + (p.beat - 1)) * beatSec;
    const cueTime = targetTime - beatSec * 1.5;
    events.push({
      id: `l1_dash_${id++}`,
      cueTime: Number(cueTime.toFixed(3)),
      time: Number(targetTime.toFixed(3)),
      action: 'tap',
      cue: 'quack',
      lane: p.lane,
      obstacleType: p.type,
      promptText: p.prompt,
      bar: p.bar,
      beat: p.beat,
    });
  }

  return { bpm, offset, duration: 45, events };
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
