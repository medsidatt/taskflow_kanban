import { Card } from './card.model';

export interface BoardColumn {
  id: string; // UUID
  name: string;
  position: number;
  wipLimit?: number;
  archived: boolean;
  boardId: string; // UUID
  // Extended for UI
  cards?: Card[];
}

export interface ColumnCreateDto {
  name: string;
  boardId: string; // UUID
  position?: number;
  wipLimit?: number;
}

export interface ColumnUpdateDto {
  name?: string;
  position?: number;
  wipLimit?: number;
  archived?: boolean;
}
