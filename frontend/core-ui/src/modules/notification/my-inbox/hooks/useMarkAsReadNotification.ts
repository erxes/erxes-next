import { useMutation } from '@apollo/client';
import { MARK_AS_READ_NOTIFICATION } from '@/notification/my-inbox/graphql/notificationMutations';

export const useMarkAsReadNotification = () => {
  const [markAsRead] = useMutation(MARK_AS_READ_NOTIFICATION);

  return markAsRead;
};
