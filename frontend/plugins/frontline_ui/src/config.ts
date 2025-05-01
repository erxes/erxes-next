import { IconMailFilled, IconTicket } from '@tabler/icons-react';

import { IUIConfig } from 'erxes-ui/types/IUIConfig';

export const CONFIG: IUIConfig = {
  name: 'frontline',
  icon: IconMailFilled,
  modules: [
    {
      name: 'inbox',
      icon: IconMailFilled,
      path: 'inbox',
      hasSettings: true,
    },
    {
      name: 'ticket',
      icon: IconTicket,
      path: 'ticket',
      hasSettings: true,
    },
  ],
};
