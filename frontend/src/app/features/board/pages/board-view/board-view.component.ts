import { Component, OnInit, OnDestroy, signal, computed, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LucideAngularModule, Plus, MoreVertical, X, Edit2, Trash2, Users, Tag, Calendar, Lock, Unlock, Archive, ArchiveRestore, CheckCircle, Circle, GripVertical } from 'lucide-angular';
import { BoardService } from '../../../../core/services/board.service';
import { ColumnService } from '../../../../core/services/column.service';
import { CardService } from '../../../../core/services/card.service';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Board } from '../../../../core/models/board.model';
import { BoardColumn } from '../../../../core/models/board-column.model';
import { Card } from '../../../../core/models/card.model';
import { forkJoin } from 'rxjs';
import { normalizeToSingleLine } from '../../../../core/utils/text.utils';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CardDetailModalComponent } from '../../components/card-detail-modal/card-detail-modal.component';
import { EditBoardModalComponent } from '../../components/edit-board-modal/edit-board-modal.component';
import { ShareBoardModalComponent } from '../../components/share-board-modal/share-board-modal.component';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    LucideAngularModule,
    UserAvatarComponent,
    ModalComponent,
    CardDetailModalComponent,
    EditBoardModalComponent,
    ShareBoardModalComponent
  ],
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit, OnDestroy {
  // Icons
  readonly icons = { Plus, MoreVertical, X, Edit2, Trash2, Users, Tag, Calendar, Lock, Unlock, Archive, ArchiveRestore, CheckCircle, Circle, GripVertical };

  @ViewChild(EditBoardModalComponent) editBoardModal!: EditBoardModalComponent;
  @ViewChild(ShareBoardModalComponent) shareBoardModal!: ShareBoardModalComponent;

  private refreshInterval: ReturnType<typeof setInterval> | null = null;

  // State
  board = signal<Board | null>(null);
  columns = signal<BoardColumn[]>([]);
  cardsByColumn = signal<Map<string, Card[]>>(new Map());
  loading = signal(true);

  // UI State
  showAddColumn = signal(false);
  newColumnTitle = signal('');
  editingColumnId = signal<string | null>(null);
  addingCardToColumn = signal<string | null>(null);
  newCardTitle = signal('');
  boardMenuOpen = signal(false);
  columnMenuId = signal<string | null>(null);
  cardMenuCardId = signal<string | null>(null);
  showArchivedModal = signal(false);
  showArchivedColumns = signal(false);
  archivedCards = signal<Card[]>([]);
  selectedCard = signal<Card | null>(null);

  // Computed
  boardTitle = computed(() => this.board()?.name || 'Board');
  boardColor = computed(() => this.board()?.backgroundColor || this.board()?.background_color || null);
  columnsActive = computed(() => (this.columns() || []).filter(c => !c.archived));
  columnsArchived = computed(() => (this.columns() || []).filter(c => c.archived));

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private boardService: BoardService,
    private columnService: ColumnService,
    private cardService: CardService,
    private confirm: ConfirmService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('id');
    if (boardId) {
      this.loadBoard(boardId);
    }
    this.refreshInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible' && this.board()?.id) {
        this.loadBoard(this.board()!.id, { background: true });
      }
    }, 60_000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      const id = this.route.snapshot.paramMap.get('id') ?? this.board()?.id;
      if (id) this.loadBoard(id, { background: true });
    }
  }

  async loadBoard(boardId: string, options?: { background?: boolean }): Promise<void> {
    if (!options?.background) this.loading.set(true);
    try {
      // Load board
      const board = await this.boardService.getBoardById(boardId).toPromise();
      this.board.set(board || null);

      // Load columns
      const columns = await this.columnService.getColumnsByBoard(boardId).toPromise();
      const sortedColumns = (columns || []).sort((a: BoardColumn, b: BoardColumn) => a.position - b.position);
      this.columns.set(sortedColumns);

      // Load cards for each column
      const cardsMap = new Map<string, Card[]>();
      for (const column of sortedColumns) {
        const cards = await this.cardService.getCardsByColumn(column.id).toPromise();
        const sortedCards = (cards || []).sort((a: Card, b: Card) => a.position - b.position);
        cardsMap.set(column.id, sortedCards);
      }
      this.cardsByColumn.set(cardsMap);

    } catch (error) {
      console.error('Failed to load board:', error);
      this.toast.error('Failed to load board. You may not have access or the board may not exist.');
    } finally {
      this.loading.set(false);
    }
  }

  getCardsForColumn(columnId: string): Card[] {
    return (this.cardsByColumn().get(columnId) || []).filter(c => !c.archived);
  }

  closeMenus(): void {
    this.boardMenuOpen.set(false);
    this.columnMenuId.set(null);
    this.cardMenuCardId.set(null);
  }

  async archiveBoard(): Promise<void> {
    const b = this.board();
    if (!b) return;
    this.closeMenus();
    try {
      const updated = await this.boardService.updateBoard(b.id, { archived: true }).toPromise();
      if (updated) this.board.set(updated);
      this.toast.success('Board archived');
    } catch { this.toast.error('Failed to archive board'); }
  }

  async restoreBoard(): Promise<void> {
    const b = this.board();
    if (!b) return;
    try {
      const updated = await this.boardService.updateBoard(b.id, { archived: false }).toPromise();
      if (updated) this.board.set(updated);
      this.toast.success('Board restored');
    } catch { this.toast.error('Failed to restore board'); }
  }

  async setBoardPrivate(value: boolean): Promise<void> {
    const b = this.board();
    if (!b) return;
    this.closeMenus();
    try {
      const updated = await this.boardService.updateBoard(b.id, { isPrivate: value }).toPromise();
      if (updated) this.board.set(updated);
      this.toast.success(value ? 'Board is now private' : 'Board is now public');
    } catch { this.toast.error('Failed to update visibility'); }
  }

  openEditBoard(): void {
    const b = this.board();
    if (!b) return;
    this.closeMenus();
    this.editBoardModal.open(b);
  }

  onBoardEditSaved(updated: Board): void {
    this.board.set(updated);
  }

  openShareBoard(): void {
    const b = this.board();
    if (!b) return;
    this.shareBoardModal.open(b);
  }

  openArchivedModal(): void {
    this.closeMenus();
    this.showArchivedModal.set(true);
    this.loadArchivedCards();
  }

  async loadArchivedCards(): Promise<void> {
    const b = this.board();
    if (!b) return;
    try {
      const list = await this.boardService.getArchivedCardsByBoard(b.id).toPromise();
      this.archivedCards.set(list || []);
    } catch { this.archivedCards.set([]); }
  }

  async restoreCard(card: Card): Promise<void> {
    try {
      await this.cardService.updateCard(card.id, { archived: false }).toPromise();
      this.archivedCards.update(l => l.filter(c => c.id !== card.id));
      this.cardsByColumn.update(m => {
        const next = new Map(m);
        const col = next.get(card.columnId) || [];
        if (!col.some(c => c.id === card.id)) {
          next.set(card.columnId, [...col, { ...card, archived: false }].sort((a, b) => a.position - b.position));
        }
        return next;
      });
      this.toast.success('Card restored');
    } catch { this.toast.error('Failed to restore card'); }
  }

  async archiveColumn(columnId: string): Promise<void> {
    this.closeMenus();
    try {
      const updated = await this.columnService.updateColumn(columnId, { archived: true }).toPromise();
      if (updated) this.columns.update(cols => cols.map(c => c.id === columnId ? updated : c));
      this.toast.success('List archived');
    } catch { this.toast.error('Failed to archive list'); }
  }

  async restoreColumn(col: BoardColumn): Promise<void> {
    const active = this.columnsActive();
    try {
      const updated = await this.columnService.updateColumn(col.id, { archived: false, position: active.length }).toPromise();
      if (updated) this.columns.update(cols => cols.map(c => c.id === col.id ? updated : c));
      this.toast.success('List restored');
    } catch { this.toast.error('Failed to restore list'); }
  }

  toggleColumnMenu(columnId: string, e: Event): void {
    e.stopPropagation();
    this.columnMenuId.update(id => id === columnId ? null : columnId);
    this.cardMenuCardId.set(null);
  }

  async archiveCard(card: Card, e: Event): Promise<void> {
    e.stopPropagation();
    this.cardMenuCardId.set(null);
    try {
      await this.cardService.updateCard(card.id, { archived: true }).toPromise();
      this.cardsByColumn.update(m => {
        const next = new Map(m);
        const col = (next.get(card.columnId) || []).filter(c => c.id !== card.id);
        next.set(card.columnId, col);
        return next;
      });
      this.toast.success('Card archived');
    } catch { this.toast.error('Failed to archive card'); }
  }

  async toggleCardAchieved(card: Card, e: Event): Promise<void> {
    e.stopPropagation();
    const next = !(card.achieved ?? false);
    try {
      await this.cardService.updateCard(card.id, { achieved: next }).toPromise();
      this.cardsByColumn.update(m => {
        const map = new Map(m);
        const col = (map.get(card.columnId) || []).map(c =>
          c.id === card.id ? { ...c, achieved: next } : c
        );
        map.set(card.columnId, col);
        return map;
      });
    } catch { this.toast.error('Failed to update card'); }
  }

  toggleCardMenu(cardId: string, e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    this.cardMenuCardId.update(id => id === cardId ? null : cardId);
    this.columnMenuId.set(null);
  }

  // Column Management
  async createColumn(): Promise<void> {
    const name = this.newColumnTitle().trim();
    if (!name || !this.board()) return;

    try {
      const column = await this.columnService.createColumn({
        name,
        boardId: this.board()!.id,
        position: this.columnsActive().length
      }).toPromise();

      if (column) {
        this.columns.update(cols => [...cols, column]);
        this.cardsByColumn().set(column.id, []);
        this.newColumnTitle.set('');
        this.showAddColumn.set(false);
      }
    } catch (error) {
      console.error('Failed to create column:', error);
    }
  }

  async updateColumnTitle(columnId: string, newTitle: string): Promise<void> {
    if (!newTitle.trim()) return;

    try {
      const updated = await this.columnService.updateColumn(columnId, {
        name: newTitle.trim()
      }).toPromise();

      if (updated) {
        this.columns.update(cols =>
          cols.map(col => col.id === columnId ? updated : col)
        );
      }
    } catch (error) {
      console.error('Failed to update column:', error);
    }
  }

  async deleteColumn(columnId: string): Promise<void> {
    const ok = await this.confirm.confirm({
      title: 'Delete column',
      message: 'Delete this column and all its cards?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!ok) return;

    try {
      await this.columnService.deleteColumn(columnId).toPromise();
      this.columns.update(cols => cols.filter(col => col.id !== columnId));
      this.cardsByColumn().delete(columnId);
    } catch (error) {
      console.error('Failed to delete column:', error);
    }
  }

  // Card Management
  async createCard(columnId: string): Promise<void> {
    const title = normalizeToSingleLine(this.newCardTitle());
    if (!title) return;

    try {
      const cards = this.getCardsForColumn(columnId);
      const card = await this.cardService.createCard({
        title,
        columnId,
        position: cards.length
      }).toPromise();

      if (card) {
        const updatedCards = [...cards, card];
        this.cardsByColumn().set(columnId, updatedCards);
        this.newCardTitle.set('');
        this.addingCardToColumn.set(null);
      }
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  }

  openCardDetails(card: Card): void {
    this.closeMenus();
    this.selectedCard.set(card);
  }

  onCardDetailClose(): void {
    this.selectedCard.set(null);
  }

  onCardDetailUpdate(updated: Card): void {
    this.cardsByColumn.update(m => {
      const next = new Map(m);
      const oldColId = [...next.entries()].find(([, arr]) => arr.some(c => c.id === updated.id))?.[0];
      if (oldColId) {
        const list = (next.get(oldColId) || []).filter(c => c.id !== updated.id);
        next.set(oldColId, list);
      }
      const col = next.get(updated.columnId) || [];
      if (!col.some(c => c.id === updated.id)) {
        next.set(updated.columnId, [...col, updated].sort((a, b) => a.position - b.position));
      } else {
        next.set(updated.columnId, col.map(c => c.id === updated.id ? updated : c).sort((a, b) => a.position - b.position));
      }
      return next;
    });
    this.selectedCard.set(updated);
  }

  onCardDetailDeleted(): void {
    const c = this.selectedCard();
    if (!c) return;
    this.cardsByColumn.update(m => {
      const next = new Map(m);
      const col = (next.get(c.columnId) || []).filter(x => x.id !== c.id);
      next.set(c.columnId, col);
      return next;
    });
    this.selectedCard.set(null);
    this.toast.success('Card deleted');
  }

  getColumnName(columnId: string): string {
    return this.columns().find(col => col.id === columnId)?.name ?? '';
  }

  // Drag & Drop
  onColumnDrop(event: CdkDragDrop<BoardColumn[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    const active = [...this.columnsActive()];
    moveItemInArray(active, event.previousIndex, event.currentIndex);
    active.forEach((col, i) => col.position = i);

    const archived = (this.columns() || []).filter(c => c.archived);
    this.columns.set([...active, ...archived]);

    const updates = active.map((col, i) =>
      this.columnService.updateColumn(col.id, { position: i })
    );
    forkJoin(updates).subscribe({
      next: () => this.toast.success('List order saved'),
      error: () => {
        this.toast.error('Failed to save list order');
        this.loadBoard(this.board()!.id);
      }
    });
  }

  onCardDrop(event: CdkDragDrop<Card[]>, targetColumnId: string): void {
    const raw = String(event.previousContainer?.id ?? '');
    const sourceColumnId = raw.startsWith('column-') ? raw.slice(7) : raw;

    if (sourceColumnId === targetColumnId && event.previousIndex === event.currentIndex) {
      return; // No change
    }

    const cardsMap = new Map(this.cardsByColumn());

    if (sourceColumnId === targetColumnId) {
      // Same column - reorder
      const cards = [...(cardsMap.get(targetColumnId) || [])];
      moveItemInArray(cards, event.previousIndex, event.currentIndex);
      cards.forEach((card, index) => card.position = index);
      cardsMap.set(targetColumnId, cards);
    } else {
      // Different columns - transfer
      const sourceCards = [...(cardsMap.get(sourceColumnId) || [])];
      const targetCards = [...(cardsMap.get(targetColumnId) || [])];

      transferArrayItem(sourceCards, targetCards, event.previousIndex, event.currentIndex);

      // Update positions
      sourceCards.forEach((card, index) => card.position = index);
      targetCards.forEach((card, index) => {
        card.position = index;
        card.columnId = targetColumnId;
      });

      cardsMap.set(sourceColumnId, sourceCards);
      cardsMap.set(targetColumnId, targetCards);
    }

    // Optimistic update
    this.cardsByColumn.set(cardsMap);

    // Sync with backend
    const movedCard = (cardsMap.get(targetColumnId) || [])[event.currentIndex];
    if (movedCard) {
      this.cardService.moveCard(movedCard.id, {
        targetColumnId,
        newPosition: event.currentIndex
      }).subscribe({
        error: (error: unknown) => {
          console.error('Failed to move card:', error);
          // Revert on error
          this.loadBoard(this.board()!.id);
        }
      });
    }
  }

  // Utility
  getConnectedDropLists(): string[] {
    return this.columnsActive().map(col => `column-${col.id}`);
  }
}
