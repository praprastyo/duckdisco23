export interface ScoringWindows {
  perfect: number; // in seconds
  great: number;
  good: number;
}

// Default tactile windows for Levels 2-4
export const SCORING_WINDOWS: ScoringWindows = {
  perfect: 0.060, // <= 60ms
  great: 0.110,   // <= 110ms
  good: 0.170,    // <= 170ms
};

// Forgiving windows for the Level 1 dance tutorial (widened for easy hits)
export const SCORING_WINDOWS_L1: ScoringWindows = {
  perfect: 0.130, // <= 130ms
  great: 0.220,   // <= 220ms
  good: 0.340,    // <= 340ms
};

export const SCORING_WINDOWS_BY_LEVEL: Record<string, ScoringWindows> = {
  level1: SCORING_WINDOWS_L1,
  level2: SCORING_WINDOWS,
  level3: SCORING_WINDOWS,
  level4: SCORING_WINDOWS,
};

export function getScoringWindows(levelId: string): ScoringWindows {
  return SCORING_WINDOWS_BY_LEVEL[levelId] ?? SCORING_WINDOWS;
}

export const JUDGEMENT_SCORES = {
  perfect: 1000,
  great: 750,
  good: 400,
  miss: 0,
};

export const JUDGEMENT_ACCURACY_WEIGHTS = {
  perfect: 1.0,
  great: 0.8,
  good: 0.5,
  miss: 0.0,
};

export type JudgementType = 'perfect' | 'great' | 'good' | 'miss';

export interface FinalGradeConfig {
  grade: 'PERFECT' | 'SUPERB' | 'GREAT' | 'GOOD' | 'NEED_PRACTICE';
  label: string;
  minAccuracy: number;
  cleared: boolean;
  color: string;
}

export const GRADE_TIERS: FinalGradeConfig[] = [
  { grade: 'PERFECT', label: 'FLAWLESS FEATHER!', minAccuracy: 98, cleared: true, color: '#facc15' },
  { grade: 'SUPERB', label: 'DISCO LEGEND!', minAccuracy: 90, cleared: true, color: '#e879f9' },
  { grade: 'GREAT', label: 'FUNKY DANCER!', minAccuracy: 75, cleared: true, color: '#38bdf8' },
  { grade: 'GOOD', label: 'IN THE GROOVE!', minAccuracy: 60, cleared: true, color: '#4ade80' },
  { grade: 'NEED_PRACTICE', label: 'OFF-BEAT QUACK...', minAccuracy: 0, cleared: false, color: '#f87171' },
];

export function getGradeTier(accuracy: number): FinalGradeConfig {
  for (const tier of GRADE_TIERS) {
    if (accuracy >= tier.minAccuracy) {
      return tier;
    }
  }
  return GRADE_TIERS[GRADE_TIERS.length - 1];
}
