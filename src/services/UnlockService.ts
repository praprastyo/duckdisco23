import { UNLOCK_SCHEDULE, LevelUnlockConfig } from '../config/unlockSchedule';
import { TimeService } from './TimeService';

/**
 * UnlockService
 * Determines level accessibility based on Asia/Jakarta calendar dates
 * and development overrides.
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
   * Check if a specific level is currently unlocked
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
