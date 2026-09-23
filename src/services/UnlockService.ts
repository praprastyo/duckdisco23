import { UNLOCK_SCHEDULE, LevelUnlockConfig } from '../config/unlockSchedule';
import { TimeService } from './TimeService';
import { SaveData } from './SaveService';

/**
 * UnlockService
 * Determines level accessibility based on sequential progression,
 * Asia/Jakarta calendar dates, and development overrides.
 */
export class UnlockService {
  private static devUnlockAll: boolean = false;

  /**
   * Toggle or set DEV_UNLOCK_ALL
   */
  public static setDevUnlockAll(enable: boolean): void {
    this.devUnlockAll = enable;
  }

  public static isDevUnlockAll(): boolean {
    return this.devUnlockAll;
  }

  /**
   * Find unlock config for a level
   */
  public static getConfig(levelId: string): LevelUnlockConfig | undefined {
    return UNLOCK_SCHEDULE.find((item) => item.levelId === levelId);
  }

  /**
   * Check if a specific level is currently unlocked by date
   */
  public static isLevelUnlocked(levelId: string): boolean {
    if (this.devUnlockAll) {
      return true;
    }

    const config = this.getConfig(levelId);
    if (!config) return false;

    const diff = TimeService.getDifferenceFromNow(config.unlockAt);
    return diff <= 0;
  }

  /**
   * Check if previous required level has been cleared in saveData
   */
  public static isPreviousLevelCleared(levelId: string, saveData?: SaveData): boolean {
    if (this.devUnlockAll) return true;
    if (levelId === 'level1') return true;
    if (levelId === 'level4') return true;
    if (!saveData) return false;

    if (levelId === 'level2') return Boolean(saveData.levels.level1?.cleared);
    if (levelId === 'level3') return Boolean(saveData.levels.level2?.cleared);
    if (levelId === 'level4') return Boolean(saveData.levels.level3?.cleared);

    return false;
  }

  /**
   * Check if a specific level is playable (date reached AND previous level cleared)
   */
  public static isLevelPlayable(levelId: string, saveData?: SaveData): boolean {
    if (this.devUnlockAll) return true;
    const isDateUnlocked = this.isLevelUnlocked(levelId);
    if (!isDateUnlocked) return false;
    return this.isPreviousLevelCleared(levelId, saveData);
  }

  /**
   * Get detailed lock reason for UI card display
   */
  public static getLockReason(
    levelId: string,
    saveData?: SaveData
  ): { type: 'DATE_LOCKED' | 'PREV_REQUIRED'; prevLevelName?: string } | null {
    if (this.devUnlockAll) return null;

    if (!this.isPreviousLevelCleared(levelId, saveData)) {
      const prevName = levelId === 'level2' ? 'NIGHT 01' : levelId === 'level3' ? 'NIGHT 02' : 'NIGHT 03';
      return { type: 'PREV_REQUIRED', prevLevelName: prevName };
    }

    if (!this.isLevelUnlocked(levelId)) {
      return { type: 'DATE_LOCKED' };
    }

    return null;
  }

  /**
   * Get remaining milliseconds until unlock. Returns 0 if already unlocked.
   */
  public static getTimeUntilUnlock(levelId: string): number {
    if (this.devUnlockAll) {
      return 0;
    }

    const config = this.getConfig(levelId);
    if (!config) return 0;

    const diff = TimeService.getDifferenceFromNow(config.unlockAt);
    return Math.max(0, diff);
  }

  /**
   * Get formatted countdown object for a level
   */
  public static getCountdown(levelId: string) {
    const diff = this.getTimeUntilUnlock(levelId);
    return TimeService.formatCountdown(diff);
  }

  /**
   * Get the next upcoming locked level and its time remaining
   */
  public static getNextUpcomingLock(): { levelId: string; timeRemainingMs: number } | null {
    for (const config of UNLOCK_SCHEDULE) {
      const remaining = this.getTimeUntilUnlock(config.levelId);
      if (remaining > 0) {
        return {
          levelId: config.levelId,
          timeRemainingMs: remaining,
        };
      }
    }
    return null;
  }
}

