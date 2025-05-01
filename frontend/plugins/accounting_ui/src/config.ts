import { IconCashBanknoteFilled } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types/IUIConfig';

export const CONFIG: IUIConfig = {
  name: 'accounting',
  icon: IconCashBanknoteFilled,
  modules: [
    {
      name: 'accounting',
      icon: IconCashBanknoteFilled,
      path: 'accounting',
      hasSettings: true,
    },
  ],
};
