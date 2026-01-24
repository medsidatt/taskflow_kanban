import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet, RouterLink, RouterLinkActive, ParamMap } from '@angular/router';
import { LucideAngularModule, LayoutGrid, Users, Settings } from 'lucide-angular';
import { WorkspaceService } from '../../core/services/workspace.service';
import { WorkspaceStateService } from './services/workspace-state.service';
import { Workspace } from '../../core/models/workspace.model';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule
  ],
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  readonly icons = { LayoutGrid, Users, Settings };

  workspace = signal<Workspace | null>(null);
  loading = signal(true);

  /** Prefer state (updated by e.g. settings) when it matches the loaded workspace. */
  displayWorkspace = computed(() => {
    const s = this.workspaceStateService.workspace$();
    const l = this.workspace();
    if (s?.id === l?.id) return s;
    return l;
  });

  constructor(
    private route: ActivatedRoute,
    private workspaceService: WorkspaceService,
    private workspaceStateService: WorkspaceStateService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.loadWorkspace(id);
      } else {
        this.loading.set(false);
      }
    });
  }

  private loadWorkspace(id: string): void {
    this.loading.set(true);
    this.workspaceService.getWorkspaceById(id).subscribe({
      next: (w: Workspace) => {
        this.workspace.set(w);
        this.workspaceStateService.setCurrentWorkspace(w);
      },
      error: () => this.workspace.set(null),
      complete: () => this.loading.set(false)
    });
  }
}
