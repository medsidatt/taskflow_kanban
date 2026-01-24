import { Injectable, signal, computed } from '@angular/core';
import { Workspace } from '../../../core/models/workspace.model';
import { WorkspaceService } from '../../../core/services/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceStateService {
  private readonly STORAGE_KEY = 'taskflow_current_workspace';

  private currentWorkspace = signal<Workspace | null>(null);
  private workspaces = signal<Workspace[]>([]);
  private loading = signal<boolean>(false);
  private viewAllBoards = signal<boolean>(false);

  readonly workspace$ = computed(() => this.currentWorkspace());
  readonly workspaces$ = computed(() => this.workspaces());
  readonly loading$ = computed(() => this.loading());
  readonly viewAllBoards$ = computed(() => this.viewAllBoards());

  constructor(private workspaceService: WorkspaceService) {
    this.loadWorkspaces();
  }

  async loadWorkspaces(): Promise<void> {
    this.loading.set(true);
    try {
      const workspaces = await this.workspaceService.getAllWorkspaces().toPromise();
      this.workspaces.set(workspaces || []);

      // Auto-select workspace
      const savedWorkspaceId = localStorage.getItem(this.STORAGE_KEY);
      if (savedWorkspaceId && workspaces) {
        const saved = workspaces.find((w: Workspace) => w.id === savedWorkspaceId);
        if (saved) {
          this.setCurrentWorkspace(saved);
          return;
        }
      }

      // Default to first workspace
      if (workspaces && workspaces.length > 0) {
        this.setCurrentWorkspace(workspaces[0]);
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    } finally {
      this.loading.set(false);
    }
  }

  setCurrentWorkspace(workspace: Workspace): void {
    this.viewAllBoards.set(false);
    this.currentWorkspace.set(workspace);
    localStorage.setItem(this.STORAGE_KEY, workspace.id);
  }

  setViewAllBoards(value: boolean): void {
    this.viewAllBoards.set(value);
    if (value) {
      this.currentWorkspace.set(null);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  setWorkspaces(workspaces: Workspace[]): void {
    this.workspaces.set(workspaces);
  }

  clearCurrentWorkspace(): void {
    this.currentWorkspace.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  async createWorkspace(data: any): Promise<Workspace | undefined> {
    try {
      const workspace = await this.workspaceService.createWorkspace(data).toPromise();
      if (workspace) {
        this.workspaces.update(list => [...list, workspace]);
        this.setCurrentWorkspace(workspace);
      }
      return workspace;
    } catch (error) {
      console.error('Failed to create workspace:', error);
      return undefined;
    }
  }

  addWorkspace(workspace: Workspace): void {
    this.workspaces.update(list => [...list, workspace]);
    this.setCurrentWorkspace(workspace);
  }
}
