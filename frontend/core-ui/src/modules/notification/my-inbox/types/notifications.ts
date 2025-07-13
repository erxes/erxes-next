import { IUser } from 'ui-modules';

export type INotification = {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';

  fromUserId?: string;
  fromUser: IUser;

  contentType: string; // 'frontline:conversation', 'sales:deal', etc.
  contentTypeId?: string; // target object ID

  // Status
  isRead: boolean;
  readAt?: string;

  // Additional data
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: any; // plugin-specific data

  // Timestamps
  createdAt: string;
  expiresAt?: string; // Auto-cleanup old notifications
};

export type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result;
