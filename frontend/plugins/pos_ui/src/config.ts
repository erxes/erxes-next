import { IconCashRegister } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'pos',
  icon: IconCashRegister,
  modules: [
    {
      name: 'pos',
      icon: IconCashRegister,
      path: 'pos',
      hasSettings: true,
      hasWidgets: true,
    },
  ],
};
