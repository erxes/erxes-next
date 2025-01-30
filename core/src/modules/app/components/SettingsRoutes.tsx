import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

import { usePLuginsSettingsRoutes } from '@/app/hooks/usePluginsRouter';
import { SettingsSkeletonLoader } from '@/settings/components/SettingsSkeletonLoader';
import { SettingsPath } from '@/types/paths/SettingsPath';
import { SettingsExperiencePage } from '~/pages/settings/account/ExperiencePage';

const SettingsProfile = lazy(() =>
  import('~/pages/settings/account/ProfilePage').then((module) => ({
    default: module.SettingsProfilePage,
  }))
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

        {usePLuginsSettingsRoutes()}
      </Routes>
    </Suspense>
  );
}
