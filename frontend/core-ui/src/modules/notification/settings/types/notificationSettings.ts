import { TNotificationSettingsForm } from '@/notification/settings/states/notificationSettingsForm';
import { FieldPathValue } from 'react-hook-form';

type ModuleType = {
  name: string;
  text: string;
};

type Module = {
  name: string;
  description: string;
  icon: string;
  types: ModuleType[];
};
export type OnNotifTypeCheckedProp = {
  fieldOnChange: (...event: any[]) => void;
  fieldValue: FieldPathValue<TNotificationSettingsForm, 'plugins'>;
  pluginName: string;
  pluginConfigState: TNotificationSettingsForm['plugins'][string];
  notifType: string;
};

export type PluginNotificationSettingsProps = {
  pluginName: string;
  modules: Module[];
};

type TPluginFormState = TNotificationSettingsForm['plugins'][string];

export type ModuleNotificationSettingsProps = {
  pluginName: string;
  moduleName: string;
  iconName: string;
  description: string;
  types: ModuleType[];
  pluginConfigState: TPluginFormState;
};

export type NotifTypeNotificationSettingsProps = {
  pluginName: string;
  text: string;
  notifType: string;
  pluginConfigState: TNotificationSettingsForm['plugins'][string];
  notifTypeState: NonNullable<TPluginFormState['types']>[string];
};

export type IUserNotificationSettings = {
  _id: string;
  userId: string;

  // Global notification controls
  inAppNotificationsDisabled: boolean; // all in-app notifications
  emailNotificationsDisabled: boolean; // all email notifications

  // Plugin-level controls
  plugins: {
    [pluginName: string]: {
      inAppDisabled: boolean;
      emailDisabled: boolean;
      types: {
        [notifTypeAction: string]: {
          inAppDisabled: boolean;
          emailDisabled: boolean;
        };
      };
    };
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
};

export type IOrgNotificationConfigs = {
  _id: string;

  inAppNotificationsDisabled: boolean;
  emailNotificationsDisabled: boolean;
  emailTemplateId?: string;
  emailSubject?: string;
  createdBy: string;
  expiresAfterDays: number;
  plugins: {
    [pluginName: string]: {
      inAppDisabled: boolean;
      emailDisabled: boolean;
      types: {
        [notifTypeAction: string]: {
          inAppDisabled: boolean;
          emailDisabled: boolean;
          emailTemplateId?: string;
          emailSubject?: string;
        };
      };
    };
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
};
export type PluginsNotificationConfig = {
  pluginName: string;
  modules: {
    name: string;
    description: string;
    icon: string;
    types: {
      name: string;
      text: string;
    }[];
  }[];
};
