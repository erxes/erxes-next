import { IconSandbox } from '@tabler/icons-react';
import { UIConfig } from 'erxes-ui/types';

export const CONFIG: UIConfig = {
  name: 'sample',
  icon: IconSandbox,
  modules: [
    {
      name: 'sampleFirst',
      icon: IconSandbox,
      path: 'sampleFirst',
      hasSettings: true,
    },
    {
      name: 'sampleSecond',
      icon: IconSandbox,
      path: 'sampleSecond',
      hasSettings: true,
      submenus: [
        {
          name: 'submenu1',
          path: 'sampleSecond',
        },
        {
          name: 'submenu2',
          path: 'sampleSecond/submenu2',
        },
      ],
    },
  ],
};
