import { SCORING_WINDOWS, ScoringWindows, JUDGEMENT_SCORES, JUDGEMENT_ACCURACY_WEIGHTS, JudgementType, getGradeTier, FinalGradeConfig } from '../config/scoring';

export interface ScoreSummary {
  score: number;
  accuracy: number;
  perfect: number;
  great: number;
  good: number;
  miss: number;
  currentCombo: number;
  maxCombo: number;
  grade: FinalGradeConfig;
  cleared: boolean;
}

export class ScoringEngine {
  private score: number = 0;
  private currentCombo: number = 0;
  private maxCombo: number = 0;
  private perfectCount: number = 0;
  private greatCount: number = 0;
  private goodCount: number = 0;
  private missCount: number = 0;

  private windows: ScoringWindows = SCORING_WINDOWS;

  constructor(windows?: ScoringWindows) {
    if (windows) this.windows = windows;
  }

  public reset(): void {
    this.score = 0;
    this.currentCombo = 0;
    this.maxCombo = 0;
    this.perfectCount = 0;
    this.greatCount = 0;
    this.goodCount = 0;
    this.missCount = 0;
  }

  /**
   * Judge a player action against target time
   * deltaSec = (audioTime - targetTime)
   */
  public judge(deltaSec: number): { judgement: JudgementType; deltaMs: number; points: number } {
    const absDelta = Math.abs(deltaSec);
    const deltaMs = Math.round(deltaSec * 1000);

    let judgement: JudgementType = 'miss';
    if (absDelta <= this.windows.perfect) {
      judgement = 'perfect';
    } else if (absDelta <= this.windows.great) {
      judgement = 'great';
    } else if (absDelta <= this.windows.good) {
      judgement = 'good';
    }

    const points = this.applyJudgement(judgement);
    return { judgement, deltaMs, points };
  }

  public registerMiss(): { judgement: JudgementType; deltaMs: number; points: number } {
    this.applyJudgement('miss');
    return { judgement: 'miss', deltaMs: 0, points: 0 };
  }

  private applyJudgement(judgement: JudgementType): number {
    let basePoints = JUDGEMENT_SCORES[judgement];

    if (judgement === 'perfect' || judgement === 'great') {
      this.currentCombo++;
      if (this.currentCombo > this.maxCombo) {
        this.maxCombo = this.currentCombo;
      }
      // Combo multiplier bonus up to 2.0x
      const comboMult = 1 + Math.min(1.0, this.currentCombo * 0.05);
      basePoints = Math.round(basePoints * comboMult);
    } else if (judgement === 'good') {
      // Good keeps combo alive without incrementing
    } else {
      // Miss breaks combo
      this.currentCombo = 0;
    }

    if (judgement === 'perfect') this.perfectCount++;
    else if (judgement === 'great') this.greatCount++;
    else if (judgement === 'good') this.goodCount++;
    else this.missCount++;

    this.score += basePoints;
    return basePoints;
  }

  public getAccuracy(): number {
    const total = this.perfectCount + this.greatCount + this.goodCount + this.missCount;
    if (total === 0) return 100.0;
    const weighted =
      this.perfectCount * JUDGEMENT_ACCURACY_WEIGHTS.perfect +
      this.greatCount * JUDGEMENT_ACCURACY_WEIGHTS.great +
      this.goodCount * JUDGEMENT_ACCURACY_WEIGHTS.good;
    return Number(((weighted / total) * 100).toFixed(1));
  }

  public getSummary(): ScoreSummary {
    const accuracy = this.getAccuracy();
    const grade = getGradeTier(accuracy);
    return {
      score: this.score,
      accuracy,
      perfect: this.perfectCount,
      great: this.greatCount,
      good: this.goodCount,
      miss: this.missCount,
      currentCombo: this.currentCombo,
      maxCombo: this.maxCombo,
      grade,
      cleared: grade.cleared,
    };
  }

  public getCurrentCombo(): number { return this.currentCombo; }
  public getMaxCombo(): number { return this.maxCombo; }
  public getScore(): number { return this.score; }
  public getMissCount(): number { return this.missCount; }
  public getPerfectCount(): number { return this.perfectCount; }
}

