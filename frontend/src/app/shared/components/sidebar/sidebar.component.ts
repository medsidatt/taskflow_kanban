import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Users, Settings, Plus, ChevronLeft, ChevronRight, ChevronDown, Briefcase, Menu, Grid, Activity, Share2 } from 'lucide-angular';
import { WorkspaceStateService } from '../../../features/workspace/services/workspace-state.service';
import { WorkspaceService } from '../../../core/services/workspace.service';
import { Workspace } from '../../../core/models/workspace.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  readonly icons = {
    Users,
    Settings,
    Plus,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Briefcase,
    Menu,
    Grid,
    Activity,
    Share2
  };

  isCollapsed = signal(false);
  showWorkspaceDropdown = signal(false);

  currentWorkspace: any;
  workspaces = computed(() => this.workspaceStateService.workspaces$());
  viewAllBoards = computed(() => this.workspaceStateService.viewAllBoards$());

  constructor(
    private workspaceStateService: WorkspaceStateService,
    private workspaceService: WorkspaceService,
    private router: Router
  ) {
    this.currentWorkspace = this.workspaceStateService.workspace$;
  }

  ngOnInit(): void {
    this.loadWorkspaces();
    const collapsed = localStorage.getItem('taskflow_sidebar_collapsed');
    if (collapsed === 'true') {
      this.isCollapsed.set(true);
    }
  }

  async loadWorkspaces(): Promise<void> {
    try {
      const workspaces = await this.workspaceService.getAllWorkspaces().toPromise();
      if (workspaces) {
        this.workspaceStateService.setWorkspaces(workspaces);
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
  }

  toggleSidebar(): void {
    this.isCollapsed.update(val => !val);
    localStorage.setItem('taskflow_sidebar_collapsed', String(this.isCollapsed()));
  }

  navigateToWorkspace(workspaceId: string | null | undefined): void {
    if (!workspaceId) return;
    this.router.navigate(['/workspaces', workspaceId]);
  }

  openWorkspaceMembers(workspaceId: string | null | undefined, event?: Event): void {
    event?.stopPropagation();
    if (!workspaceId) return;
    this.router.navigate(['/workspaces', workspaceId, 'members']);
    this.showWorkspaceDropdown.set(false);
  }

  openWorkspaceSettings(workspaceId: string | null | undefined, event?: Event): void {
    event?.stopPropagation();
    if (!workspaceId) return;
    this.router.navigate(['/workspaces', workspaceId, 'settings']);
    this.showWorkspaceDropdown.set(false);
  }

  openWorkspaceActivity(workspaceId: string | null | undefined, event?: Event): void {
    event?.stopPropagation();
    if (!workspaceId) return;
    this.router.navigate(['/workspaces', workspaceId, 'activity']);
    this.showWorkspaceDropdown.set(false);
  }

  toggleDropdown(type: 'workspace'): void {
    if (type === 'workspace') {
      this.showWorkspaceDropdown.update(v => !v);
    }
  }

  openWorkspaceBoardsList(workspaceId: string | null | undefined, event?: Event): void {
    event?.stopPropagation();
    if (!workspaceId) return;
    this.navigateToWorkspace(workspaceId);
    this.showWorkspaceDropdown.set(false);
  }

  selectWorkspace(workspace: Workspace): void {
    if (!workspace?.id) return;
    this.workspaceStateService.setCurrentWorkspace(workspace);
    this.navigateToWorkspace(workspace.id);
    this.showWorkspaceDropdown.set(false);
  }

  selectAllBoards(event?: Event): void {
    event?.stopPropagation();
    this.workspaceStateService.setViewAllBoards(true);
    this.router.navigate(['/boards']);
    this.showWorkspaceDropdown.set(false);
  }

  closeDropdowns(): void {
    this.showWorkspaceDropdown.set(false);
  }
}
