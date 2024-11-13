import { SettingsSkeletonLoader } from '@/settings/components/SettingsSkeletonLoader';
import { SettingsPath } from '@/types/SettingsPath';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SettingsExperience } from '~/app/settings/account/experience';

const SettingsProfile = lazy(() =>
  import('~/app/settings/account/profile').then((module) => ({
    default: module.SettingsProfile,
  }))
);

export function SettingsRoutes() {
  return (
    <Suspense fallback={<SettingsSkeletonLoader />}>
      <Routes>
        <Route path={SettingsPath.Profile} element={<SettingsProfile />} />
        <Route
          path={SettingsPath.Experience}
          element={<SettingsExperience />}
        />
      </Routes>
    </Suspense>
  );
}
