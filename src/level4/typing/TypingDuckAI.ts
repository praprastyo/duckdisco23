import { TOTAL_STORY_CHARS } from './TypingEngine';

export class TypingDuckAI {
  private completedChars: number = 0;
  private currentWpm: number = 60;
  private timeSinceLastFluctuation: number = 0;
  private hesitationRemaining: number = 0;

  public reset(): void {
    this.completedChars = 0;
    this.currentWpm = 60;
    this.timeSinceLastFluctuation = 0;
    this.hesitationRemaining = 0;
  }

  public update(deltaSec: number): {
    completedChars: number;
    currentWpm: number;
    progressPercent: number;
  } {
    this.timeSinceLastFluctuation += deltaSec;

    // Every 4-7 seconds, randomly adjust WPM around the 60 WPM trend (45 - 75 WPM)
    if (this.timeSinceLastFluctuation > 4.5 + Math.random() * 3) {
      this.timeSinceLastFluctuation = 0;
      // Normal distribution around 60: 45 to 75
      const fluctuation = (Math.random() - 0.5) * 26; // -13 to +13
      this.currentWpm = Math.min(75, Math.max(45, Math.round(60 + fluctuation)));

      // Occasional brief 0.3s - 0.6s hesitation (pause for punctuation or paper adjustment)
      if (Math.random() < 0.3) {
        this.hesitationRemaining = 0.3 + Math.random() * 0.4;
      }
    }

    if (this.hesitationRemaining > 0) {
      this.hesitationRemaining -= deltaSec;
    } else {
      // WPM to characters per second: 1 word = 5 characters
      // charsPerSec = (WPM * 5) / 60 = WPM / 12
      const charsPerSec = (this.currentWpm * 5) / 60;
      this.completedChars = Math.min(
        TOTAL_STORY_CHARS,
        this.completedChars + charsPerSec * deltaSec
      );
    }

    const progressPercent = Math.min(
      100,
      Math.round((this.completedChars / TOTAL_STORY_CHARS) * 100)
    );

    return {
      completedChars: Math.floor(this.completedChars),
      currentWpm: this.currentWpm,
      progressPercent,
    };
  }

  public getCompletedChars(): number {
    return Math.floor(this.completedChars);
  }

  public getProgress(): number {
    return Math.min(100, Math.round((this.completedChars / TOTAL_STORY_CHARS) * 100));
  }
}
