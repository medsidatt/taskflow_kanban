import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Error State Component
 * Displays an error message with optional retry button
 */
@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-state">
      <div class="error-icon">⚠</div>
      <h3 class="error-title">{{ title }}</h3>
      <p class="error-message" *ngIf="message">{{ message }}</p>
      <button 
        *ngIf="showRetry"
        class="btn btn-primary"
        (click)="retry.emit()">
        Try Again
      </button>
    </div>
  `,
  styles: [`
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      text-align: center;
    }

    .error-icon {
      font-size: 3rem;
      color: #ef4444;
      margin-bottom: 1rem;
    }

    .error-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #991b1b;
      margin-bottom: 0.5rem;
    }

    .error-message {
      font-size: 0.875rem;
      color: #dc2626;
      max-width: 28rem;
      margin-bottom: 1.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.375rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2563eb;
    }
  `]
})
export class ErrorStateComponent {
  @Input() title = 'Something went wrong';
  @Input() message = '';
  @Input() showRetry = true;
  @Output() retry = new EventEmitter<void>();
}
