import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button 
              type="button" 
              class="modal-close-btn" 
              (click)="close()"
              aria-label="Close modal">
              <lucide-icon [name]="iconX" [size]="20" />
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <ng-content></ng-content>
          </div>

          <!-- Footer (optional) -->
          @if (showFooter) {
            <div class="modal-footer">
              <ng-content select="[modal-footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: var(--z-modal-backdrop, 1040);
      animation: fadeIn 0.15s ease-out;
    }

    .modal-container {
      background: var(--color-background, white);
      border-radius: var(--radius-xl, 0.75rem);
      box-shadow: var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.2s ease-out;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--color-border, #e5e7eb);
    }

    .modal-title {
      font-size: var(--text-xl, 1.25rem);
      font-weight: var(--font-semibold, 600);
      color: var(--color-text, #18181b);
      margin: 0;
    }

    .modal-close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      background: none;
      border: none;
      border-radius: var(--radius-md, 0.375rem);
      color: var(--color-text-secondary, #52525b);
      cursor: pointer;
      transition: all var(--transition-fast, 150ms);
    }

    .modal-close-btn:hover {
      background-color: var(--color-gray-100, #f4f4f5);
      color: var(--color-text, #18181b);
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.5rem;
      border-top: 1px solid var(--color-border, #e5e7eb);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 640px) {
      .modal-container {
        max-width: 100%;
        margin: 0.5rem;
      }
    }
  `]
})
export class ModalComponent implements OnInit {
  readonly iconX = X;
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showFooter = true;
  @Input() closeOnBackdrop = true;
  @Output() closed = new EventEmitter<void>();

  ngOnInit() {
    // Prevent body scroll when modal is open
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  close() {
    this.isOpen = false;
    document.body.style.overflow = '';
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }
}
