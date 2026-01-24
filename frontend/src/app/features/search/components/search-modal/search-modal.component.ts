import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  signal,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, EMPTY } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { LucideAngularModule, Search, Briefcase, LayoutDashboard, LayoutList, CreditCard, X } from 'lucide-angular';
import { SearchService } from '../../../../core/services/search.service';
import {
  SearchResult,
  SearchBoardItem,
  SearchColumnItem,
  SearchCardItem,
} from '../../../../core/models/search.model';
import { Workspace } from '../../../../core/models/workspace.model';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css'],
})
export class SearchModalComponent implements AfterViewChecked {
  readonly icons = { Search, Briefcase, LayoutDashboard, LayoutList, CreditCard, X };

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  isOpen = signal(false);
  inputValue = signal('');
  query = signal('');
  loading = signal(false);
  result = signal<SearchResult | null>(null);

  private searchInput$ = new Subject<string>();
  private destroyRef = inject(DestroyRef);
  private focusInput = false;

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => {
          const t = (q || '').trim();
          this.query.set(t);
          if (!t) {
            this.loading.set(false);
            this.result.set(null);
            return EMPTY;
          }
          this.loading.set(true);
          this.result.set(null);
          return this.searchService.search(t);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (r: SearchResult) => {
          this.result.set(r);
          this.loading.set(false);
        },
        error: () => {
          this.result.set({ workspaces: [], boards: [], columns: [], cards: [] });
          this.loading.set(false);
        },
      });
  }

  ngAfterViewChecked(): void {
    if (this.focusInput && this.isOpen() && this.searchInputRef?.nativeElement) {
      this.searchInputRef.nativeElement.focus();
      this.focusInput = false;
    }
  }

  open(): void {
    this.isOpen.set(true);
    this.inputValue.set('');
    this.query.set('');
    this.result.set(null);
    this.loading.set(false);
    this.focusInput = true;
  }

  close(): void {
    this.isOpen.set(false);
    this.inputValue.set('');
    this.query.set('');
    this.result.set(null);
  }

  onQueryInput(value: string): void {
    this.inputValue.set(value);
    this.searchInput$.next(value);
  }

  hasAnyResults(r: SearchResult): boolean {
    return (
      (r.workspaces?.length ?? 0) > 0 ||
      (r.boards?.length ?? 0) > 0 ||
      (r.columns?.length ?? 0) > 0 ||
      (r.cards?.length ?? 0) > 0
    );
  }

  goToWorkspace(w: Workspace): void {
    this.router.navigate(['/workspaces', w.id]);
    this.close();
  }

  goToBoard(b: SearchBoardItem): void {
    this.router.navigate(['/boards', b.id]);
    this.close();
  }

  goToColumn(c: SearchColumnItem): void {
    this.router.navigate(['/boards', c.boardId]);
    this.close();
  }

  goToCard(c: SearchCardItem): void {
    this.router.navigate(['/boards', c.boardId], { queryParams: { card: c.id } });
    this.close();
  }

  onBackdropClick(): void {
    this.close();
  }

  onPanelClick(event: Event): void {
    event.stopPropagation();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}
