import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-angular';
import { ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (t of toastService.items(); track t.id) {
        <div 
          class="toast toast-{{ t.type }}"
          [attr.role]="'alert'">
          <span class="toast-icon">
            @switch (t.type) {
              @case ('success') { <lucide-icon [name]="icons.CheckCircle" [size]="20" /> }
              @case ('error') { <lucide-icon [name]="icons.XCircle" [size]="20" /> }
              @case ('warning') { <lucide-icon [name]="icons.AlertTriangle" [size]="20" /> }
              @default { <lucide-icon [name]="icons.Info" [size]="20" /> }
            }
          </span>
          <p class="toast-message">{{ t.message }}</p>
          <button 
            type="button" 
            class="toast-close" 
            (click)="toastService.dismiss(t.id)"
            aria-label="Dismiss">
            <lucide-icon [name]="icons.X" [size]="16" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: var(--spacing-4, 1rem);
      right: var(--spacing-4, 1rem);
      z-index: var(--z-tooltip, 1070);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2, 0.5rem);
      max-width: 420px;
      pointer-events: none;
    }

    .toast-container > * {
      pointer-events: auto;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-3, 0.75rem);
      padding: var(--spacing-4, 1rem) var(--spacing-4, 1rem);
      border-radius: var(--radius-lg, 0.5rem);
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15), 0 4px 10px -5px rgba(0,0,0,0.08);
      border: 1px solid rgba(255,255,255,0.2);
      animation: toastIn 0.25s ease-out;
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }

    .toast-icon { flex-shrink: 0; }
    .toast-message { margin: 0; flex: 1; font-size: var(--text-sm, 0.875rem); line-height: 1.4; }
    .toast-close {
      flex-shrink: 0;
      padding: var(--spacing-1, 0.25rem);
      background: none;
      border: none;
      border-radius: var(--radius-md, 0.375rem);
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.15s, background 0.15s;
    }
    .toast-close:hover { opacity: 1; background: rgba(0,0,0,0.08); }

    .toast-success {
      background: var(--success-50, #f0fdf4);
      color: var(--success-700, #059669);
    }
    .toast-success .toast-icon { color: var(--success-500, #10b981); }
    .toast-success .toast-message { color: var(--gray-800, #27272a); }

    .toast-error {
      background: var(--error-50, #fef2f2);
      color: var(--error-700, #dc2626);
    }
    .toast-error .toast-icon { color: var(--error-500, #ef4444); }
    .toast-error .toast-message { color: var(--gray-800, #27272a); }

    .toast-warning {
      background: var(--warning-50, #fffbeb);
      color: var(--warning-700, #d97706);
    }
    .toast-warning .toast-icon { color: var(--warning-500, #f59e0b); }
    .toast-warning .toast-message { color: var(--gray-800, #27272a); }

    .toast-info {
      background: var(--info-50, #e3f2fd);
      color: var(--info-700, #0891b2);
    }
    .toast-info .toast-icon { color: var(--info-500, #06b6d4); }
    .toast-info .toast-message { color: var(--gray-800, #27272a); }

    .toast-close { color: var(--gray-600, #52525b); }

    @media (max-width: 480px) {
      .toast-container { left: var(--spacing-3); right: var(--spacing-3); max-width: none; }
    }
  `]
})
export class ToastComponent {
  readonly icons = { CheckCircle, XCircle, AlertTriangle, Info, X };

  constructor(public toastService: ToastService) {}
}
