import { onNotifTypeCheckedProp } from '@/notification/settings/hooks/useNotificationSettings';
import { TNotificationSettingsForm } from '@/notification/settings/states/notificationSettingsForm';
import { PluginsNotificationConfig } from '@/notification/settings/types/notificationSettings';
import { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';

// 1. Context interface
export interface INotificationSettingsContext {
  form: UseFormReturn<TNotificationSettingsForm>;
  pluginsNotifications: PluginsNotificationConfig[];
  loading: boolean;
  isOrgDefault: boolean;
  toggleOrgDefault: (value: boolean | null) => void;
  onCheckGlobal: (
    type: 'email' | 'inApp',
    checked: boolean,
  ) => (
    value: {
      inAppNotificationsDisabled: boolean;
      emailNotificationsDisabled: boolean;
    },
    onChange: (...event: any[]) => void,
  ) => void;
  onNotiTypeChecked: (
    {
      fieldOnChange,
      fieldValue,
      pluginName,
      pluginConfigState,
      notifType,
    }: onNotifTypeCheckedProp,
    type: 'email' | 'inApp',
    checked: boolean,
  ) => void;
}

// 2. Create context
export const NotificationSettingsContext =
  createContext<INotificationSettingsContext>(
    {} as INotificationSettingsContext,
  );

// 3. Hook to use context
export const useNotificationsSettingsContext = () => {
  return useContext(NotificationSettingsContext);
};

// 4. Context provider
export const NotificationSettingsProvider = ({
  children,
  form,
  pluginsNotifications,
  loading,
  isOrgDefault,
  toggleOrgDefault,
  onNotiTypeChecked,
}: {
  children: React.ReactNode;
  form: UseFormReturn<TNotificationSettingsForm>;
  pluginsNotifications: PluginsNotificationConfig[];
  loading: boolean;
  isOrgDefault: boolean;
  toggleOrgDefault: (value: boolean | null) => void;
  onNotiTypeChecked: (
    {
      fieldOnChange,
      fieldValue,
      pluginName,
      pluginConfigState,
      notifType,
    }: onNotifTypeCheckedProp,
    type: 'email' | 'inApp',
    checked: boolean,
  ) => void;
}) => {
  const onCheckGlobal =
    (type: 'email' | 'inApp', checked: boolean) =>
    (
      value: {
        inAppNotificationsDisabled: boolean;
        emailNotificationsDisabled: boolean;
      },
      onChange: (...event: any[]) => void,
    ) => {
      const fieldName =
        type === 'email'
          ? 'emailNotificationsDisabled'
          : 'inAppNotificationsDisabled';

      const fieldChange = {
        ...value,
        [fieldName]: !checked,
      };

      onChange(fieldChange);
    };

  return (
    <NotificationSettingsContext.Provider
      value={{
        pluginsNotifications,
        loading,
        onCheckGlobal,
        isOrgDefault,
        toggleOrgDefault,
        form,
        onNotiTypeChecked,
      }}
    >
      {children}
    </NotificationSettingsContext.Provider>
  );
};
