import { CardMember } from './card-member.model';
import { Label } from './label.model';

export interface Card {
  id: string; // UUID
  title: string;
  description?: string;
  position: number;
  archived: boolean;
  achieved?: boolean;
  dueDate?: string; // ISO 8601 string
  startDate?: string; // ISO 8601 string
  priority?: number; // 1 = highest, 2, 3, etc.
  columnId: string; // UUID
  members?: CardMember[];
  labels?: Label[];
  // Extended for UI
  commentCount?: number;
  attachmentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CardCreateDto {
  title: string;
  description?: string;
  columnId: string; // UUID
  position?: number;
  dueDate?: string;
  startDate?: string;
  priority?: number;
}

export interface CardUpdateDto {
  title?: string;
  description?: string;
  dueDate?: string;
  startDate?: string;
  priority?: number;
  archived?: boolean;
  achieved?: boolean;
  /** When true, clears dueDate on the server. */
  clearDueDate?: boolean;
}

export interface CardMoveDto {
  targetColumnId: string; // UUID
  newPosition: number;
}

// Activity Log
export interface ActivityLog {
  id: string; // UUID
  entityId: string; // UUID
  entityType: string;
  action: string; // CREATED, UPDATED, MOVED, DELETED
  details: string;
  timestamp: string; // ISO 8601
  performedBy: string; // UUID
  performedByUsername?: string; // Extended for UI
}

// Comment
export interface Comment {
  id: string; // UUID
  content: string;
  edited: boolean;
  cardId: string; // UUID
  authorId: string; // UUID
  authorUsername: string;
  createdAt: string; // ISO 8601
  updatedAt?: string;
}

export interface CommentCreateDto {
  content: string;
  cardId: string; // UUID
}

// Attachment
export interface Attachment {
  id: string; // UUID
  fileName: string;
  fileSize: number;
  fileUrl: string;
  cardId: string; // UUID
  uploadedBy: string; // UUID
  createdAt: string;
}
