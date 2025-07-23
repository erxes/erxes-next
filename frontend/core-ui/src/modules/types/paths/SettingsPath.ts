import { Icon } from '@tabler/icons-react';

export enum SettingsPath {
  Index = 'settings/',
  Profile = 'profile',
  Experience = 'experience',
}

export enum SettingsWorkspacePath {
  General = 'general',
  FileUpload = 'file-upload',
  MailConfig = 'mail-config',
  Permission = 'permission',
  TeamMember = 'team-member',
  Structure = 'structure',
  StructureCatchAll = 'structure/*',
  Tags = 'tags',
  ProductsCatchAll = 'products/*',
  Brands = 'brands',
  AutomationsCatchAll = 'automations/*',
  Notification ="notification",
  NotificationCatchAll = 'notification/*',
}

export type TSettingPath = {
  name: string;
  icon: Icon;
  path: string;
};
