import gql from 'graphql-tag';

const NOTIFICATION_FIELDS = `
      _id
      title
      message
      type
      fromUserId
      priority
      metadata
      createdAt
      isRead
      contentType
      contentTypeId
`;

export const NOTIFICATIONS = gql`
  query Notifications {
    notifications {
      ${NOTIFICATION_FIELDS}
    }
  }
`;

export const NOTIFICATION = gql`
  query Notification ($_id:String!) {
    notification (_id:$_id) {
      ${NOTIFICATION_FIELDS}
    }
  }
`;
