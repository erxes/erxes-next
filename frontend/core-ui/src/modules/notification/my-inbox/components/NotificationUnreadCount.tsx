import { useUnreadNotificationCount } from '@/notification/my-inbox/hooks/useUnreadNotificationCount';
import { Spinner } from 'erxes-ui';

export const UnreadNotificationsCount = () => {
  const { unreadNotificationsCount, loading } = useUnreadNotificationCount();

  return (
    <p className="flex justify-end font-semibold text-accent-foreground text-xs">
      Unread {loading ? <Spinner /> : unreadNotificationsCount || 0}{' '}
      notifications
    </p>
  );
};
