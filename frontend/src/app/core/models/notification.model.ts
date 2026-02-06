export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  entityId?: string;
  entityType?: string;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType =
  | 'CARD_ASSIGNED'
  | 'CARD_COMMENT'
  | 'CARD_MENTION'
  | 'DUE_DATE_REMINDER'
  | 'BOARD_INVITE'
  | 'CARD_UPDATE';

export interface UnreadCountResponse {
  count: number;
}
