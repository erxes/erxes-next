import { IconInbox, IconTicket } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: 'frontline',
  icon: IconInbox,
  modules: [
    {
      name: 'inbox',
      icon: IconInbox,
      path: 'inbox',
      hasSettings: true,
      hasWidgets: true,
    },
    {
      name: 'ticket',
      icon: IconTicket,
      path: 'ticket',
      hasSettings: true,
      hasWidgets: true,
    },
  ],
};
