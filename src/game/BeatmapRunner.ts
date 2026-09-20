import { SCORING_WINDOWS, ScoringWindows } from '../config/scoring';

export type DanceDirection = 'left' | 'right' | 'up' | 'down';

export interface BeatmapEvent {
  id: string;
  time: number;
  cueTime?: number;
  endTime?: number;
  action: 'tap' | 'hold' | 'release' | 'special';
  cue?: string;
  promptText?: string;
  lane?: 'left' | 'mid' | 'right';
  obstacleType?: string;
  direction?: DanceDirection;
  bar?: number;
  beat?: number;
}


export interface BeatmapData {
  bpm: number;
  offset: number;
  duration?: number;
  events: BeatmapEvent[];
}

export class BeatmapRunner {
  private events: BeatmapEvent[] = [];
  private lastAudioTime: number = 0;
  private nextCueIndex: number = 0;
  private nextHitIndex: number = 0;
  private hitStates: Map<string, boolean> = new Map();
  private windows: ScoringWindows = SCORING_WINDOWS;

  private onCueCallback: ((event: BeatmapEvent) => void) | null = null;
  private onMissCallback: ((event: BeatmapEvent) => void) | null = null;

  constructor(windows?: ScoringWindows) {
    if (windows) this.windows = windows;
  }

  public load(data: BeatmapData): void {
    // Sort events strictly by target time
    this.events = [...data.events].sort((a, b) => a.time - b.time);
    this.reset();
  }

  public reset(startTime: number = 0): void {
    this.lastAudioTime = startTime;
    this.nextCueIndex = 0;
    this.nextHitIndex = 0;
    this.hitStates.clear();
  }

  public onCue(cb: (event: BeatmapEvent) => void): void {
    this.onCueCallback = cb;
  }

  public onMiss(cb: (event: BeatmapEvent) => void): void {
    this.onMissCallback = cb;
  }

  /**
   * Safe frame-drop update against audio playhead
   */
  public update(currentTime: number): void {
    if (currentTime < this.lastAudioTime) {
      // Seek backwards
      this.reset(currentTime);
      return;
    }

    // 1. Dispatch Cues
    while (this.nextCueIndex < this.events.length) {
      const ev = this.events[this.nextCueIndex];
      const cueTime = ev.cueTime ?? (ev.time - 0.5);
      if (currentTime >= cueTime) {
        this.onCueCallback?.(ev);
        this.nextCueIndex++;
      } else {
        break;
      }
    }

    // 2. Check for auto-misses on unhit past events
    const missThreshold = this.windows.good;
    while (this.nextHitIndex < this.events.length) {
      const ev = this.events[this.nextHitIndex];
      if (this.hitStates.get(ev.id)) {
        this.nextHitIndex++;
        continue;
      }

      if (currentTime > ev.time + missThreshold) {
        // Event window expired without valid hit
        this.hitStates.set(ev.id, true);
        this.onMissCallback?.(ev);
        this.nextHitIndex++;
      } else {
        break;
      }
    }

    this.lastAudioTime = currentTime;
  }

  /**
   * Find closest unhit event within interactive window.
   * If action is directional, only matches notes of that specific direction or directionless notes.
   * This prevents pressing 'left' from consuming or blocking an upcoming 'up' note.
   */
  public getActiveTarget(currentTime: number, action?: string): { event: BeatmapEvent; deltaSec: number } | null {
    const missThreshold = this.windows.good;
    const isDirectional = action === 'left' || action === 'right' || action === 'up' || action === 'down';

    for (let i = this.nextHitIndex; i < this.events.length; i++) {
      const ev = this.events[i];
      if (this.hitStates.get(ev.id)) continue;

      // Skip events requiring a different direction
      if (ev.direction && isDirectional && ev.direction !== action) {
        continue;
      }

      const deltaSec = currentTime - ev.time;
      if (Math.abs(deltaSec) <= missThreshold) {
        return { event: ev, deltaSec };
      }

      if (ev.time - currentTime > missThreshold * 2) {
        break;
      }
    }

    return null;
  }


  public markHit(eventId: string): void {
    this.hitStates.set(eventId, true);
  }

  public getEvents(): BeatmapEvent[] {
    return this.events;
  }

  public getProgress(currentTime: number): number {
    if (this.events.length === 0) return 0;
    const lastEventTime = this.events[this.events.length - 1].time;
    if (lastEventTime === 0) return 0;
    return Math.min(1.0, Math.max(0, currentTime / lastEventTime));
  }
}
