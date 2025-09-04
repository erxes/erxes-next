import { useArchiveNotifications } from '@/notification/my-inbox/hooks/useArchiveNotifications';
import { useMarkAsReadNotifications } from '@/notification/my-inbox/hooks/useMarkAsReadNotifications';
import { INotification } from '@/notification/my-inbox/types/notifications';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { IconArchiveOff, IconEyeCheck } from '@tabler/icons-react';
import {
  Button,
  CommandBar,
  ICursorListResponse,
  Separator,
  Skeleton,
} from 'erxes-ui';

export const NotificationsCommandBar = ({
  refetch,
}: {
  refetch: (
    variables?: Partial<OperationVariables> | undefined,
  ) => Promise<ApolloQueryResult<ICursorListResponse<INotification>>>;
}) => {
  const {
    status,
    selectedNotificationsCount,
    setSelectedNotifications,
    archiveNotifications,
    selectedNotifications,
    loading,
  } = useArchiveNotifications();

  const { markAsNotifications } = useMarkAsReadNotifications();
  return (
    <CommandBar open={selectedNotificationsCount > 0}>
      {loading ? (
        <Skeleton className="h-4 w-36" />
      ) : (
        <CommandBar.Bar>
          <CommandBar.Value onClose={() => setSelectedNotifications([])}>
            {selectedNotificationsCount} selected
          </CommandBar.Value>
          {status !== 'read' && (
            <>
              <Separator.Inline />
              <Button variant="ghost" onClick={markAsNotifications}>
                <IconEyeCheck />
                Mark as read
              </Button>
            </>
          )}
          <Separator.Inline />
          <Button
            variant="ghost"
            onClick={() => archiveNotifications({ ids: selectedNotifications })}
          >
            <IconArchiveOff />
            Archive selected
          </Button>
          <Button
            variant="ghost"
            onClick={() => archiveNotifications({ all: true })}
          >
            <IconArchiveOff />
            Archive all
          </Button>
        </CommandBar.Bar>
      )}
    </CommandBar>
  );
};
