import { useNotificationsSettingsContext } from '@/notification/settings/context/NotificationSettingsContext';
import { useUserNotificationSettings } from '@/notification/settings/hooks/useUserNotificationSettings';
import { TNotificationSettingsForm } from '@/notification/settings/states/notificationSettingsForm';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const UserNotificationFormEffect = ({
  form,
}: {
  form: UseFormReturn<TNotificationSettingsForm>;
}) => {
  const { userNotificationSettings } = useUserNotificationSettings();

  const { inAppNotificationsDisabled, emailNotificationsDisabled, plugins } =
    userNotificationSettings || {};

  useEffect(() => {
    form.reset({
      all: {
        inAppNotificationsDisabled: inAppNotificationsDisabled || false,
        emailNotificationsDisabled: emailNotificationsDisabled || false,
      },
      plugins: plugins || {},
    });
  }, [userNotificationSettings, form]);

  return <></>;
};
