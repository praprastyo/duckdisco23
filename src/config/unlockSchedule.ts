export interface LevelUnlockConfig {
  levelId: string;
  unlockAt: string; // ISO 8601 string with Asia/Jakarta offset (+07:00)
}

export const UNLOCK_SCHEDULE: LevelUnlockConfig[] = [
  {
    levelId: 'level1',
    unlockAt: '2026-09-20T00:00:00+07:00',
  },
  {
    levelId: 'level2',
    unlockAt: '2026-09-21T00:00:00+07:00',
  },
  {
    levelId: 'level3',
    unlockAt: '2026-09-22T00:00:00+07:00',
  },
  {
    levelId: 'level4',
    unlockAt: '2026-09-23T00:00:00+07:00',
  },
];
