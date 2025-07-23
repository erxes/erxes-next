import { useOrgNotificationSettings } from '@/notification/settings/hooks/useOrgNotificationConfigurations';
import { TNotificationSettingsForm } from '@/notification/settings/states/notificationSettingsForm';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const OrgNotificationFormEffect = ({
  form,
}: {
  form: UseFormReturn<TNotificationSettingsForm>;
}) => {
  const { organizationNotificationConfigs } = useOrgNotificationSettings();

  const {
    inAppNotificationsDisabled,
    emailNotificationsDisabled,
    expiresAfterDays,
    plugins,
  } = organizationNotificationConfigs || {};

  useEffect(() => {
    form.reset({
      all: {
        inAppNotificationsDisabled: inAppNotificationsDisabled || false,
        emailNotificationsDisabled: emailNotificationsDisabled || false,
      },
      expiresAfterDays: expiresAfterDays || 30,
      plugins: plugins || {},
    });
  }, [organizationNotificationConfigs, form]);

  return <></>;
};
