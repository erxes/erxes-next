import { NotificationContainer } from '@/notification/my-inbox/components/NotificationContainer';
import { NotificationContext } from '@/notification/my-inbox/components/NotificationContext';
import {
  NOTIFICATION_PRIORITY_COLORS,
  NOTIFICATION_TYPE_COLORS,
  NOTIFICATION_TYPE_ICONS,
} from '@/notification/my-inbox/constants/notifications';
import { useNotifications } from '@/notification/my-inbox/hooks/useNotifications';
import { TooltipContent } from '@radix-ui/react-tooltip';
import { IconSquareRounded } from '@tabler/icons-react';
import { format } from 'date-fns';
import { Badge, cn, RelativeDateDisplay, Tooltip } from 'erxes-ui';
import { useParams } from 'react-router';
import { getAutomationTypes } from 'ui-modules';

export const Notifications = () => {
  const { notifications, loading } = useNotifications();
  const { id } = useParams();

  return (
    <>
      {notifications.map((notification) => {
        const {
          _id,
          title,
          message,
          type,
          contentType,
          isRead,
          createdAt,
          priority,
        } = notification;
        const NotificationTypeIcon = NOTIFICATION_TYPE_ICONS[type];
        const notificationtypeColor = NOTIFICATION_TYPE_COLORS[type];
        const priorityColor = NOTIFICATION_PRIORITY_COLORS[priority];
        const moduleName = (contentType || '').replace(':', '.').split('.')[1];

        return (
          <NotificationContext.Provider key={_id} value={notification}>
            <NotificationContainer
              className="p-4 pl-6 h-auto overflow-hidden flex-col items-start cursor-pointer"
              // onConversationSelect={onConversationSelect}
            >
              <div className="flex flex-row gap-4 text-foreground w-full">
                <Tooltip.Provider>
                  <Tooltip>
                    <Tooltip.Trigger asChild>
                      {NotificationTypeIcon ? (
                        <NotificationTypeIcon
                          className={cn('size-4 mt-2', notificationtypeColor)}
                        />
                      ) : (
                        <IconSquareRounded className="mt-2" />
                      )}
                    </Tooltip.Trigger>
                    <Tooltip.Content>{type}</Tooltip.Content>
                  </Tooltip>
                </Tooltip.Provider>

                <div
                  className={cn('flex flex-col gap-2 w-full', {
                    'text-accent-foreground': isRead && id !== _id,
                  })}
                >
                  <p className="w-full text-left truncate text-semibold flex flex-row gap-2 items-center">
                    {title}
                    <Tooltip.Provider>
                      <Tooltip>
                        <Tooltip.Trigger>
                          <div
                            className={cn('size-2 rounded-full', priorityColor)}
                          />
                        </Tooltip.Trigger>
                        <Tooltip.Content>{priority}</Tooltip.Content>
                      </Tooltip>
                    </Tooltip.Provider>
                  </p>
                  <span className="font-normal text-accent-foreground text-xs">
                    {message}
                  </span>
                  <div className="w-full flex flex-row justify-between items-center">
                    {createdAt && (
                      <RelativeDateDisplay.Value value={createdAt} />
                    )}
                    <Badge variant="secondary" className="capitalize">
                      {moduleName || '-'}
                    </Badge>
                  </div>
                </div>
              </div>
              {/* {isRead} */}
            </NotificationContainer>
          </NotificationContext.Provider>
        );
      })}
    </>
  );
};
