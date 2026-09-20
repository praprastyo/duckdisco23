export type InputCallback = (action: 'tap' | 'holdStart' | 'release', timestamp: number) => void;

/**
 * InputManager
 * Unifies keyboard (Spacebar), touch, and pointer events.
 * Manages input latency offset and prevents unwanted browser scrolling/zoom during gameplay.
 */
export class InputManager {
  private isHolding: boolean = false;
  private holdThresholdMs: number = 180;
  private holdTimer: number | null = null;
  private pressStartTime: number = 0;

  private latencyOffsetSec: number = 0; // Negative = earlier, positive = later
  private callbacks: Set<InputCallback> = new Set();
  private attachedElement: HTMLElement | Window | null = null;

  constructor(latencyOffsetMs: number = 0) {
    this.latencyOffsetSec = latencyOffsetMs / 1000;
  }

  public setLatencyOffset(offsetMs: number) {
    this.latencyOffsetSec = offsetMs / 1000;
  }

  public getLatencyOffsetSec(): number {
    return this.latencyOffsetSec;
  }

  public subscribe(cb: InputCallback): () => void {
    this.callbacks.add(cb);
    return () => this.callbacks.delete(cb);
  }

  public attach(target: HTMLElement | Window = window) {
    this.detach();
    this.attachedElement = target;

    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    window.addEventListener('keyup', this.handleKeyUp, { passive: false });
    target.addEventListener('pointerdown', this.handlePointerDown as EventListener, { passive: false });
    target.addEventListener('pointerup', this.handlePointerUp as EventListener, { passive: false });
    target.addEventListener('pointercancel', this.handlePointerUp as EventListener, { passive: false });
  }

  public detach() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    if (this.attachedElement) {
      this.attachedElement.removeEventListener('pointerdown', this.handlePointerDown as EventListener);
      this.attachedElement.removeEventListener('pointerup', this.handlePointerUp as EventListener);
      this.attachedElement.removeEventListener('pointercancel', this.handlePointerUp as EventListener);
      this.attachedElement = null;
    }
    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
    this.isHolding = false;
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.key === ' ' || e.code === 'Enter') {
      if (!e.repeat) {
        e.preventDefault();
        this.startPress();
      }
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.key === ' ' || e.code === 'Enter') {
      e.preventDefault();
      this.endPress();
    }
  };

  private handlePointerDown = (e: PointerEvent) => {
    // Ignore right click
    if (e.button !== 0) return;
    // Don't intercept clicks on interactive buttons inside HUD
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, [data-interactive="true"]')) {
      return;
    }
    e.preventDefault();
    this.startPress();
  };

  private handlePointerUp = (e: PointerEvent) => {
    if (e.button !== 0 && e.type !== 'pointercancel') return;
    this.endPress();
  };

  private startPress() {
    this.pressStartTime = performance.now();
    this.isHolding = false;

    // Immediately trigger initial tap
    this.dispatch('tap');

    // Schedule hold detection
    this.holdTimer = window.setTimeout(() => {
      this.isHolding = true;
      this.dispatch('holdStart');
    }, this.holdThresholdMs);
  }

  private endPress() {
    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }

    if (this.isHolding) {
      this.isHolding = false;
      this.dispatch('release');
    }
  }

  private dispatch(action: 'tap' | 'holdStart' | 'release') {
    const rawTime = performance.now();
    this.callbacks.forEach((cb) => cb(action, rawTime));
  }
}
