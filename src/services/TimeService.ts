/**
 * TimeService
 * Authoritative time provider for DISCO DUCK.
 * Supports Asia/Jakarta (UTC+7) timezone formatting and dev offsets.
 * Decouples game/unlock logic from browser new Date().
 */
export class TimeService {
  private static timeOffsetMs = 0;
  private static mockTimestamp: number | null = null;

  /**
   * Get authoritative current timestamp in milliseconds
   */
  public static getCurrentTimestamp(): number {
    if (this.mockTimestamp !== null) {
      return this.mockTimestamp;
    }
    return Date.now() + this.timeOffsetMs;
  }

  /**
   * Get authoritative Date object
   */
  public static getCurrentTime(): Date {
    return new Date(this.getCurrentTimestamp());
  }

  /**
   * Set custom dev time offset in milliseconds
   */
  public static setDebugOffset(offsetMs: number): void {
    this.timeOffsetMs = offsetMs;
  }

  /**
   * Set explicit fixed mock timestamp for testing (null to disable)
   */
  public static setMockTimestamp(timestamp: number | null): void {
    this.mockTimestamp = timestamp;
  }

  /**
   * Calculate difference between target ISO date string and authoritative current time
   */
  public static getDifferenceFromNow(targetIsoString: string): number {
    const targetMs = new Date(targetIsoString).getTime();
    const nowMs = this.getCurrentTimestamp();
    return targetMs - nowMs;
  }

  /**
   * Format a millisecond duration into HH:MM:SS
   */
  public static formatCountdown(diffMs: number): { hours: string; minutes: string; seconds: string; isPast: boolean } {
    if (diffMs <= 0) {
      return { hours: '00', minutes: '00', seconds: '00', isPast: true };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      isPast: false,
    };
  }

  /**
   * Get current time string in Asia/Jakarta representation
   */
  public static getJakartaTimeString(): string {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jakarta',
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(this.getCurrentTime());
  }
}
