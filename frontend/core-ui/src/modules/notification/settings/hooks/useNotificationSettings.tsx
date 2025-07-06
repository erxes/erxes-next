import { EDIT_USER_NOTIFICATION_SETTINGS } from '@/notification/settings/graphql/notificationSettingsMutations';
import { useUserNotificationSettings } from '@/notification/settings/hooks/useUserNotificationSettings';
import {
  notificationSettingsFormSchema,
  TNotificationSettingsForm,
} from '@/notification/settings/states/notificationSettingsForm';
import { UserNotificationSettings } from '@/notification/settings/types/notificationSettings';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, useQueryState } from 'erxes-ui';
import { FieldPathValue, useForm } from 'react-hook-form';

export type onNotifTypeCheckedProp = {
  fieldOnChange: (...event: any[]) => void;
  fieldValue: FieldPathValue<TNotificationSettingsForm, 'plugins'>;
  pluginName: string;
  pluginConfigState: TNotificationSettingsForm['plugins'][string];
  notifType: string;
};

export const useNotificationSettings = (refetch?: () => void) => {
  const [isOrgDefault, toggleOrgDefault] = useQueryState('isOrgDefault');
  const [editSettings] = useMutation(EDIT_USER_NOTIFICATION_SETTINGS);

  const form = useForm<TNotificationSettingsForm>({
    resolver: zodResolver(notificationSettingsFormSchema),
    defaultValues: {
      all: {
        inAppNotificationsDisabled: false,
        emailNotificationsDisabled: false,
      },
      plugins: {},
    },
  });
  const { watch } = form;

  const [isEmailDisabled, isInAppDisabled] = watch([
    'all.emailNotificationsDisabled',
    'all.inAppNotificationsDisabled',
  ]);

  const onNotiTypeChecked = (
    {
      fieldOnChange,
      fieldValue,
      pluginName,
      pluginConfigState,
      notifType,
    }: onNotifTypeCheckedProp,
    type: 'email' | 'inApp',
    checked: boolean,
  ) => {
    const updatedValue = {
      ...fieldValue,
      [pluginName]: {
        ...pluginConfigState,
        types: {
          ...(pluginConfigState.types || {}),
          [notifType]: {
            [type === 'email' ? 'emailDisabled' : 'inAppDisabled']: !checked,
          },
        },
      },
    };
    fieldOnChange(updatedValue);
    editSettings({
      variables: {
        userSettings: {
          emailNotificationsDisabled: isEmailDisabled,
          inAppNotificationsDisabled: isInAppDisabled,
          plugins: updatedValue,
        },
      },
    })
      .then(() => {
        toast({ title: 'Edited successfully' });
        refetch && refetch();
      })
      .catch((err) =>
        toast({
          title: 'Something went wrong',
          description: err.message,
          variant: 'destructive',
        }),
      );
  };

  return {
    onNotiTypeChecked,
    form,
    watch,
    isOrgDefault,
    toggleOrgDefault,
    isDisabledAllNotification: isEmailDisabled && isInAppDisabled,
  };
};
