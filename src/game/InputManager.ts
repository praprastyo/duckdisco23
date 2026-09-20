export type InputAction = 'tap' | 'holdStart' | 'release' | 'left' | 'right' | 'up' | 'down';
export type InputCallback = (action: InputAction, timestamp: number) => void;

/**
 * InputManager
 * Unifies keyboard (Space, Arrow keys, WASD), touch, and pointer events.
 * Supports directional cues for AyoDance-style step mechanics.
 */
export class InputManager {
  private isHolding: boolean = false;
  private holdThresholdMs: number = 180;
  private holdTimer: number | null = null;
  private latencyOffsetSec: number = 0;
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

    window.addEventListener('keydown', this.handleKeyDown, { capture: true, passive: false });
    window.addEventListener('keyup', this.handleKeyUp, { capture: true, passive: false });
    target.addEventListener('pointerdown', this.handlePointerDown as EventListener, { passive: false });
    target.addEventListener('pointerup', this.handlePointerUp as EventListener, { passive: false });
    target.addEventListener('pointercancel', this.handlePointerUp as EventListener, { passive: false });
  }

  public detach() {
    window.removeEventListener('keydown', this.handleKeyDown, { capture: true });
    window.removeEventListener('keyup', this.handleKeyUp, { capture: true });
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
    const code = e.code;
    if (e.repeat) return;

    if (code === 'Space' || code === 'Enter') {
      e.preventDefault();
      e.stopImmediatePropagation();
      (document.activeElement as HTMLElement)?.blur();
      this.startPress('tap');
    } else if (code === 'ArrowLeft' || code === 'KeyA') {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.triggerAction('left');
    } else if (code === 'ArrowRight' || code === 'KeyD') {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.triggerAction('right');
    } else if (code === 'ArrowUp' || code === 'KeyW') {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.triggerAction('up');
    } else if (code === 'ArrowDown' || code === 'KeyS') {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.triggerAction('down');
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.endPress();
    }
  };


  private handlePointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, [data-interactive="true"]')) {
      return;
    }
    e.preventDefault();
    this.startPress('tap');
  };

  private handlePointerUp = (e: PointerEvent) => {
    if (e.button !== 0 && e.type !== 'pointercancel') return;
    this.endPress();
  };

  public triggerAction(action: InputAction) {
    const rawTime = performance.now();
    this.callbacks.forEach((cb) => cb(action, rawTime));
  }

  private startPress(action: InputAction = 'tap') {
    this.isHolding = false;
    this.triggerAction(action);

    this.holdTimer = window.setTimeout(() => {
      this.isHolding = true;
      this.triggerAction('holdStart');
    }, this.holdThresholdMs);
  }

  private endPress() {
    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
    if (this.isHolding) {
      this.isHolding = false;
      this.triggerAction('release');
    }
  }
}

