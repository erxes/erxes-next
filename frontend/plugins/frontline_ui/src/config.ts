import { IconMailFilled, IconTicket } from '@tabler/icons-react';

import { UIConfig } from 'erxes-ui/types/UIConfig';

export const CONFIG: UIConfig = {
  name: 'frontline',
  icon: IconMailFilled,
  modules: [
    {
      name: 'inbox',
      icon: IconMailFilled,
      path: 'inbox',
      haveSettings: true,
    },
    {
      name: 'tickets',
      icon: IconTicket,
      path: 'tickets',
      haveSettings: true,
    },
  ],
};
