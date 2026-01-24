import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'taskflow-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly media = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  /** Stored preference: light, dark, or system. */
  readonly theme = signal<ThemeMode>('system');

  init(): void {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const mode: ThemeMode = raw === 'light' || raw === 'dark' || raw === 'system' ? raw : 'system';
    this.theme.set(mode);
    this.apply();
    this.attachMediaListener();
  }

  setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, mode);
    this.apply();
  }

  private apply(): void {
    if (typeof document === 'undefined') return;
    const t = this.theme();
    const r = (t === 'system' && this.media)
      ? (this.media.matches ? 'dark' : 'light')
      : (t === 'dark' ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', r);
  }

  private attachMediaListener(): void {
    if (!this.media) return;
    const handler = () => {
      if (this.theme() === 'system') this.apply();
    };
    this.media.addEventListener('change', handler);
  }
}
