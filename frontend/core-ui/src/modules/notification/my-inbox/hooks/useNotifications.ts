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
import strip from 'strip-ansi';
import { currentUserState, IUser } from 'ui-modules';
type NotificationInsertedData = {
  notificationInserted: INotification;
};

type NotificationRead = {
  notificationRead: {
    userId: string;
    notificationId?: string;
    notificationIds?: string[];
  };
};

type NotificationArchived = {
  notificationArchived: {
    userId: string;
    notificationId?: string;
    notificationIds?: string[];
  };
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
        limit: NOTIFICATIONS_LIMIT,
        status: status?.toUpperCase() || 'ALL',
        priority: priority?.toUpperCase(),
        type: type?.toUpperCase(),
        fromDate: parseDateRangeFromString(createdAt)?.from,
        endDate: parseDateRangeFromString(createdAt)?.to,
        fromUserId: fromUserId ?? undefined,
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

        const prevList = prev.notifications?.list || [];

        if (status !== 'read') {
          const existsIndex = prevList.findIndex(
            (item: any) => item._id === notificationInserted._id,
          );

          let updatedList;

          if (existsIndex !== -1) {
            updatedList = [
              notificationInserted,
              ...prevList.filter((_, idx) => idx !== existsIndex),
            ];
          } else {
            updatedList = [notificationInserted, ...prevList];
          }

          return {
            ...prev,
            notifications: {
              ...prev.notifications,
              totalCount: prev?.notifications?.totalCount + 1,
              list: updatedList,
            },
          };
        }
        return prev;
      },
    });
    const notificationRead = subscribeToMore<NotificationRead>({
      document: gql(NOTIFICATION_READ),
      variables: { userId: currentUser ? currentUser._id : null },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        const { notificationId, notificationIds = [] } =
          data?.notificationRead || {};

        const removedIds = notificationIds.length
          ? notificationIds
          : notificationId
          ? [notificationId]
          : [];
        if (!status || status === 'unread') {
          const updatedTotalCount = Math.max(
            (prev?.notifications?.totalCount || 0) - removedIds.length,
            0,
          );
          const updatedList = (prev?.notifications?.list || []).filter(
            (notification) => !removedIds.includes(notification._id),
          );

          if (
            updatedList.length === 0 &&
            prev.notifications?.pageInfo?.endCursor
          ) {
            handleFetchMore({ direction: EnumCursorDirection.FORWARD });
          }
          return {
            ...prev,
            notifications: {
              ...prev.notifications,
              list: updatedList,
              totalCount: updatedTotalCount,
            },
          };
        }

        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            list: (prev?.notifications?.list || []).map((notification) =>
              removedIds.includes(notification._id)
                ? { ...notification, isRead: true }
                : notification,
            ),
          },
        };
      },
    });

    const notificationArchived = subscribeToMore<NotificationArchived>({
      document: gql(NOTIFICATION_ARCHIVED),
      variables: { userId: currentUser ? currentUser._id : null },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        const { notificationId, notificationIds = [] } =
          data?.notificationArchived || {};
        const removedIds = notificationIds.length
          ? notificationIds
          : notificationId
          ? [notificationId]
          : [];
        const updatedList = (prev?.notifications?.list || []).filter(
          (notification) => !removedIds.includes(notification._id),
        );
        const updatedTotalCount = Math.max(
          (prev?.notifications?.totalCount || 0) - removedIds.length,
          0,
        );

        if (
          updatedList.length === 0 &&
          prev.notifications?.pageInfo?.endCursor
        ) {
          handleFetchMore({ direction: EnumCursorDirection.FORWARD });
        }
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            list: updatedList,
            totalCount: updatedTotalCount,
          },
        };
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
