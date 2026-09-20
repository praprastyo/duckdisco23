type Listener = (enabled: boolean) => void;

class DevModeServiceManager {
  private storageKey = 'duckdisco_dev_mode';
  private listeners: Set<Listener> = new Set();

  public isEnabled(): boolean {
    try {
      return localStorage.getItem(this.storageKey) === 'true';
    } catch {
      return false;
    }
  }

  public setEnabled(val: boolean): void {
    try {
      localStorage.setItem(this.storageKey, val ? 'true' : 'false');
    } catch {
      // ignore
    }
    this.notify(val);
  }

  public checkAndToggle(password: string): boolean {
    if (password === 'duck23') {
      const next = !this.isEnabled();
      this.setEnabled(next);
      return true;
    }
    return false;
  }

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify(val: boolean): void {
    this.listeners.forEach((cb) => cb(val));
  }
}

export const DevModeService = new DevModeServiceManager();
