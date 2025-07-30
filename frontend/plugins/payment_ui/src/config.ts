import { IconCurrencyDollar } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'payment',
  icon: IconCurrencyDollar,
  modules: [
    {
      name: 'payment',
      icon: IconCurrencyDollar,
      path: 'payment',
      hasSettings: true,
      hasRelationWidget: false,
      hasFloatingWidget: false,
    },
  ],
};
