import { IconSandbox } from '@tabler/icons-react';


import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'operation',
  icon: IconSandbox,
  modules: [
    {
      name: 'tasks',
      icon: IconSandbox,
      path: 'tasks',
      hasSettings: true,
      hasRelationWidget: false,
      hasFloatingWidget: false,
    },
  ],
};
