import { IUser } from 'ui-modules';

export enum INotificationKind {
  SYSTEM = 'system',
  USER = 'user',
}

export type INotification = {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';

  fromUserId?: string;
  fromUser?: IUser;

  contentType?: string; // 'frontline:conversation', 'sales:deal', etc.
  contentTypeId?: string; // target object ID

  // Status
  isRead: boolean;
  readAt?: string;

  // Additional data
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: any; // plugin-specific data
  action?: string;

  // Timestamps
  createdAt: string;
  expiresAt?: string; // Auto-cleanup old notifications
  kind: INotificationKind;
  emailDelivery?: {
    _id: string;
    status: string;
    error?: string;
    sentAt: string;
  };
};

export type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result;

export enum MyInboxHotkeyScope {
  MainPage = 'my-inbox-main-filter',
  NotificationsAbjustments = 'my-inbox-main-abjustments',
  NotificationsContainer = 'my-inbox-notifications-container',
}

export enum NotificationsPaths {
  MainPage = '/my-inbox',
}
