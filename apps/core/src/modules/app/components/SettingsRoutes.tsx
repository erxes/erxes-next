import { usePLuginsSettingsRoutes } from '@/app/hooks/usePluginsRouter';
import { SettingsSkeletonLoader } from '@/settings/components/SettingsSkeletonLoader';
import { SettingsPath } from '@/types/SettingsPath';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SettingsExperiencePage } from '~/pages/settings/account/ExperiencePage';

const SettingsProfile = lazy(() =>
  import('~/pages/settings/account/ProfilePage').then((module) => ({
    default: module.SettingsProfilePage,
  }))
);

const SettingsPrivacy = lazy(() =>
  import('~/pages/settings/account/PrivacyPage').then((module) => ({
    default: module.SettingsPrivacyPage,
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
        <Route path={SettingsPath.Privacy} element={<SettingsPrivacy />} />
        {usePLuginsSettingsRoutes()}

        {/* <Route path={`/inbox`} element={<SettingsProfile />} /> */}
      </Routes>
    </Suspense>
  );
}
