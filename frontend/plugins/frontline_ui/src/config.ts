import { IconInbox, IconTicket } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui';

export const CONFIG: IUIConfig = {
  name: 'frontline',
  icon: IconInbox,
  modules: [
    {
      name: 'inbox',
      icon: IconInbox,
      path: 'inbox',
      hasSettings: true,
      hasRelationWidget: true,
      hasFloatingWidget: true,
    },
    {
      name: 'ticket',
      icon: IconTicket,
      path: 'ticket',
      hasSettings: true,
      hasRelationWidget: true,
    },
  ],
};
