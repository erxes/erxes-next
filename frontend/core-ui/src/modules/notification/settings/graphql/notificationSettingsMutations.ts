import { gql } from '@apollo/client';

export const EDIT_USER_NOTIFICATION_SETTINGS = gql`
  mutation EditUserNotificationSettings($userSettings: JSON) {
    editUserNotificationSettings(userSettings: $userSettings)
  }
`;

export const EDIT_ORG_NOTIFICATION_CONFIGURATION = gql`
  mutation EditOrganizationNotificationConfigs($configs: JSON!) {
    editOrganizationNotificationConfigs(configs: $configs)
  }
`;
