import { MARS_AS_READ_NOTIFICATIONS } from '@/notification/my-inbox/graphql/notificationMutations';
import { selectedNotificationsState } from '@/notification/my-inbox/states/notificationState';
import { useMutation } from '@apollo/client';
import { parseDateRangeFromString, toast, useMultiQueryState } from 'erxes-ui';
import { useAtom } from 'jotai';

export const useMarkAsReadNotifications = () => {
  const [{ status, priority, type, createdAt, fromUserId }] =
    useMultiQueryState<{
      status: 'read' | 'unread' | 'all';
      priority: 'low' | 'medium' | 'high' | 'urgent';
      type: 'info' | 'success' | 'warning' | 'error';
      createdAt: string;
      fromUserId: string;
    }>(['status', 'priority', 'type', 'createdAt', 'fromUserId']);
  const [selectedNotifications, setSelectedNotifications] = useAtom(
    selectedNotificationsState,
  );

  const [archive, { loading }] = useMutation(MARS_AS_READ_NOTIFICATIONS);

  const markAsNotifications = () => {
    let variables: any = { ids: selectedNotifications };
    archive({
      variables,
      onError: (error) => {
        toast({ title: 'Something went wrong', description: error?.message });
      },
      onCompleted: () => {
        toast({ title: 'Set mark as read notifications successfully' });

        setSelectedNotifications([]);
      },
    });
  };

  return {
    status,
    markAsNotifications,
    loading,
    selectedNotificationsCount: selectedNotifications.length,
    setSelectedNotifications,
    selectedNotifications,
  };
};
