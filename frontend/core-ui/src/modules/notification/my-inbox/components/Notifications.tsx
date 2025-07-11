import { NotificationsCommandBar } from '@/notification/my-inbox/components/NotificationCommandBar';
import { NotificationContainer } from '@/notification/my-inbox/components/NotificationContainer';
import { NotificationContext } from '@/notification/my-inbox/components/NotificationContext';
import { NotificationSidebarToolbar } from '@/notification/my-inbox/components/NotificationSidebarToolbar';
import { NotificationListContext } from '@/notification/my-inbox/components/NotificationsListContext';
import {
  NOTIFICATION_PRIORITY_COLORS,
  NOTIFICATION_TYPE_COLORS,
  NOTIFICATION_TYPE_ICONS,
} from '@/notification/my-inbox/constants/notifications';
import { useNotifications } from '@/notification/my-inbox/hooks/useNotifications';
import {
  notificationsContainerScrollState,
  refetchNewNotificationsState,
  selectedNotificationsState,
  setSelectNotificationsState,
} from '@/notification/my-inbox/states/notificationState';
import { INotification } from '@/notification/my-inbox/types/notifications';
import { IconLoader, IconSquareRounded } from '@tabler/icons-react';
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  cn,
  EnumCursorDirection,
  isUndefinedOrNull,
  readFile,
  RelativeDateDisplay,
  Tooltip,
} from 'erxes-ui';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import { Link, useParams } from 'react-router';

export const Notifications = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [notificationsContainerScroll, setNotificationsContainerScroll] =
    useAtom(notificationsContainerScrollState);
  const refetchNewNotifications = useAtomValue(refetchNewNotificationsState);

  const [rerendered, setRerendered] = useState(false);

  const { notifications, loading, handleFetchMore, pageInfo, totalCount } =
    useNotifications();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <NotificationsCommandBar />
        <div className="h-full w-full overflow-y-auto" ref={containerRef}>
          {notifications.map((notification) => (
            <NotificationRow
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
              ref={ref}
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
      </div>
    </NotificationListContext.Provider>
  );
};

const NotificationRow = ({
  notification,
  setNotificationsContainerScroll,
  setRerendered,
  containerRef,
}: {
  notification: INotification;
  containerRef: RefObject<HTMLDivElement>;
  setNotificationsContainerScroll: any;
  setRerendered: Dispatch<SetStateAction<boolean>>;
}) => {
  const { id: selectedNotificationId } = useParams();

  const {
    _id,
    title,
    message,
    type,
    contentType,
    isRead,
    createdAt,
    priority,
    fromUser,
    fromUserId,
  } = notification;
  const NotificationTypeIcon = NOTIFICATION_TYPE_ICONS[type];
  const notificationtypeColor = NOTIFICATION_TYPE_COLORS[type];
  const priorityColor = NOTIFICATION_PRIORITY_COLORS[priority];
  const moduleName = (contentType || '').replace(':', '.').split('.')[1];
  const isSelected = _id === selectedNotificationId;
  const selectedNotifications = useAtomValue(selectedNotificationsState);
  const isCheckedNotificaton = selectedNotifications.includes(_id);

  return (
    <NotificationContext.Provider key={_id} value={notification}>
      <NotificationContainer
        className="relative group p-4 pl-6 h-auto overflow-hidden flex-col items-start cursor-pointer"
        onNotificationSelect={() => {
          setNotificationsContainerScroll(containerRef.current?.scrollTop || 0);
          setRerendered(true);
        }}
      >
        <div className="absolute left-0 top-0 h-full w-1/5 z-10 pl-4">
          <NotificationCheckbox _id={_id} />
        </div>
        <div
          className={cn(
            'flex flex-row gap-4 w-full transition-all',
            isSelected ? 'text-primary' : 'text-foreground',
            'group-hover:translate-x-12',
            {
              'translate-x-12': isCheckedNotificaton,
            },
          )}
        >
          <div
            className={cn('flex flex-col gap-2 w-full', {
              'text-accent-foreground': isRead && !isSelected,
            })}
          >
            <div className="flex flex-row justify-between">
              <div className="flex flex-row items-center gap-2">
                <Avatar size="lg" className="hover:shadow">
                  {/* <Link to={`/settings/team-member?user_id=${fromUserId}`}> */}
                  <Avatar.Image src={fromUser.details?.avatar} />
                  <Avatar.Fallback
                    className={cn({
                      'text-primary': isSelected,
                    })}
                  >
                    {
                      `${
                        fromUser?.username ||
                        fromUser?.details?.fullName ||
                        fromUser?.email
                      }`.split('')[0]
                    }
                  </Avatar.Fallback>
                  {/* </Link> */}
                </Avatar>

                <div>
                  <p className="w-full text-left truncate text-semibold flex flex-row gap-2 items-center">
                    {title}
                    {!isRead && (
                      <Tooltip.Provider>
                        <Tooltip>
                          <Tooltip.Trigger>
                            <div
                              className={cn(
                                'size-2 rounded-full',
                                priorityColor,
                              )}
                            />
                          </Tooltip.Trigger>
                          <Tooltip.Content>{priority}</Tooltip.Content>
                        </Tooltip>
                      </Tooltip.Provider>
                    )}
                  </p>
                  <span
                    className={`font-normal ${
                      isSelected ? 'text-primary' : 'text-accent-foreground'
                    } text-xs`}
                  >
                    {message}
                  </span>
                </div>
              </div>

              <Tooltip.Provider>
                <Tooltip>
                  <Tooltip.Trigger asChild>
                    {NotificationTypeIcon ? (
                      <NotificationTypeIcon
                        className={cn('size-4', notificationtypeColor)}
                      />
                    ) : (
                      <IconSquareRounded />
                    )}
                  </Tooltip.Trigger>
                  <Tooltip.Content>{type}</Tooltip.Content>
                </Tooltip>
              </Tooltip.Provider>
            </div>

            <div className="w-full flex flex-row justify-between items-center">
              {createdAt && <RelativeDateDisplay.Value value={createdAt} />}
              <Badge variant="secondary" className="capitalize">
                {moduleName || '-'}
              </Badge>
            </div>
          </div>
        </div>
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

const NotificationCheckbox = ({ _id }: { _id: string }) => {
  const [isChecked, setIsChecked] = useState(false);
  const setSelectNotifications = useSetAtom(setSelectNotificationsState);

  return (
    <div
      className={cn('h-full flex items-center p-2 ', {
        'opacity-0 group-hover:opacity-100 transition-opacity': !isChecked,
      })}
    >
      <Checkbox
        checked={isChecked}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onCheckedChange={() => setSelectNotifications(_id || '')}
      />
      <NotificationCheckedEffect
        _id={_id}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
      />
    </div>
  );
};

const NotificationCheckedEffect = ({
  _id,
  isChecked,
  setIsChecked,
}: {
  _id: string;
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
}) => {
  const selectedNotifications = useAtomValue(selectedNotificationsState);

  useEffect(() => {
    if (isChecked !== selectedNotifications.includes(_id || '')) {
      setIsChecked(selectedNotifications.includes(_id || ''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNotifications]);

  return null;
};
