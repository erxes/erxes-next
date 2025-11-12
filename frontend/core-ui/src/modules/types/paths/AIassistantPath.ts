import { Icon } from '@tabler/icons-react';
import { IconSettings, IconBrain, IconMessage, IconDatabase } from '@tabler/icons-react';

export enum AIAssistantPath {
  Index = '/ai-assistant',
  General = 'general',
  Training = 'training',
  SystemPrompt = 'system',
}
export type TAIAssistantRoute = {
  name: string;
  icon: Icon;
  path: string;
};

export const AIAssistantRoutes: TAIAssistantRoute[] = [
  {
    name: 'General',
    icon: IconSettings,
    path: AIAssistantPath.General,
  },
  {
    name: 'Data training',
    icon: IconDatabase,
    path: AIAssistantPath.Training,
  },
  {
    name: 'System prompt',
    icon: IconBrain,
    path: AIAssistantPath.SystemPrompt,
  },
];
