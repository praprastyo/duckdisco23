export type Level4Scene =
  | 'splash'
  | 'ballroom'
  | 'typing'
  | 'puzzle'
  | 'shooter'
  | 'giftReveal'
  | 'letter';
export type BallroomIntroStage =
  | 'doors_open'
  | 'wide_disco_gift'
  | 'pan_typing_duck'
  | 'pan_puzzle_duck'
  | 'pan_cowboy_duck'
  | 'player_control_ready';

export type NpcInteractionState =
  | 'idle'
  | 'hovered'
  | 'approached'
  | 'talking'
  | 'challengePrompt'
  | 'playing'
  | 'completed';

export type RevealSuspenseStage =
  | 'initial_dark_mask'

  | 'inspect_closed'
  | 'anticipation_rumble'
  | 'box_tremors'
  | 'light_leak'
  | 'mystery_silhouette'
  | 'particle_buildup'
  | 'fakeout_blackout'
  | 'fakeout_quack'
  | 'final_flash'
  | 'envelope_closed'
  | 'envelope_unfolding'
  | 'letter_reading';


export type DuckNpcId = 'typing' | 'puzzle' | 'cowboy';

export type DuckNpcVariant =
  | 'idle'
  | 'type'
  | 'look'
  | 'aim'
  | 'talk'
  | 'shoot'
  | 'dance'
  | 'win'
  | 'lose';

export interface GameProgress {
  typingCompleted: boolean;
  puzzleCompleted: boolean;
  shooterCompleted: boolean;
}

export interface Level4SaveData extends GameProgress {
  finalGiftUnlocked: boolean;
  finalGiftOpened: boolean;
}

// --- Typing Battle Types ---
export interface TypingLineState {
  index: number;
  text: string;
}

export interface TypingRaceState {
  currentLineIndex: number;
  playerInput: string;
  playerMistakes: number; // Max 3
  playerCorrectChars: number;
  playerWpm: number;
  playerProgress: number; // 0 - 100%
  aiProgress: number; // 0 - 100%
  aiWpm: number;
  isComplete: boolean;
  isGameOver: boolean;
  gameOverReason: 'duck_won' | 'too_many_mistakes' | null;
  startTime: number | null;
  requireEnter: boolean;
}

// --- Puzzle Conversation Types ---
export interface PuzzleQuestion {
  id: number;
  question: string;
  answers: string[];
}

export interface PuzzleState {
  questions: PuzzleQuestion[];
  currentIndex: number;
  mistakes: number; // Max 3
  currentInput: string;
  feedbackText: string | null;
  feedbackType: 'correct' | 'wrong' | 'idle';
  isComplete: boolean;
  isGameOver: boolean;
}

// --- Concentration Shooter Types ---
export type TargetType = 'bottle' | 'cocktail' | 'poop' | 'cactus';

export interface ShooterTarget {
  id: string;
  type: TargetType;
  x: number; // 0 - 100 percentage
  y: number; // 0 - 100 percentage
  velocityX: number;
  velocityY: number;
  spawnTime: number;
  scale: number;
  rotation: number;
  active: boolean;
  points: number; // +1 or -1
}

export interface ShooterGameState {
  timeRemaining: number; // 60 -> 0
  playerScore: number;
  cowboyScore: number;
  activeTargets: ShooterTarget[];
  isComplete: boolean;
  isGameOver: boolean;
  playerWon: boolean;
}

// --- 3D Gift & Letter Types ---
export interface GiftDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface GiftTexturesConfig {
  front: string;
  back: string;
  left: string;
  right: string;
  top: string;
  bottom: string;
}

export interface FinalLetterConfig {
  title: string;
  subtitle?: string;
  paragraphs: string[];
  signature: string;
}
