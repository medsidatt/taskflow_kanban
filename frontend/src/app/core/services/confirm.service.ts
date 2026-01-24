import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private configSub = new BehaviorSubject<ConfirmConfig | null>(null);
  private resolveFn: ((v: boolean) => void) | null = null;

  readonly config$: Observable<ConfirmConfig | null> = this.configSub.asObservable();

  confirm(config: ConfirmConfig): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.resolveFn = resolve;
      this.configSub.next({
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'primary',
        ...config
      });
    });
  }

  onResult(confirmed: boolean): void {
    if (this.resolveFn) {
      this.resolveFn(confirmed);
      this.resolveFn = null;
    }
    this.configSub.next(null);
  }
}
