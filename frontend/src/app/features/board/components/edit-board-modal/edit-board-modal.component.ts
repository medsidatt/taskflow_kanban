import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { BoardService } from '../../../../core/services/board.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Board } from '../../../../core/models/board.model';

@Component({
  selector: 'app-edit-board-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      [title]="'Edit Board'"
      (closed)="onClose()">

      <form (ngSubmit)="onSubmit()" #boardForm="ngForm">
        <div class="form-group">
          <label for="editBoardName" class="form-label">Board Name <span class="required">*</span></label>
          <input
            type="text"
            id="editBoardName"
            name="name"
            [(ngModel)]="formData.name"
            class="form-input"
            placeholder="e.g., Product Roadmap"
            required
            maxlength="100"
            #nameInput="ngModel" />
          @if (nameInput.invalid && (nameInput.dirty || nameInput.touched)) {
            <span class="form-error">Board name is required</span>
          }
        </div>

        <div class="form-group">
          <label for="editBoardDescription" class="form-label">Description <span class="optional">(optional)</span></label>
          <textarea
            id="editBoardDescription"
            name="description"
            [(ngModel)]="formData.description"
            class="form-textarea"
            placeholder="What is this board for?"
            rows="3"
            maxlength="500"></textarea>
          <span class="form-hint">{{ (formData.description || '').length }}/500 characters</span>
        </div>

        <div class="form-group">
          <label class="form-label">Background Color</label>
          <div class="color-grid">
            @for (color of backgroundColors; track color.value) {
              <button
                type="button"
                class="color-option"
                [class.selected]="formData.backgroundColor === color.value"
                [style.background]="color.gradient || color.value"
                [title]="color.name"
                (click)="selectColor(color.value)">
                @if (formData.backgroundColor === color.value) {
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13 4L6 11L3 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                }
              </button>
            }
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" name="isPrivate" [(ngModel)]="formData.isPrivate" class="checkbox-input" />
            <span class="checkbox-text">
              <strong>Private Board</strong>
              <span class="checkbox-description">Only you and invited members can see this board</span>
            </span>
          </label>
        </div>

        <div modal-footer class="modal-actions">
          <button type="button" class="btn btn-secondary" (click)="onClose()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="!boardForm.valid || loading()">
            @if (loading()) {
              <span class="spinner"></span>
              Saving...
            } @else {
              Save changes
            }
          </button>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .form-group { margin-bottom: 1.5rem; }
    .form-label { display: block; margin-bottom: 0.5rem; font-size: var(--text-sm, 0.875rem); font-weight: 600; color: var(--text-primary, #18181b); }
    .required { color: var(--error-500, #ef4444); }
    .optional { font-weight: 400; color: var(--text-secondary, #6b7280); }
    .form-input, .form-textarea {
      width: 100%; padding: 0.625rem 0.875rem; font-size: 1rem; color: var(--text-primary, #18181b);
      background: var(--bg-primary, #fff); border: 2px solid var(--border-color, #e5e7eb);
      border-radius: var(--radius-lg, 0.5rem); transition: border-color 0.15s, box-shadow 0.15s;
    }
    .form-input:hover, .form-textarea:hover { border-color: var(--gray-400, #a1a1aa); }
    .form-input:focus, .form-textarea:focus { outline: none; border-color: var(--primary-500, #3b82f6); box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
    .form-textarea { resize: vertical; min-height: 80px; }
    .form-hint { display: block; margin-top: 0.375rem; font-size: 0.75rem; color: var(--text-secondary, #6b7280); }
    .form-error { display: block; margin-top: 0.375rem; font-size: 0.75rem; color: var(--error-500, #ef4444); }
    .color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(48px, 1fr)); gap: 0.5rem; }
    .color-option {
      width: 100%; aspect-ratio: 1; border: 2px solid transparent; border-radius: 0.375rem;
      cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; display: flex; align-items: center; justify-content: center; padding: 0;
    }
    .color-option:hover { transform: scale(1.05); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .color-option.selected { border-color: #18181b; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #18181b; }
    .checkbox-label { display: flex; gap: 0.75rem; padding: 1rem; background: var(--gray-50, #fafafa); border-radius: 0.5rem; cursor: pointer; }
    .checkbox-label:hover { background: var(--gray-100, #f4f4f5); }
    .checkbox-input { width: 20px; height: 20px; margin-top: 2px; flex-shrink: 0; cursor: pointer; }
    .checkbox-text { display: flex; flex-direction: column; gap: 0.25rem; }
    .checkbox-description { font-size: 0.875rem; color: var(--text-secondary, #6b7280); }
    .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
    /* Buttons use global .btn, .btn-primary, .btn-secondary classes from styles.css */
    .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: edit-spin 0.6s linear infinite; }
    @keyframes edit-spin { to { transform: rotate(360deg); } }
  `]
})
export class EditBoardModalComponent {
  @Output() saved = new EventEmitter<Board>();
  @Output() closed = new EventEmitter<void>();

  isOpen = signal(false);
  loading = signal(false);

  formData = {
    name: '',
    description: '',
    isPrivate: false,
    backgroundColor: '#3b82f6'
  };

  private boardId: string | null = null;

  backgroundColors = [
    { name: 'Blue', value: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { name: 'Purple', value: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { name: 'Pink', value: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
    { name: 'Red', value: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { name: 'Orange', value: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { name: 'Yellow', value: '#eab308', gradient: 'linear-gradient(135deg, #eab308, #ca8a04)' },
    { name: 'Green', value: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { name: 'Teal', value: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
    { name: 'Cyan', value: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    { name: 'Indigo', value: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
    { name: 'Slate', value: '#64748b', gradient: 'linear-gradient(135deg, #64748b, #475569)' },
    { name: 'Gray', value: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280, #4b5563)' }
  ];

  constructor(
    private boardService: BoardService,
    private toast: ToastService
  ) {}

  open(board: Board): void {
    this.boardId = board.id;
    this.formData = {
      name: board.name,
      description: board.description ?? '',
      isPrivate: !!board.isPrivate,
      backgroundColor: board.backgroundColor || board.background_color || '#3b82f6'
    };
    this.isOpen.set(true);
    this.loading.set(false);
  }

  onClose(): void {
    this.isOpen.set(false);
    this.boardId = null;
    this.loading.set(false);
    this.closed.emit();
  }

  selectColor(color: string): void {
    this.formData.backgroundColor = color;
  }

  onSubmit(): void {
    if (this.loading() || !this.boardId) return;
    this.loading.set(true);
    this.boardService.updateBoard(this.boardId, {
      name: this.formData.name.trim(),
      description: this.formData.description?.trim() || undefined,
      isPrivate: this.formData.isPrivate,
      backgroundColor: this.formData.backgroundColor
    }).subscribe({
      next: (updated) => {
        this.toast.success('Board updated');
        this.saved.emit(updated);
        this.onClose();
      },
      error: () => {
        this.toast.error('Failed to update board');
        this.loading.set(false);
      }
    });
  }
}
