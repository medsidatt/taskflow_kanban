import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertTriangle, HelpCircle } from 'lucide-angular';
import { ConfirmService, ConfirmConfig } from '../../../core/services/confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (config) {
      <div class="confirm-backdrop" (click)="onBackdropClick($event)">
        <div class="confirm-dialog" (click)="$event.stopPropagation()" role="alertdialog" [attr.aria-labelledby]="'confirm-title'" [attr.aria-describedby]="'confirm-desc'">
          <div class="confirm-icon" [class.confirm-danger]="config.variant === 'danger'">
            @if (config.variant === 'danger') {
              <lucide-icon [name]="icons.AlertTriangle" [size]="28" />
            } @else {
              <lucide-icon [name]="icons.HelpCircle" [size]="28" />
            }
          </div>
          <h2 id="confirm-title" class="confirm-title">{{ config.title }}</h2>
          <p id="confirm-desc" class="confirm-message">{{ config.message }}</p>
          <div class="confirm-actions">
            <button type="button" class="confirm-btn confirm-cancel" (click)="cancel()">
              {{ config.cancelText }}
            </button>
            <button 
              type="button" 
              class="confirm-btn confirm-ok" 
              [class.confirm-ok-danger]="config.variant === 'danger'"
              (click)="confirm()">
              {{ config.confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirm-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-4, 1rem);
      z-index: var(--z-modal, 1050);
      animation: confirmFadeIn 0.2s ease;
    }

    @keyframes confirmFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .confirm-dialog {
      background: var(--bg-primary, #fff);
      border-radius: var(--radius-xl, 0.75rem);
      box-shadow: 0 24px 48px rgba(0,0,0,0.18);
      padding: var(--spacing-6, 1.5rem);
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: confirmSlideIn 0.25s ease;
    }

    @keyframes confirmSlideIn {
      from { opacity: 0; transform: scale(0.95) translateY(-10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .confirm-icon {
      width: 56px;
      height: 56px;
      margin: 0 auto var(--spacing-4, 1rem);
      border-radius: var(--radius-full, 9999px);
      background: var(--primary-50, #eff6ff);
      color: var(--primary-500, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .confirm-icon.confirm-danger {
      background: var(--error-50, #fef2f2);
      color: var(--error-500, #ef4444);
    }

    .confirm-title {
      margin: 0 0 var(--spacing-2, 0.5rem);
      font-size: var(--text-lg, 1.125rem);
      font-weight: var(--font-semibold, 600);
      color: var(--text-primary, #18181b);
    }

    .confirm-message {
      margin: 0 0 var(--spacing-5, 1.25rem);
      font-size: var(--text-sm, 0.875rem);
      color: var(--text-secondary, #52525b);
      line-height: 1.5;
    }

    .confirm-actions {
      display: flex;
      gap: var(--spacing-3, 0.75rem);
      justify-content: center;
      flex-wrap: wrap;
    }

    .confirm-btn {
      padding: var(--spacing-2, 0.5rem) var(--spacing-4, 1rem);
      font-size: var(--text-sm, 0.875rem);
      font-weight: var(--font-medium, 500);
      border-radius: var(--radius-lg, 0.5rem);
      cursor: pointer;
      transition: background 0.15s, color 0.15s, transform 0.1s;
      border: none;
    }

    .confirm-btn:active { transform: scale(0.98); }

    .confirm-cancel {
      background: var(--gray-100, #f4f4f5);
      color: var(--text-secondary, #52525b);
    }

    .confirm-cancel:hover {
      background: var(--gray-200, #e4e4e7);
      color: var(--text-primary, #18181b);
    }

    .confirm-ok {
      background: var(--primary-500, #3b82f6);
      color: #fff;
    }

    .confirm-ok:hover {
      background: var(--primary-600, #2563eb);
    }

    .confirm-ok.confirm-ok-danger {
      background: var(--error-500, #ef4444);
    }

    .confirm-ok.confirm-ok-danger:hover {
      background: var(--error-600, #dc2626);
    }
  `]
})
export class ConfirmDialogComponent implements OnDestroy {
  readonly icons = { AlertTriangle, HelpCircle };
  config: ConfirmConfig | null = null;
  private sub?: Subscription;

  constructor(private confirmService: ConfirmService) {
    this.sub = this.confirmService.config$.subscribe((c: ConfirmConfig | null) => (this.config = c));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  confirm(): void {
    this.confirmService.onResult(true);
  }

  cancel(): void {
    this.confirmService.onResult(false);
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('confirm-backdrop')) {
      this.cancel();
    }
  }
}
