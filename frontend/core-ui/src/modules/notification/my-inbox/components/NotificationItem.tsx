import {
  NOTIFICATION_PRIORITY_COLORS,
  NOTIFICATION_TYPE_COLORS,
  NOTIFICATION_TYPE_ICONS,
} from '@/notification/my-inbox/constants/notifications';
import { useNotificationContext } from '@/notification/my-inbox/hooks/userNotficationContext';
import {
  selectedNotificationsState,
  setSelectNotificationsState,
} from '@/notification/my-inbox/states/notificationState';
import {
  INotification,
  INotificationKind,
} from '@/notification/my-inbox/types/notifications';
import { IconSquareRounded } from '@tabler/icons-react';
import {
  Avatar,
  Badge,
  Checkbox,
  cn,
  RelativeDateDisplay,
  Separator,
  Tooltip,
} from 'erxes-ui';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router';
import { NotificationContext } from '../context/NotificationContext';
import { NotificationContainer } from './NotificationContainer';

export const NotificationItem = ({
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

  const { _id, contentType, isRead, createdAt, updatedAt, kind } = notification;
  const moduleName = (contentType || '').replace(':', '.').split('.')[1];
  const isSelected = _id === selectedNotificationId;

  return (
    <NotificationContext.Provider key={_id} value={notification}>
      <NotificationContainer
        className="p-4 pl-6 h-auto overflow-hidden flex-col items-start cursor-pointer"
        onNotificationSelect={() => {
          setNotificationsContainerScroll(containerRef.current?.scrollTop || 0);
          setRerendered(true);
        }}
      >
        <div
          className={cn(
            'flex flex-row gap-4 w-full transition-all',
            isSelected ? 'text-primary' : 'text-foreground',
          )}
        >
          <div
            className={cn('flex flex-col gap-2 w-full', {
              'text-accent-foreground': isRead && !isSelected,
            })}
          >
            <NotificationItemRow />

            <div className="w-full flex flex-row justify-between items-center">
              {createdAt && (
                <RelativeDateDisplay.Value value={updatedAt || createdAt} />
              )}
              <Badge variant="secondary" className="capitalize">
                {kind === INotificationKind.SYSTEM
                  ? 'System'
                  : moduleName || '-'}
              </Badge>
            </div>
          </div>
        </div>
      </NotificationContainer>
      <Separator />
    </NotificationContext.Provider>
  );
};

const NotificationItemRow = () => {
  const { id: selectedNotificationId } = useParams();

  const { loading, ...notification } = useNotificationContext();

  const { _id, title, isRead, priority, message, type } = notification || {};

  const NotificationTypeIcon = NOTIFICATION_TYPE_ICONS[type];
  const notificationtypeColor = NOTIFICATION_TYPE_COLORS[type];
  const priorityColor = NOTIFICATION_PRIORITY_COLORS[priority];
  const isSelected = _id === selectedNotificationId;
  const selectedNotifications = useAtomValue(selectedNotificationsState);
  const isCheckedNotificaton = selectedNotifications.includes(_id);

  return (
    <div className="flex flex-row justify-between relative group">
      <div className="absolute left-0 top-0 h-full w-1/5 z-10">
        <NotificationCheckbox _id={_id} />
      </div>
      <div
        className={cn(
          'flex flex-row gap-4 w-full items-center transition-all',
          isSelected ? 'text-primary' : 'text-foreground',
          'group-hover:translate-x-8  group-focus-within:translate-x-8',
          {
            'translate-x-8': isCheckedNotificaton,
          },
        )}
      >
        <NotificationAvatar isSelected={isSelected} />

        <div>
          <p className="w-full text-left truncate text-semibold flex flex-row gap-2 items-center">
            {title}
            {!isRead && (
              <Tooltip.Provider>
                <Tooltip>
                  <Tooltip.Trigger>
                    <div className={cn('size-2 rounded-full', priorityColor)} />
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

      {NotificationTypeIcon ? (
        <NotificationTypeIcon
          className={cn('size-4 z-20', notificationtypeColor)}
        />
      ) : (
        <IconSquareRounded />
      )}
    </div>
  );
};

const NotificationAvatar = ({ isSelected }: { isSelected: boolean }) => {
  const { loading, ...notification } = useNotificationContext();
  const { fromUser, kind } = notification;

  if (kind === INotificationKind.SYSTEM) {
    return (
      <Avatar size="lg" className="hover:shadow">
        <Avatar.Image src="/assets/erxes-bot.webp" />
      </Avatar>
    );
  }

  return (
    <Avatar size="lg" className="hover:shadow">
      {/* <Link to={`/settings/team-member?user_id=${fromUserId}`}> */}
      <Avatar.Image src={fromUser?.details?.avatar} />
      <Avatar.Fallback
        className={cn({
          'text-primary': isSelected,
        })}
      >
        {
          `${
            fromUser?.username || fromUser?.details?.fullName || fromUser?.email
          }`.split('')[0]
        }
      </Avatar.Fallback>
      {/* </Link> */}
    </Avatar>
  );
};

const NotificationCheckbox = ({ _id }: { _id: string }) => {
  const [isChecked, setIsChecked] = useState(false);
  const setSelectNotifications = useSetAtom(setSelectNotificationsState);

  return (
    <div
      className={cn('h-full flex items-center p-2 ', {
        'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity':
          !isChecked,
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
