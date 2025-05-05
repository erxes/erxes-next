import { IconCashBanknoteFilled } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'accounting',
  icon: IconCashBanknoteFilled,
  modules: [
    {
      name: 'accounting',
      icon: IconCashBanknoteFilled,
      path: 'accounting',
      hasSettings: true,
      hasWidgets: false,
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
          name: 'odds',
          path: 'accounting/odd-transactions',
        },
      ],
    },
  ],
};
