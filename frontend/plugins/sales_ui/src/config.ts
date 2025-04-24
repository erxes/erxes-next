import { IconBriefcase } from '@tabler/icons-react';
import { UIConfig } from 'erxes-ui';

export const CONFIG: UIConfig = {
  name: 'sales',
  icon: IconBriefcase,
  modules: [
    {
      name: 'deals',
      icon: IconBriefcase,
      path: 'deals',
      hasSettings: true,
    },
  ],
};
