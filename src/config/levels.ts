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
  collectibleKey?: 'neonFeather' | 'goldenVinyl' | 'mirrorFeather';
  visualIntensity: number;
  difficulty: string;
  instructions: string[];
}

export const LEVELS: LevelConfig[] = [
  {
    id: 'level1',
    levelNumber: 1,
    title: 'NEON DISCO BEACH WALK',
    dateDisplay: '20 SEP 2026',
    subtitle: 'Sunset Beach • Obstacle Rhythm Timing',
    environmentName: 'Retro Neon Beach',
    song: songs.level1,
    collectibleName: 'NEON FEATHER',
    collectibleKey: 'neonFeather',
    visualIntensity: 0.35,
    difficulty: 'BEACH GROOVE • 108 BPM',
    instructions: [
      'DJ Quack berjalan santai menyusuri pantai disko.',
      'Perhatikan kepiting neon atau bola pantai yang berjalan menghampiri.',
      'Tekan SPACEBAR / TAP tepat saat obstacle masuk ke dalam LINGKARAN TARGET!',
    ],
  },
  {
    id: 'level2',
    levelNumber: 2,
    title: 'DJ QUACK SCRATCH',
    dateDisplay: '21 SEP 2026',
    subtitle: 'DJ Booth • Tap, Hold & Vinyl Scratch',
    environmentName: 'DJ Booth & Turntable',
    song: songs.level2,
    collectibleName: 'GOLDEN VINYL',
    collectibleKey: 'goldenVinyl',
    visualIntensity: 0.50,
    difficulty: 'BOOGIE SCRATCH • 118 BPM',
    instructions: [
      'TAP on single beats.',
      'HOLD the vinyl to slow the groove.',
      'RELEASE precisely on cue for the record scratch!',
    ],
  },
  {
    id: 'level3',
    levelNumber: 3,
    title: 'DUCK FLOOR FEVER',
    dateDisplay: '22 SEP 2026',
    subtitle: 'Dance Floor • Multi-Cue & Blackout Memory',
    environmentName: 'Reactive Disco Floor',
    song: songs.level3,
    collectibleName: 'MIRROR FEATHER',
    collectibleKey: 'mirrorFeather',
    visualIntensity: 0.75,
    difficulty: 'NU-DISCO FEVER • 126 BPM',
    instructions: [
      'SHAKE = 2 beats later. SPIN = 1 beat later.',
      'QUACK = immediate. CLAP = offbeat.',
      'Trust your ears when the disco lights black out!',
    ],
  },
  {
    id: 'level4',
    levelNumber: 4,
    title: 'DISCO DUCK REMIX',
    dateDisplay: '23 SEP 2026',
    subtitle: 'Main Stage • The Grand Finale & Reveal',
    environmentName: 'Grand Main Stage',
    song: songs.level4,
    collectibleName: 'THE GOLDEN DISCO DUCK',
    visualIntensity: 1.00,
    difficulty: 'GRAND FINALE • 124 BPM',
    instructions: [
      'Rapidly alternating mechanics from all 3 nights!',
      'Nail the silent drop hit to crack the Golden Egg.',
      'Unlock the legendary 3D prize reveal!',
    ],
  },
];

export function getLevelConfig(levelId: string): LevelConfig | undefined {
  return LEVELS.find((l) => l.id === levelId);
}
