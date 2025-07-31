import { IconSandbox } from '@tabler/icons-react';


import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'operation',
  icon: IconSandbox,
  modules: [
    {
      name: 'task',
      icon: IconSandbox,
      path: 'task',
      hasSettings: true,
      hasRelationWidget: false,
      hasFloatingWidget: false,
    },
  ],
};
