export type Direction = 'left' | 'up' | 'right' | 'down';

export interface RhythmCommand {
  direction: Direction;
  offset: number;
  fake?: boolean;
}

export interface CommandRound {
  id: string;
  sectionId: string;
  demoStart: number;
  responseStart: number;
  commands: RhythmCommand[];
  difficulty?: number;
}

export interface MusicSection {
  id: string;
  label: string;
  startTime: number;
  endTime: number;
  bpm: number;
  beatOffset: number;
  transitionIn?: number;
  transitionOut?: number;
}

export interface TransitionZone {
  id: string;
  startTime: number;
  endTime: number;
  label?: string;
}

export interface HitWindows {
  perfect: number;
  great: number;
  good: number;
}

export interface Level3Config {
  sections: MusicSection[];
  transitions: TransitionZone[];
  rounds: CommandRound[];
  hitWindows: HitWindows;
  inputLatencyOffset: number;
  sequenceBonus: number;
  clearAccuracyThreshold: number;
}

export type GamePhase =
  | 'intro'
  | 'watch'
  | 'get-ready'
  | 'response'
  | 'round-result'
  | 'transition'
  | 'finished';

export type DJQuackPose =
  | 'idle'
  | 'demo-left'
  | 'demo-up'
  | 'demo-right'
  | 'demo-down'
  | 'player-left'
  | 'player-up'
  | 'player-right'
  | 'player-down'
  | 'miss'
  | 'wrong-move'
  | 'full-groove'
  | 'celebrate'
  | 'special';

export type JudgementRating = 'perfect' | 'great' | 'good' | 'miss' | 'wrong' | 'early';

export interface CommandJudgement {
  roundId: string;
  commandIndex: number;
  direction: Direction;
  rating: JudgementRating;
  deltaMs: number;
  scoreGained: number;
  isFake: boolean;
}

export interface Level3Summary {
  score: number;
  accuracy: number;
  perfect: number;
  great: number;
  good: number;
  miss: number;
  wrongMoves: number;
  maxCombo: number;
  fullGrooves: number;
  cleared: boolean;
}
