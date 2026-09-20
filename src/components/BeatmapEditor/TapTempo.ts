/**
 * TapTempo
 * Measures user tap intervals to compute BPM accurately.
 */
export class TapTempo {
  private taps: number[] = [];

  public tap(): number | null {
    const now = performance.now();
    // Reset if last tap was more than 2.5 seconds ago
    if (this.taps.length > 0 && now - this.taps[this.taps.length - 1] > 2500) {
      this.taps = [];
    }
    this.taps.push(now);

    if (this.taps.length < 3) return null;

    // Calculate average interval between consecutive taps
    const intervals: number[] = [];
    for (let i = 1; i < this.taps.length; i++) {
      intervals.push(this.taps[i] - this.taps[i - 1]);
    }

    const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const bpm = Math.round(60000 / avgMs);
    return Math.max(40, Math.min(240, bpm));
  }

  public reset() {
    this.taps = [];
  }
}
