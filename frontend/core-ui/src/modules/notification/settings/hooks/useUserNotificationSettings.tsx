import { USER_NOTIFICATION_SETTINGS } from '@/notification/settings/graphql/notificationSettingsQueries';
import { UserNotificationSettings } from '@/notification/settings/types/notificationSettings';
import { useQuery } from '@apollo/client';

export const useUserNotificationSettings = () => {
  const { data, loading, refetch } = useQuery<{
    userNotificationSettings: UserNotificationSettings;
  }>(USER_NOTIFICATION_SETTINGS);

  return {
    loading,
    refetch,
    userNotificationSettings: data?.userNotificationSettings,
  };
};
