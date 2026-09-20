import { AudioAnalyser } from './AudioAnalyser';
import { DiscoSfx, SfxName } from './sfx';

export type AudioState = 'unloaded' | 'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error';
export type AudioStateListener = (state: AudioState) => void;

export class AudioEngine {
  private static instance: AudioEngine | null = null;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private analyser: AudioAnalyser = new AudioAnalyser();

  private currentBuffer: AudioBuffer | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private isStarted: boolean = false;
  private isPaused: boolean = false;
  private startCtxTime: number = 0;
  private pauseOffsetTime: number = 0;
  private trackDuration: number = 0;

  private stateListeners: Set<AudioStateListener> = new Set();
  private onEndedCallback: (() => void) | null = null;

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) AudioEngine.instance = new AudioEngine();
    return AudioEngine.instance;
  }

  public ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.connect(this.masterGain);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.connect(this.masterGain);
      this.analyser.init(this.ctx, this.musicGain);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  public getContext(): AudioContext | null { return this.ctx; }
  public getAnalyser(): AudioAnalyser { return this.analyser; }

  public async loadTrack(url: string): Promise<AudioBuffer> {
    this.ensureContext();
    this.notifyState('loading');
    this.stop();

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Track load failed: ${response.statusText} (${url})`);
      const buf = await response.arrayBuffer();
      const decoded = await this.ctx!.decodeAudioData(buf);
      this.currentBuffer = decoded;
      this.trackDuration = decoded.duration;
      this.pauseOffsetTime = 0;
      this.notifyState('ready');
      return decoded;
    } catch (err) {
      this.notifyState('error');
      throw err;
    }
  }

  public play(offsetSeconds: number = 0, onEnded?: () => void): void {
    const ctx = this.ensureContext();
    if (!this.currentBuffer) return;
    this.stopSource();

    const source = ctx.createBufferSource();
    source.buffer = this.currentBuffer;
    source.connect(this.musicGain!);

    const safeOffset = Math.min(Math.max(0, offsetSeconds), this.trackDuration);
    this.startCtxTime = ctx.currentTime - safeOffset;
    this.pauseOffsetTime = safeOffset;
    this.onEndedCallback = onEnded || null;

    source.onended = () => {
      if (this.isStarted && !this.isPaused) {
        this.isStarted = false;
        this.notifyState('ended');
        this.onEndedCallback?.();
      }
    };

    source.start(0, safeOffset);
    this.currentSource = source;
    this.isStarted = true;
    this.isPaused = false;
    this.notifyState('playing');
  }

  public pause(): void {
    if (!this.isStarted || this.isPaused) return;
    this.pauseOffsetTime = this.getCurrentTime();
    this.isPaused = true;
    this.stopSource();
    this.notifyState('paused');
  }

  public resume(): void {
    if (!this.isPaused || !this.currentBuffer) return;
    this.play(this.pauseOffsetTime, this.onEndedCallback || undefined);
  }

  public stop(): void {
    this.isStarted = false;
    this.isPaused = false;
    this.pauseOffsetTime = 0;
    this.stopSource();
  }

  private stopSource(): void {
    if (this.currentSource) {
      try {
        this.currentSource.onended = null;
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (_) {}
      this.currentSource = null;
    }
  }

  public seek(sec: number): void {
    const active = this.isStarted && !this.isPaused;
    this.stop();
    this.pauseOffsetTime = Math.max(0, Math.min(sec, this.trackDuration));
    if (active) this.play(this.pauseOffsetTime, this.onEndedCallback || undefined);
  }

  public getCurrentTime(): number {
    if (!this.ctx || !this.isStarted || this.isPaused) return this.pauseOffsetTime;
    const current = this.ctx.currentTime - this.startCtxTime;
    return Math.min(Math.max(0, current), this.trackDuration);
  }

  public getDuration(): number { return this.trackDuration; }
  public getCurrentBuffer(): AudioBuffer | null { return this.currentBuffer; }
  public isPlaybackActive(): boolean { return this.isStarted && !this.isPaused; }


  public setMasterVolume(val: number): void {
    if (this.masterGain) this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx?.currentTime || 0);
  }

  public setMusicVolume(val: number): void {
    if (this.musicGain) this.musicGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx?.currentTime || 0);
  }

  public setSfxVolume(val: number): void {
    if (this.sfxGain) this.sfxGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx?.currentTime || 0);
  }

  public playSfx(type: SfxName): void {
    const ctx = this.ensureContext();
    if (this.sfxGain) DiscoSfx.play(ctx, this.sfxGain, type);
  }

  public onStateChange(listener: AudioStateListener): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private notifyState(state: AudioState) {
    this.stateListeners.forEach((l) => l(state));
  }
}
