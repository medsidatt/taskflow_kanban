export interface Workspace {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkspaceCreateDto {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface WorkspaceUpdateDto {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}
