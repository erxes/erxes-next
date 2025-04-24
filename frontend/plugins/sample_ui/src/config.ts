import { IconSandbox } from '@tabler/icons-react';
import { UIConfig } from 'erxes-ui/types';

export const CONFIG: UIConfig = {
  name: 'sample',
  icon: IconSandbox,
  modules: [
    {
      name: 'sample-first',
      icon: IconSandbox,
      path: 'sample-first',
      haveSettings: true,
    },
    {
      name: 'sample-second',
      icon: IconSandbox,
      path: 'sample-second',
      haveSettings: true,
      submenus: [
        {
          name: 'submenu1',
          path: 'sample-second',
        },
        {
          name: 'submenu2',
          path: 'sample-second/submenu2',
        },
      ],
    },
  ],
};
