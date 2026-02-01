import { Card } from './card.model';

export interface BoardColumn {
  id: string; // UUID
  name: string;
  position: number;
  wipLimit?: number;
  archived: boolean;
  boardId: string; // UUID
  color?: string; // Hex color code for column
  // Extended for UI
  cards?: Card[];
}

export interface ColumnCreateDto {
  name: string;
  boardId: string; // UUID
  position?: number;
  wipLimit?: number;
  color?: string;
}

export interface ColumnUpdateDto {
  name?: string;
  position?: number;
  wipLimit?: number;
  archived?: boolean;
  color?: string;
}
