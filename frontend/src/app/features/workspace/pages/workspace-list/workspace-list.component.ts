import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Plus, Users } from 'lucide-angular';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { WorkspaceStateService } from '../../services/workspace-state.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Workspace } from '../../../../core/models/workspace.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { CreateWorkspaceModalComponent, CreateWorkspaceData } from '../../components/create-workspace-modal/create-workspace-modal.component';

@Component({
  selector: 'app-workspace-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent, CreateWorkspaceModalComponent],
  template: `
    <div class="workspace-list-page">
      <div class="page-header">
        <h1 class="page-title">Workspaces</h1>
        <button class="btn-primary" (click)="createWorkspace()">
          <lucide-icon [name]="icons.Plus" [size]="18" />
          <span>Create Workspace</span>
        </button>
      </div>

      @if (loading()) {
        <div class="workspaces-grid">
          @for (i of [1,2,3,4]; track i) {
            <div class="skeleton skeleton-card"></div>
          }
        </div>
      } @else if (workspaces().length === 0) {
        <app-empty-state
          icon="Briefcase"
          title="No workspaces"
          description="Create your first workspace to get started"
          actionLabel="Create Workspace"
          (action)="createWorkspace()" />
      } @else {
        <div class="workspaces-grid">
          @for (workspace of workspaces(); track workspace.id) {
            <div class="workspace-card" (click)="openWorkspace(workspace.id)">
              <div class="workspace-icon">{{ workspace.name.charAt(0) }}</div>
              <h3 class="workspace-name">{{ workspace.name }}</h3>
              @if (workspace.description) {
                <p class="workspace-description">{{ workspace.description }}</p>
              }
              <div class="workspace-meta">
                <span class="badge" [class.badge-primary]="!isWorkspacePrivate(workspace)" [class.badge-warning]="isWorkspacePrivate(workspace)">
                  {{ isWorkspacePrivate(workspace) ? 'Private' : 'Public' }}
                </span>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Create Workspace Modal -->
    <app-create-workspace-modal
      (workspaceCreated)="onWorkspaceCreated($event)"
      (closed)="createWorkspaceModal.onClose()">
    </app-create-workspace-modal>
  `,
  styles: [`
    .workspace-list-page { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
    .workspaces-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .workspace-card { padding: 2rem; background: white; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.2s; }
    .workspace-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); transform: translateY(-4px); }
    .workspace-icon { width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #2196f3, #1976d2); color: white; font-size: 1.5rem; font-weight: 600; border-radius: 0.75rem; margin-bottom: 1rem; }
    .workspace-name { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
    .workspace-description { font-size: 0.875rem; color: #757575; margin-bottom: 1rem; }
    .workspace-meta { display: flex; gap: 0.5rem; }
  `]
})
export class WorkspaceListComponent implements OnInit {
  readonly icons = { Plus, Users };

  @ViewChild(CreateWorkspaceModalComponent) createWorkspaceModal!: CreateWorkspaceModalComponent;

  /** Read isPrivate; support "isPrivate" or "private" from API. */
  isWorkspacePrivate(w: Workspace): boolean {
    if (!w) return false;
    const o = w as unknown as Record<string, unknown>;
    if (typeof o['isPrivate'] === 'boolean') return o['isPrivate'] as boolean;
    if (typeof o['private'] === 'boolean') return o['private'] as boolean;
    return false;
  }

  workspaces = signal<Workspace[]>([]);
  loading = signal(true);

  constructor(
    private workspaceService: WorkspaceService,
    private workspaceStateService: WorkspaceStateService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  async loadWorkspaces(): Promise<void> {
    try {
      const workspaces = await this.workspaceService.getAllWorkspaces().toPromise();
      this.workspaces.set(workspaces || []);
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    } finally {
      this.loading.set(false);
    }
  }

  createWorkspace(): void {
    this.createWorkspaceModal.open();
  }

  onWorkspaceCreated(data: CreateWorkspaceData): void {
    this.workspaceService.createWorkspace(data).subscribe({
      next: (workspace: Workspace) => {
        // Update local list
        this.workspaces.update(list => [...list, workspace]);

        // Update state service (updates sidebar in real-time)
        this.workspaceStateService.addWorkspace(workspace);

        this.createWorkspaceModal.completeCreation();
        this.router.navigate(['/workspaces', workspace.id]);
      },
      error: (error: unknown) => {
        console.error('Failed to create workspace:', error);
        this.toast.error('Failed to create workspace');
        this.createWorkspaceModal.completeCreation();
      }
    });
  }

  openWorkspace(id: string): void {
    this.router.navigate(['/workspaces', id]);
  }
}
