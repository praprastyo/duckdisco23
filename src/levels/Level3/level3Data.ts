import { Level3Config } from './level3Types';

export const LEVEL3_STORAGE_KEY = 'duckdisco_level3_config_v4';

export const DEFAULT_LEVEL3_CONFIG: Level3Config = {
  sections: [
    {
      id: 'part-1',
      label: 'Groove 115',
      startTime: 0,
      endTime: 70,
      bpm: 115,
      beatOffset: 0,
    },
    {
      id: 'part-2',
      label: 'Slow Groove 85',
      startTime: 70,
      endTime: 153,
      bpm: 85,
      beatOffset: 70,
    },
    {
      id: 'part-3',
      label: 'Final Groove 123',
      startTime: 153,
      endTime: 257,
      bpm: 123,
      beatOffset: 153,
    },
  ],
  transitions: [
    {
      id: 'transition-1',
      startTime: 69.5,
      endTime: 71.5,
      label: 'SLOW IT DOWN',
    },
    {
      id: 'transition-2',
      startTime: 152.0,
      endTime: 154.5,
      label: 'FINAL GROOVE',
    },
  ],
  hitWindows: {
    perfect: 0.130, // Widened from 70ms to 130ms
    great: 0.240,   // Widened from 140ms to 240ms
    good: 0.380,    // Widened from 230ms to 380ms
  },
  inputLatencyOffset: 0,
  sequenceBonus: 1000,
  clearAccuracyThreshold: 70,
  rounds: [
    // --- SECTION 1 (115 BPM - 2X DENSITY, ACTIVE DANCING) ---
    {
      id: 'round-01',
      sectionId: 'part-1',
      demoStart: 3.5,
      responseStart: 6.5,
      difficulty: 1,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'right', offset: 0.522 },
        { direction: 'left', offset: 1.043 },
      ],
    },
    {
      id: 'round-02',
      sectionId: 'part-1',
      demoStart: 9.5,
      responseStart: 12.5,
      difficulty: 1,
      commands: [
        { direction: 'up', offset: 0 },
        { direction: 'down', offset: 0.522 },
        { direction: 'up', offset: 1.043 },
      ],
    },
    {
      id: 'round-03',
      sectionId: 'part-1',
      demoStart: 15.5,
      responseStart: 19.0,
      difficulty: 2,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.522 },
        { direction: 'right', offset: 1.043 },
        { direction: 'down', offset: 1.565 },
      ],
    },
    {
      id: 'round-04',
      sectionId: 'part-1',
      demoStart: 23.0,
      responseStart: 26.5,
      difficulty: 2,
      commands: [
        { direction: 'down', offset: 0 },
        { direction: 'left', offset: 0.522 },
        { direction: 'up', offset: 1.043 },
        { direction: 'right', offset: 1.565 },
      ],
    },
    {
      id: 'round-05',
      sectionId: 'part-1',
      demoStart: 30.5,
      responseStart: 34.5,
      difficulty: 3,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'left', offset: 0.522 },
        { direction: 'up', offset: 1.043 },
        { direction: 'right', offset: 1.565 },
        { direction: 'down', offset: 2.087 },
      ],
    },
    {
      id: 'round-06',
      sectionId: 'part-1',
      demoStart: 39.0,
      responseStart: 43.0,
      difficulty: 3,
      commands: [
        { direction: 'right', offset: 0 },
        { direction: 'right', offset: 0.522 },
        { direction: 'down', offset: 1.043 },
        { direction: 'left', offset: 1.565 },
        { direction: 'up', offset: 2.087 },
      ],
    },
    {
      id: 'round-07',
      sectionId: 'part-1',
      demoStart: 47.5,
      responseStart: 51.5,
      difficulty: 3,
      commands: [
        { direction: 'up', offset: 0 },
        { direction: 'left', offset: 0.522 },
        { direction: 'down', offset: 1.043 },
        { direction: 'right', offset: 1.565 },
        { direction: 'up', offset: 2.087 },
        { direction: 'down', offset: 2.608 },
      ],
    },
    {
      id: 'round-08',
      sectionId: 'part-1',
      demoStart: 56.5,
      responseStart: 60.5,
      difficulty: 4,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.522 },
        { direction: 'right', offset: 1.043 },
        { direction: 'down', offset: 1.565 },
        { direction: 'left', offset: 2.087 },
        { direction: 'right', offset: 2.608 },
      ],
    },
    {
      id: 'round-09',
      sectionId: 'part-1',
      demoStart: 65.0,
      responseStart: 67.5,
      difficulty: 3,
      commands: [
        { direction: 'up', offset: 0 },
        { direction: 'down', offset: 0.522 },
        { direction: 'left', offset: 1.043 },
        { direction: 'right', offset: 1.565 },
      ],
    },

    // --- SECTION 2 (85 BPM - DON'T RUSH, FAKE COMMANDS) ---
    {
      id: 'round-10',
      sectionId: 'part-2',
      demoStart: 72.5,
      responseStart: 76.5,
      difficulty: 3,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.706 },
        { direction: 'right', offset: 1.412 },
        { direction: 'down', offset: 2.118 },
      ],
    },
    {
      id: 'round-11',
      sectionId: 'part-2',
      demoStart: 81.0,
      responseStart: 85.0,
      difficulty: 3,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.706, fake: true },
        { direction: 'right', offset: 1.412 },
        { direction: 'down', offset: 2.118 },
      ],
    },
    {
      id: 'round-12',
      sectionId: 'part-2',
      demoStart: 89.5,
      responseStart: 94.0,
      difficulty: 4,
      commands: [
        { direction: 'down', offset: 0 },
        { direction: 'right', offset: 0.706 },
        { direction: 'up', offset: 1.412, fake: true },
        { direction: 'left', offset: 2.118 },
        { direction: 'up', offset: 2.824 },
      ],
    },
    {
      id: 'round-13',
      sectionId: 'part-2',
      demoStart: 99.0,
      responseStart: 103.5,
      difficulty: 4,
      commands: [
        { direction: 'up', offset: 0 },
        { direction: 'down', offset: 0.706 },
        { direction: 'left', offset: 1.412, fake: true },
        { direction: 'right', offset: 2.118 },
        { direction: 'down', offset: 2.824 },
      ],
    },
    {
      id: 'round-14',
      sectionId: 'part-2',
      demoStart: 108.5,
      responseStart: 113.5,
      difficulty: 4,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'right', offset: 0.706 },
        { direction: 'down', offset: 1.412, fake: true },
        { direction: 'up', offset: 2.118 },
        { direction: 'right', offset: 2.824 },
        { direction: 'left', offset: 3.529 },
      ],
    },
    {
      id: 'round-15',
      sectionId: 'part-2',
      demoStart: 119.0,
      responseStart: 124.0,
      difficulty: 5,
      commands: [
        { direction: 'down', offset: 0 },
        { direction: 'left', offset: 0.706 },
        { direction: 'up', offset: 1.412, fake: true },
        { direction: 'right', offset: 2.118 },
        { direction: 'down', offset: 2.824 },
        { direction: 'up', offset: 3.529 },
      ],
    },
    {
      id: 'round-16',
      sectionId: 'part-2',
      demoStart: 129.5,
      responseStart: 134.5,
      difficulty: 5,
      commands: [
        { direction: 'right', offset: 0 },
        { direction: 'up', offset: 0.706 },
        { direction: 'left', offset: 1.412, fake: true },
        { direction: 'down', offset: 2.118 },
        { direction: 'right', offset: 2.824 },
        { direction: 'down', offset: 3.529 },
      ],
    },
    {
      id: 'round-17',
      sectionId: 'part-2',
      demoStart: 140.0,
      responseStart: 145.5,
      difficulty: 5,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.706, fake: true },
        { direction: 'down', offset: 1.412 },
        { direction: 'right', offset: 2.118, fake: true },
        { direction: 'up', offset: 2.824 },
        { direction: 'down', offset: 3.529 },
      ],
    },
    // --- SECTION 3 (123 BPM - FINAL HIGH-ENERGY ESCALATION) ---
    {
      id: 'round-18',
      sectionId: 'part-3',
      demoStart: 155.5,
      responseStart: 158.5,
      difficulty: 4,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.488 },
        { direction: 'right', offset: 0.976 },
        { direction: 'down', offset: 1.463 },
      ],
    },
    {
      id: 'round-19',
      sectionId: 'part-3',
      demoStart: 162.5,
      responseStart: 166.0,
      difficulty: 4,
      commands: [
        { direction: 'down', offset: 0 },
        { direction: 'left', offset: 0.488 },
        { direction: 'up', offset: 0.976 },
        { direction: 'right', offset: 1.463 },
        { direction: 'down', offset: 1.951 },
      ],
    },
    {
      id: 'round-20',
      sectionId: 'part-3',
      demoStart: 170.5,
      responseStart: 174.0,
      difficulty: 5,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.488 },
        { direction: 'right', offset: 0.976 },
        { direction: 'right', offset: 1.463 },
        { direction: 'down', offset: 1.951 },
        { direction: 'left', offset: 2.439 },
      ],
    },
    {
      id: 'round-21',
      sectionId: 'part-3',
      demoStart: 179.0,
      responseStart: 183.0,
      difficulty: 5,
      commands: [
        { direction: 'up', offset: 0 },
        { direction: 'right', offset: 0.488 },
        { direction: 'down', offset: 0.976, fake: true },
        { direction: 'left', offset: 1.463 },
        { direction: 'up', offset: 1.951 },
        { direction: 'down', offset: 2.439 },
      ],
    },
    {
      id: 'round-22',
      sectionId: 'part-3',
      demoStart: 188.0,
      responseStart: 192.5,
      difficulty: 6,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'left', offset: 0.488 },
        { direction: 'up', offset: 0.976 },
        { direction: 'right', offset: 1.463 },
        { direction: 'down', offset: 1.951 },
        { direction: 'left', offset: 2.439 },
        { direction: 'right', offset: 2.927 },
      ],
    },
    {
      id: 'round-23',
      sectionId: 'part-3',
      demoStart: 198.0,
      responseStart: 202.5,
      difficulty: 6,
      commands: [
        { direction: 'up', offset: 0 },
        { direction: 'down', offset: 0.488 },
        { direction: 'left', offset: 0.976 },
        { direction: 'right', offset: 1.463 },
        { direction: 'up', offset: 1.951 },
        { direction: 'down', offset: 2.439 },
        { direction: 'left', offset: 2.927 },
      ],
    },
    {
      id: 'round-24',
      sectionId: 'part-3',
      demoStart: 208.5,
      responseStart: 213.5,
      difficulty: 7,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.488 },
        { direction: 'right', offset: 0.976 },
        { direction: 'down', offset: 1.463 },
        { direction: 'left', offset: 1.951 },
        { direction: 'down', offset: 2.439 },
        { direction: 'up', offset: 2.927 },
        { direction: 'right', offset: 3.415 },
      ],
    },
    {
      id: 'round-25',
      sectionId: 'part-3',
      demoStart: 220.0,
      responseStart: 225.0,
      difficulty: 7,
      commands: [
        { direction: 'right', offset: 0 },
        { direction: 'down', offset: 0.488 },
        { direction: 'left', offset: 0.976 },
        { direction: 'up', offset: 1.463 },
        { direction: 'right', offset: 1.951 },
        { direction: 'left', offset: 2.439 },
        { direction: 'down', offset: 2.927 },
        { direction: 'up', offset: 3.415 },
      ],
    },
    {
      id: 'round-26',
      sectionId: 'part-3',
      demoStart: 231.5,
      responseStart: 237.0,
      difficulty: 8,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.488 },
        { direction: 'right', offset: 0.976 },
        { direction: 'down', offset: 1.463 },
        { direction: 'up', offset: 1.951 },
        { direction: 'down', offset: 2.439 },
        { direction: 'left', offset: 2.927 },
        { direction: 'right', offset: 3.415 },
        { direction: 'up', offset: 3.902 },
        { direction: 'down', offset: 4.390 },
      ],
    },
  ],
};

export function loadLevel3Config(): Level3Config {
  try {
    const raw = localStorage.getItem(LEVEL3_STORAGE_KEY);
    if (!raw) return DEFAULT_LEVEL3_CONFIG;
    const parsed = JSON.parse(raw);
    if (!parsed.sections || !parsed.rounds || !parsed.hitWindows) {
      return DEFAULT_LEVEL3_CONFIG;
    }
    return parsed as Level3Config;
  } catch {
    return DEFAULT_LEVEL3_CONFIG;
  }
}

export function saveLevel3Config(config: Level3Config): void {
  try {
    localStorage.setItem(LEVEL3_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save Level 3 config:', err);
  }
}

export function resetLevel3Config(): Level3Config {
  try {
    localStorage.removeItem(LEVEL3_STORAGE_KEY);
  } catch {
    // ignore
  }
  return DEFAULT_LEVEL3_CONFIG;
}
