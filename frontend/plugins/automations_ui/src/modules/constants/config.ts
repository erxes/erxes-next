import { IconMailFilled, IconPolygon } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'automations',
  icon: IconPolygon,
  modules: [
    {
      name: 'automations',
      icon: IconMailFilled,
      path: 'automations',
      hasSettings: false,
      hasWidgets: true,
    },
  ],
};
