import { USER_NOTIFICATION_SETTINGS } from '@/notification/settings/graphql/notificationSettingsQueries';
import { IUserNotificationSettings } from '@/notification/settings/types/notificationSettings';
import { useQuery } from '@apollo/client';

export const useUserNotificationSettings = () => {
  const { data } = useQuery<{
    userNotificationSettings: IUserNotificationSettings;
  }>(USER_NOTIFICATION_SETTINGS);

  return {
    userNotificationSettings: data?.userNotificationSettings,
  };
};
