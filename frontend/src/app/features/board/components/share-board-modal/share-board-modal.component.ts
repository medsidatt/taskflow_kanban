import { Component, signal, computed, DestroyRef, inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LucideAngularModule, UserPlus, Users, Trash2, X } from 'lucide-angular';
import { BoardService } from '../../../../core/services/board.service';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { BoardMember, BoardRole } from '../../../../core/models/board-member.model';
import { UserSummaryDto } from '../../../../core/models/user.model';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar.component';
import { Board } from '../../../../core/models/board.model';

const ROLES: BoardRole[] = ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'];

@Component({
  selector: 'app-share-board-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, UserAvatarComponent],
  templateUrl: './share-board-modal.component.html',
  styleUrls: ['./share-board-modal.component.css']
})
export class ShareBoardModalComponent implements OnInit {
  readonly icons = { UserPlus, Users, Trash2, X };
  readonly roles = ROLES;

  @Input() board: Board | null = null;
  @Output() boardUpdated = new EventEmitter<Board>();

  isOpen = signal(false);
  members = signal<BoardMember[]>([]);
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
    if (!user?.id || !this.board) return null;
    const m = this.members().find(x => x.userId === user.id);
    return m?.role ?? null;
  });

  constructor(
    private boardService: BoardService,
    private userService: UserService,
    private authService: AuthService,
    private toast: ToastService,
    private confirm: ConfirmService
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
    if (this.board) {
      this.loadMembers();
    }
  }

  open(board: Board): void {
    this.board = board;
    this.isOpen.set(true);
    this.showAdd.set(false);
    this.addSearch.set('');
    this.addSearchResults.set([]);
    this.loadMembers();
  }

  close(): void {
    this.isOpen.set(false);
    this.showAdd.set(false);
    this.addSearch.set('');
    this.addSearchResults.set([]);
  }

  private loadMembers(): void {
    if (!this.board?.id) return;
    this.loading.set(true);
    // Members are already loaded in the board object
    // We'll use them directly, but we could also fetch fresh data
    if (this.board.members) {
      this.members.set(this.board.members);
      this.loading.set(false);
    } else {
      // Fallback: reload board to get members
      this.boardService.getBoardById(this.board.id).subscribe({
        next: (board) => {
          this.board = board;
          this.members.set(board.members || []);
        },
        error: () => {
          this.members.set([]);
          this.toast.error('Failed to load members');
        },
        complete: () => this.loading.set(false)
      });
    }
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
        if (!this.board) return;
        const memberIds = new Set((this.members() || []).map(m => m.userId));
        const filtered = (users || []).filter(u => !memberIds.has(u.id));
        this.addSearchResults.set(filtered);
      },
      error: () => this.addSearchResults.set([]),
      complete: () => this.addSearching.set(false)
    });
  }

  addMember(user: UserSummaryDto): void {
    if (!this.board?.id) return;
    this.addingUserId.set(user.id);
    this.boardService.addMember(this.board.id, user.id).subscribe({
      next: () => {
        this.loadMembers();
        this.showAdd.set(false);
        this.addSearch.set('');
        this.addSearchResults.set([]);
        this.toast.success(`Added ${user.username || user.email}`);
        // Reload board to get updated member list
        this.reloadBoard();
      },
      error: () => {
        this.toast.error('Failed to add member');
      },
      complete: () => this.addingUserId.set(null)
    });
  }

  changeRole(member: BoardMember, newRole: BoardRole): void {
    if (!this.board?.id || member.role === newRole) return;
    this.boardService.updateMemberRole(this.board.id, member.userId, newRole).subscribe({
      next: () => {
        this.members.update(list =>
          list.map(m => m.userId === member.userId ? { ...m, role: newRole } : m)
        );
        this.toast.success('Role updated');
        this.reloadBoard();
      },
      error: () => this.toast.error('Failed to update role')
    });
  }

  removeMember(member: BoardMember): void {
    if (!this.board?.id) return;
    const boardId = this.board.id;
    this.confirm.confirm({
      title: 'Remove member',
      message: `Remove ${member.username || member.email} from this board?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      variant: 'danger'
    }).then((ok) => {
      if (!ok || !this.board?.id) return;
      this.boardService.removeMember(boardId, member.userId).subscribe({
        next: () => {
          this.members.update(list => list.filter(m => m.userId !== member.userId));
          this.toast.success('Member removed');
          this.reloadBoard();
        },
        error: () => this.toast.error('Failed to remove member')
      });
    });
  }

  private reloadBoard(): void {
    if (!this.board?.id) return;
    this.boardService.getBoardById(this.board.id).subscribe({
      next: (board) => {
        this.board = board;
        this.members.set(board.members || []);
        this.boardUpdated.emit(board);
      },
      error: () => {
        // Silently fail - board might already be updated
      }
    });
  }

  toggleAdd(): void {
    this.showAdd.update(v => !v);
    if (!this.showAdd()) {
      this.addSearch.set('');
      this.addSearchResults.set([]);
    }
  }

  roleLabel(r: BoardRole): string {
    return r;
  }
}
