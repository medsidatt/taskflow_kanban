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

  toggleDropdown(type: 'workspace', event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (type === 'workspace') {
      // Don't toggle if viewing all boards
      if (this.viewAllBoards()) {
        this.showWorkspaceDropdown.set(false);
        return;
      }
      this.showWorkspaceDropdown.update(v => !v);
    }
  }

  openWorkspaceBoardsList(workspaceId: string | null | undefined, event?: Event): void {
    event?.stopPropagation();
    if (!workspaceId) return;
    this.navigateToWorkspace(workspaceId);
    this.showWorkspaceDropdown.set(false);
  }

  selectWorkspace(workspace: Workspace, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (!workspace?.id) return;
    // Close dropdown first
    this.showWorkspaceDropdown.set(false);
    // Then set workspace and navigate
    this.workspaceStateService.setCurrentWorkspace(workspace);
    this.navigateToWorkspace(workspace.id);
  }

  selectAllBoards(event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    // Don't touch the dropdown at all - just set state and navigate
    this.workspaceStateService.setViewAllBoards(true);
    this.router.navigate(['/boards']);
  }

  closeDropdowns(event?: Event): void {
    // Don't close if clicking inside the dropdown or on navigation items
    if (event) {
      const target = event.target as HTMLElement;
      // If clicking on "All Boards" button, don't touch dropdown at all - just return
      const allBoardsButton = target.closest('button.sidebar-nav-item, button.sidebar-collapsed-item');
      if (allBoardsButton && (allBoardsButton.textContent?.includes('All Boards') || allBoardsButton.getAttribute('title') === 'All Boards')) {
        // Don't touch dropdown - just return
        return;
      }
      // Don't close if clicking inside the dropdown
      if (target.closest('.sidebar-workspace-selector-dropdown')) {
        return;
      }
      // Don't close if clicking on the workspace selector button itself
      if (target.closest('.sidebar-workspace-selector-btn')) {
        return;
      }
      // Don't close if clicking on other navigation items
      if (target.closest('.sidebar-nav-item') || target.closest('.sidebar-collapsed-item')) {
        return;
      }
    }
    this.showWorkspaceDropdown.set(false);
  }
}
