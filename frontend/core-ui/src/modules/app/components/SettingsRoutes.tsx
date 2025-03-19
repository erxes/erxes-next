import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

import { SettingsSkeletonLoader } from '@/settings/components/SettingsSkeletonLoader';
import {
  SettingsPath,
  SettingsWorkspacePath,
} from '@/types/paths/SettingsPath';
import { SettingsExperiencePage } from '~/pages/settings/account/ExperiencePage';
import { getPluginsSettingsRoutes } from '../hooks/usePluginsRouter';

const SettingsProfile = lazy(() =>
  import('~/pages/settings/account/ProfilePage').then((module) => ({
    default: module.SettingsProfilePage,
  })),
);

const SettingsFileUpload = lazy(() =>
  import('~/pages/settings/workspace/FilePage').then((module) => ({
    default: module.FilePage,
  })),
);
const SettingsMailConfig = lazy(() =>
  import('~/pages/settings/workspace/MailConfigPage').then((module) => ({
    default: module.MailConfigPage,
  })),
);
const GeneralSettings = lazy(() =>
  import('~/pages/settings/workspace/GeneralSettingsPage').then((module) => ({
    default: module.GeneralSettingsPage,
  })),
);
const PermissionSettings = lazy(() =>
  import('~/pages/settings/workspace/PermissionPage').then((module) => ({
    default: module.PermissionPage,
  })),
);

export function SettingsRoutes() {
  return (
    <Suspense fallback={<SettingsSkeletonLoader />}>
      <Routes>
        <Route path={SettingsPath.Profile} element={<SettingsProfile />} />
        <Route
          path={SettingsPath.Experience}
          element={<SettingsExperiencePage />}
        />
        <Route
          path={SettingsWorkspacePath.FileUpload}
          element={<SettingsFileUpload />}
        />
        <Route
          path={SettingsWorkspacePath.MailConfig}
          element={<SettingsMailConfig />}
        />
        <Route
          path={SettingsWorkspacePath.General}
          element={<GeneralSettings />}
        />
        <Route
          path={SettingsWorkspacePath.Permission}
          element={<PermissionSettings />}
        />

        {getPluginsSettingsRoutes()}
      </Routes>
    </Suspense>
  );
}
