import { IconMail, IconStackFront, IconTicket } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui';
import { lazy, Suspense } from 'react';

const FrontlineNavigation = lazy(() =>
  import('./modules/FrontlineNavigation').then((module) => ({
    default: module.FrontlineNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'frontline',
  navigationGroup: {
    name: 'frontline',
    icon: IconStackFront,
    content: () => (
      <Suspense fallback={<div />}>
        <FrontlineNavigation />
      </Suspense>
    ),
  },
  modules: [
    {
      name: 'inbox',
      icon: IconMail,
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
