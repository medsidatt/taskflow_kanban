import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { WorkspaceRole } from '../models/workspace-member.model';
import { BoardRole } from '../models/board-member.model';
import { CardRole } from '../models/card-member.model';

/**
 * Service for checking user permissions across the application
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  // Workspace Permissions
  canEditWorkspace(role: WorkspaceRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  canDeleteWorkspace(role: WorkspaceRole): boolean {
    return role === 'OWNER';
  }

  canManageWorkspaceMembers(role: WorkspaceRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  canCreateBoard(role: WorkspaceRole): boolean {
    return role === 'OWNER' || role === 'ADMIN' || role === 'MEMBER';
  }

  // Board Permissions
  canEditBoard(role: BoardRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  canDeleteBoard(role: BoardRole): boolean {
    return role === 'OWNER';
  }

  canManageBoardMembers(role: BoardRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  canCreateColumn(role: BoardRole): boolean {
    return role === 'OWNER' || role === 'ADMIN' || role === 'MEMBER';
  }

  canEditColumn(role: BoardRole): boolean {
    return role === 'OWNER' || role === 'ADMIN' || role === 'MEMBER';
  }

  canDeleteColumn(role: BoardRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  canCreateCard(role: BoardRole): boolean {
    return role === 'OWNER' || role === 'ADMIN' || role === 'MEMBER';
  }

  // Card Permissions
  canEditCard(boardRole: BoardRole, cardRole?: CardRole): boolean {
    // Board members with at least MEMBER role can edit cards
    if (boardRole === 'OWNER' || boardRole === 'ADMIN' || boardRole === 'MEMBER') {
      return true;
    }
    // Card assignees can also edit
    return cardRole === 'ASSIGNEE';
  }

  canDeleteCard(boardRole: BoardRole): boolean {
    return boardRole === 'OWNER' || boardRole === 'ADMIN' || boardRole === 'MEMBER';
  }

  canAddComment(boardRole: BoardRole): boolean {
    // Anyone with at least VIEWER role can comment
    return true;
  }

  canEditComment(authorId: string, currentUserId: string, boardRole: BoardRole): boolean {
    // User can edit their own comments, or admins/owners can edit any comment
    return authorId === currentUserId || boardRole === 'OWNER' || boardRole === 'ADMIN';
  }

  canDeleteComment(authorId: string, currentUserId: string, boardRole: BoardRole): boolean {
    // User can delete their own comments, or admins/owners can delete any comment
    return authorId === currentUserId || boardRole === 'OWNER' || boardRole === 'ADMIN';
  }

  // Label Permissions
  canManageLabels(role: BoardRole): boolean {
    return role === 'OWNER' || role === 'ADMIN' || role === 'MEMBER';
  }
}
