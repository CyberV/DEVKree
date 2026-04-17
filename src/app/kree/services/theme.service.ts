import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'kree.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemeMode>('dark');

  init(): void {
    // Respect a previously-saved preference, else honour the system.
    const stored = this.readStored();
    if (stored) {
      this.apply(stored);
      return;
    }
    const prefersLight =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches;
    this.apply(prefersLight ? 'light' : 'dark');
  }

  toggle(): void {
    this.apply(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(mode: ThemeMode): void {
    this.apply(mode);
  }

  private apply(mode: ThemeMode): void {
    this.theme.set(mode);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
    }
    try {
      localStorage?.setItem(STORAGE_KEY, mode);
    } catch {
      /* storage unavailable — fine, we'll use defaults next boot */
    }
  }

  private readStored(): ThemeMode | null {
    try {
      const v = localStorage?.getItem(STORAGE_KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch {
      return null;
    }
  }
}
