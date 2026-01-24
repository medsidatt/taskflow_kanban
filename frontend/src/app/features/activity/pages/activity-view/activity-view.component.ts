import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Activity, Filter } from 'lucide-angular';
import { ActivityService } from '../../../../core/services/activity.service';
import { ActivityLog } from '../../../../core/models/card.model';
import { WorkspaceStateService } from '../../../workspace/services/workspace-state.service';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-activity-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, UserAvatarComponent, EmptyStateComponent],
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.css']
})
export class ActivityViewComponent implements OnInit {
  readonly icons = { Activity, Filter };

  activities = signal<ActivityLog[]>([]);
  loading = signal(true);
  filterType = signal<string>('all');

  currentWorkspace: any;

  constructor(
    private activityService: ActivityService,
    private workspaceStateService: WorkspaceStateService
  ) {
    // Initialize workspace data from service
    this.currentWorkspace = this.workspaceStateService.workspace$;
  }

  ngOnInit(): void {
    this.loadActivities();
  }

  async loadActivities(): Promise<void> {
    this.loading.set(true);
    try {
      // In a real app, you'd fetch workspace-wide activities
      // For now, this is a placeholder
      const workspaceId = this.currentWorkspace()?.id || '';
      if (workspaceId) {
        const activities = await this.activityService.getActivitiesByEntity(workspaceId).toPromise();
        this.activities.set(activities || []);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
