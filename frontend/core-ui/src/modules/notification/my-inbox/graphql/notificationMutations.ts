import { gql } from '@apollo/client';

export const ARCHIVE_NOTIFICATION = gql`
  mutation ArchiveNotification($id: String!) {
    archiveNotification(_id: $id)
  }
`;

export const ARCHIVE_NOTIFICATIONS = gql`
  mutation ArchiveNotifications(
    $ids: [String]
    $archiveAll: Boolean
    $filters: JSON
  ) {
    archiveNotifications(ids: $ids, archiveAll: $archiveAll, filters: $filters)
  }
`;

export const MARK_AS_READ_NOTIFICATION = gql`
  mutation MarkNotificationAsRead($id: String!) {
    markNotificationAsRead(_id: $id)
  }
`;

export const MARS_AS_READ_NOTIFICATIONS = gql`
  mutation MarkAsReadNotifications(
    $ids: [String]
    $status: NotificationStatus
    $priority: NotificationPriority
    $type: NotificationType
    $fromDate: String
    $endDate: String
    $fromUserId: String
  ) {
    markAsReadNotifications(
      ids: $ids
      status: $status
      priority: $priority
      type: $type
      fromDate: $fromDate
      endDate: $endDate
      fromUserId: $fromUserId
    )
  }
`;
