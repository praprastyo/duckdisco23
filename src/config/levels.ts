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
    dateDisplay: 'MISI 1',
    subtitle: 'Pesta Pantai Disko • Buka Petunjuk Pertama',
    environmentName: 'Sunset Duck Beach Stage',
    song: songs.level1,
    collectibleName: 'BULU PELANGI',
    collectibleKey: 'rainbowFeather',
    visualIntensity: 0.35,
    difficulty: 'IRAMA PANTAI • 79 BPM',
    instructions: [
      'Ikuti koreografi panah: ← Geser, ↑ Melompat, → Putar Sayap, ↓ Tunduk Santai.',
      'Tekan tombol panah tepat saat nada menyentuh garis dansa.',
      'Jaga kombo untuk membuka petunjuk hadiah pertama!',
    ],
  },
  {
    id: 'level2',
    levelNumber: 2,
    title: 'DJ QUACK SCRATCH',
    dateDisplay: 'MISI 2',
    subtitle: 'Meja DJ Disko • Ketuk & Tahan Piringan Hitam',
    environmentName: 'DJ Booth & Turntable',
    song: songs.level2,
    collectibleName: 'VINIL EMAS',
    collectibleKey: 'goldenVinyl',
    visualIntensity: 0.50,
    difficulty: 'BOOGIE SCRATCH • 118 BPM',
    instructions: [
      'KETUK pada ketukan tunggal.',
      'TAHAN piringan hitam saat irama melambat.',
      'LEPASKAN tepat waktu untuk scratch dan raih petunjuk kedua!',
    ],
  },
  {
    id: 'level3',
    levelNumber: 3,
    title: 'DUCK FLOOR FEVER',
    dateDisplay: 'MISI 3',
    subtitle: 'Lantai Dansa Neon • Uji Ingatan Ritme',
    environmentName: 'Reactive Disco Floor',
    song: songs.level3,
    collectibleName: 'BULU CERMIN KILAU',
    collectibleKey: 'mirrorFeather',
    visualIntensity: 0.75,
    difficulty: 'NU-DISCO FEVER • 126 BPM',
    instructions: [
      'Ikuti aba-aba ketukan yang muncul di lantai dansa.',
      'Tetap percaya diri dan dengarkan ketukan saat lampu meredup!',
      'Kumpulkan petunjuk ketiga sebelum babak buka kado!',
    ],
  },
  {
    id: 'level4',
    levelNumber: 4,
    title: 'REVEAL HADIAH SPESIAL',
    dateDisplay: 'MISI FINAL',
    subtitle: 'Panggung Utama • Babak Penentuan Hadiah 3D',
    environmentName: 'Grand Main Stage',
    song: songs.level4,
    collectibleName: 'KADO SPESIAL 3D',
    visualIntensity: 1.00,
    difficulty: 'BABAK FINAL • 124 BPM',
    instructions: [
      'Kombinasi tarian formasi akbar di panggung utama!',
      'Raih skor minimal 70.000 pts & akurasi 75% untuk memecahkan telur kejutan.',
      'Buka dan nikmati hadiah spesial ulang tahunmu!',
    ],
  },
];

export function getLevelConfig(levelId: string): LevelConfig | undefined {
  return LEVELS.find((l) => l.id === levelId);
}
