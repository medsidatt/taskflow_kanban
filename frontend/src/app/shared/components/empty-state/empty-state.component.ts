import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule, icons } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="empty-state">
      <div class="empty-state-icon">
        <lucide-icon [name]="icon" [size]="48" [strokeWidth]="1.5" />
      </div>
      <h3 class="empty-state-title">{{ title }}</h3>
      <p class="empty-state-description">{{ description }}</p>
      @if (actionLabel) {
        <button class="btn-primary" (click)="action.emit()">
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-state-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      margin-bottom: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 50%;
      color: #9e9e9e;
    }

    .empty-state-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #212121;
      margin-bottom: 0.5rem;
    }

    .empty-state-description {
      font-size: 0.875rem;
      color: #757575;
      margin-bottom: 1.5rem;
      max-width: 400px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: keyof typeof icons = 'Inbox';
  @Input() title: string = 'No data';
  @Input() description: string = 'There is nothing to display here yet.';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}
