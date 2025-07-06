import { useNotificationContext } from '@/notification/my-inbox/hooks/userNotficationContext';
import { activeNotificationState } from '@/notification/my-inbox/states/activeNotificationState';
import { Button, cn } from 'erxes-ui';
import { useAtomValue, useSetAtom } from 'jotai';
import { Link, useParams } from 'react-router';
import { currentUserState } from 'ui-modules';

export const NotificationContainer = ({
  children,
  className,
  onConversationSelect,
}: {
  children: React.ReactNode;
  className?: string;
  onConversationSelect?: () => void;
}) => {
  const { id } = useParams();
  const setActiveNotification = useSetAtom(activeNotificationState);
  const { loading, ...notification } = useNotificationContext();
  const { _id, isRead } = notification || {};
  const currentUser = useAtomValue(currentUserState);

  return (
    <Button
      key={_id}
      variant={isRead ? 'secondary' : 'ghost'}
      size="lg"
      className={cn(
        'flex rounded-none h-10 justify-start px-4 gap-3 hover:bg-primary/5 hover:text-foreground w-full',
        className,
        isRead && 'font-medium text-muted-foreground',
        id === _id && 'bg-primary/10 text-foreground hover:bg-primary/10',
      )}
      asChild
    >
      <Link
        to={`/my-inbox/${notification._id}`}
        onClick={() => {
          notification && setActiveNotification(notification);
          onConversationSelect?.();
        }}
      >
        {children}
      </Link>
    </Button>
  );
};
