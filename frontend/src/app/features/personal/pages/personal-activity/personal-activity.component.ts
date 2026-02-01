import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Activity, Filter } from 'lucide-angular';
import { ActivityService } from '../../../../core/services/activity.service';
import { ActivityLog } from '../../../../core/models/card.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-personal-activity',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent, UserAvatarComponent],
  template: `
    <div class="personal-activity-page">
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Your Activity</h1>
          <p class="page-subtitle">Track all your recent activities</p>
        </div>

        <div class="header-right">
          <div class="filter-controls">
            <button class="filter-btn" [class.active]="activeFilter() === 'all'" (click)="activeFilter.set('all')">
              <lucide-icon [name]="icons.Filter" [size]="18" />
              <span>All Activity</span>
            </button>
            <button class="filter-btn" [class.active]="activeFilter() === 'created'" (click)="activeFilter.set('created')">
              <span>Created</span>
            </button>
            <button class="filter-btn" [class.active]="activeFilter() === 'commented'" (click)="activeFilter.set('commented')">
              <span>Commented</span>
            </button>
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="activity-loading">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="skeleton" style="height: 80px; margin-bottom: 1rem; border-radius: 8px; background: var(--color-border, #e5e7eb);"></div>
          }
        </div>
      } @else if (filteredActivities().length === 0) {
        <app-empty-state
          icon="Activity"
          title="No activity yet"
          description="Your activities will appear here"
          actionLabel="Go to Boards"
          (action)="navigateToBoards()" />
      } @else {
        <div class="activity-timeline">
          @for (activity of filteredActivities(); track activity.id) {
            <div class="activity-item">
              <div class="activity-avatar">
                <app-user-avatar [name]="activity.performedByUsername || 'User'" size="md" />
              </div>
              <div class="activity-content">
                <div class="activity-header">
                  <span class="activity-user">{{ activity.performedByUsername || 'You' }}</span>
                  <span class="activity-action">{{ activity.action }}</span>
                  <span class="activity-entity">{{ activity.entityType }}</span>
                </div>
                @if (activity.details) {
                  <p class="activity-details">{{ activity.details }}</p>
                }
                <span class="activity-time">{{ activity.timestamp | date:'medium' }}</span>
              </div>
            </div>
          }
        </div>
      }
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

    .activity-loading {
      padding: 1rem 0;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: var(--radius-lg, 0.5rem);
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
    }

    .activity-avatar { flex-shrink: 0; }
    .activity-content { flex: 1; }
    .activity-header { margin-bottom: 0.5rem; }
    .activity-user { font-weight: 600; color: var(--color-text, #18181b); }
    .activity-action { margin-left: 0.5rem; color: var(--color-text-secondary, #52525b); }
    .activity-entity {
      margin-left: 0.25rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      background: var(--color-primary-50, #eff6ff);
      color: var(--color-primary, #3b82f6);
      border-radius: var(--radius-sm, 0.25rem);
    }
    .activity-details { font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 0.5rem; }
    .activity-time { font-size: 0.75rem; color: var(--color-text-light, #a1a1aa); }

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

  activities = signal<ActivityLog[]>([]);
  loading = signal(true);
  activeFilter = signal<'all' | 'created' | 'commented'>('all');

  filteredActivities = computed(() => {
    const list = this.activities();
    const filter = this.activeFilter();
    if (filter === 'all') return list;
    if (filter === 'created') return list.filter(a => a.action === 'CREATE');
    if (filter === 'commented') return list.filter(a => a.action?.includes('COMMENT'));
    return list;
  });

  constructor(
    private activityService: ActivityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  async loadActivities(): Promise<void> {
    this.loading.set(true);
    try {
      const activities = await this.activityService.getMyActivities().toPromise();
      this.activities.set(activities || []);
    } catch (error) {
      console.error('Failed to load activities:', error);
      this.activities.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  navigateToBoards(): void {
    this.router.navigate(['/boards']);
  }
}
