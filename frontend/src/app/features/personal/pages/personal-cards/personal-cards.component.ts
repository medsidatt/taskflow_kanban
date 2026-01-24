import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Search, Filter, Archive } from 'lucide-angular';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-personal-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, EmptyStateComponent],
  template: `
    <div class="personal-cards-page">
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Your Cards</h1>
          <p class="page-subtitle">All your assigned and created cards</p>
        </div>

        <div class="header-right">
          <!-- Search -->
          <div class="search-box">
            <input
              type="text"
              class="search-input"
              placeholder="Search cards..."
              [(ngModel)]="searchQuery"
              (input)="searchQuery.set($any($event.target).value)" />
          </div>

          <!-- Filters -->
          <div class="filter-buttons">
            <button class="filter-btn" [class.active]="activeFilter() === 'assigned'">
              <lucide-icon [name]="icons.Filter" [size]="18" />
              <span>Assigned to me</span>
            </button>
            <button class="filter-btn" [class.active]="activeFilter() === 'created'">
              <lucide-icon [name]="icons.Plus" [size]="18" />
              <span>Created by me</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <app-empty-state
        icon="LayoutDashboard"
        title="No cards yet"
        description="Cards assigned to you or from your workspaces will appear here"
        actionLabel="Create Board"
        (action)="navigateToBoards()" />
    </div>
  `,
  styles: [`
    .personal-cards-page {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      gap: 2rem;
    }

    .header-left {
      flex: 1;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-text, #18181b);
      margin-bottom: 0.5rem;
    }

    .page-subtitle {
      color: var(--color-text-secondary, #52525b);
      font-size: 0.875rem;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .search-box {
      position: relative;
      width: 300px;
    }

    .search-input {
      width: 100%;
      padding: 0.625rem 1rem;
      padding-left: 2.5rem;
      border: 2px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-lg, 0.5rem);
      font-size: 0.875rem;
      transition: all var(--transition-fast, 150ms);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-primary, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filter-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: white;
      border: 2px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-lg, 0.5rem);
      color: var(--color-text-secondary, #52525b);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast, 150ms);
    }

    .filter-btn:hover {
      border-color: var(--color-primary, #3b82f6);
      color: var(--color-primary, #3b82f6);
    }

    .filter-btn.active {
      background: linear-gradient(135deg, var(--color-primary, #3b82f6), var(--color-primary-600, #2563eb));
      color: white;
      border-color: var(--color-primary, #3b82f6);
    }

    @media (max-width: 1024px) {
      .header-right {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
      }

      .search-box {
        width: 100%;
      }

      .filter-buttons {
        flex-wrap: wrap;
      }
    }
  `]
})
export class PersonalCardsComponent implements OnInit {
  readonly icons = { Plus, Search, Filter, Archive };

  searchQuery = signal('');
  activeFilter = signal<'assigned' | 'created'>('assigned');

  ngOnInit(): void {
    // Load personal cards here
  }

  navigateToBoards(): void {
    // Navigate to boards
  }
}
