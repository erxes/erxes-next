import { SettingsSkeletonLoader } from '@/settings/components/SettingsSkeletonLoader';
import { SettingsPath, SettingsWorkspacePath } from '@/types/SettingsPath';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { SettingsExperiencePage } from '~/pages/settings/account/ExperiencePage';
import { usePLuginsSettingsRoutes } from '@/app/hooks/usePluginsRouter';

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

        {/* <Route path={`/inbox`} element={<SettingsProfile />} /> */}
      </Routes>
    </Suspense>
  );
}
