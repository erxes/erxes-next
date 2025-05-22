import { IconSandbox } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'sample',
  icon: IconSandbox,
  modules: [
    {
      name: 'sampleModule',
      icon: IconSandbox,
      path: 'sampleModule',
      hasSettings: true,
      hasWidgets: true,
    },
  ],
};
