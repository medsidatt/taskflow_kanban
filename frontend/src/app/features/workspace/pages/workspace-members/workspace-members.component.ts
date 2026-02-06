import { Component, OnInit, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { LucideAngularModule, UserPlus, Users, Trash2 } from 'lucide-angular';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { WorkspaceStateService } from '../../services/workspace-state.service';
import { WorkspaceMember, WorkspaceRole } from '../../../../core/models/workspace-member.model';
import { UserSummaryDto } from '../../../../core/models/user.model';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar.component';

const ROLES: WorkspaceRole[] = ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'];

@Component({
  selector: 'app-workspace-members',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, UserAvatarComponent],
  templateUrl: './workspace-members.component.html',
  styleUrls: ['./workspace-members.component.css']
})
export class WorkspaceMembersComponent implements OnInit {
  readonly icons = { UserPlus, Users, Trash2 };
  readonly roles = ROLES;

  workspaceId = signal<string | null>(null);
  members = signal<WorkspaceMember[]>([]);
  loading = signal(true);
  showAdd = signal(false);
  addSearch = signal('');
  addSearchResults = signal<UserSummaryDto[]>([]);
  addSearching = signal(false);
  addingUserId = signal<string | null>(null);

  private search$ = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  canManage = computed(() => {
    const myRole = this.myRole();
    return myRole === 'ADMIN' || myRole === 'OWNER';
  });

  myRole = computed(() => {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return null;
    const m = this.members().find(x => x.userId === user.id);
    return m?.role ?? null;
  });

  currentUserId = computed(() => this.authService.getCurrentUser()?.id);

  sortedMembers = computed(() => {
    const roleOrder: Record<WorkspaceRole, number> = { OWNER: 0, ADMIN: 1, MEMBER: 2, VIEWER: 3 };
    return [...this.members()].sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);
  });

  workspaceName = computed(() => this.workspaceStateService.workspace$()?.name ?? 'Workspace');

  constructor(
    private route: ActivatedRoute,
    private workspaceService: WorkspaceService,
    private userService: UserService,
    private authService: AuthService,
    private toast: ToastService,
    private confirm: ConfirmService,
    private workspaceStateService: WorkspaceStateService
  ) {
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((q) => this.doUserSearch(q));
  }

  ngOnInit(): void {
    const id = this.route.parent?.snapshot?.paramMap?.get('id') ?? null;
    this.workspaceId.set(id);
    if (id) this.loadMembers(id);
    else this.loading.set(false);
  }

  private loadMembers(workspaceId: string): void {
    this.loading.set(true);
    this.workspaceService.getMembers(workspaceId).subscribe({
      next: (list) => this.members.set(list || []),
      error: () => { this.members.set([]); this.toast.error('Failed to load members'); },
      complete: () => this.loading.set(false)
    });
  }

  onAddSearchInput(v: string): void {
    this.addSearch.set(v);
    this.search$.next(v);
  }

  private doUserSearch(q: string): void {
    const t = (q || '').trim();
    if (!t) {
      this.addSearchResults.set([]);
      return;
    }
    this.addSearching.set(true);
    this.userService.searchUsers(t).subscribe({
      next: (users) => {
        const wid = this.workspaceId();
        const memberIds = new Set((this.members() || []).map(m => m.userId));
        const filtered = (users || []).filter(u => !memberIds.has(u.id));
        this.addSearchResults.set(filtered);
      },
      error: () => this.addSearchResults.set([]),
      complete: () => this.addSearching.set(false)
    });
  }

  addMember(user: UserSummaryDto): void {
    const wid = this.workspaceId();
    if (!wid) return;
    this.addingUserId.set(user.id);
    this.workspaceService.addMember(wid, user.id).subscribe({
      next: () => {
        this.loadMembers(wid);
        this.showAdd.set(false);
        this.addSearch.set('');
        this.addSearchResults.set([]);
        this.toast.success(`Added ${user.username || user.email}`);
      },
      error: () => {
        this.toast.error('Failed to add member');
      },
      complete: () => this.addingUserId.set(null)
    });
  }

  changeRole(member: WorkspaceMember, newRole: WorkspaceRole): void {
    const wid = this.workspaceId();
    if (!wid || member.role === newRole) return;
    this.workspaceService.updateMemberRole(wid, member.userId, newRole).subscribe({
      next: () => {
        this.members.update(list =>
          list.map(m => m.userId === member.userId ? { ...m, role: newRole } : m)
        );
        this.toast.success('Role updated');
      },
      error: () => this.toast.error('Failed to update role')
    });
  }

  removeMember(member: WorkspaceMember): void {
    const wid = this.workspaceId();
    if (!wid) return;
    this.confirm.confirm({
      title: 'Remove member',
      message: `Remove ${member.username || member.email} from this workspace?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      variant: 'danger'
    }).then((ok) => {
      if (!ok) return;
      this.workspaceService.removeMember(wid, member.userId).subscribe({
        next: () => {
          this.members.update(list => list.filter(m => m.userId !== member.userId));
          this.toast.success('Member removed');
        },
        error: () => this.toast.error('Failed to remove member')
      });
    });
  }

  toggleAdd(): void {
    this.showAdd.update(v => !v);
    if (!this.showAdd()) {
      this.addSearch.set('');
      this.addSearchResults.set([]);
    }
  }

  roleLabel(r: WorkspaceRole): string {
    return r;
  }
}
