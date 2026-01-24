import { Workspace } from './workspace.model';

export interface SearchBoardItem {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  workspaceName: string;
}

export interface SearchColumnItem {
  id: string;
  name: string;
  boardId: string;
  boardName: string;
  workspaceId: string;
  workspaceName: string;
}

export interface SearchCardItem {
  id: string;
  title: string;
  columnId: string;
  columnName: string;
  boardId: string;
  boardName: string;
  workspaceId: string;
  workspaceName: string;
}

export interface SearchResult {
  workspaces: Workspace[];
  boards: SearchBoardItem[];
  columns: SearchColumnItem[];
  cards: SearchCardItem[];
}
