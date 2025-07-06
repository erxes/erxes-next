import gql from 'graphql-tag';

export const NOTIFICATION_PLUGINS_TYPES = gql`
  query PluginsNotifications {
    pluginsNotifications {
      pluginName
      modules {
        name
        description
        icon
        types {
          name
          text
        }
      }
    }
  }
`;

export const USER_NOTIFICATION_SETTINGS = gql`
  query UserNotificationSettings {
    userNotificationSettings
  }
`;
