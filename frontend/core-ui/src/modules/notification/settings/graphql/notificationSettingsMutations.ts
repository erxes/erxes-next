import gql from 'graphql-tag';

export const EDIT_USER_NOTIFICATION_SETTINGS = gql`
  mutation EditUserNotificationSettings($userSettings: JSON) {
    editUserNotificationSettings(userSettings: $userSettings)
  }
`;
