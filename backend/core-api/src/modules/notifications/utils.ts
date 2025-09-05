import {
  INotificationConfigDocument,
  INotificationData,
  IUserNotificationSettingsDocument,
} from 'erxes-api-shared/core-modules';

export const shouldSendNotification = (
  type: 'email' | 'inApp',
  defaultConfig: any,
  userSettings: IUserNotificationSettingsDocument | null,
  data: Extract<INotificationData, { kind: 'user' }>,
): boolean => {
  let shouldSend = true;

  if (userSettings) {
    if (!isNotificationAllowedUser(type, userSettings, data)) {
      shouldSend = false;
    }

    if (!isNotificationAllowedOrg(type, defaultConfig, data)) {
      shouldSend = false;
    }
  }

  return shouldSend;
};

export const isNotificationAllowedUser = (
  type: 'email' | 'inApp',
  userSettings: IUserNotificationSettingsDocument | null,
  data: Extract<INotificationData, { kind: 'user' }>,
): boolean => {
  if (!userSettings) return true;

  // Global-level setting
  if (type === 'email' && userSettings.emailNotificationsDisabled) return false;
  if (type === 'inApp' && userSettings.inAppNotificationsDisabled) return false;

  const [pluginName] = (data?.contentType || '').split(':');
  const pluginSettings = (userSettings.plugins || {})[pluginName];

  // Plugin-level setting
  if (type === 'email' && pluginSettings?.emailDisabled) return false;
  if (type === 'inApp' && pluginSettings?.inAppDisabled) return false;

  // Type-level setting
  const typeKey = data.notificationType || '';
  const typeSetting = (pluginSettings?.types || {})[typeKey];

  if (type === 'email' && typeSetting?.emailDisabled) return false;
  if (type === 'inApp' && typeSetting?.inAppDisabled) return false;

  return true;
};

export const isNotificationAllowedOrg = (
  type: 'email' | 'inApp',
  defaultConfig: INotificationConfigDocument | null,
  data: Extract<INotificationData, { kind: 'user' }>,
) => {
  if (!defaultConfig) return true;

  const {
    emailNotificationsDisabled,
    inAppNotificationsDisabled,
    plugins = {},
  } = defaultConfig || {};

  // Global-level setting
  if (type === 'email' && emailNotificationsDisabled) return false;

  if (type === 'inApp' && inAppNotificationsDisabled) return false;

  const [pluginName] = (data?.contentType || '').split(':');
  const pluginSettings = plugins[pluginName];

  // Plugin-level setting
  if (type === 'email' && pluginSettings?.emailDisabled) return false;

  if (type === 'inApp' && pluginSettings?.inAppDisabled) return false;

  // Type-level setting
  const typeKey = data.notificationType || '';
  const typeSetting = (pluginSettings?.types || {})[typeKey];

  if (type === 'email' && typeSetting?.emailDisabled) return false;

  if (type === 'inApp' && typeSetting?.inAppDisabled) return false;

  return true;
};
