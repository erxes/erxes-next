import { NOTIFICATIONS } from '@/notification/my-inbox/graphql/notificationsQueries';
import { INotification } from '@/notification/my-inbox/types/notifications';
import { useQuery } from '@apollo/client';

export const useNotifications = () => {
  const { data, loading } = useQuery<{ notifications: INotification[] }>(
    NOTIFICATIONS,
  );

  const { notifications = [] } = data || {};

  return {
    notifications,
    loading,
  };
};
