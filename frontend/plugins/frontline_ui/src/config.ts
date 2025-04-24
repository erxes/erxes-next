import { IconMailFilled, IconTicket } from '@tabler/icons-react';

export const CONFIG = {
  name: 'frontline',
  icon: IconMailFilled,
  haveWidgets: true,
  widgetsIcon: IconMailFilled,
  modules: [
    {
      name: 'Inbox',
      icon: IconMailFilled,
      path: 'inbox',
    },
    {
      name: 'Tickets',
      icon: IconTicket,
      path: 'tickets',
    },
  ],
};
