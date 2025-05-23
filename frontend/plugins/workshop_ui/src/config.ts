import { IconSandbox } from '@tabler/icons-react';


import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'workshop',
  icon: IconSandbox,
  modules: [
    {
      name: 'leacture',
      icon: IconSandbox,
      path: 'leacture',
      hasSettings: true,
      hasWidgets: true,
    },
  ],
};
