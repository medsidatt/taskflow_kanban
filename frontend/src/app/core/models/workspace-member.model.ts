export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface WorkspaceMember {
  id: string; // UUID
  workspaceId: string; // UUID
  userId: string; // UUID
  username?: string;
  email?: string;
  role: WorkspaceRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkspaceMemberUpdateDto {
  role: WorkspaceRole;
}
