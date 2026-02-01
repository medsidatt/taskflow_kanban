import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, AlignLeft, MessageSquare, Paperclip, Tag, Calendar, Users, Activity, Trash2, CheckCircle, Circle } from 'lucide-angular';
import { Card, Comment, ActivityLog } from '../../../../core/models/card.model';
import { normalizeToSingleLine } from '../../../../core/utils/text.utils';
import { CardService } from '../../../../core/services/card.service';
import { CommentService } from '../../../../core/services/comment.service';
import { ActivityService } from '../../../../core/services/activity.service';
import { LabelService } from '../../../../core/services/label.service';
import { UserService } from '../../../../core/services/user.service';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar.component';
import { Label } from '../../../../core/models/label.model';
import { UserSummaryDto } from '../../../../core/models/user.model';

@Component({
  selector: 'app-card-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, UserAvatarComponent],
  templateUrl: './card-detail-modal.component.html',
  styleUrls: ['./card-detail-modal.component.css']
})
export class CardDetailModalComponent implements OnInit {
  @Input() card!: Card;
  @Input() columnTitle = '';
  @Input() columns: { id: string; name: string }[] = [];
  @Input() boardId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<Card>();
  @Output() deleted = new EventEmitter<void>();

  // Icons
  readonly icons = { X, AlignLeft, MessageSquare, Paperclip, Tag, Calendar, Users, Activity, Trash2, CheckCircle, Circle };

  // State
  comments = signal<Comment[]>([]);
  activities = signal<ActivityLog[]>([]);
  editingTitle = signal(false);
  editingDescription = signal(false);
  editingDueDate = signal(false);
  newComment = signal('');
  cardTitle = signal('');
  cardDescription = signal('');
  cardDueDate = signal('');
  boardLabels = signal<Label[]>([]);
  moveTargetColumnId = signal('');
  showLabelPicker = signal(false);
  showCreateLabel = signal(false);
  newLabelName = signal('');
  newLabelColor = signal('#4A90E2');
  creatingLabel = signal(false);
  showMemberSearch = signal(false);
  memberSearchQuery = signal('');
  memberSearchResults = signal<UserSummaryDto[]>([]);
  addingLabelId = signal<string | null>(null);
  addingMemberId = signal<string | null>(null);

  constructor(
    private cardService: CardService,
    private commentService: CommentService,
    private activityService: ActivityService,
    private labelService: LabelService,
    private userService: UserService,
    private confirm: ConfirmService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.syncFromCard();
    this.loadComments();
    this.loadActivities();
    const bid = this.boardId;
    if (bid) {
      this.labelService.getLabelsByBoard(bid).subscribe({
        next: (list) => this.boardLabels.set(list || []),
        error: () => {}
      });
    }
  }

  private syncFromCard(): void {
    this.cardTitle.set(this.card.title);
    this.cardDescription.set(this.card.description || '');
    this.cardDueDate.set(this.card.dueDate ? this.card.dueDate.split('T')[0] : '');
  }

  private emitUpdate(updated: Card): void {
    this.card = updated;
    this.syncFromCard();
    this.update.emit(updated);
  }

  async loadComments(): Promise<void> {
    try {
      const comments = await this.commentService.getCommentsByCard(this.card.id).toPromise();
      this.comments.set(comments || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  }

  async loadActivities(): Promise<void> {
    try {
      const activities = await this.activityService.getActivitiesByEntity(this.card.id).toPromise();
      this.activities.set(activities || []);
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  }

  async updateTitle(): Promise<void> {
    const newTitle = normalizeToSingleLine(this.cardTitle());
    if (!newTitle || newTitle === this.card.title) {
      this.editingTitle.set(false);
      return;
    }

    try {
      const updated = await this.cardService.updateCard(this.card.id, {
        title: newTitle
      }).toPromise();

      if (updated) this.emitUpdate(updated);
    } catch (error) {
      console.error('Failed to update card title:', error);
      this.toast.error('Failed to update title');
    } finally {
      this.editingTitle.set(false);
    }
  }

  async updateDescription(): Promise<void> {
    const newDesc = normalizeToSingleLine(this.cardDescription());
    if (newDesc === normalizeToSingleLine(this.card.description || '')) {
      this.editingDescription.set(false);
      return;
    }

    try {
      const updated = await this.cardService.updateCard(this.card.id, {
        description: newDesc
      }).toPromise();

      if (updated) this.emitUpdate(updated);
    } catch (error) {
      console.error('Failed to update description:', error);
      this.toast.error('Failed to update description');
    } finally {
      this.editingDescription.set(false);
    }
  }

  async updateDueDate(value: string | null): Promise<void> {
    this.editingDueDate.set(false);
    const next = value && value.trim() ? value.trim() : undefined;
    if (next === (this.card.dueDate ? this.card.dueDate.split('T')[0] : undefined)) return;
    try {
      const payload = next
        ? { dueDate: next + 'T12:00:00.000Z' }
        : { clearDueDate: true };
      const updated = await this.cardService.updateCard(this.card.id, payload).toPromise();
      if (updated) this.emitUpdate(updated);
      this.toast.success(next ? 'Due date set' : 'Due date removed');
    } catch {
      this.toast.error('Failed to update due date');
    }
  }

  async doMove(): Promise<void> {
    const colId = this.moveTargetColumnId();
    if (!colId || colId === this.card.columnId) return;
    try {
      await this.cardService.moveCard(this.card.id, { targetColumnId: colId, newPosition: 0 }).toPromise();
      const updated = await this.cardService.getCardById(this.card.id).toPromise();
      if (updated) this.emitUpdate(updated);
      this.moveTargetColumnId.set('');
      this.toast.success('Card moved');
    } catch {
      this.toast.error('Failed to move card');
    }
  }

  async updateAchieved(value: boolean): Promise<void> {
    try {
      const updated = await this.cardService.updateCard(this.card.id, { achieved: value }).toPromise();
      if (updated) this.emitUpdate(updated);
    } catch {
      this.toast.error('Failed to update');
    }
  }

  async confirmDeleteCard(): Promise<void> {
    const ok = await this.confirm.confirm({
      title: 'Delete card',
      message: 'Delete this card permanently?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!ok) return;
    try {
      await this.cardService.deleteCard(this.card.id).toPromise();
      this.deleted.emit();
      this.close.emit();
    } catch {
      this.toast.error('Failed to delete card');
    }
  }

  async addLabel(label: Label): Promise<void> {
    if ((this.card.labels || []).some(l => l.id === label.id)) return;
    this.addingLabelId.set(label.id);
    try {
      await this.labelService.addLabelToCard(this.card.id, label.id).toPromise();
      const updated = await this.cardService.getCardById(this.card.id).toPromise();
      if (updated) this.emitUpdate(updated);
      this.showLabelPicker.set(false);
    } catch {
      this.toast.error('Failed to add label');
    } finally {
      this.addingLabelId.set(null);
    }
  }

  async removeLabel(labelId: string): Promise<void> {
    try {
      await this.labelService.removeLabelFromCard(this.card.id, labelId).toPromise();
      const updated = await this.cardService.getCardById(this.card.id).toPromise();
      if (updated) this.emitUpdate(updated);
    } catch {
      this.toast.error('Failed to remove label');
    }
  }

  async createLabel(): Promise<void> {
    const name = this.newLabelName().trim();
    if (!name || !this.boardId || this.creatingLabel()) return;

    this.creatingLabel.set(true);
    try {
      const newLabel = await this.labelService.createLabel({
        name,
        color: this.newLabelColor(),
        boardId: this.boardId
      }).toPromise();

      if (newLabel) {
        // Add the new label to the board labels list
        this.boardLabels.update(labels => [...labels, newLabel]);
        // Reset form
        this.newLabelName.set('');
        this.newLabelColor.set('#4A90E2');
        this.showCreateLabel.set(false);
        // Optionally add it to the card immediately
        await this.addLabel(newLabel);
        this.toast.success('Label created');
      }
    } catch {
      this.toast.error('Failed to create label');
    } finally {
      this.creatingLabel.set(false);
    }
  }

  cancelCreateLabel(): void {
    this.showCreateLabel.set(false);
    this.newLabelName.set('');
    this.newLabelColor.set('#4A90E2');
  }

  // Predefined color options for quick selection
  readonly labelColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#000000',
    '#4A90E2', '#50C878', '#FF6B6B', '#9B59B6', '#F39C12', '#1ABC9C'
  ];

  async doMemberSearch(): Promise<void> {
    const q = this.memberSearchQuery().trim();
    if (!q) { this.memberSearchResults.set([]); return; }
    this.userService.searchUsers(q).subscribe({
      next: (users) => {
        const cur = new Set((this.card.members || []).map(m => m.userId));
        this.memberSearchResults.set((users || []).filter(u => !cur.has(u.id)));
      },
      error: () => this.memberSearchResults.set([])
    });
  }

  async addMember(u: UserSummaryDto): Promise<void> {
    this.addingMemberId.set(u.id);
    try {
      await this.cardService.addAssignee(this.card.id, u.id).toPromise();
      const updated = await this.cardService.getCardById(this.card.id).toPromise();
      if (updated) this.emitUpdate(updated);
      this.showMemberSearch.set(false);
      this.memberSearchQuery.set('');
      this.memberSearchResults.set([]);
      this.toast.success('Member added');
    } catch {
      this.toast.error('Failed to add member');
    } finally {
      this.addingMemberId.set(null);
    }
  }

  async removeMember(userId: string): Promise<void> {
    try {
      await this.cardService.removeAssignee(this.card.id, userId).toPromise();
      const updated = await this.cardService.getCardById(this.card.id).toPromise();
      if (updated) this.emitUpdate(updated);
      this.toast.success('Member removed');
    } catch {
      this.toast.error('Failed to remove member');
    }
  }

  hasLabelOnCard(labelId: string): boolean {
    return (this.card.labels || []).some(l => l.id === labelId);
  }

  allLabelsOnCard(): boolean {
    const card = (this.card.labels || []).length;
    const board = this.boardLabels().length;
    return board > 0 && card >= board;
  }

  async addComment(): Promise<void> {
    const content = this.newComment().trim();
    if (!content) return;

    try {
      const comment = await this.commentService.createComment({
        content,
        cardId: this.card.id
      }).toPromise();

      if (comment) {
        this.comments.update(list => [...list, comment]);
        this.newComment.set('');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }

  confirmDeleteComment(commentId: string): void {
    this.confirm.confirm({
      title: 'Delete comment',
      message: 'Delete this comment?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    }).then(ok => {
      if (ok) this.deleteComment(commentId);
    });
  }

  async deleteComment(commentId: string): Promise<void> {
    try {
      await this.commentService.deleteComment(commentId).toPromise();
      this.comments.update(list => list.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
