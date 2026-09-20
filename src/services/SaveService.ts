export interface LevelScoreRecord {
  cleared: boolean;
  bestScore: number;
  bestAccuracy: number;
  maxCombo: number;
}

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  reducedMotion: boolean;
  timingOffset: number; // in milliseconds
}

export interface Collectibles {
  neonFeather: boolean;
  rainbowFeather?: boolean;
  goldenVinyl: boolean;
  mirrorFeather: boolean;
}


export interface SaveData {
  levels: {
    level1: LevelScoreRecord;
    level2: LevelScoreRecord;
    level3: LevelScoreRecord;
    level4: LevelScoreRecord;
  };
  collectibles: Collectibles;
  finalUnlocked: boolean;
  settings: GameSettings;
}

const STORAGE_KEY = 'disco_duck_savedata_v1';

const DEFAULT_LEVEL_RECORD: LevelScoreRecord = {
  cleared: false,
  bestScore: 0,
  bestAccuracy: 0,
  maxCombo: 0,
};

const DEFAULT_SAVE_DATA: SaveData = {
  levels: {
    level1: { ...DEFAULT_LEVEL_RECORD },
    level2: { ...DEFAULT_LEVEL_RECORD },
    level3: { ...DEFAULT_LEVEL_RECORD },
    level4: { ...DEFAULT_LEVEL_RECORD },
  },
  collectibles: {
    neonFeather: false,
    rainbowFeather: false,
    goldenVinyl: false,
    mirrorFeather: false,
  },
  finalUnlocked: false,
  settings: {
    musicVolume: 0.8,
    sfxVolume: 0.9,
    reducedMotion: false,
    timingOffset: 0,
  },
};

/**
 * SaveService
 * Central storage repository for game records, collectibles, and settings.
 * Can be redirected to a remote backend API in production.
 */
export class SaveService {
  private static cachedData: SaveData | null = null;
  private static listeners: Set<(data: SaveData) => void> = new Set();

  /**
   * Load stored save data with fallback to defaults
   */
  public static load(): SaveData {
    if (this.cachedData) {
      return this.cachedData;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.cachedData = {
          levels: {
            level1: { ...DEFAULT_LEVEL_RECORD, ...(parsed.levels?.level1 || {}) },
            level2: { ...DEFAULT_LEVEL_RECORD, ...(parsed.levels?.level2 || {}) },
            level3: { ...DEFAULT_LEVEL_RECORD, ...(parsed.levels?.level3 || {}) },
            level4: { ...DEFAULT_LEVEL_RECORD, ...(parsed.levels?.level4 || {}) },
          },
          collectibles: {
            ...DEFAULT_SAVE_DATA.collectibles,
            ...(parsed.collectibles || {}),
          },
          finalUnlocked: Boolean(parsed.finalUnlocked),
          settings: {
            ...DEFAULT_SAVE_DATA.settings,
            ...(parsed.settings || {}),
          },
        };
        return this.cachedData;
      }
    } catch (err) {
      console.warn('Failed to load save data, using defaults', err);
    }

    this.cachedData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    return this.cachedData as SaveData;
  }

  /**
   * Persist state to storage and notify listeners
   */
  public static save(data: SaveData): void {
    this.cachedData = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.notify(data);
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }
  }

  /**
   * Update level result after a playthrough
   */
  public static recordLevelResult(
    levelId: 'level1' | 'level2' | 'level3' | 'level4',
    result: { score: number; accuracy: number; maxCombo: number; cleared: boolean }
  ): SaveData {
    const current = this.load();
    const prev = current.levels[levelId] || { ...DEFAULT_LEVEL_RECORD };

    const updatedRecord: LevelScoreRecord = {
      cleared: prev.cleared || result.cleared,
      bestScore: Math.max(prev.bestScore, result.score),
      bestAccuracy: Math.max(prev.bestAccuracy, result.accuracy),
      maxCombo: Math.max(prev.maxCombo, result.maxCombo),
    };

    const next: SaveData = {
      ...current,
      levels: {
        ...current.levels,
        [levelId]: updatedRecord,
      },
    };

    // Auto-unlock collectibles based on clearance
    if (result.cleared) {
      if (levelId === 'level1') next.collectibles.rainbowFeather = true;
      if (levelId === 'level2') next.collectibles.goldenVinyl = true;
      if (levelId === 'level3') next.collectibles.mirrorFeather = true;
      if (levelId === 'level4') next.finalUnlocked = true;
    }

    this.save(next);
    return next;
  }

  /**
   * Update settings
   */
  public static updateSettings(settings: Partial<GameSettings>): SaveData {
    const current = this.load();
    const next: SaveData = {
      ...current,
      settings: {
        ...current.settings,
        ...settings,
      },
    };
    this.save(next);
    return next;
  }

  /**
   * Reset save data
   */
  public static reset(): SaveData {
    const fresh = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    this.save(fresh);
    return fresh;
  }

  /**
   * Subscribe to save changes
   */
  public static subscribe(fn: (data: SaveData) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private static notify(data: SaveData) {
    this.listeners.forEach((fn) => fn(data));
  }
}
