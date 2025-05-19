import { IconDatabase } from '@tabler/icons-react';
import { UIConfig } from 'erxes-ui/types';

export const CONFIG: UIConfig = {
  name: 'cms',
  icon: IconDatabase,
  modules: [
    {
      name: 'cms',
      icon: IconDatabase,
      path: 'cms',
      hasSettings: true,
    },
  ],
};
