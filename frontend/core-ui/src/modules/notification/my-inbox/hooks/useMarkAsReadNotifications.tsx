import { MARS_AS_READ_NOTIFICATIONS } from '@/notification/my-inbox/graphql/notificationMutations';
import { selectedNotificationsState } from '@/notification/my-inbox/states/notificationState';
import { useMutation } from '@apollo/client';
import { toast, useMultiQueryState } from 'erxes-ui';
import { useAtom } from 'jotai';

export const useMarkAsReadNotifications = () => {
  const [{ status }] = useMultiQueryState<{
    status: 'read' | 'unread' | 'all';
  }>(['status']);

  const [selectedNotifications, setSelectedNotifications] = useAtom(
    selectedNotificationsState,
  );

  const [archive, { loading }] = useMutation(MARS_AS_READ_NOTIFICATIONS);

  const markAsNotifications = () => {
    const variables: any = { ids: selectedNotifications };

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
