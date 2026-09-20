export interface SectionDef {
  id: string;
  name: string;
  start: number; // in seconds
  end: number;
}

export type BeatListener = (beatNumber: number, time: number) => void;
export type BarListener = (barNumber: number, time: number) => void;
export type SectionListener = (section: SectionDef, time: number) => void;

export class BeatClock {
  private bpm: number = 120;
  private offset: number = 0;
  private beatDuration: number = 0.5;

  private lastTime: number = 0;
  private currentBeat: number = 0;
  private currentBar: number = 0;
  private currentHalfBeat: number = 0;
  private currentQuarterBeat: number = 0;

  private sections: SectionDef[] = [];
  private activeSection: SectionDef | null = null;

  private beatListeners: Set<BeatListener> = new Set();
  private halfBeatListeners: Set<BeatListener> = new Set();
  private quarterBeatListeners: Set<BeatListener> = new Set();
  private barListeners: Set<BarListener> = new Set();
  private sectionListeners: Set<SectionListener> = new Set();

  public setConfig(bpm: number, offset: number, sections: SectionDef[] = []) {
    this.bpm = bpm;
    this.offset = offset;
    this.beatDuration = 60 / bpm;
    this.sections = sections;
    this.reset();
  }

  public reset(startTime: number = 0) {
    this.lastTime = startTime;
    const adjusted = Math.max(0, startTime - this.offset);
    this.currentBeat = Math.floor(adjusted / this.beatDuration);
    this.currentBar = Math.floor(this.currentBeat / 4);
    this.currentHalfBeat = Math.floor(adjusted / (this.beatDuration / 2));
    this.currentQuarterBeat = Math.floor(adjusted / (this.beatDuration / 4));
    this.activeSection = this.findSection(startTime);
  }

  public update(audioTime: number) {
    if (audioTime < this.lastTime) {
      // Audio looped or seeked backwards
      this.reset(audioTime);
      return;
    }

    const prevAdjusted = Math.max(0, this.lastTime - this.offset);
    const currAdjusted = Math.max(0, audioTime - this.offset);

    // Quarter beats
    const prevQuarter = Math.floor(prevAdjusted / (this.beatDuration / 4));
    const currQuarter = Math.floor(currAdjusted / (this.beatDuration / 4));
    if (currQuarter > prevQuarter) {
      for (let q = prevQuarter + 1; q <= currQuarter; q++) {
        this.quarterBeatListeners.forEach((l) => l(q, audioTime));
      }
      this.currentQuarterBeat = currQuarter;
    }

    // Half beats
    const prevHalf = Math.floor(prevAdjusted / (this.beatDuration / 2));
    const currHalf = Math.floor(currAdjusted / (this.beatDuration / 2));
    if (currHalf > prevHalf) {
      for (let h = prevHalf + 1; h <= currHalf; h++) {
        this.halfBeatListeners.forEach((l) => l(h, audioTime));
      }
      this.currentHalfBeat = currHalf;
    }

    // Full beats
    const prevBeat = Math.floor(prevAdjusted / this.beatDuration);
    const currBeat = Math.floor(currAdjusted / this.beatDuration);
    if (currBeat > prevBeat) {
      for (let b = prevBeat + 1; b <= currBeat; b++) {
        this.beatListeners.forEach((l) => l(b, audioTime));
      }
      this.currentBeat = currBeat;
    }

    // Bars (4 beats per bar)
    const prevBar = Math.floor(prevAdjusted / (this.beatDuration * 4));
    const currBar = Math.floor(currAdjusted / (this.beatDuration * 4));
    if (currBar > prevBar) {
      for (let bar = prevBar + 1; bar <= currBar; bar++) {
        this.barListeners.forEach((l) => l(bar, audioTime));
      }
      this.currentBar = currBar;
    }

    // Section transition
    const newSection = this.findSection(audioTime);
    if (newSection && (!this.activeSection || this.activeSection.id !== newSection.id)) {
      this.activeSection = newSection;
      this.sectionListeners.forEach((l) => l(newSection, audioTime));
    }

    this.lastTime = audioTime;
  }

  private findSection(time: number): SectionDef | null {
    return this.sections.find((s) => time >= s.start && time < s.end) || null;
  }

  // Listener subscriptions
  public onBeat(cb: BeatListener): () => void {
    this.beatListeners.add(cb);
    return () => this.beatListeners.delete(cb);
  }

  public onHalfBeat(cb: BeatListener): () => void {
    this.halfBeatListeners.add(cb);
    return () => this.halfBeatListeners.delete(cb);
  }

  public onQuarterBeat(cb: BeatListener): () => void {
    this.quarterBeatListeners.add(cb);
    return () => this.quarterBeatListeners.delete(cb);
  }

  public onBar(cb: BarListener): () => void {
    this.barListeners.add(cb);
    return () => this.barListeners.delete(cb);
  }

  public onSectionChange(cb: SectionListener): () => void {
    this.sectionListeners.add(cb);
    return () => this.sectionListeners.delete(cb);
  }

  public getBeatProgress(audioTime: number): number {
    const adjusted = Math.max(0, audioTime - this.offset);
    return (adjusted % this.beatDuration) / this.beatDuration;
  }

  public getCurrentBeat(): number {
    return this.currentBeat;
  }

  public getCurrentBar(): number {
    return this.currentBar;
  }

  public getBpm(): number {
    return this.bpm;
  }

  public getBeatDuration(): number {
    return this.beatDuration;
  }

  public clearAllListeners() {
    this.beatListeners.clear();
    this.halfBeatListeners.clear();
    this.quarterBeatListeners.clear();
    this.barListeners.clear();
    this.sectionListeners.clear();
  }
}
