import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, MessageSquare, Paperclip, Pencil, Trash2 } from 'lucide-angular';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { Card } from '../../../../core/models/card.model';
import { RelativeTimePipe } from '../../../../core/pipes/relative-time.pipe';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';

/**
 * Board Card Component
 * Represents a single card in the Kanban board
 */
@Component({
  selector: 'app-board-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RelativeTimePipe, TruncatePipe],
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.css']
})
export class BoardCardComponent {
  @Input() card!: Card;
  @Output() cardUpdated = new EventEmitter<Card>();
  @Output() cardDeleted = new EventEmitter<string>();

  readonly icons = { Calendar, MessageSquare, Paperclip, Pencil, Trash2 };

  constructor(private confirm: ConfirmService) {}

  get hasLabels(): boolean {
    return !!(this.card.labels && this.card.labels.length > 0);
  }

  get hasMembers(): boolean {
    return !!(this.card.members && this.card.members.length > 0);
  }

  get hasAttachments(): boolean {
    return !!(this.card.attachmentCount && this.card.attachmentCount > 0);
  }

  get hasComments(): boolean {
    return !!(this.card.commentCount && this.card.commentCount > 0);
  }

  get hasDueDate(): boolean {
    return !!this.card.dueDate;
  }

  get isDueSoon(): boolean {
    if (!this.card.dueDate) return false;
    const dueDate = new Date(this.card.dueDate);
    const now = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  }

  get isOverdue(): boolean {
    if (!this.card.dueDate) return false;
    return new Date(this.card.dueDate) < new Date();
  }

  /**
   * Get priority label from number (1 = High, 2 = Medium, 3 = Low, etc.)
   */
  get priorityLabel(): string {
    if (!this.card.priority) return '';
    if (this.card.priority === 1) return 'High';
    if (this.card.priority === 2) return 'Medium';
    if (this.card.priority === 3) return 'Low';
    return `P${this.card.priority}`;
  }

  get priorityClass(): string {
    if (!this.card.priority) return '';
    if (this.card.priority === 1) return 'priority-high';
    if (this.card.priority === 2) return 'priority-medium';
    if (this.card.priority === 3) return 'priority-low';
    return '';
  }

  onCardClick(event: MouseEvent): void {
    event.stopPropagation();
    // Card click handled by parent component
  }

  onQuickEdit(event: MouseEvent): void {
    event.stopPropagation();
    // TODO: Open quick edit modal
    console.log('Quick edit card:', this.card.id);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.confirm.confirm({
      title: 'Delete card',
      message: 'Are you sure you want to delete this card?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    }).then(ok => {
      if (ok) this.cardDeleted.emit(this.card.id);
    });
  }
}
