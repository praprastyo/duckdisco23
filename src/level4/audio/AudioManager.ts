import { LEVEL4_AUDIO_CONFIG } from '../config/level4Config';
import { SaveService } from '../../services/SaveService';

export type BallroomFocusMode = 'hub' | 'minigame' | 'reveal';

export class AudioManager {
  private static instance: AudioManager | null = null;
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private musicFilter: BiquadFilterNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private isBgmPlaying: boolean = false;
  private currentFocus: BallroomFocusMode = 'hub';

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) AudioManager.instance = new AudioManager();
    return AudioManager.instance;
  }

  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.musicGain = this.ctx.createGain();
      this.musicFilter = this.ctx.createBiquadFilter();
      this.musicFilter.type = 'lowpass';
      this.musicFilter.frequency.setValueAtTime(20000, this.ctx.currentTime);

      this.sfxGain = this.ctx.createGain();
      const s = SaveService.load().settings;
      this.musicGain.gain.setValueAtTime(s.musicVolume, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(s.sfxVolume, this.ctx.currentTime);

      // Audio Graph: musicSource -> musicGain -> musicFilter (lowpass muffled) -> destination
      this.musicGain.connect(this.musicFilter);
      this.musicFilter.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  public async startBallroomMusic(): Promise<void> {
    const ctx = this.ensureCtx();
    if (this.bgmAudio && this.isBgmPlaying) return;
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio();
      this.bgmAudio.loop = true;
      this.bgmAudio.crossOrigin = 'anonymous';
      try {
        const src = ctx.createMediaElementSource(this.bgmAudio);
        src.connect(this.musicGain!);
      } catch {}
      this.bgmAudio.src = LEVEL4_AUDIO_CONFIG.ballroomSoundtrack;
      this.bgmAudio.onerror = () => {
        if (this.bgmAudio && this.bgmAudio.src.includes('level-4-ballroom.mp3')) {
          this.bgmAudio.src = LEVEL4_AUDIO_CONFIG.ballroomFallback;
          this.bgmAudio.play().catch(() => {});
        }
      };
    }
    try {
      await this.bgmAudio.play();
      this.isBgmPlaying = true;
      this.setBallroomFocus('hub');
    } catch {
      this.isBgmPlaying = false;
    }
  }

  public setBallroomFocus(mode: BallroomFocusMode): void {
    this.currentFocus = mode;
    if (!this.ctx || !this.musicGain) return;
    const vol = SaveService.load().settings.musicVolume ?? 0.8;
    const scale = LEVEL4_AUDIO_CONFIG.volume[mode] ?? 1.0;
    const now = this.ctx.currentTime;
    const dur = LEVEL4_AUDIO_CONFIG.fadeDurationMs / 1000;

    // Volume ducking
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
    this.musicGain.gain.linearRampToValueAtTime(vol * scale, now + dur);

    // Muffled low-pass filter: 20kHz in hub, 900Hz in minigames, 18kHz in reveal
    if (this.musicFilter) {
      const targetCutoff = mode === 'hub' ? 20000 : mode === 'minigame' ? 900 : 18000;
      this.musicFilter.frequency.cancelScheduledValues(now);
      this.musicFilter.frequency.setValueAtTime(this.musicFilter.frequency.value, now);
      this.musicFilter.frequency.exponentialRampToValueAtTime(
        Math.max(200, targetCutoff),
        now + dur
      );
    }
  }

  public getFocus(): BallroomFocusMode {
    return this.currentFocus;
  }

  public stopBallroomMusic(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
      this.isBgmPlaying = false;
    }
  }

  public playTypewriterKey(v: number = 1): void {
    const ctx = this.ensureCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const pitches = [1800, 2200, 1950, 2400];
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitches[v % pitches.length], now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playCarriageReturn(): void {
    const ctx = this.ensureCtx();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2800, now);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(4200, now);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain!);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.46);
    osc2.stop(now + 0.46);
  }

  public playTypingError(): void {
    const ctx = this.ensureCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playPuzzleBlip(success: boolean): void {
    const ctx = this.ensureCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = success ? 'sine' : 'square';
    osc.frequency.setValueAtTime(success ? 784 : 120, now);
    if (success) osc.frequency.setValueAtTime(1046.5, now + 0.08);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playShooterPop(type: 'shot' | 'bottle' | 'forbidden' | 'cowboy'): void {
    const ctx = this.ensureCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    if (type === 'shot' || type === 'cowboy') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'shot' ? 880 : 700, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    } else if (type === 'bottle') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1860, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    }
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  public playFanfare(): void {
    const ctx = this.ensureCtx();
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      const now = ctx.currentTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now);
      osc.stop(now + 0.29);
    });
  }

  public playBoxOpen(): void {
    const ctx = this.ensureCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 1.2);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(now);
    osc.stop(now + 1.35);
  }
}
