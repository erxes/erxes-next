import { IconCashBanknote } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui';

export const CONFIG: IUIConfig = {
  name: 'accounting',
  icon: IconCashBanknote,
  modules: [
    {
      name: 'accounting',
      icon: IconCashBanknote,
      path: 'accounting',
      hasSettings: true,
      hasRelationWidget: false,
      submenus: [
        {
          name: 'main',
          path: 'accounting/main',
        },
        {
          name: 'records',
          path: 'accounting/records',
        },
        {
          name: 'adjustment',
          path: 'accounting/adjustment',
        },
        {
          name: 'odds',
          path: 'accounting/odd-transactions',
        },
      ],
    },
  ],
};
