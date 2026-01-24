export type CardRole = 'ASSIGNEE' | 'WATCHER';

export interface CardMember {
  id: string; // UUID
  cardId: string; // UUID
  userId: string; // UUID
  username?: string;
  email?: string;
  role: CardRole;
  createdAt?: string;
}
