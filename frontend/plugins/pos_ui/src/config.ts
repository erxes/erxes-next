import { IconCashRegister } from '@tabler/icons-react';
import { UIConfig } from 'erxes-ui/types';

export const CONFIG: UIConfig = {
  name: 'pos',
  icon: IconCashRegister,
  modules: [
    {
      name: 'pos',
      icon: IconCashRegister,
      path: 'pos',
      hasSettings: true,
    },
  ],
};
