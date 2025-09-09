import { MARK_AS_READ_NOTIFICATION } from '@/notification/my-inbox/graphql/notificationMutations';
import { useNotificationContext } from '@/notification/my-inbox/hooks/userNotficationContext';
import { useMutation } from '@apollo/client';

export const useMarkAsReadNotification = () => {
  const { _id } = useNotificationContext();

  const [markAsRead] = useMutation(MARK_AS_READ_NOTIFICATION, {
    update: (cache) => {
      if (!_id) return;
      cache.modify({
        id: cache.identify({ __typename: 'Notification', _id }),
        fields: {
          isRead: () => true,
        },
      });
    },
  });

  return markAsRead;
};
