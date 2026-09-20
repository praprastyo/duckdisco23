import fs from 'fs';
import path from 'path';

function buildLevel1Beatmap() {
  const bpm = 108, offset = 0.18, beatSec = 60 / bpm;
  const events = [];
  let id = 1;

  // Phase A: "1, 2, 3, QUACK!" -> Tap on 4
  for (const bar of [2, 3, 4, 5]) {
    events.push({
      id: `l1_std_${id++}`,
      cueTime: Number((offset + (bar * 4 + 2) * beatSec).toFixed(3)),
      time: Number((offset + (bar * 4 + 3) * beatSec).toFixed(3)),
      action: 'tap',
      cue: 'quack',
      promptText: 'QUACK!',
      bar,
      beat: 4,
    });
  }

  // Phase B: Variation -> "1, 2, TAP!" (Hit on Beat 3)
  for (const bar of [6, 7]) {
    events.push({
      id: `l1_var_${id++}`,
      cueTime: Number((offset + (bar * 4 + 1) * beatSec).toFixed(3)),
      time: Number((offset + (bar * 4 + 2) * beatSec).toFixed(3)),
      action: 'tap',
      cue: 'quack',
      promptText: 'FAST QUACK!',
      bar,
      beat: 3,
    });
  }

  // Phase C: Offbeat Syncopation -> Hit on 3.5 (& of 3)
  for (const bar of [8, 9]) {
    events.push({
      id: `l1_sync_${id++}`,
      cueTime: Number((offset + (bar * 4 + 2) * beatSec).toFixed(3)),
      time: Number((offset + (bar * 4 + 2.5) * beatSec).toFixed(3)),
      action: 'tap',
      cue: 'clap',
      promptText: 'OFFBEAT QUACK!',
      bar,
      beat: 3.5,
    });
  }

  // Phase D: Fake visual cue test
  events.push({
    id: `l1_fake_${id++}`,
    cueTime: Number((offset + (10 * 4 + 1) * beatSec).toFixed(3)),
    time: Number((offset + (10 * 4 + 3) * beatSec).toFixed(3)),
    action: 'tap',
    cue: 'visualFake',
    promptText: 'WAIT FOR BEAT...',
    bar: 10,
    beat: 4,
  });

  // Flurry finale
  for (let b = 0; b < 6; b++) {
    const t = offset + (12 * 4 + b) * beatSec;
    events.push({
      id: `l1_flurry_${id++}`,
      cueTime: Number((t - beatSec * 0.75).toFixed(3)),
      time: Number(t.toFixed(3)),
      action: 'tap',
      cue: 'quack',
      promptText: 'PARTY IN!',
      bar: 12,
      beat: b + 1,
    });
  }

  return { bpm, offset, duration: 36, events };
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
