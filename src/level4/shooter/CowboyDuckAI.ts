import { ShooterTarget } from '../types/level4Types';

export class CowboyDuckAI {
  private targetLockedId: string | null = null;
  private timeToShoot: number = 0;
  private baseAccuracy: number = 0.85;

  public reset(): void {
    this.targetLockedId = null;
    this.timeToShoot = 0;
  }

  public update(
    deltaSec: number,
    targets: ShooterTarget[]
  ): { shotFired: boolean; hitTargetId?: string; points: number } {
    // If no target locked, pick the best valid bottle
    if (!this.targetLockedId) {
      const validBottles = targets.filter((t) => t.active && t.type === 'bottle' && t.y < 70);
      if (validBottles.length > 0) {
        // Pick one bottle and assign reaction latency (0.45s - 0.75s)
        const chosen = validBottles[Math.floor(Math.random() * validBottles.length)];
        this.targetLockedId = chosen.id;
        this.timeToShoot = 0.45 + Math.random() * 0.3;
      }
      return { shotFired: false, points: 0 };
    }

    // Countdown to trigger shot
    this.timeToShoot -= deltaSec;
    if (this.timeToShoot <= 0) {
      const lockedId = this.targetLockedId;
      this.targetLockedId = null;

      // Verify target is still active
      const target = targets.find((t) => t.id === lockedId && t.active);
      if (target) {
        const roll = Math.random();
        if (roll <= this.baseAccuracy) {
          // Accurate hit!
          return { shotFired: true, hitTargetId: lockedId, points: 1 };
        } else {
          // Whiffed / missed
          return { shotFired: true, points: 0 };
        }
      }
    }

    return { shotFired: false, points: 0 };
  }
}
