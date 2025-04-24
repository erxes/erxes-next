import { IconSandbox } from '@tabler/icons-react';
import { UIConfig } from 'erxes-ui/types';

export const CONFIG: UIConfig = {
  name: 'sample',
  icon: IconSandbox,
  modules: [
    {
      name: 'sample',
      icon: IconSandbox,
      path: 'sample',
      haveSettings: true,
    },
  ],
};
