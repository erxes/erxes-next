import { IconSandbox } from '@tabler/icons-react';


import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'finance',
  icon: IconSandbox,
  modules: [
    {
      name: 'saving',
      icon: IconSandbox,
      path: 'saving',
      hasSettings: true,
      hasRelationWidget: false,
      hasFloatingWidget: false,
    },
  ],
};
