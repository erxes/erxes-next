import { USER_NOTIFICATION_SETTINGS } from '@/notification/settings/graphql/notificationSettingsQueries';
import { IUserNotificationSettings } from '@/notification/settings/types/notificationSettings';
import { useQuery } from '@apollo/client';

export const useUserNotificationSettings = () => {
  const { data, loading, refetch } = useQuery<{
    userNotificationSettings: IUserNotificationSettings;
  }>(USER_NOTIFICATION_SETTINGS);

  return {
    loading,
    refetch,
    userNotificationSettings: data?.userNotificationSettings,
  };
};
