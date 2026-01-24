const FAVORITE_STORAGE_KEY = 'taskflow-favorite-board-ids';
const VIEW_MODE_STORAGE_KEY = 'taskflow_board_view_mode';

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

import { Component, signal, computed, effect, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Grid, List as ListIcon, Plus, Star, Clock, Archive, ArchiveRestore, Edit2, Trash2 } from 'lucide-angular';
import { WorkspaceStateService } from '../../../workspace/services/workspace-state.service';
import { BoardService } from '../../../../core/services/board.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { Board } from '../../../../core/models/board.model';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { CreateBoardModalComponent, CreateBoardData } from '../../components/create-board-modal/create-board-modal.component';
import { EditBoardModalComponent } from '../../components/edit-board-modal/edit-board-modal.component';

@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    UserAvatarComponent,
    EmptyStateComponent,
    CreateBoardModalComponent,
    EditBoardModalComponent
  ],
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class BoardListComponent implements OnInit {
  // Icons
  readonly icons = {
    Grid,
    ListIcon,
    Plus,
    Star,
    Clock,
    Archive,
    ArchiveRestore,
    Edit2,
    Trash2
  };

  // View Child
  @ViewChild(CreateBoardModalComponent) createBoardModal!: CreateBoardModalComponent;
  @ViewChild(EditBoardModalComponent) editBoardModal!: EditBoardModalComponent;

  // View mode
  viewMode = signal<'grid' | 'list'>('grid');

  // Favorites (persisted in localStorage)
  favoriteIds = signal<Set<string>>(new Set());

  // State
  boards = signal<Board[]>([]);
  loading = signal(true);
  searchQuery = signal('');

  // Current workspace (from state service); use getters to avoid init order
  get currentWorkspace() { return this.workspaceStateService.workspace$; }
  get workspaceLoading() { return this.workspaceStateService.loading$; }
  get workspaces() { return this.workspaceStateService.workspaces$; }
  get viewAllBoards() { return this.workspaceStateService.viewAllBoards$; }

  // Filtered boards (active only)
  filteredBoards = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const allBoards = this.boards().filter(b => !b.archived);

    if (!query) return allBoards;

    return allBoards.filter(b =>
      b.name.toLowerCase().includes(query) ||
      b.description?.toLowerCase().includes(query)
    );
  });

  // Favorites (subset of filtered, excludes search to keep section stable)
  favoriteBoards = computed(() => {
    const ids = this.favoriteIds();
    return this.filteredBoards().filter(b => ids.has(b.id));
  });

  archivedBoards = computed(() => this.boards().filter(b => b.archived));

  constructor(
    private workspaceStateService: WorkspaceStateService,
    private boardService: BoardService,
    private router: Router,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {
    // Reload boards when workspace or "all boards" mode changes
    effect(() => {
      this.workspaceStateService.workspace$();
      this.workspaceStateService.viewAllBoards$();
      this.loadBoards();
    });
  }

  ngOnInit(): void {
    this.favoriteIds.set(loadFavoriteIds());
    const mode = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (mode === 'grid' || mode === 'list') this.viewMode.set(mode);
  }

  isFavorite(boardId: string): boolean {
    return this.favoriteIds().has(boardId);
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

  async loadBoards(): Promise<void> {
    if (this.viewAllBoards()) {
      this.loading.set(true);
      try {
        const boards = await this.boardService.getAllBoards().toPromise();
        this.boards.set(boards || []);
      } catch (error) {
        console.error('Failed to load boards:', error);
        this.boards.set([]);
      } finally {
        this.loading.set(false);
      }
      return;
    }

    const workspace = this.currentWorkspace();
    if (!workspace) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    try {
      const boards = await this.boardService.getBoardsByWorkspace(workspace.id).toPromise();
      this.boards.set(boards || []);
    } catch (error) {
      console.error('Failed to load boards:', error);
    } finally {
      this.loading.set(false);
    }
  }

  goToWorkspaces(): void {
    this.router.navigate(['/workspaces']);
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  }

  openBoard(boardId: string): void {
    this.router.navigate(['/boards', boardId]);
  }

  createBoard(): void {
    this.createBoardModal.open();
  }

  onBoardCreated(data: CreateBoardData): void {
    const workspace = this.currentWorkspace();
    if (!workspace) return;

    this.boardService.createBoard({
      name: data.name,
      description: data.description,
      workspaceId: workspace.id,
      isPrivate: data.isPrivate,
      backgroundColor: data.backgroundColor
    }).subscribe({
      next: (board: Board) => {
        this.boards.update(list => [...list, board]);
        this.createBoardModal.completeCreation();
        this.router.navigate(['/boards', board.id]);
      },
      error: (error: unknown) => {
        console.error('Failed to create board:', error);
        this.toast.error('Failed to create board');
        this.createBoardModal.completeCreation();
      }
    });
  }

  editBoard(board: Board, event: Event): void {
    event.stopPropagation();
    this.editBoardModal.open(board);
  }

  onBoardUpdated(updated: Board): void {
    this.boards.update(list => list.map(b => b.id === updated.id ? updated : b));
  }

  deleteBoard(board: Board, event: Event): void {
    event.stopPropagation();
    this.confirm.confirm({
      title: 'Delete board',
      message: `Are you sure you want to delete "${board.name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    }).then(ok => {
      if (!ok) return;
      this.boardService.deleteBoard(board.id).subscribe({
        next: () => {
          this.boards.update(list => list.filter(b => b.id !== board.id));
        },
        error: (error: unknown) => {
          console.error('Failed to delete board:', error);
          this.toast.error('Failed to delete board');
        }
      });
    });
  }

  archiveBoard(board: Board, event: Event): void {
    event.stopPropagation();
    this.boardService.updateBoard(board.id, { archived: true }).subscribe({
      next: (updated) => {
        this.boards.update(list => list.map(b => b.id === board.id ? updated : b));
        this.toast.success('Board archived');
      },
      error: () => this.toast.error('Failed to archive board')
    });
  }

  restoreBoard(board: Board, event: Event): void {
    event.stopPropagation();
    this.boardService.updateBoard(board.id, { archived: false }).subscribe({
      next: (updated) => {
        this.boards.update(list => list.map(b => b.id === board.id ? updated : b));
        this.toast.success('Board restored');
      },
      error: () => this.toast.error('Failed to restore board')
    });
  }

}
