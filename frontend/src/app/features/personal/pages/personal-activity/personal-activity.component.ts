import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Activity, Filter } from 'lucide-angular';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-personal-activity',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent],
  template: `
    <div class="personal-activity-page">
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Your Activity</h1>
          <p class="page-subtitle">Track all your recent activities</p>
        </div>

        <div class="header-right">
          <!-- Filter -->
          <div class="filter-controls">
            <button class="filter-btn" [class.active]="activeFilter() === 'all'">
              <lucide-icon [name]="icons.Filter" [size]="18" />
              <span>All Activity</span>
            </button>
            <button class="filter-btn" [class.active]="activeFilter() === 'created'">
              <span>Created</span>
            </button>
            <button class="filter-btn" [class.active]="activeFilter() === 'commented'">
              <span>Commented</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="activity-timeline">
        <!-- Empty State -->
        <app-empty-state
          icon="Activity"
          title="No activity yet"
          description="Your activities will appear here"
          actionLabel="Go to Boards"
          (action)="navigateToBoards()" />
      </div>
    </div>
  `,
  styles: [`
    .personal-activity-page {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      gap: 2rem;
    }

    .header-left {
      flex: 1;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-text, #18181b);
      margin-bottom: 0.5rem;
    }

    .page-subtitle {
      color: var(--color-text-secondary, #52525b);
      font-size: 0.875rem;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .filter-controls {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: white;
      border: 2px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-lg, 0.5rem);
      color: var(--color-text-secondary, #52525b);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast, 150ms);
    }

    .filter-btn:hover {
      border-color: var(--color-primary, #3b82f6);
      color: var(--color-primary, #3b82f6);
    }

    .filter-btn.active {
      background: linear-gradient(135deg, var(--color-primary, #3b82f6), var(--color-primary-600, #2563eb));
      color: white;
      border-color: var(--color-primary, #3b82f6);
    }

    .activity-timeline {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-right {
        width: 100%;
      }

      .filter-controls {
        width: 100%;
      }

      .filter-btn {
        flex: 1;
      }
    }
  `]
})
export class PersonalActivityComponent implements OnInit {
  readonly icons = { Activity, Filter };

  activeFilter = signal<'all' | 'created' | 'commented'>('all');

  ngOnInit(): void {
    // Load personal activity here
  }

  navigateToBoards(): void {
    // Navigate to boards
  }
}
