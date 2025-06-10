import { IconSandbox } from '@tabler/icons-react';


import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'tasks',
  icon: IconSandbox,
  modules: [
    {
      name: 'tasks',
      icon: IconSandbox,
      path: 'tasks',
      hasSettings: true,
      hasWidgets: true,
    },
  ],
};
