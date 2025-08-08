import { INotification } from '@/notification/my-inbox/types/notifications';
import { createContext } from 'react';

export const NotificationContext = createContext<
  INotification & {
    loading?: boolean;
  }
>({} as INotification & { loading?: boolean });
