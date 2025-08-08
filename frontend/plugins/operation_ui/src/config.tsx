import { IconUserSquare, IconListCheck } from '@tabler/icons-react';

import { IUIConfig } from 'erxes-ui/types';
import { lazy, Suspense } from 'react';

const MainNavigation = lazy(() =>
  import('./modules/navigation/MainNavigation').then((module) => ({
    default: module.MainNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'operation',
  navigationGroup: {
    name: 'operation',
    icon: IconListCheck,
    content: () => (
      <Suspense fallback={<div />}>
        <MainNavigation />
      </Suspense>
    ),
  },
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
