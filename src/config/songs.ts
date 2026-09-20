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
    title: 'Quack Check-In Funk',
    src: '/audio/level-1.mp3',
    bpm: 108,
    beatOffset: 0.18,
    intensity: {
      bassMultiplier: 0.7,
      midMultiplier: 0.6,
      highMultiplier: 0.5,
      pulseStrength: 0.45,
      particleStrength: 0.25,
      laserStrength: 0.15,
    },
    beatmap: '/beatmaps/level1.json',
  },

  level2: {
    id: 'level2',
    title: 'DJ Quack Scratch Boogie',
    src: '/audio/level-2.mp3',
    bpm: 118,
    beatOffset: 0.12,
    intensity: {
      bassMultiplier: 0.9,
      midMultiplier: 0.85,
      highMultiplier: 0.7,
      pulseStrength: 0.65,
      particleStrength: 0.45,
      laserStrength: 0.35,
    },
    beatmap: '/beatmaps/level2.json',
  },

  level3: {
    id: 'level3',
    title: 'Duck Floor Fever Nu-Disco',
    src: '/audio/level-3.mp3',
    bpm: 126,
    beatOffset: 0.09,
    intensity: {
      bassMultiplier: 1.1,
      midMultiplier: 1,
      highMultiplier: 1,
      pulseStrength: 0.85,
      particleStrength: 0.75,
      laserStrength: 0.75,
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
