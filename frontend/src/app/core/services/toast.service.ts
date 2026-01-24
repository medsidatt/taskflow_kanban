import { Injectable, signal, computed } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private timeouts = new Map<string, ReturnType<typeof setTimeout>>();

  readonly items = computed(() => this.toasts());

  success(message: string, duration = 4000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 4500): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 4000): void {
    this.show(message, 'info', duration);
  }

  show(message: string, type: ToastType = 'info', duration = 4000): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const toast: Toast = { id, message, type, duration };

    this.toasts.update(list => [...list, toast]);

    if (duration > 0) {
      const t = setTimeout(() => this.dismiss(id), duration);
      this.timeouts.set(id, t);
    }
  }

  dismiss(id: string): void {
    const t = this.timeouts.get(id);
    if (t) {
      clearTimeout(t);
      this.timeouts.delete(id);
    }
    this.toasts.update(list => list.filter(x => x.id !== id));
  }

  dismissAll(): void {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts.clear();
    this.toasts.set([]);
  }
}
