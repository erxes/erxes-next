import { useMarkAsReadNotification } from '@/notification/my-inbox/hooks/useMarkAsReadNotification';
import { useNotificationContext } from '@/notification/my-inbox/hooks/userNotficationContext';
import { activeNotificationState } from '@/notification/my-inbox/states/notificationState';
import { Button, cn } from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { useNavigate, useParams, useSearchParams } from 'react-router';

export const NotificationContainer = ({
  children,
  className,
  onNotificationSelect,
}: {
  children: React.ReactNode;
  className?: string;
  onNotificationSelect?: () => void;
}) => {
  const [searchParams] = useSearchParams();
  const markAsRead = useMarkAsReadNotification();
  const { id } = useParams();
  const navigate = useNavigate();

  const setActiveNotification = useSetAtom(activeNotificationState);
  const { loading, ...notification } = useNotificationContext();
  const { _id, isRead } = notification || {};

  const handleClick = () => {
    const queryString = searchParams.toString();
    const newPath = `/my-inbox/${notification._id}${
      queryString ? `?${queryString}` : ''
    }`;
    notification && setActiveNotification(notification);
    onNotificationSelect?.();
    markAsRead({ variables: { id } });
    navigate(newPath);
  };

  return (
    <Button
      key={_id}
      variant={isRead ? 'secondary' : 'ghost'}
      size="lg"
      className={cn(
        'flex rounded-none h-10 justify-start px-4 gap-3 hover:bg-primary/5 hover:text-foreground w-full focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/70',
        className,
        isRead && 'font-medium text-muted-foreground',
        id === _id && 'bg-primary/10 text-foreground hover:bg-primary/10',
      )}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      tabIndex={0}
      asChild
    >
      {children}
    </Button>
  );
};
