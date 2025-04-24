import { IconCashBanknoteFilled } from '@tabler/icons-react';
import { UIConfig } from 'erxes-ui/types/UIConfig';

export const CONFIG: UIConfig = {
  name: 'accounting',
  icon: IconCashBanknoteFilled,
  modules: [
    {
      name: 'Accounting',
      icon: IconCashBanknoteFilled,
      path: 'accounting',
      hasSettings: true,
    },
  ],
};
