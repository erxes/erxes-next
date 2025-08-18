import { IconSandbox } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui';
import { lazy, Suspense } from 'react';

const FinanceNavigation = lazy(() =>
  import('./modules/FinanceNavigation').then((module) => ({
    default: module.FinanceNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'finance',
  icon: IconSandbox,
  navigationGroup: {
    name: 'finance',
    icon: IconSandbox,
    content: () => (
      <Suspense fallback={<div />}>
        <FinanceNavigation />
      </Suspense>
    ),
  },
  modules: [
    {
      name: 'saving',
      icon: IconSandbox,
      path: 'saving',
      hasSettings: true,
      hasRelationWidget: false,
      hasFloatingWidget: false,
    },
  ],
};
