import { ORG_NOTIFICATION_CONFIGURATION } from '@/notification/settings/graphql/notificationSettingsQueries';
import { IOrgNotificationConfigs } from '@/notification/settings/types/notificationSettings';
import { useQuery } from '@apollo/client';

export const useOrgNotificationSettings = () => {
  const { data, loading, refetch } = useQuery<{
    organizationNotificationConfigs: IOrgNotificationConfigs;
  }>(ORG_NOTIFICATION_CONFIGURATION);

  return {
    loading,
    refetch,
    organizationNotificationConfigs: data?.organizationNotificationConfigs,
  };
};
