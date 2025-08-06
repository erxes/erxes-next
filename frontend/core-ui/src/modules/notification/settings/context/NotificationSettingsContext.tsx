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
  isOrgConfig: boolean;
  toggleOrgConfig: (value: boolean | null) => void;
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
  onNotifTypeToggle: (
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
  isDisabledAllNotification: boolean;
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
  isOrgConfig,
  toggleOrgConfig,
  onNotifTypeToggle,
  isDisabledAllNotification,
}: {
  children: React.ReactNode;
  form: UseFormReturn<TNotificationSettingsForm>;
  pluginsNotifications: PluginsNotificationConfig[];
  loading: boolean;
  isOrgConfig: boolean;
  toggleOrgConfig: (value: boolean | null) => void;
  onNotifTypeToggle: (
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
  isDisabledAllNotification: boolean;
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

      onChange({
        ...value,
        [fieldName]: !checked,
      });
    };

  return (
    <NotificationSettingsContext.Provider
      value={{
        pluginsNotifications,
        loading,
        onCheckGlobal,
        isOrgConfig,
        toggleOrgConfig,
        form,
        onNotifTypeToggle,
        isDisabledAllNotification,
      }}
    >
      {children}
    </NotificationSettingsContext.Provider>
  );
};
