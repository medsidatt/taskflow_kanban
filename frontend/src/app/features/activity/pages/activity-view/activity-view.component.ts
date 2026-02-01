import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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

  private workspaceId = signal<string | null>(null);
  currentWorkspace = computed(() => {
    const id = this.workspaceId();
    if (!id) return null;
    return this.workspaceStateService.workspaces$().find(w => w.id === id) ?? { id, name: 'Workspace' };
  });

  constructor(
    private activityService: ActivityService,
    private workspaceStateService: WorkspaceStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.parent?.snapshot?.paramMap?.get('id') ?? null;
    this.workspaceId.set(id);
    this.loadActivities();
  }

  async loadActivities(): Promise<void> {
    const workspaceId = this.workspaceId();
    this.loading.set(true);
    try {
      if (workspaceId) {
        const activities = await this.activityService.getActivitiesByWorkspace(workspaceId).toPromise();
        this.activities.set(activities || []);
      } else {
        const activities = await this.activityService.getMyActivities().toPromise();
        this.activities.set(activities || []);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
      this.activities.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
