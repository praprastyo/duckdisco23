import { Level3Config } from './level3Types';

export const LEVEL3_STORAGE_KEY = 'duckdisco_level3_config_v2';

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
    perfect: 0.070,
    great: 0.140,
    good: 0.230,
  },
  inputLatencyOffset: 0,
  sequenceBonus: 1000,
  clearAccuracyThreshold: 70,
  rounds: [
    // --- SECTION 1 (115 BPM) ---
    {
      id: 'round-01',
      sectionId: 'part-1',
      demoStart: 4.174,
      responseStart: 8.348,
      difficulty: 1,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'right', offset: 1.043 },
      ],
    },
    {
      id: 'round-02',
      sectionId: 'part-1',
      demoStart: 12.522,
      responseStart: 16.696,
      difficulty: 1,
      commands: [
        { direction: 'up', offset: 0 },
        { direction: 'down', offset: 1.043 },
      ],
    },
    {
      id: 'round-03',
      sectionId: 'part-1',
      demoStart: 20.870,
      responseStart: 25.043,
      difficulty: 2,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.522 },
        { direction: 'right', offset: 1.043 },
      ],
    },
    {
      id: 'round-04',
      sectionId: 'part-1',
      demoStart: 29.217,
      responseStart: 35.478,
      difficulty: 2,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.522 },
        { direction: 'right', offset: 1.043 },
        { direction: 'down', offset: 1.565 },
      ],
    },
    {
      id: 'round-05',
      sectionId: 'part-1',
      demoStart: 39.652,
      responseStart: 45.913,
      difficulty: 3,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'left', offset: 0.522 },
        { direction: 'up', offset: 1.043 },
        { direction: 'right', offset: 1.565 },
      ],
    },
    {
      id: 'round-06',
      sectionId: 'part-1',
      demoStart: 50.087,
      responseStart: 58.435,
      difficulty: 3,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 1.043 },
        { direction: 'right', offset: 1.565 },
        { direction: 'down', offset: 2.608 },
      ],
    },

    // --- SECTION 2 (85 BPM - DON'T RUSH, FAKE COMMANDS) ---
    {
      id: 'round-07',
      sectionId: 'part-2',
      demoStart: 73.5,
      responseStart: 81.97,
      difficulty: 3,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 1.412 },
        { direction: 'right', offset: 2.824 },
        { direction: 'down', offset: 4.235 },
      ],
    },
    {
      id: 'round-08',
      sectionId: 'part-2',
      demoStart: 88.0,
      responseStart: 96.47,
      difficulty: 4,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.706, fake: true },
        { direction: 'right', offset: 1.412 },
        { direction: 'down', offset: 2.824 },
      ],
    },
    {
      id: 'round-09',
      sectionId: 'part-2',
      demoStart: 104.0,
      responseStart: 113.88,
      difficulty: 4,
      commands: [
        { direction: 'up', offset: 0 },
        { direction: 'down', offset: 1.412 },
        { direction: 'left', offset: 2.118 },
        { direction: 'right', offset: 2.824, fake: true },
        { direction: 'up', offset: 4.235 },
      ],
    },
    {
      id: 'round-10',
      sectionId: 'part-2',
      demoStart: 122.0,
      responseStart: 133.29,
      difficulty: 5,
      commands: [
        { direction: 'down', offset: 0 },
        { direction: 'left', offset: 0.706 },
        { direction: 'up', offset: 2.118 },
        { direction: 'right', offset: 2.824 },
        { direction: 'left', offset: 3.529 },
        { direction: 'down', offset: 4.941 },
      ],
    },
    // --- SECTION 3 (123 BPM - FINAL ESCALATION) ---
    {
      id: 'round-11',
      sectionId: 'part-3',
      demoStart: 156.0,
      responseStart: 161.85,
      difficulty: 4,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.488 },
        { direction: 'right', offset: 0.976 },
        { direction: 'down', offset: 1.463 },
      ],
    },
    {
      id: 'round-12',
      sectionId: 'part-3',
      demoStart: 166.0,
      responseStart: 173.80,
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
      id: 'round-13',
      sectionId: 'part-3',
      demoStart: 179.0,
      responseStart: 186.80,
      difficulty: 5,
      commands: [
        { direction: 'up', offset: 0 },
        { direction: 'right', offset: 0.488 },
        { direction: 'down', offset: 0.976 },
        { direction: 'left', offset: 1.463 },
        { direction: 'up', offset: 1.951, fake: true },
        { direction: 'down', offset: 2.439 },
        { direction: 'right', offset: 2.927 },
      ],
    },
    {
      id: 'round-14',
      sectionId: 'part-3',
      demoStart: 194.0,
      responseStart: 201.80,
      difficulty: 6,
      commands: [
        { direction: 'left', offset: 0 },
        { direction: 'up', offset: 0.244 },
        { direction: 'right', offset: 0.732 },
        { direction: 'down', offset: 1.220 },
        { direction: 'down', offset: 1.707 },
        { direction: 'left', offset: 2.195 },
        { direction: 'right', offset: 2.683 },
      ],
    },
    {
      id: 'round-15',
      sectionId: 'part-3',
      demoStart: 210.0,
      responseStart: 221.70,
      difficulty: 7,
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
