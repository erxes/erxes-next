import {
  IconListCheck,
  IconChecklist,
  IconClipboard,
} from '@tabler/icons-react';

import { IUIConfig } from 'erxes-ui';
import { lazy, Suspense } from 'react';

const MainNavigation = lazy(() =>
  import('./modules/navigation/MainNavigation').then((module) => ({
    default: module.MainNavigation,
  })),
);

const TeamsNavigation = lazy(() =>
  import('./modules/navigation/TeamsNavigation').then((mod) => ({
    default: mod.TeamsNavigation,
  })),
);

const OperationSettingsNavigation = lazy(() =>
  import('./modules/OperationSettingsNavigation').then((module) => ({
    default: module.OperationSettingsNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'operation',
  path: 'operation',
  settingsNavigation: () => (
    <Suspense fallback={<div />}>
      <OperationSettingsNavigation />
    </Suspense>
  ),
  navigationGroup: {
    name: 'operation',
    icon: IconListCheck,
    content: () => (
      <Suspense fallback={<div />}>
        <MainNavigation />
      </Suspense>
    ),
    subGroup: () => (
      <Suspense fallback={<div />}>
        <TeamsNavigation />
      </Suspense>
    ),
  },
  relationWidgets: [
    {
      name: 'tasks',
      icon: IconChecklist,
    },
    {
      name: 'projects',
      icon: IconClipboard,
    },
  ],
};
