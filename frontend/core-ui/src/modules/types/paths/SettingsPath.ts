import { Icon } from '@tabler/icons-react';

export enum SettingsPath {
  Profile = 'profile',
  Experience = 'experience',
}

export enum SettingsWorkspacePath {
  General = 'general',
  FileUpload = 'file-upload',
  MailConfig = 'mail-config',
  Permission = 'permission',
  TeamMember = 'team-member',
}

export type TSettingPath = {
  name: string;
  icon: Icon;
  path: string;
};
