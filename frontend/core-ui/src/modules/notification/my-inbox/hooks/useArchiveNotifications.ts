import { ARCHIVE_NOTIFICATIONS } from '@/notification/my-inbox/graphql/notificationMutations';
import { selectedNotificationsState } from '@/notification/my-inbox/states/notificationState';
import { useMutation } from '@apollo/client';
import { parseDateRangeFromString, toast, useMultiQueryState } from 'erxes-ui';
import { useAtom } from 'jotai';

export const useArchiveNotifications = () => {
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

  const [archive, { loading }] = useMutation(ARCHIVE_NOTIFICATIONS);

  const archiveNotifications = ({
    ids,
    all,
  }: {
    ids?: string[];
    all?: boolean;
  }) => {
    let variables: any = { ids };
    if (all) {
      variables = {
        archiveAll: all,
        filters: {
          status: status?.toUpperCase() || 'UNREAD',
          priority: priority?.toUpperCase(),
          type: type?.toUpperCase(),
          fromDate: parseDateRangeFromString(createdAt)?.from,
          endDate: parseDateRangeFromString(createdAt)?.to,
          fromUserId,
        },
      };
    }
    archive({
      variables,
      onError: (error) => {
        toast({ title: 'Something went wrong', description: error?.message });
      },
      onCompleted: () => {
        toast({ title: 'Archived successfully' });

        setSelectedNotifications([]);
      },
    });
  };

  return {
    status,
    archiveNotifications,
    loading,
    selectedNotificationsCount: selectedNotifications.length,
    setSelectedNotifications,
    selectedNotifications,
  };
};
