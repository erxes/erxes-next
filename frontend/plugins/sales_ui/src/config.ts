import { IconBriefcase, IconSandbox } from '@tabler/icons-react';

export const CONFIG = {
  name: 'sales',
  icon: IconBriefcase,
  hasWidgets: true,
  widgetsIcon: IconBriefcase,
  modules: [
    {
      name: 'deals',
      icon: IconSandbox,
      path: 'deals',
      hasSettings: true,
    },
  ],
};
