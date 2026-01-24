export interface Label {
  id: string; // UUID
  name: string;
  color: string; // Hex color like "#e74c3c"
  boardId: string; // UUID
}

export interface LabelCreateDto {
  name: string;
  color: string;
  boardId: string; // UUID
}

export interface LabelUpdateDto {
  name?: string;
  color?: string;
}
