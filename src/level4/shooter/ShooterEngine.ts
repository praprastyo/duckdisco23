import { ShooterTarget, TargetType } from '../types/level4Types';
import { TARGET_DEFS } from './targetConfig';

export class ShooterEngine {
  private targets: ShooterTarget[] = [];
  private nextId: number = 1;
  private lastSpawnTime: number = 0;

  public reset(): void {
    this.targets = [];
    this.nextId = 1;
    this.lastSpawnTime = 0;
  }

  public update(elapsedSec: number, deltaSec: number): void {
    // 1. Spawning logic based on elapsed seconds (accelerates in final 10s)
    const spawnInterval =
      elapsedSec >= 50
        ? 0.38
        : elapsedSec < 15
        ? 1.3
        : elapsedSec < 30
        ? 0.95
        : elapsedSec < 45
        ? 0.7
        : 0.5;

    if (elapsedSec - this.lastSpawnTime >= spawnInterval && elapsedSec < 60) {
      this.lastSpawnTime = elapsedSec;
      this.spawnTarget(elapsedSec);
    }

    // 2. Trajectory physics
    const gravity = 40; // percentage units per sec^2
    this.targets.forEach((t) => {
      if (!t.active) return;
      t.x += t.velocityX * deltaSec;
      t.velocityY += gravity * deltaSec;
      t.y += t.velocityY * deltaSec;
      t.rotation += 180 * deltaSec;

      // Deactivate if out of playfield bounds
      if (t.y > 115 || t.x < 15 || t.x > 105) {
        t.active = false;
      }
    });

    // Clean up inactive targets
    this.targets = this.targets.filter((t) => t.active);
  }

  private spawnTarget(elapsedSec: number): void {
    let type: TargetType = 'bottle';

    if (elapsedSec < 15) {
      type = 'bottle';
    } else if (elapsedSec < 30) {
      type = Math.random() < 0.7 ? 'bottle' : 'cocktail';
    } else if (elapsedSec < 45) {
      const roll = Math.random();
      type = roll < 0.6 ? 'bottle' : roll < 0.8 ? 'cocktail' : 'cactus';
    } else {
      const roll = Math.random();
      type = roll < 0.55 ? 'bottle' : roll < 0.7 ? 'cocktail' : roll < 0.85 ? 'poop' : 'cactus';
    }

    // Bartender tosses from bar counter (middle/right: x = 38% - 78%)
    const x = 38 + Math.random() * 40;
    const y = 82;
    // Toss with slight angle toward center or right
    const velocityX = (Math.random() - 0.5) * 22;
    const velocityY = -(48 + Math.random() * 18);

    const target: ShooterTarget = {
      id: `target_${this.nextId++}`,
      type,
      x,
      y,
      velocityX,
      velocityY,
      spawnTime: elapsedSec,
      scale: 1,
      rotation: 0,
      active: true,
      points: TARGET_DEFS[type].points,
    };

    this.targets.push(target);
  }

  public checkHit(clickXPercent: number, clickYPercent: number): {
    hit: boolean;
    target?: ShooterTarget;
    points: number;
  } {
    // Hit radius ~ 7% of screen
    const hitRadius = 7.5;
    for (let i = this.targets.length - 1; i >= 0; i--) {
      const t = this.targets[i];
      if (!t.active) continue;
      const dx = t.x - clickXPercent;
      const dy = t.y - clickYPercent;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= hitRadius) {
        t.active = false;
        return { hit: true, target: t, points: t.points };
      }
    }
    return { hit: false, points: 0 };
  }

  public getActiveTargets(): ShooterTarget[] {
    return this.targets;
  }

  public removeTarget(id: string): void {
    const t = this.targets.find((target) => target.id === id);
    if (t) t.active = false;
  }
}
