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
  Apps = 'apps',
  Permissions = 'permissions',
  TeamMember = 'team-member',
  Structure = 'structures',
  StructureCatchAll = 'structures/*',
  Tags = 'tags',
  ProductsCatchAll = 'products/*',
  Brands = 'brands',
  AutomationsCatchAll = 'automations/*',
}

export type TSettingPath = {
  name: string;
  icon: Icon;
  path: string;
};
