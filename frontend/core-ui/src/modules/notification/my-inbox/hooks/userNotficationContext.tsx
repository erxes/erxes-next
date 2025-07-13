import { NotificationContext } from '@/notification/my-inbox/context/NotificationContext';
import { useContext } from 'react';

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotificationContext must be used within a NotificationContext',
    );
  }
  return context;
};
