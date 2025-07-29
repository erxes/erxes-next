import { IconShieldDollar } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'payment',
  icon: IconShieldDollar,
  modules: [
    {
      name: 'payment',
      icon: IconShieldDollar,
      path: 'payment',
      hasSettings: true,
      hasRelationWidget: false,
      hasFloatingWidget: false,

    },
  ],
};
