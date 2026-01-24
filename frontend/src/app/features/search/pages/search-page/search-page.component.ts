import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, Search, Briefcase, LayoutDashboard, LayoutList, CreditCard } from 'lucide-angular';
import { SearchService } from '../../../../core/services/search.service';
import { SearchResult, SearchBoardItem, SearchColumnItem, SearchCardItem } from '../../../../core/models/search.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { Workspace } from '../../../../core/models/workspace.model';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  readonly icons = { Search, Briefcase, LayoutDashboard, LayoutList, CreditCard };

  query = signal('');
  loading = signal(false);
  result = signal<SearchResult | null>(null);

  private destroyRef = inject(DestroyRef);
  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      const q = (params['q'] ?? '').trim();
      this.query.set(q || '');
      this.runSearch(q);
    });
  }

  runSearch(q: string): void {
    if (!q) {
      this.loading.set(false);
      this.result.set(null);
      return;
    }
    this.loading.set(true);
    this.result.set(null);
    this.searchService.search(q).subscribe({
      next: (r: SearchResult) => {
        this.result.set(r);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.result.set({ workspaces: [], boards: [], columns: [], cards: [] });
      }
    });
  }

  hasAnyResults(r: SearchResult): boolean {
    return (r.workspaces?.length ?? 0) > 0 ||
           (r.boards?.length ?? 0) > 0 ||
           (r.columns?.length ?? 0) > 0 ||
           (r.cards?.length ?? 0) > 0;
  }

  goToWorkspace(w: Workspace): void {
    this.router.navigate(['/workspaces', w.id]);
  }

  goToBoard(b: SearchBoardItem): void {
    this.router.navigate(['/boards', b.id]);
  }

  goToColumn(c: SearchColumnItem): void {
    this.router.navigate(['/boards', c.boardId]);
  }

  goToCard(c: SearchCardItem): void {
    this.router.navigate(['/boards', c.boardId], { queryParams: { card: c.id } });
  }
}
