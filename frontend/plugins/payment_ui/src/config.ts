import { IconSandbox } from '@tabler/icons-react';


import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'payment',
  icon: IconSandbox,
  modules: [
    {
      name: 'payment',
      icon: IconSandbox,
      path: 'payment',
      hasSettings: true,
      hasRelationWidget: false,
      hasFloatingWidget: false,
    },
  ],
};
