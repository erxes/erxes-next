import { NOTIFICATIONS } from '@/notification/my-inbox/graphql/notificationsQueries';
import {
  NOTIFICATION_ARCHIVED,
  NOTIFICATION_READ,
  NOTIFICATION_SUBSCRIPTION,
} from '@/notification/my-inbox/graphql/notificationSubscriptions';
import { INotification } from '@/notification/my-inbox/types/notifications';
import { gql, useQuery } from '@apollo/client';
import {
  EnumCursorDirection,
  ICursorListResponse,
  mergeCursorData,
  parseDateRangeFromString,
  sendDesktopNotification,
  useMultiQueryState,
  validateFetchMore,
} from 'erxes-ui';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import strip from 'strip-ansi';
import { currentUserState, IUser } from 'ui-modules';
type NotificationInsertedData = {
  notificationInserted: INotification;
};

type NotificationsQueryResponse = ICursorListResponse<INotification>;

const NOTIFICATIONS_LIMIT = 15;

const generateOrderBy = (
  orderBy: 'new' | 'old' | 'priority' | 'readAt' | null,
) => {
  const orderByObject: any = {};
  if (orderBy === 'old') {
    orderByObject.orderBy = { createdAt: 1 };
  } else if (orderBy === 'priority') {
    orderByObject.orderBy = { priority: -1 };
  } else if (orderBy === 'readAt') {
    orderByObject.orderBy = { readAt: -1 };
  }

  return orderByObject;
};

export const useNotifications = () => {
  const currentUser = useAtomValue(currentUserState) as IUser;
  const { id: currentNotificationId } = useParams();

  const [{ status, priority, type, createdAt, orderBy, fromUserId }] =
    useMultiQueryState<{
      status: 'read' | 'unread' | 'all';
      priority: 'low' | 'medium' | 'high' | 'urgent';
      type: 'info' | 'success' | 'warning' | 'error';
      createdAt: string;
      orderBy: 'new' | 'old' | 'priority';
      fromUserId: string;
    }>(['status', 'priority', 'type', 'createdAt', 'orderBy', 'fromUserId']);

  const { data, loading, subscribeToMore, refetch, fetchMore } =
    useQuery<NotificationsQueryResponse>(NOTIFICATIONS, {
      variables: {
        ids:
          currentNotificationId && (!status || status === 'unread')
            ? [currentNotificationId]
            : undefined,
        limit: NOTIFICATIONS_LIMIT,
        status: status?.toUpperCase() || 'UNREAD',
        priority: priority?.toUpperCase(),
        type: type?.toUpperCase(),
        fromDate: parseDateRangeFromString(createdAt)?.from,
        endDate: parseDateRangeFromString(createdAt)?.to,
        fromUserId,
        ...generateOrderBy(orderBy),
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
  // useEffect is used for GraphQL pubsub subscription
  useEffect(() => {
    const unsubscribe = subscribeToMore<NotificationInsertedData>({
      document: gql(NOTIFICATION_SUBSCRIPTION),
      variables: {
        userId: currentUser ? currentUser._id : null,
      },
      updateQuery: (prev, { subscriptionData: { data } }) => {
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

    const notificationArchived = subscribeToMore({
      document: gql(NOTIFICATION_ARCHIVED),
      variables: { userId: currentUser ? currentUser._id : null },
      updateQuery: () => {
        refetch();
      },
    });

    return () => {
      notificationArchived();
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
    refetch,
  };
};
