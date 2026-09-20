import { AudioEngine } from '../audio/AudioEngine';
import { BeatClock } from '../audio/BeatClock';
import { BeatmapRunner, BeatmapEvent, BeatmapData } from './BeatmapRunner';
import { InputManager, InputAction } from './InputManager';
import { ScoringEngine, ScoreSummary } from './ScoringEngine';
import { JudgementType, getScoringWindows } from '../config/scoring';


export type GameStatus = 'loading' | 'readyToStart' | 'playing' | 'paused' | 'completed' | 'failed' | 'error';

export interface JudgementEvent {
  judgement: JudgementType;
  deltaMs: number;
  points: number;
  combo: number;
  score: number;
  event?: BeatmapEvent;
}

export class RhythmEngine {
  private audioEngine = AudioEngine.getInstance();
  private beatClock = new BeatClock();
  private beatmapRunner: BeatmapRunner;
  private inputManager = new InputManager();
  private scoringEngine: ScoringEngine;

  private status: GameStatus = 'loading';
  private frameId: number | null = null;
  private isAutoplay = false;
  private maxMisses = 10;

  private onJudgementCb: ((e: JudgementEvent) => void) | null = null;
  private onCueCb: ((e: BeatmapEvent) => void) | null = null;
  private onStatusCb: ((s: GameStatus) => void) | null = null;
  private onCompleteCb: ((summary: ScoreSummary) => void) | null = null;
  private onInputCb: ((action: InputAction) => void) | null = null;

  constructor(timingOffsetMs = 0, levelId = 'level1') {
    const windows = getScoringWindows(levelId);
    this.beatmapRunner = new BeatmapRunner(windows);
    this.scoringEngine = new ScoringEngine(windows);
    this.inputManager.setLatencyOffset(timingOffsetMs);
    if (levelId === 'level2') {
      this.maxMisses = 999999; // Allow completing full track on Level 2 Quack Beat Pop
    }
    this.setupListeners();
  }

  private setupListeners() {
    this.beatmapRunner.onCue((ev) => this.onCueCb?.(ev));
    this.beatmapRunner.onMiss((ev) => {
      const res = this.scoringEngine.registerMiss();
      this.audioEngine.playSfx('miss');
      this.onJudgementCb?.({
        judgement: res.judgement,
        deltaMs: 0,
        points: 0,
        combo: this.scoringEngine.getCurrentCombo(),
        score: this.scoringEngine.getScore(),
        event: ev,
      });
      this.checkMissLimit();
    });
    this.inputManager.subscribe((action) => {
      if (this.status !== 'playing' || this.isAutoplay) return;
      this.onInputCb?.(action);
      this.handlePlayerAction(action);
    });
  }



  public async initializeLevel(trackUrl: string, beatmapData: BeatmapData): Promise<void> {
    this.stop();
    this.setStatus('loading');
    try {
      await this.audioEngine.loadTrack(trackUrl);
      this.beatClock.setConfig(beatmapData.bpm, beatmapData.offset);
      this.beatmapRunner.load(beatmapData);
      this.scoringEngine.reset();
      this.setStatus('readyToStart');
    } catch (err) {
      console.error('Level load err:', err);
      this.setStatus('error');
      throw err;
    }
  }

  public start(): void {
    if (this.status !== 'readyToStart') return;
    this.inputManager.attach(window);
    this.audioEngine.play(0, () => this.handleTrackComplete());
    this.setStatus('playing');
    this.startLoop();
  }

  public pause(): void {
    if (this.status !== 'playing') return;
    this.audioEngine.pause();
    this.setStatus('paused');
  }

  public resume(): void {
    if (this.status !== 'paused') return;
    this.audioEngine.resume();
    this.setStatus('playing');
    this.startLoop();
  }

  public restart(): void {
    this.stop();
    this.scoringEngine.reset();
    this.beatClock.reset(0);
    this.beatmapRunner.reset(0);
    this.setStatus('readyToStart');
    this.start();
  }

  public stop(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.audioEngine.stop();
    this.inputManager.detach();
  }

  private startLoop() {
    const loop = () => {
      if (this.status === 'playing') {
        const time = this.audioEngine.getCurrentTime();
        this.beatClock.update(time);
        this.audioEngine.getAnalyser().update();

        if (this.isAutoplay) {
          const target = this.beatmapRunner.getActiveTarget(time);
          if (target && Math.abs(target.deltaSec) <= 0.015) {
            this.handlePlayerAction('tap');
          }
        }
        this.beatmapRunner.update(time);
        this.frameId = requestAnimationFrame(loop);
      }
    };
    this.frameId = requestAnimationFrame(loop);
  }

  public handlePlayerAction(action: InputAction = 'tap') {
    const time = this.audioEngine.getCurrentTime() - this.inputManager.getLatencyOffsetSec();
    // Match only targets corresponding to this action/direction
    const target = this.beatmapRunner.getActiveTarget(time, action);
    if (!target) {
      this.audioEngine.playSfx('miss');
      return;
    }

    const ev = target.event;
    this.beatmapRunner.markHit(ev.id);
    const result = this.scoringEngine.judge(target.deltaSec);

    if (result.judgement !== 'miss') {
      const cue = ev.cue;
      if (cue === 'quack') this.audioEngine.playSfx('quack');
      else if (cue === 'scratch') this.audioEngine.playSfx('scratch');
      else if (cue === 'clap') this.audioEngine.playSfx('clap');
      else this.audioEngine.playSfx('cowbell');
    } else {
      this.audioEngine.playSfx('miss');
      this.checkMissLimit();
    }

    this.onJudgementCb?.({
      judgement: result.judgement,
      deltaMs: result.deltaMs,
      points: result.points,
      combo: this.scoringEngine.getCurrentCombo(),
      score: this.scoringEngine.getScore(),
      event: target.event,
    });
  }

  /**
   * Handle direct 2D target click for Level 2 (Quack Beat Pop / OSU-style)
   */
  public handleTargetClick(noteId: string, clickTime?: number): JudgementEvent | null {
    if (this.status !== 'playing') return null;

    const ev = this.beatmapRunner.getEvent(noteId);
    if (!ev || this.beatmapRunner.isHit(noteId)) return null;

    const time = (clickTime ?? this.audioEngine.getCurrentTime()) - this.inputManager.getLatencyOffsetSec();
    const deltaSec = time - ev.time;

    const result = this.scoringEngine.judge(deltaSec);
    this.beatmapRunner.markHit(noteId);

    if (result.judgement !== 'miss') {
      this.audioEngine.playSfx('cowbell');
    } else {
      this.audioEngine.playSfx('miss');
      this.checkMissLimit();
    }

    const jEv: JudgementEvent = {
      judgement: result.judgement,
      deltaMs: result.deltaMs,
      points: result.points,
      combo: this.scoringEngine.getCurrentCombo(),
      score: this.scoringEngine.getScore(),
      event: ev,
    };

    this.onJudgementCb?.(jEv);
    return jEv;
  }

  private checkMissLimit() {
    if (this.scoringEngine.getMissCount() >= this.maxMisses && this.status === 'playing') {
      this.handleStageFailed();
    }
  }

  private handleStageFailed() {
    this.stop();
    this.audioEngine.playSfx('scratch');
    this.setStatus('failed');
  }

  private handleTrackComplete() {
    this.setStatus('completed');
    this.onCompleteCb?.(this.scoringEngine.getSummary());
  }

  public getBeatClock() { return this.beatClock; }
  public getAudioEngine() { return this.audioEngine; }
  public getBeatmapRunner() { return this.beatmapRunner; }
  public getScoringEngine() { return this.scoringEngine; }
  public getStatus() { return this.status; }
  public getMaxMisses() { return this.maxMisses; }
  public setMaxMisses(val: number) { this.maxMisses = val; }
  public setAutoplay(v: boolean) { this.isAutoplay = v; }
  public getAutoplay() { return this.isAutoplay; }


  public onJudgement(cb: (e: JudgementEvent) => void) { this.onJudgementCb = cb; }
  public onCue(cb: (e: BeatmapEvent) => void) { this.onCueCb = cb; }
  public onStatusChange(cb: (s: GameStatus) => void) { this.onStatusCb = cb; }
  public onInput(cb: (a: InputAction) => void) { this.onInputCb = cb; }
  public onComplete(cb: (s: ScoreSummary) => void) { this.onCompleteCb = cb; }


  private setStatus(s: GameStatus) {
    this.status = s;
    this.onStatusCb?.(s);
  }
}
