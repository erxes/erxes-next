import { NotificationItem } from '@/notification/my-inbox/components/NotificationItem';
import { useNotifications } from '@/notification/my-inbox/hooks/useNotifications';
import {
  notificationsContainerScrollState,
  refetchNewNotificationsState,
} from '@/notification/my-inbox/states/notificationState';
import {
  INotification,
  SetAtom,
} from '@/notification/my-inbox/types/notifications';
import { IconLoader, IconMailboxOff } from '@tabler/icons-react';
import {
  Button,
  EnumCursorDirection,
  isUndefinedOrNull,
  Separator,
} from 'erxes-ui';
import { useAtom, useAtomValue } from 'jotai';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import { NotificationListContext } from '../context/NotificationsListContext';
import { NotificationsCommandBar } from './NotificationCommandBar';
import { NotificationSidebarToolbar } from './NotificationSidebarToolbar';

export const Notifications = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [notificationsContainerScroll, setNotificationsContainerScroll] =
    useAtom(notificationsContainerScrollState);
  const refetchNewNotifications = useAtomValue(refetchNewNotificationsState);

  const [rerendered, setRerendered] = useState(false);

  const {
    notifications,
    loading,
    handleFetchMore,
    pageInfo,
    totalCount,
    refetch,
  } = useNotifications();

  const [ref] = useInView({
    onChange(inView) {
      if (inView) {
        handleFetchMore({
          direction: EnumCursorDirection.FORWARD,
        });
      }
    },
  });

  useEffect(() => {
    if (
      containerRef.current &&
      !isUndefinedOrNull(notificationsContainerScroll) &&
      !rerendered
    ) {
      containerRef.current.scrollTo({
        top: notificationsContainerScroll,
      });
      setNotificationsContainerScroll(null);
    }
  }, [notificationsContainerScroll]);

  useEffect(() => {
    if (refetchNewNotifications) {
      containerRef.current?.scrollTo({
        top: 0,
      });
    }
  }, [refetchNewNotifications]);

  return (
    <NotificationListContext.Provider
      value={{ notifications, loading, totalCount }}
    >
      <div className="flex flex-col h-full overflow-hidden w-full">
        <NotificationSidebarToolbar />
        <NotificationsCommandBar refetch={refetch} />
        <Separator />
        <NotificationList
          inViewRef={ref}
          containerRef={containerRef}
          setRerendered={setRerendered}
          setNotificationsContainerScroll={setNotificationsContainerScroll}
          notifications={notifications}
          loading={loading}
          pageInfo={pageInfo}
        />
      </div>
    </NotificationListContext.Provider>
  );
};

const NotificationList = ({
  inViewRef,
  containerRef,
  setNotificationsContainerScroll,
  setRerendered,
  notifications,
  loading,
  pageInfo,
}: {
  inViewRef: (node?: Element | null) => void;
  containerRef: RefObject<HTMLDivElement>;
  setRerendered: Dispatch<SetStateAction<boolean>>;
  setNotificationsContainerScroll: SetAtom<
    [SetStateAction<number | null>],
    void
  >;
  notifications: INotification[];
  loading: boolean;
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
}) => {
  if (!loading && notifications.length === 0) {
    return (
      <div className="h-full w-full flex flex-col gap-4 justify-center items-center text-accent-foreground">
        <div className="border border-dashed p-6 bg-sidebar rounded-xl">
          <IconMailboxOff />
        </div>
        <span className="text-sm">
          No notifications to display at the moment.
        </span>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full overflow-y-auto"
      ref={containerRef}
      tabIndex={0}
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          setNotificationsContainerScroll={setNotificationsContainerScroll}
          setRerendered={setRerendered}
          containerRef={containerRef}
        />
      ))}
      {!loading && notifications?.length > 0 && pageInfo?.hasNextPage && (
        <Button
          variant="ghost"
          ref={inViewRef}
          className="pl-6 h-8 w-full text-muted-foreground"
          asChild
        >
          <div>
            <IconLoader className="size-4 animate-spin" />
            loading more...
          </div>
        </Button>
      )}
    </div>
  );
};
