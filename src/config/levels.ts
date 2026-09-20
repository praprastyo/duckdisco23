import { songs, SongConfig } from './songs';

export interface LevelConfig {
  id: 'level1' | 'level2' | 'level3' | 'level4';
  levelNumber: number;
  title: string;
  dateDisplay: string;
  subtitle: string;
  environmentName: string;
  song: SongConfig;
  collectibleName: string;
  collectibleKey?: 'neonFeather' | 'rainbowFeather' | 'goldenVinyl' | 'mirrorFeather';
  visualIntensity: number;
  difficulty: string;
  instructions: string[];
}

export const LEVELS: LevelConfig[] = [
  {
    id: 'level1',
    levelNumber: 1,
    title: 'QUACK DANCE PARTY',
    dateDisplay: 'QUEST 01',
    subtitle: 'Beach Disco Groove • Rhythm Dance',
    environmentName: 'Sunset Duck Beach Stage',
    song: songs.level1,
    collectibleName: 'RAINBOW FEATHER',
    collectibleKey: 'rainbowFeather',
    visualIntensity: 0.35,
    difficulty: 'BEACH GROOVE • 79 BPM',
    instructions: [
      'Follow the dance cues: ← Slide, ↑ Jump, → Wing Spin, ↓ Low Groove.',
      'Hit the matching arrow key right as notes touch the Dance Line.',
      'Keep your combo alive to unlock the first clue!',
    ],
  },
  {
    id: 'level2',
    levelNumber: 2,
    title: 'QUACK BEAT POP',
    dateDisplay: 'QUEST 02',
    subtitle: 'Target Clicking • Pop The Beats',
    environmentName: 'Neon Duck Disco Arcade',
    song: songs.level2,
    collectibleName: 'TURBO VINYL',
    collectibleKey: 'goldenVinyl',
    visualIntensity: 0.55,
    difficulty: 'MEDIUM–HARD • 146 BPM',
    instructions: [
      'Click or tap circular rhythm targets right as the approach ring closes in!',
      'Follow the sequence numbers (1, 2, 3...) across the playfield.',
      'Maintain your combo and reach ≥ 70% accuracy to unlock Turbo Vinyl!',
    ],
  },
  {
    id: 'level3',
    levelNumber: 3,
    title: 'DUCK FLOOR FEVER',
    dateDisplay: 'QUEST 03',
    subtitle: 'Neon Dance Floor • Memory & Beat Reflexes',
    environmentName: 'Reactive Disco Floor',
    song: songs.level3,
    collectibleName: 'MIRROR FEATHER',
    collectibleKey: 'mirrorFeather',
    visualIntensity: 0.75,
    difficulty: 'NU-DISCO FEVER • 126 BPM',
    instructions: [
      'Follow the rhythmic cues flashed across the disco floor.',
      'Trust your ears and maintain your groove when lights dim!',
      'Collect the final clue before the grand birthday reveal!',
    ],
  },
  {
    id: 'level4',
    levelNumber: 4,
    title: 'SPECIAL GIFT REVEAL',
    dateDisplay: 'FINAL QUEST',
    subtitle: 'Grand Main Stage • The 3D Birthday Gift Reveal',
    environmentName: 'Grand Main Stage',
    song: songs.level4,
    collectibleName: '3D SPECIAL GIFT',
    visualIntensity: 1.00,
    difficulty: 'GRAND FINALE • 124 BPM',
    instructions: [
      'Master the combined formation dance on the grand stage!',
      'Score ≥ 70,000 pts & ≥ 75% accuracy to crack the golden egg.',
      'Reveal your special 3D birthday surprise!',
    ],
  },
];

export function getLevelConfig(levelId: string): LevelConfig | undefined {
  return LEVELS.find((l) => l.id === levelId);
}
