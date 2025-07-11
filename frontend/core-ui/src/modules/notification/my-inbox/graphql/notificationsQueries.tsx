import gql from 'graphql-tag';

const FROM_USER_FIELDS = `
      fromUser {
        _id
        email
        details {
          avatar
          fullName
          firstName
          lastName
        }
      }
`;

const NOTIFICATION_FIELDS = `
      _id
      title
      message
      type
      fromUserId
      ${FROM_USER_FIELDS}
      priority
      metadata
      createdAt
      isRead
      contentType
      contentTypeId
`;

const NOTIFICATIONS_LIST_PARAMS = `
  $limit: Int,
  $cursor: String,
  $cursorMode: CURSOR_MODE,
  $direction: CURSOR_DIRECTION,
  $orderBy: JSON,
  $status: NotificationStatus,
  $priority: NotificationPriority,
  $type: NotificationType,
  $fromDate: String,
  $endDate: String,
  $module: String
`;

const NOTIFICATIONS_LIST_PARAMS_DEF = `
  limit: $limit,
  cursor: $cursor,
  cursorMode: $cursorMode,
  direction: $direction,
  orderBy: $orderBy,
  status: $status,
  priority: $priority,
  type: $type,
  fromDate: $fromDate,
  endDate: $endDate,
  module: $module
`;

export const NOTIFICATIONS = gql`
  query Notifications(${NOTIFICATIONS_LIST_PARAMS}) {
  notifications(${NOTIFICATIONS_LIST_PARAMS_DEF}) {
      list { ${NOTIFICATION_FIELDS} }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const NOTIFICATION_DETAIL = gql`
  query NotificationDetail ($_id:String!) {
    notificationDetail (_id:$_id) {
      ${NOTIFICATION_FIELDS}
    }
  }
`;

export const UNREAD_NOTIFICATIONS_COUNT = gql`
  query UnreadNotificationsCount {
    unreadNotificationsCount
  }
`;
