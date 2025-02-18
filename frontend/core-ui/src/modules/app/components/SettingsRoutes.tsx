import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

import { usePLuginsSettingsRoutes } from '@/app/hooks/usePluginsRouter';
import { SettingsSkeletonLoader } from '@/settings/components/SettingsSkeletonLoader';
import { SettingsPath, SettingsWorkspacePath } from '@/types/paths/SettingsPath';
import { SettingsExperiencePage } from '~/pages/settings/account/ExperiencePage';

const SettingsProfile = lazy(() =>
  import('~/pages/settings/account/ProfilePage').then((module) => ({
    default: module.SettingsProfilePage,
  }))
);

const SettingsFileUpload = lazy(() =>
  import('~/pages/settings/workspace/FilePage').then((module) => ({
    default: module.FilePage,
  }))
)

export function SettingsRoutes() {
  return (
    <Suspense fallback={<SettingsSkeletonLoader />}>
      <Routes>
        <Route path={SettingsPath.Profile} element={<SettingsProfile />} />
        <Route
          path={SettingsPath.Experience}
          element={<SettingsExperiencePage />}
        />
        <Route path={SettingsWorkspacePath.FileUpload} element={<SettingsFileUpload />} />

        {usePLuginsSettingsRoutes()}
      </Routes>
    </Suspense>
  );
}
