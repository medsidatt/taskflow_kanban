import { Component, DestroyRef, signal, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Plus, LayoutGrid } from 'lucide-angular';
import { BoardService } from '../../../../core/services/board.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Board } from '../../../../core/models/board.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { CreateBoardModalComponent, CreateBoardData } from '../../../board/components/create-board-modal/create-board-modal.component';

@Component({
  selector: 'app-workspace-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    EmptyStateComponent,
    CreateBoardModalComponent
  ],
  template: `
    <div class="workspace-detail-page">
      <div class="page-header">
        <h1 class="page-title">Boards</h1>
        <button class="btn-primary" (click)="createBoard()">
          <lucide-icon [name]="icons.Plus" [size]="18" />
          <span>Create Board</span>
        </button>
      </div>

      @if (loading()) {
        <div class="boards-grid">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="skeleton skeleton-card"></div>
          }
        </div>
      } @else if (boards().length === 0) {
        <app-empty-state
          icon="LayoutGrid"
          title="No boards yet"
          description="Create your first board to get started"
          actionLabel="Create Board"
          (action)="createBoard()" />
      } @else {
        <div class="boards-grid">
          @for (board of boards(); track board.id) {
            <a [routerLink]="['/boards', board.id]" class="board-card">
              <div 
                class="board-card-bg" 
                [style.background]="(board.backgroundColor || board.background_color) 
                  || 'linear-gradient(135deg, var(--primary-500, #3b82f6), var(--primary-600, #2563eb))'">
              </div>
              <div class="board-card-body">
                <h3 class="board-card-title">{{ board.name }}</h3>
                @if (board.description) {
                  <p class="board-card-desc">{{ board.description }}</p>
                }
                @if (board.isPrivate) {
                  <span class="board-badge">Private</span>
                }
              </div>
            </a>
          }
        </div>
      }
    </div>

    <app-create-board-modal
      (boardCreated)="onBoardCreated($event)"
      (closed)="createBoardModal.onClose()">
    </app-create-board-modal>
  `,
  styles: [`
    .workspace-detail-page { padding: var(--spacing-6, 1.5rem); max-width: 1200px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-6, 1.5rem); }
    .page-title { margin: 0; font-size: var(--text-2xl, 1.5rem); font-weight: 600; color: var(--text-primary, #18181b); }
    /* Buttons use global .btn, .btn-primary classes from styles.css */
    .boards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
    .board-card { display: block; background: var(--bg-primary, #fff); border-radius: var(--radius-lg, 0.5rem); overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); transition: box-shadow 0.2s, transform 0.2s; text-decoration: none; color: inherit; }
    .board-card:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.12); transform: translateY(-2px); }
    .board-card-bg { height: 100px; }
    .board-card-body { padding: 1rem; }
    .board-card-title { margin: 0 0 0.25rem 0; font-size: 1rem; font-weight: 600; color: var(--text-primary, #18181b); }
    .board-card-desc { margin: 0; font-size: 0.8125rem; color: var(--text-secondary, #52525b); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .board-badge { display: inline-block; margin-top: 0.5rem; padding: 0.2rem 0.5rem; font-size: 0.7rem; font-weight: 600; color: var(--warning-700, #d97706); background: var(--warning-50, #fffbeb); border-radius: var(--radius-sm, 0.25rem); }
    .skeleton { background: linear-gradient(90deg, var(--gray-200, #e4e4e7) 0%, var(--gray-100, #f4f4f5) 50%, var(--gray-200, #e4e4e7) 100%); background-size: 200% 100%; animation: ws-skel 1.2s ease-in-out infinite; border-radius: var(--radius-lg, 0.5rem); }
    .skeleton-card { height: 180px; }
    @keyframes ws-skel { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `]
})
export class WorkspaceDetailComponent {
  readonly icons = { Plus, LayoutGrid };

  @ViewChild(CreateBoardModalComponent) createBoardModal!: CreateBoardModalComponent;

  boards = signal<Board[]>([]);
  loading = signal(true);
  workspaceId: string | null = null;

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private router: Router,
    private toast: ToastService
  ) {
    // React to workspace :id changes when switching from sidebar dropdown (component is reused)
    const paramMap = this.route.parent?.paramMap;
    if (paramMap) {
      paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
        const id = params.get('id') ?? null;
        this.workspaceId = id;
        if (id) {
          this.boards.set([]);
          this.loadBoards();
        } else {
          this.boards.set([]);
          this.loading.set(false);
        }
      });
    } else {
      this.loading.set(false);
    }
  }

  private loadBoards(): void {
    if (!this.workspaceId) return;
    this.loading.set(true);
    this.boardService.getBoardsByWorkspace(this.workspaceId).subscribe({
      next: (list: Board[]) => this.boards.set(list || []),
      error: () => this.boards.set([]),
      complete: () => this.loading.set(false)
    });
  }

  createBoard(): void {
    this.createBoardModal.open();
  }

  onBoardCreated(data: CreateBoardData): void {
    if (!this.workspaceId) return;
    this.boardService.createBoard({
      name: data.name,
      description: data.description,
      workspaceId: this.workspaceId,
      isPrivate: data.isPrivate,
      backgroundColor: data.backgroundColor
    }).subscribe({
      next: (board: Board) => {
        this.boards.update(list => [...list, board]);
        this.createBoardModal.completeCreation();
        this.router.navigate(['/boards', board.id]);
      },
      error: (err: unknown) => {
        console.error('Failed to create board:', err);
        this.toast.error('Failed to create board');
        this.createBoardModal.completeCreation();
      }
    });
  }
}
