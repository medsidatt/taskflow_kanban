export type BoardRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface BoardMember {
  id: string; // UUID
  boardId: string; // UUID
  userId: string; // UUID
  username?: string;
  email?: string;
  role: BoardRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardMemberUpdateDto {
  role: BoardRole;
}
