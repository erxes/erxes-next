import { IconSandbox } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'aa',
  icon: IconSandbox,
  modules: [
    {
      name: 'lol',
      icon: IconSandbox,
      path: 'lol',
      hasSettings: true,
      hasWidgets: true,
    },
  ],
};
