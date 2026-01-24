const FAVORITE_STORAGE_KEY = 'taskflow-favorite-board-ids';

function loadFavoriteIds(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITE_STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveFavoriteIds(ids: Set<string>): void {
  localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify([...ids]));
}

import { Component, OnInit, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Share2, Grid, List as ListIcon, Plus, Star, Archive, ArchiveRestore, Edit2, Trash2 } from 'lucide-angular';
import { BoardService } from '../../../../core/services/board.service';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { Board } from '../../../../core/models/board.model';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { EditBoardModalComponent } from '../../components/edit-board-modal/edit-board-modal.component';

@Component({
  selector: 'app-shared-boards',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    UserAvatarComponent,
    EmptyStateComponent,
    EditBoardModalComponent
  ],
  templateUrl: './shared-boards.component.html',
  styleUrls: ['../board-list/board-list.component.css']
})
export class SharedBoardsComponent implements OnInit {
  readonly icons = { Share2, Grid, ListIcon, Plus, Star, Archive, ArchiveRestore, Edit2, Trash2 };

  boards = signal<Board[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  favoriteIds = signal<Set<string>>(new Set());
  viewMode = signal<'grid' | 'list'>('grid');

  @ViewChild(EditBoardModalComponent) editBoardModal!: EditBoardModalComponent;

  constructor(
    private boardService: BoardService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  private get currentUserId(): string | null {
    return this.authService.getCurrentUser()?.id ?? null;
  }

  isSharedWithMe(board: Board): boolean {
    const uid = this.currentUserId;
    if (!uid || !board.members) return false;
    const me = board.members.find(m => m.userId === uid);
    return !!me && me.role !== 'OWNER';
  }

  sharedBoards = computed(() => {
    const uid = this.currentUserId;
    const query = this.searchQuery().toLowerCase();
    return (this.boards() || []).filter(b => {
      if (b.archived) return false;
      const me = b.members?.find(m => m.userId === uid);
      if (!me || me.role === 'OWNER') return false;
      if (query && !b.name.toLowerCase().includes(query) && !(b.description || '').toLowerCase().includes(query)) return false;
      return true;
    });
  });

  favoriteShared = computed(() => {
    const ids = this.favoriteIds();
    return this.sharedBoards().filter(b => ids.has(b.id));
  });

  archivedShared = computed(() => {
    const uid = this.currentUserId;
    return (this.boards() || []).filter(b => {
      if (!b.archived) return false;
      const me = b.members?.find(m => m.userId === uid);
      return !!me && me.role !== 'OWNER';
    });
  });

  ngOnInit(): void {
    this.favoriteIds.set(loadFavoriteIds());
    const mode = localStorage.getItem('taskflow_board_view_mode');
    if (mode === 'grid' || mode === 'list') this.viewMode.set(mode);
    this.loadBoards();
  }

  loadBoards(): void {
    this.loading.set(true);
    this.boardService.getAllBoards().subscribe({
      next: (list) => this.boards.set(list || []),
      error: () => { this.boards.set([]); this.toast.error('Failed to load boards'); },
      complete: () => this.loading.set(false)
    });
  }

  isFavorite(id: string): boolean {
    return this.favoriteIds().has(id);
  }

  toggleFavorite(boardId: string, e: Event): void {
    e.stopPropagation();
    const next = new Set(this.favoriteIds());
    if (next.has(boardId)) {
      next.delete(boardId);
      this.toast.info('Removed from favorites');
    } else {
      next.add(boardId);
      this.toast.success('Added to favorites');
    }
    this.favoriteIds.set(next);
    saveFavoriteIds(next);
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
    localStorage.setItem('taskflow_board_view_mode', mode);
  }

  openBoard(id: string): void {
    this.router.navigate(['/boards', id]);
  }

  editBoard(board: Board, e: Event): void {
    e.stopPropagation();
    this.editBoardModal.open(board);
  }

  onBoardUpdated(updated: Board): void {
    this.boards.update(list => list.map(b => b.id === updated.id ? updated : b));
  }

  deleteBoard(board: Board, e: Event): void {
    e.stopPropagation();
    this.confirm.confirm({
      title: 'Delete board',
      message: `Are you sure you want to delete "${board.name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    }).then(ok => {
      if (!ok) return;
      this.boardService.deleteBoard(board.id).subscribe({
        next: () => this.boards.update(list => list.filter(b => b.id !== board.id)),
        error: () => this.toast.error('Failed to delete board')
      });
    });
  }

  archiveBoard(board: Board, e: Event): void {
    e.stopPropagation();
    this.boardService.updateBoard(board.id, { archived: true }).subscribe({
      next: (u) => { this.boards.update(l => l.map(b => b.id === board.id ? u : b)); this.toast.success('Board archived'); },
      error: () => this.toast.error('Failed to archive board')
    });
  }

  restoreBoard(board: Board, e: Event): void {
    e.stopPropagation();
    this.boardService.updateBoard(board.id, { archived: false }).subscribe({
      next: (u) => { this.boards.update(l => l.map(b => b.id === board.id ? u : b)); this.toast.success('Board restored'); },
      error: () => this.toast.error('Failed to restore board')
    });
  }

  goToBoards(): void {
    this.router.navigate(['/boards']);
  }
}
