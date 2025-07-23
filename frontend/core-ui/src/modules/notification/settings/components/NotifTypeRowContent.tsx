import { NotifTypeRow } from '@/notification/settings/components/NotifTypeRow';
import { useNotificationsSettingsContext } from '@/notification/settings/context/NotificationSettingsContext';
import { TNotificationSettingsForm } from '@/notification/settings/states/notificationSettingsForm';
import { NotifTypeNotificationSettingsProps } from '@/notification/settings/types/notificationSettings';
import { useController, useFormContext, useWatch } from 'react-hook-form';

export const NotifTypeRowContent = ({
  pluginName,
  text,
  notifType,
  pluginConfigState,
  notifTypeState,
}: NotifTypeNotificationSettingsProps) => {
  const { control, watch } = useFormContext<TNotificationSettingsForm>();

  const {
    field: { value: pluginFieldValue, onChange: pluginFieldOnChange },
  } = useController({
    name: 'plugins',
    control,
  });

  const { onNotifTypeToggle, isDisabledAllNotification } =
    useNotificationsSettingsContext();

  const { inAppNotificationsDisabled, emailNotificationsDisabled } =
    watch('all');

  const isEmailDisabled =
    isDisabledAllNotification ||
    emailNotificationsDisabled ||
    notifTypeState?.emailDisabled;

  const isInAppDisabled =
    isDisabledAllNotification ||
    inAppNotificationsDisabled ||
    notifTypeState?.inAppDisabled;

  const handleCheck = (type: 'email' | 'inApp', checked: boolean) =>
    onNotifTypeToggle(
      {
        fieldOnChange: pluginFieldOnChange,
        fieldValue: pluginFieldValue,
        pluginName,
        pluginConfigState,
        notifType,
      },
      type,
      checked,
    );

  return (
    <NotifTypeRow
      key={notifType}
      title={text}
      enabled={{
        email: !isEmailDisabled,
        inApp: !isInAppDisabled,
      }}
      onCheck={handleCheck}
    />
  );
};
