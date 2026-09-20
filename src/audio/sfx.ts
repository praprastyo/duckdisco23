/**
 * Procedural SFX synthesis using Web Audio API.
 * Musically tuned for retro disco grooves and duck mascot cues.
 */
export type SfxName = 'quack' | 'clap' | 'cowbell' | 'scratch' | 'kick' | 'snare' | 'miss' | 'reveal';

export class DiscoSfx {
  public static play(ctx: AudioContext, destination: AudioNode, type: SfxName) {
    const now = ctx.currentTime;

    switch (type) {
      case 'quack': {
        // Formant filtered vocal duck quack
        const osc = ctx.createOscillator();
        const biquad = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);

        biquad.type = 'bandpass';
        biquad.frequency.setValueAtTime(860, now);
        biquad.Q.setValueAtTime(3.8, now);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(biquad);
        biquad.connect(gain);
        gain.connect(destination);

        osc.start(now);
        osc.stop(now + 0.23);
        break;
      }

      case 'clap': {
        // Punchy 808 disco clap
        const bufferSize = Math.floor(ctx.sampleRate * 0.2);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(2.2, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(destination);

        noise.start(now);
        noise.stop(now + 0.19);
        break;
      }

      case 'cowbell': {
        // 808 cowbell
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const bandpass = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = 'square';
        osc1.frequency.setValueAtTime(587, now);
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(845, now);

        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(800, now);
        bandpass.Q.setValueAtTime(2.8, now);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc1.connect(bandpass);
        osc2.connect(bandpass);
        bandpass.connect(gain);
        gain.connect(destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.26);
        osc2.stop(now + 0.26);
        break;
      }

      case 'scratch': {
        // Vinyl scratch pitch sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(650, now + 0.07);
        osc.frequency.linearRampToValueAtTime(80, now + 0.16);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

        osc.connect(gain);
        gain.connect(destination);

        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }

      case 'miss': {
        // Dull vinyl thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.14);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(destination);
        osc.start(now);
        osc.stop(now + 0.16);
        break;
      }

      case 'kick': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.14);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(destination);
        osc.start(now);
        osc.stop(now + 0.16);
        break;
      }

      case 'snare': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.1);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        osc.connect(gain);
        gain.connect(destination);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }

      case 'reveal': {
        // Shimmer chord for reward
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.05);
          gain.gain.setValueAtTime(0.15, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + i * 0.05);
          osc.connect(gain);
          gain.connect(destination);
          osc.start(now + i * 0.05);
          osc.stop(now + 0.9 + i * 0.05);
        });
        break;
      }
    }
  }
}
