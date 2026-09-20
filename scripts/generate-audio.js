import fs from 'fs';
import path from 'path';

const SAMPLE_RATE = 44100;

function createWavHeader(numChannels, sampleRate, bitsPerSample, numSamples) {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  return buffer;
}

function synthTrack(bpm, durationSec, style) {
  const totalSamples = Math.floor(SAMPLE_RATE * durationSec);
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);
  const beatSec = 60 / bpm;
  const totalBeats = Math.floor(durationSec / beatSec);

  for (let b = 0; b < totalBeats; b++) {
    const beatStart = Math.floor(b * beatSec * SAMPLE_RATE);
    addKick(left, right, beatStart, 0.85);
    if (b % 2 === 1) addClap(left, right, beatStart, 0.7);

    const qtr = Math.floor((beatSec / 4) * SAMPLE_RATE);
    for (let sub = 0; sub < 4; sub++) {
      const open = sub === 2;
      addHiHat(left, right, beatStart + sub * qtr, open ? 0.35 : 0.18, open ? 0.12 : 0.04);
    }

    const root = style === 'level2' ? 65.41 : style === 'level3' ? 82.41 : 73.42;
    const bassFreq = (b % 2 === 1) ? root * 2 : root;
    addBass(left, right, beatStart, bassFreq, beatSec * 0.8, 0.65);

    const upbeat = beatStart + Math.floor((beatSec / 2) * SAMPLE_RATE);
    if (b % 2 === 0 || style === 'level3' || style === 'level4') {
      const chords = style === 'level3' ? [164.81, 246.94, 329.63] : [146.83, 220.0, 293.66];
      addChord(left, right, upbeat, chords, beatSec * 0.4, 0.35);
    }

    if (b % 8 === 3 || b % 8 === 7 || (style === 'level1' && b % 4 === 2)) {
      addQuack(left, right, beatStart, 0.45);
    }
  }

  const pcmBuffer = Buffer.alloc(totalSamples * 4);
  for (let i = 0; i < totalSamples; i++) {
    const l = Math.max(-1, Math.min(1, left[i]));
    const r = Math.max(-1, Math.min(1, right[i]));
    pcmBuffer.writeInt16LE(Math.floor(l < 0 ? l * 0x8000 : l * 0x7fff), i * 4);
    pcmBuffer.writeInt16LE(Math.floor(r < 0 ? r * 0x8000 : r * 0x7fff), i * 4 + 2);
  }

  return Buffer.concat([createWavHeader(2, SAMPLE_RATE, 16, totalSamples), pcmBuffer]);
}

function addKick(l, r, start, vol) {
  const dur = Math.floor(0.18 * SAMPLE_RATE);
  for (let i = 0; i < dur && start + i < l.length; i++) {
    const t = i / SAMPLE_RATE;
    const s = Math.sin(2 * Math.PI * (145 * Math.exp(-t * 22) + 42) * t) * (Math.exp(-t * 18) * vol);
    l[start + i] += s;
    r[start + i] += s;
  }
}

function addClap(l, r, start, vol) {
  const dur = Math.floor(0.15 * SAMPLE_RATE);
  for (let i = 0; i < dur && start + i < l.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 28) * vol;
    const s = ((Math.random() * 2 - 1) + Math.sin(2 * Math.PI * 180 * t) * 0.4) * env;
    l[start + i] += s * 0.9;
    r[start + i] += s * 1.1;
  }
}

function addHiHat(l, r, start, vol, durSec) {
  const dur = Math.floor(durSec * SAMPLE_RATE);
  for (let i = 0; i < dur && start + i < l.length; i++) {
    const t = i / SAMPLE_RATE;
    const s = (Math.random() * 2 - 1) * (Math.exp(-t / (durSec * 0.4)) * vol);
    l[start + i] += s * 0.7;
    r[start + i] += s * 0.8;
  }
}

function addBass(l, r, start, freq, durSec, vol) {
  const dur = Math.floor(durSec * SAMPLE_RATE);
  for (let i = 0; i < dur && start + i < l.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.min(1, t * 80) * Math.exp(-t * 3.5) * vol;
    const s = (Math.sin(2 * Math.PI * freq * t) + Math.sin(2 * Math.PI * freq * 2 * t) * 0.4) * env;
    l[start + i] += s;
    r[start + i] += s;
  }
}

function addChord(l, r, start, freqs, durSec, vol) {
  const dur = Math.floor(durSec * SAMPLE_RATE);
  for (let i = 0; i < dur && start + i < l.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.min(1, t * 100) * Math.exp(-t * 6) * vol;
    let sum = 0;
    for (const f of freqs) sum += Math.sin(2 * Math.PI * f * t);
    l[start + i] += (sum / freqs.length) * env * 0.8;
    r[start + i] += (sum / freqs.length) * env;
  }
}

function addQuack(l, r, start, vol) {
  const dur = Math.floor(0.22 * SAMPLE_RATE);
  for (let i = 0; i < dur && start + i < l.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 14) * vol;
    const f = 260 + 180 * Math.sin(Math.PI * (t / 0.22));
    const s = Math.sin(2 * Math.PI * f * t) * env;
    l[start + i] += s * 0.6;
    r[start + i] += s * 0.6;
  }
}

const outDir = path.resolve('public/audio');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const tracks = [
  { file: 'level-1.mp3', bpm: 81, dur: 45, style: 'level1' },
  { file: 'level-2.mp3', bpm: 118, dur: 36, style: 'level2' },
  { file: 'level-3.mp3', bpm: 126, dur: 36, style: 'level3' },
  { file: 'level-4.mp3', bpm: 124, dur: 45, style: 'level4' },
];


console.log('Synthesizing disco soundtracks...');
for (const t of tracks) {
  const wavBuf = synthTrack(t.bpm, t.dur, t.style);
  fs.writeFileSync(path.join(outDir, t.file), wavBuf);
  console.log(`Saved ${t.file} (${(wavBuf.length / 1024 / 1024).toFixed(2)} MB, ${t.bpm} BPM)`);
}
console.log('All soundtracks ready.');
