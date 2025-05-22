import { IconSandbox } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'dada',
  icon: IconSandbox,
  modules: [
    {
      name: 'll',
      icon: IconSandbox,
      path: 'll',
      hasSettings: true,
      hasWidgets: true,
    },
  ],
};
