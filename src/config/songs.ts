export interface SongConfig {
  id: string;
  title: string;
  src: string;
  bpm: number;
  beatOffset: number;
  intensity: {
    bassMultiplier: number;
    midMultiplier: number;
    highMultiplier: number;
    pulseStrength: number;
    particleStrength: number;
    laserStrength: number;
  };
  beatmap: string;
}

export const songs: Record<string, SongConfig> = {
  level1: {
    id: 'level1',
    title: 'Beach Disco Groove',
    // Swap to '/audio/level-1.mp4' to use your own MP4 soundtrack instead.
    src: '/audio/level-1.mp3',
    bpm: 79,
    beatOffset: 0.20,
    intensity: {
      bassMultiplier: 0.8,
      midMultiplier: 0.65,
      highMultiplier: 0.5,
      pulseStrength: 0.45,
      particleStrength: 0.3,
      laserStrength: 0.15,
    },
    beatmap: '/beatmaps/level1.json',
  },

  level2: {
    id: 'level2',
    title: 'Jumping Machine (WUKONG Remix)',
    src: '/audio/level-2.mp3',
    bpm: 146,
    beatOffset: 0,
    intensity: {
      bassMultiplier: 1.1,
      midMultiplier: 0.9,
      highMultiplier: 0.8,
      pulseStrength: 0.8,
      particleStrength: 0.6,
      laserStrength: 0.5,
    },
    beatmap: '/beatmaps/level2.json',
  },

  level3: {
    id: 'level3',
    title: 'Duck Floor Command (Trilogy Dance Battle)',
    src: '/audio/level-3.mp3',
    bpm: 115,
    beatOffset: 0,
    intensity: {
      bassMultiplier: 1.1,
      midMultiplier: 1,
      highMultiplier: 1,
      pulseStrength: 0.85,
      particleStrength: 0.75,
      laserStrength: 0.85,
    },
    beatmap: '/beatmaps/level3.json',
  },

  level4: {
    id: 'level4',
    title: 'Disco Duck Grand Anthem & Reveal',
    src: '/audio/level-4.mp3',
    bpm: 124,
    beatOffset: 0.15,
    intensity: {
      bassMultiplier: 1.3,
      midMultiplier: 1.2,
      highMultiplier: 1.2,
      pulseStrength: 1,
      particleStrength: 1,
      laserStrength: 1,
    },
    beatmap: '/beatmaps/level4.json',
  },
};
