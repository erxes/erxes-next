import { IconUserSquare, IconListCheck } from '@tabler/icons-react';

import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'operation',
  icon: IconListCheck,
  modules: [
    {
      name: 'operation',
      icon: IconListCheck,
      path: 'operation',
      hasSettings: false,
      hasRelationWidget: false,
      hasFloatingWidget: false,
    },
    {
      name: 'team',
      icon: IconUserSquare,
      path: 'operation/team',
      hasSettings: true,
      hasRelationWidget: false,
      hasFloatingWidget: false,
    },
  ],
};
