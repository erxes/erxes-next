import { INotification } from '@/notification/my-inbox/types/notifications';
import { createContext, useContext } from 'react';

export interface INotificationListContext {
  notifications: INotification[];
  loading: boolean;
  totalCount: number;
}

export const NotificationListContext = createContext<INotificationListContext>(
  {} as INotificationListContext,
);

export const useNotificationsListContext = () => {
  return useContext(NotificationListContext);
};
