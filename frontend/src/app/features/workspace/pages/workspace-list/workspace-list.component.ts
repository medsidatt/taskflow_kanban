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
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1rem; }
    .page-title { font-size: 1.875rem; font-weight: 700; color: var(--color-text); margin: 0; }
    .workspaces-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .workspace-card { padding: 2rem; background: var(--color-background); border: 1px solid var(--color-border); border-radius: 0.75rem; box-shadow: var(--shadow-sm); cursor: pointer; transition: all 0.2s; }
    .workspace-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); border-color: var(--color-border-dark); }
    .workspace-icon { width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); color: white; font-size: 1.5rem; font-weight: 600; border-radius: 0.75rem; margin-bottom: 1rem; }
    .workspace-name { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--color-text); }
    .workspace-description { font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1rem; }
    .workspace-meta { display: flex; gap: 0.5rem; }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; border-radius: 0.375rem; }
    .badge-primary { background: rgba(59, 130, 246, 0.1); color: var(--color-primary, #3b82f6); border: 1px solid rgba(59, 130, 246, 0.2); }
    .badge-warning { background: rgba(245, 158, 11, 0.15); color: var(--color-warning, #f59e0b); border: 1px solid rgba(245, 158, 11, 0.3); }
    [data-theme="dark"] .badge-primary { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border-color: rgba(59, 130, 246, 0.4); }
    [data-theme="dark"] .badge-warning { background: rgba(245, 158, 11, 0.25); color: #fbbf24; border-color: rgba(245, 158, 11, 0.4); }
    .btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600; color: #fff; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); border: none; border-radius: 0.5rem; cursor: pointer; transition: opacity 0.2s; }
    .btn-primary:hover:not(:disabled) { opacity: 0.9; }
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
