import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, Lock, Unlock, Trash2, AlertTriangle } from 'lucide-angular';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { WorkspaceStateService } from '../../services/workspace-state.service';
import { Workspace } from '../../../../core/models/workspace.model';
import { WorkspaceMember } from '../../../../core/models/workspace-member.model';

@Component({
  selector: 'app-workspace-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './workspace-settings.component.html',
  styleUrls: ['./workspace-settings.component.css']
})
export class WorkspaceSettingsComponent implements OnInit {
  readonly icons = { Lock, Unlock, Trash2, AlertTriangle };

  workspaceId = signal<string | null>(null);
  workspace = signal<Workspace | null>(null);
  members = signal<WorkspaceMember[]>([]);
  loading = signal(true);
  saving = signal(false);
  deleting = signal(false);

  formName = signal('');
  formDescription = signal('');
  formIsPrivate = signal(false);

  canEdit = computed(() => {
    const r = this.myRole();
    return r === 'ADMIN' || r === 'OWNER';
  });

  isOwner = computed(() => this.myRole() === 'OWNER');

  myRole = computed(() => {
    const uid = this.authService.getCurrentUser()?.id;
    if (!uid) return null;
    const m = this.members().find(x => x.userId === uid);
    return m?.role ?? null;
  });

  workspaceName = computed(() => this.workspace()?.name ?? 'Workspace');

  /** Read isPrivate; support "isPrivate" or "private" from API. */
  private readIsPrivate(w: Workspace | null): boolean {
    if (!w) return false;
    const o = w as unknown as Record<string, unknown>;
    if (typeof o['isPrivate'] === 'boolean') return o['isPrivate'] as boolean;
    if (typeof o['private'] === 'boolean') return o['private'] as boolean;
    return false;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workspaceService: WorkspaceService,
    private authService: AuthService,
    private toast: ToastService,
    private confirm: ConfirmService,
    private workspaceStateService: WorkspaceStateService
  ) {}

  ngOnInit(): void {
    const id = this.route.parent?.snapshot?.paramMap?.get('id') ?? null;
    this.workspaceId.set(id);
    if (id) {
      this.loadWorkspace(id);
      this.loadMembers(id);
    } else {
      this.loading.set(false);
    }
  }

  private loadWorkspace(id: string): void {
    this.workspaceService.getWorkspaceById(id).subscribe({
      next: (w) => {
        this.workspace.set(w);
        this.formName.set(w.name ?? '');
        this.formDescription.set(w.description ?? '');
        this.formIsPrivate.set(this.readIsPrivate(w));
      },
      error: () => this.toast.error('Failed to load workspace'),
      complete: () => this.loading.set(false)
    });
  }

  private loadMembers(id: string): void {
    this.workspaceService.getMembers(id).subscribe({
      next: (list) => this.members.set(list ?? []),
      error: () => this.members.set([])
    });
  }

  async save(): Promise<void> {
    const id = this.workspaceId();
    if (!id || !this.canEdit()) return;

    const name = this.formName().trim();
    if (!name) {
      this.toast.error('Name is required');
      return;
    }

    this.saving.set(true);
    try {
      const updated = await this.workspaceService.updateWorkspace(id, {
        name,
        description: this.formDescription().trim() || undefined,
        isPrivate: this.formIsPrivate()
      }).toPromise();

      if (updated) {
        this.workspace.set(updated);
        this.workspaceStateService.setCurrentWorkspace(updated);
        this.workspaceStateService.setWorkspaces(
          this.workspaceStateService.workspaces$().map(w => w.id === updated.id ? updated : w)
        );
        this.toast.success('Workspace updated');
      }
    } catch {
      this.toast.error('Failed to update workspace');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteWorkspace(): Promise<void> {
    const w = this.workspace();
    const id = this.workspaceId();
    if (!id || !w) return;
    if (!this.isOwner()) {
      this.toast.error('Only the owner can delete the workspace');
      return;
    }

    const ok = await this.confirm.confirm({
      title: 'Delete workspace',
      message: `This will permanently delete "${w.name}" and all its boards, columns, and cards. This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!ok) return;

    this.deleting.set(true);
    try {
      await this.workspaceService.deleteWorkspace(id).toPromise();
      this.workspaceStateService.clearCurrentWorkspace();
      this.toast.success('Workspace deleted');
      await this.router.navigate(['/workspaces']);
    } catch {
      this.toast.error('Failed to delete workspace');
    } finally {
      this.deleting.set(false);
    }
  }
}
