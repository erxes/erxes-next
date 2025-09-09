import { MARK_AS_READ_NOTIFICATION } from '@/notification/my-inbox/graphql/notificationMutations';
import { useNotificationContext } from '@/notification/my-inbox/hooks/userNotficationContext';
import { useMutation } from '@apollo/client';

export const useMarkAsReadNotification = () => {
  const { _id } = useNotificationContext();

  const [markAsRead] = useMutation(MARK_AS_READ_NOTIFICATION, {
    update: (cache) => {
      cache.modify({
        fields: {
          notifications(existingDocs) {
            const { list = [] } = existingDocs || {};

            return list.map((notification: any) =>
              notification._id === _id
                ? { ...notification, isRead: true }
                : notification,
            );
          },
        },
      });
    },
  });

  return markAsRead;
};
