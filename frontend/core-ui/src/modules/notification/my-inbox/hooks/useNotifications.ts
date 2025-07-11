import { NOTIFICATIONS } from '@/notification/my-inbox/graphql/notificationsQueries';
import {
  NOTIFICATION_READ,
  NOTIFICATION_SUBSCRIPTION,
} from '@/notification/my-inbox/graphql/notificationSubscriptions';
import { INotification } from '@/notification/my-inbox/types/notifications';
import { gql, useQuery } from '@apollo/client';
import {
  EnumCursorDirection,
  ICursorListResponse,
  mergeCursorData,
  sendDesktopNotification,
  useMultiQueryState,
  validateFetchMore,
} from 'erxes-ui';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import strip from 'strip-ansi';
import { currentUserState, IPageInfo, IUser } from 'ui-modules';
type NotificationInsertedData = {
  notificationInserted: INotification;
};

type NotificationsQueryResponse = ICursorListResponse<INotification>;

const NOTIFICATIONS_LIMIT = 15;

export const useNotifications = () => {
  const currentUser = useAtomValue(currentUserState) as IUser;

  const [{ status, priority, type, fromDate, endDate, module }] =
    useMultiQueryState<{
      status: 'read' | 'unread' | 'all';
      priority: 'low' | 'medium' | 'high' | 'urgent';
      type: 'info' | 'success' | 'warning' | 'error';
      fromDate: string;
      endDate: string;
      module: string;
    }>(['status', 'priority', 'type', 'fromDate', 'endDate', 'module']);

  const { data, loading, subscribeToMore, refetch, fetchMore } =
    useQuery<NotificationsQueryResponse>(NOTIFICATIONS, {
      variables: {
        limit: NOTIFICATIONS_LIMIT,
        status: status?.toUpperCase() || 'UNREAD',
        priority: priority?.toUpperCase(),
        type: type?.toUpperCase(),
        fromDate,
        endDate,
        module,
      },
    });

  const { list = [], pageInfo, totalCount = 0 } = data?.notifications || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (!validateFetchMore({ direction, pageInfo })) {
      return;
    }

    fetchMore({
      variables: {
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: NOTIFICATIONS_LIMIT,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          notifications: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.notifications,
            prevResult: prev.notifications,
          }),
        });
      },
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToMore<NotificationInsertedData>({
      document: gql(NOTIFICATION_SUBSCRIPTION),
      variables: {
        userId: currentUser ? currentUser._id : null,
      },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        console.log({ data });
        const { notificationInserted } = data;
        const { title, message } = notificationInserted;

        sendDesktopNotification({ title, content: strip(message || '') });

        refetch();
      },
    });
    const notificationRead = subscribeToMore({
      document: gql(NOTIFICATION_READ),
      variables: { userId: currentUser ? currentUser._id : null },
      updateQuery: () => {
        refetch();
      },
    });

    return () => {
      notificationRead();
      unsubscribe();
    };
  }, []);

  return {
    notifications: list,
    loading,
    handleFetchMore,
    totalCount,
    pageInfo,
  };
};
