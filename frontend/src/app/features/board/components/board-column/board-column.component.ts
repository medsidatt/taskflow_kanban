import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { BoardColumn } from '../../../../core/models/board-column.model';
import { Card, CardCreateDto } from '../../../../core/models/card.model';
import { normalizeToSingleLine } from '../../../../core/utils/text.utils';
import { BoardCardComponent } from '../board-card/board-card.component';
import { CardService } from '../../../../core/services/card.service';
import { ToastService } from '../../../../core/services/toast.service';

/**
 * Board Column Component
 * Represents a single column in the Kanban board
 * Handles card creation and displays cards in a drag-droppable list
 */
@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, BoardCardComponent],
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.css']
})
export class BoardColumnComponent {
  @Input() column!: BoardColumn;
  @Input() connectedLists: string[] = [];
  @Output() cardDropped = new EventEmitter<CdkDragDrop<Card[]>>();
  @Output() cardAdded = new EventEmitter<string>();
  @Output() cardUpdated = new EventEmitter<Card>();
  @Output() cardDeleted = new EventEmitter<string>();

  isAddingCard = false;
  newCardTitle = '';
  isCreating = false;

  constructor(
    private cardService: CardService,
    private toast: ToastService
  ) {}

  get cards(): Card[] {
    return this.column.cards || [];
  }

  get columnId(): string {
    return `column-${this.column.id}`;
  }

  onDrop(event: CdkDragDrop<Card[]>): void {
    this.cardDropped.emit(event);
  }

  startAddCard(): void {
    this.isAddingCard = true;
  }

  cancelAddCard(): void {
    this.isAddingCard = false;
    this.newCardTitle = '';
  }

  /**
   * Create a new card in this column
   */
  addCard(): void {
    const title = normalizeToSingleLine(this.newCardTitle);
    if (!title || this.isCreating) return;

    this.isCreating = true;
    const cardDto: CardCreateDto = {
      title,
      columnId: this.column.id,
      position: this.cards.length
    };

    this.cardService.createCard(cardDto).subscribe({
      next: (card) => {
        // Add card to UI immediately
        if (!this.column.cards) {
          this.column.cards = [];
        }
        this.column.cards.push(card);
        
        this.newCardTitle = '';
        this.isAddingCard = false;
        this.isCreating = false;
        this.cardAdded.emit(this.column.id);
      },
      error: (error) => {
        console.error('Error creating card:', error);
        this.toast.error('Failed to create card');
        this.isCreating = false;
      }
    });
  }

  onCardClick(card: Card): void {
    // TODO: Open card detail modal
    console.log('Card clicked:', card);
  }

  onCardUpdate(card: Card): void {
    this.cardUpdated.emit(card);
  }

  onCardDelete(cardId: string): void {
    this.cardDeleted.emit(cardId);
  }

  /**
   * Get a color for the column header
   */
  getColumnColor(): string {
    if (this.column.color) {
      return this.column.color;
    }
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#764ba2'];
    return colors[this.column.position % colors.length];
  }

  /**
   * Get background color for the column header (lighter version)
   */
  getColumnBackgroundColor(): string {
    const color = this.getColumnColor();
    return this.hexToRgba(color, 0.08);
  }

  /**
   * Convert hex color to rgba with transparency
   */
  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
