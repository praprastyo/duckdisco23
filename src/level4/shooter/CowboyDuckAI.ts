import { ShooterTarget } from '../types/level4Types';

export type CowboyAimStatus = 'idle' | 'aiming' | 'shooting' | 'miss_reaction';

export interface CowboyAimInfo {
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  state: CowboyAimStatus;
}

export class CowboyDuckAI {
  private aimPos: { x: number; y: number } = { x: 18, y: 65 };
  private state: CowboyAimStatus = 'idle';
  private targetLockedId: string | null = null;
  private timeToShoot: number = 0;
  private stateTimer: number = 0;
  private baseAccuracy: number = 0.85;

  public reset(): void {
    this.aimPos = { x: 18, y: 65 };
    this.state = 'idle';
    this.targetLockedId = null;
    this.timeToShoot = 0;
    this.stateTimer = 0;
  }

  public getAim(): CowboyAimInfo {
    return {
      x: this.aimPos.x,
      y: this.aimPos.y,
      state: this.state,
    };
  }

  public update(
    deltaSec: number,
    targets: ShooterTarget[]
  ): { shotFired: boolean; hitTargetId?: string; points: number } {
    // 1. Post-shot recovery timers
    if (this.state === 'shooting') {
      this.stateTimer -= deltaSec;
      if (this.stateTimer <= 0) {
        this.state = 'idle';
      }
      return { shotFired: false, points: 0 };
    }

    if (this.state === 'miss_reaction') {
      this.stateTimer -= deltaSec;
      if (this.stateTimer <= 0) {
        this.state = 'idle';
      }
      return { shotFired: false, points: 0 };
    }

    // 2. Target Acquisition
    if (!this.targetLockedId) {
      // Return crosshair to ready position
      this.aimPos.x += (22 - this.aimPos.x) * (4 * deltaSec);
      this.aimPos.y += (60 - this.aimPos.y) * (4 * deltaSec);

      // Find active valid bottle targets (x > 25 to focus on target gallery)
      const validBottles = targets.filter(
        (t) => t.active && t.type === 'bottle' && t.y < 70 && t.x > 22
      );

      if (validBottles.length > 0) {
        // Pick one bottle and assign reaction latency (0.45s - 0.70s)
        const chosen = validBottles[Math.floor(Math.random() * validBottles.length)];
        this.targetLockedId = chosen.id;
        this.timeToShoot = 0.45 + Math.random() * 0.25;
        this.state = 'aiming';
      }
      return { shotFired: false, points: 0 };
    }

    // 3. Smooth AI Aim Interpolation toward target bottle
    const target = targets.find((t) => t.id === this.targetLockedId && t.active);
    if (!target) {
      // Target was destroyed or fell off-screen
      this.targetLockedId = null;
      this.state = 'idle';
      return { shotFired: false, points: 0 };
    }

    // Smoothly track target position
    const aimSpeed = 8.5; // tracking interpolation speed
    this.aimPos.x += (target.x - this.aimPos.x) * (aimSpeed * deltaSec);
    this.aimPos.y += (target.y - this.aimPos.y) * (aimSpeed * deltaSec);

    // 4. Countdown to trigger shot
    this.timeToShoot -= deltaSec;
    if (this.timeToShoot <= 0) {
      const lockedId = this.targetLockedId;
      this.targetLockedId = null;

      const roll = Math.random();
      if (roll <= this.baseAccuracy) {
        // Accurate hit!
        this.state = 'shooting';
        this.stateTimer = 0.2;
        return { shotFired: true, hitTargetId: lockedId, points: 1 };
      } else {
        // Whiffed / miss reaction: overshoot slightly
        this.state = 'miss_reaction';
        this.stateTimer = 0.5;
        this.aimPos.x += (Math.random() > 0.5 ? 8 : -8);
        this.aimPos.y += (Math.random() > 0.5 ? 8 : -8);
        return { shotFired: true, points: 0 };
      }
    }

    return { shotFired: false, points: 0 };
  }
}

