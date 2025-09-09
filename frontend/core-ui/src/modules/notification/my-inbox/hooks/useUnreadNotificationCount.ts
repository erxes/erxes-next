import { UNREAD_NOTIFICATIONS_COUNT } from '@/notification/my-inbox/graphql/notificationsQueries';
import {
  NOTIFICATION_READ,
  NOTIFICATION_SUBSCRIPTION,
} from '@/notification/my-inbox/graphql/notificationSubscriptions';
import { INotification } from '@/notification/my-inbox/types/notifications';
import { gql, useQuery } from '@apollo/client';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { currentUserState, IUser } from 'ui-modules';

export const useUnreadNotificationCount = () => {
  const currentUser = useAtomValue(currentUserState) as IUser;

  const { data, loading, subscribeToMore, refetch } = useQuery<{
    unreadNotificationsCount: number;
  }>(UNREAD_NOTIFICATIONS_COUNT);

  const { unreadNotificationsCount = 0 } = data || {};

  useEffect(() => {
    const unsubscribe = subscribeToMore<{
      notificationInserted: INotification;
    }>({
      document: gql(NOTIFICATION_SUBSCRIPTION),
      variables: {
        userId: currentUser ? currentUser._id : null,
      },
      updateQuery: () => {
        refetch();
      },
    });

    const notificationRead = subscribeToMore({
      document: gql(NOTIFICATION_READ),
      variables: { userId: currentUser ? currentUser._id : null },
      updateQuery: () => {
        refetch();
      },
    });

    return () => {
      unsubscribe();
      notificationRead();
    };
  }, []);

  return {
    unreadNotificationsCount,
    loading,
  };
};
