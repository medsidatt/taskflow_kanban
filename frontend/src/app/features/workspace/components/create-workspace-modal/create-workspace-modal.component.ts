import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

export interface CreateWorkspaceData {
  name: string;
  description?: string;
  isPrivate: boolean;
}

@Component({
  selector: 'app-create-workspace-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal 
      [isOpen]="isOpen()" 
      [title]="'Create New Workspace'"
      (closed)="onClose()">
      
      <form (ngSubmit)="onSubmit()" #workspaceForm="ngForm">
        <!-- Workspace Name -->
        <div class="form-group">
          <label for="workspaceName" class="form-label">
            Workspace Name <span class="required">*</span>
          </label>
          <input
            type="text"
            id="workspaceName"
            name="name"
            [(ngModel)]="formData.name"
            class="form-input"
            placeholder="e.g., Marketing Team"
            required
            maxlength="100"
            #nameInput="ngModel"
            autofocus
          />
          @if (nameInput.invalid && (nameInput.dirty || nameInput.touched)) {
            <span class="form-error">Workspace name is required</span>
          }
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="workspaceDescription" class="form-label">
            Description
            <span class="optional">(optional)</span>
          </label>
          <textarea
            id="workspaceDescription"
            name="description"
            [(ngModel)]="formData.description"
            class="form-textarea"
            placeholder="What is this workspace for?"
            rows="4"
            maxlength="500"
          ></textarea>
          <span class="form-hint">{{ formData.description?.length || 0 }}/500 characters</span>
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
              <strong>Private Workspace</strong>
              <span class="checkbox-description">Only invited members can access this workspace and its boards</span>
            </span>
          </label>
        </div>

        <!-- Info Box -->
        <div class="info-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z" fill="currentColor"/>
          </svg>
          <div>
            <strong>What's a workspace?</strong>
            <p>Workspaces help organize your boards by team, department, or project. You can invite members to collaborate on all boards within a workspace.</p>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div modal-footer class="modal-actions">
          <button type="button" class="btn btn-secondary" (click)="onClose()">
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="!workspaceForm.valid || loading()">
            @if (loading()) {
              <span class="spinner"></span>
              Creating...
            } @else {
              Create Workspace
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
      min-height: 100px;
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

    /* Info Box */
    .info-box {
      display: flex;
      gap: 0.75rem;
      padding: 1rem;
      background-color: var(--color-primary-50, #eff6ff);
      border-radius: var(--radius-lg, 0.5rem);
      color: var(--color-primary-700, #1d4ed8);
      margin-bottom: 1.5rem;
    }

    .info-box svg {
      flex-shrink: 0;
      margin-top: 2px;
    }

    .info-box strong {
      display: block;
      margin-bottom: 0.25rem;
      font-size: var(--text-sm, 0.875rem);
    }

    .info-box p {
      font-size: var(--text-sm, 0.875rem);
      line-height: 1.5;
      margin: 0;
      opacity: 0.9;
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
export class CreateWorkspaceModalComponent {
  @Output() workspaceCreated = new EventEmitter<CreateWorkspaceData>();
  @Output() closed = new EventEmitter<void>();

  isOpen = signal(false);
  loading = signal(false);

  formData: CreateWorkspaceData = {
    name: '',
    description: '',
    isPrivate: false
  };

  open() {
    this.isOpen.set(true);
    this.resetForm();
  }

  onClose() {
    this.isOpen.set(false);
    this.loading.set(false);
    this.closed.emit();
  }

  async onSubmit() {
    if (this.loading()) return;

    this.loading.set(true);
    
    // Emit the data
    this.workspaceCreated.emit({ ...this.formData });
  }

  resetForm() {
    this.formData = {
      name: '',
      description: '',
      isPrivate: false
    };
    this.loading.set(false);
  }

  completeCreation() {
    this.loading.set(false);
    this.onClose();
  }
}
