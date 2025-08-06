import { TNotificationSettingsForm } from '@/notification/settings/states/notificationSettingsForm';
import { FieldPathValue } from 'react-hook-form';

export const togglePluginNotifType = (
  fieldValue: FieldPathValue<TNotificationSettingsForm, 'plugins'>,
  pluginName: string,
  pluginConfigState: TNotificationSettingsForm['plugins'][string],
  notifType: string,
  type: string,
  checked: boolean,
) => ({
  ...fieldValue,
  [pluginName]: {
    ...pluginConfigState,
    types: {
      ...(pluginConfigState?.types ?? {}),
      [notifType]: {
        ...(pluginConfigState?.types?.[notifType] ?? {}),
        [type === 'email' ? 'emailDisabled' : 'inAppDisabled']: !checked,
      },
    },
  },
});

export const generateNotificationMutationVariables = (
  isOrgConfig: boolean | null,
  plugins: TNotificationSettingsForm['plugins'],
  { all, ...formState }: TNotificationSettingsForm,
) => {
  const commonPayload = {
    ...all,
    ...formState,
    plugins,
  };

  return isOrgConfig
    ? { configs: commonPayload }
    : { userSettings: commonPayload };
};

export function isEqualFormState(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}
