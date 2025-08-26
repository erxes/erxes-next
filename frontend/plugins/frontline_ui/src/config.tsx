import { IconMail, IconStackFront, IconTicket } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui';
import { lazy, Suspense } from 'react';

const FrontlineNavigation = lazy(() =>
  import('./modules/FrontlineNavigation').then((module) => ({
    default: module.FrontlineNavigation,
  })),
);

const FrontlineSubGroups = lazy(() =>
  import('./modules/FrontlineSubGroups').then((module) => ({
    default: module.FrontlineSubGroups,
  })),
);

const FrontlineActions = lazy(() =>
  import('./modules/FrontlineActions').then((module) => ({
    default: module.FrontlineActions,
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
    subGroups: () => (
      <Suspense fallback={<div />}>
        <FrontlineSubGroups />
      </Suspense>
    ),
    actions: () => (
      <Suspense fallback={<div />}>
        <FrontlineActions />
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
