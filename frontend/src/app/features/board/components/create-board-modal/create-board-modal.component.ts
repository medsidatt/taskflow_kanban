import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

export interface CreateBoardData {
  name: string;
  description?: string;
  isPrivate: boolean;
  backgroundColor?: string;
}

@Component({
  selector: 'app-create-board-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal 
      [isOpen]="isOpen()" 
      [title]="'Create New Board'"
      (closed)="onClose()">
      
      <form (ngSubmit)="onSubmit()" #boardForm="ngForm">
        <!-- Board Name -->
        <div class="form-group">
          <label for="boardName" class="form-label">
            Board Name <span class="required">*</span>
          </label>
          <input
            type="text"
            id="boardName"
            name="name"
            [(ngModel)]="formData.name"
            class="form-input"
            placeholder="e.g., Product Roadmap"
            required
            maxlength="100"
            #nameInput="ngModel"
            autofocus
          />
          @if (nameInput.invalid && (nameInput.dirty || nameInput.touched)) {
            <span class="form-error">Board name is required</span>
          }
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="boardDescription" class="form-label">
            Description
            <span class="optional">(optional)</span>
          </label>
          <textarea
            id="boardDescription"
            name="description"
            [(ngModel)]="formData.description"
            class="form-textarea"
            placeholder="What is this board for?"
            rows="3"
            maxlength="500"
          ></textarea>
          <span class="form-hint">{{ formData.description?.length || 0 }}/500 characters</span>
        </div>

        <!-- Background Color -->
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

        <!-- Privacy -->
        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              name="isPrivate"
              [(ngModel)]="formData.isPrivate"
              class="checkbox-input"
            />
            <span class="checkbox-text">
              <strong>Private Board</strong>
              <span class="checkbox-description">Only you and invited members can see this board</span>
            </span>
          </label>
        </div>

        <!-- Footer Buttons -->
        <div modal-footer class="modal-actions">
          <button type="button" class="btn btn-secondary" (click)="onClose()">
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="!boardForm.valid || loading()">
            @if (loading()) {
              <span class="spinner"></span>
              Creating...
            } @else {
              Create Board
            }
          </button>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: var(--text-sm, 0.875rem);
      font-weight: var(--font-semibold, 600);
      color: var(--color-text, #18181b);
    }

    .required {
      color: var(--color-danger, #ef4444);
    }

    .optional {
      font-weight: var(--font-normal, 400);
      color: var(--color-text-secondary, #52525b);
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.625rem 0.875rem;
      font-size: var(--text-base, 1rem);
      color: var(--color-text, #18181b);
      background-color: var(--color-background, white);
      border: 2px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-lg, 0.5rem);
      transition: all var(--transition-fast, 150ms);
    }

    .form-input:hover,
    .form-textarea:hover {
      border-color: var(--color-gray-300, #d1d5db);
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--color-primary, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-hint {
      display: block;
      margin-top: 0.375rem;
      font-size: var(--text-xs, 0.75rem);
      color: var(--color-text-secondary, #52525b);
    }

    .form-error {
      display: block;
      margin-top: 0.375rem;
      font-size: var(--text-xs, 0.75rem);
      color: var(--color-danger, #ef4444);
    }

    /* Color Grid */
    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
      gap: 0.5rem;
    }

    .color-option {
      width: 100%;
      aspect-ratio: 1;
      border: 2px solid transparent;
      border-radius: var(--radius-md, 0.375rem);
      cursor: pointer;
      transition: all var(--transition-fast, 150ms);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .color-option:hover {
      transform: scale(1.05);
      box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
    }

    .color-option.selected {
      border-color: var(--color-text, #18181b);
      box-shadow: 0 0 0 2px var(--color-background, white), 
                  0 0 0 4px var(--color-text, #18181b);
    }

    /* Checkbox */
    .checkbox-label {
      display: flex;
      gap: 0.75rem;
      padding: 1rem;
      background-color: var(--color-gray-50, #fafafa);
      border-radius: var(--radius-lg, 0.5rem);
      cursor: pointer;
      transition: background-color var(--transition-fast, 150ms);
    }

    .checkbox-label:hover {
      background-color: var(--color-gray-100, #f4f4f5);
    }

    .checkbox-input {
      width: 20px;
      height: 20px;
      margin-top: 2px;
      flex-shrink: 0;
      cursor: pointer;
    }

    .checkbox-text {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .checkbox-description {
      font-size: var(--text-sm, 0.875rem);
      font-weight: var(--font-normal, 400);
      color: var(--color-text-secondary, #52525b);
    }

    /* Modal Actions */
    .modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    /* Buttons use global .btn, .btn-primary, .btn-secondary classes from styles.css */

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class CreateBoardModalComponent {
  @Output() boardCreated = new EventEmitter<CreateBoardData>();
  @Output() closed = new EventEmitter<void>();

  isOpen = signal(false);
  loading = signal(false);

  formData: CreateBoardData = {
    name: '',
    description: '',
    isPrivate: false,
    backgroundColor: '#3b82f6'
  };

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

  open() {
    this.isOpen.set(true);
    this.resetForm();
  }

  onClose() {
    this.isOpen.set(false);
    this.loading.set(false);
    this.closed.emit();
  }

  selectColor(color: string) {
    this.formData.backgroundColor = color;
  }

  async onSubmit() {
    if (this.loading()) return;

    this.loading.set(true);
    
    // Emit the data
    this.boardCreated.emit({ ...this.formData });
  }

  resetForm() {
    this.formData = {
      name: '',
      description: '',
      isPrivate: false,
      backgroundColor: '#3b82f6'
    };
    this.loading.set(false);
  }

  completeCreation() {
    this.loading.set(false);
    this.onClose();
  }
}
