import {
  EDIT_ORG_NOTIFICATION_CONFIGURATION,
  EDIT_USER_NOTIFICATION_SETTINGS,
} from '@/notification/settings/graphql/notificationSettingsMutations';
import {
  notificationSettingsFormSchema,
  TNotificationSettingsForm,
} from '@/notification/settings/states/notificationSettingsForm';
import {
  generateNotificationMutationVariables,
  togglePluginNotifType,
} from '@/notification/settings/utils';
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

export const useNotificationSettings = () => {
  const [isOrgConfig, toggleOrgConfig] = useQueryState<boolean>('isOrgConfig');

  const [editSettings] = useMutation(
    isOrgConfig
      ? EDIT_ORG_NOTIFICATION_CONFIGURATION
      : EDIT_USER_NOTIFICATION_SETTINGS,
  );

  const form = useForm<TNotificationSettingsForm>({
    resolver: zodResolver(notificationSettingsFormSchema),
    values: {
      all: {
        inAppNotificationsDisabled: false,
        emailNotificationsDisabled: false,
      },
      expiresAfterDays: 30,
      plugins: {},
    },
  });

  const { getValues, watch } = form;

  const { inAppNotificationsDisabled, emailNotificationsDisabled } =
    watch('all');

  const isDisabledAllNotification =
    inAppNotificationsDisabled && emailNotificationsDisabled;

  const submitNotificationChanges = async (
    updatedPlugins: TNotificationSettingsForm['plugins'],
  ) => {
    try {
      const variables = generateNotificationMutationVariables(
        isOrgConfig,
        updatedPlugins,
        getValues(),
      );

      await editSettings({
        variables,
      });

      toast({ title: 'Edited successfully' });
    } catch (err: any) {
      toast({
        title: 'Something went wrong',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const onNotifTypeToggle = (
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
    const updatedPlugins = togglePluginNotifType(
      fieldValue,
      pluginName,
      pluginConfigState,
      notifType,
      type,
      checked,
    );

    fieldOnChange(updatedPlugins);
    submitNotificationChanges(updatedPlugins);
  };
  return {
    form,
    watch,
    onNotifTypeToggle,
    isOrgConfig,
    toggleOrgConfig,
    isDisabledAllNotification,
  };
};
