import { BoardColumn } from './board-column.model';
import { BoardMember } from './board-member.model';

export interface Board {
  id: string; // UUID
  name: string;
  description?: string;
  archived: boolean;
  isPrivate: boolean;
  backgroundColor?: string;
  /** Alternate when API uses snake_case (e.g. some proxies) */
  background_color?: string;
  position: number;
  workspaceId: string; // UUID
  workspaceName?: string;
  members?: BoardMember[];
  // Extended for UI
  columns?: BoardColumn[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardCreateDto {
  name: string;
  description?: string;
  isPrivate?: boolean;
  backgroundColor?: string;
  workspaceId: string; // UUID
}

export interface BoardUpdateDto {
  name?: string;
  description?: string;
  isPrivate?: boolean;
  backgroundColor?: string;
  archived?: boolean;
}
