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
  const { control } = useFormContext<TNotificationSettingsForm>();
  const { field } = useController({
    name: 'plugins',
    control,
  });
  const [isAllInpAppDisabled, isAllEmailDisabled] = useWatch({
    name: ['all.isInAppDisabled', 'all.isEmailDisabled'],
  });
  const { onNotiTypeChecked } = useNotificationsSettingsContext();
  const isEmailEnabled = isAllEmailDisabled || notifTypeState?.emailDisabled;
  const isInAppEnabled = isAllInpAppDisabled || notifTypeState?.inAppDisabled;

  return (
    <NotifTypeRow
      key={notifType}
      title={text}
      enabled={{
        email: !isEmailEnabled,
        inApp: !isInAppEnabled,
      }}
      onCheck={(type, checked) =>
        onNotiTypeChecked(
          {
            fieldOnChange: field.onChange,
            fieldValue: field.value,
            pluginName,
            pluginConfigState,
            notifType,
          },
          type,
          checked,
        )
      }
    />
  );
};
