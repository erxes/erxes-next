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
