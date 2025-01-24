import { SettingsSkeletonLoader } from '@/settings/components/SettingsSkeletonLoader';
import { SettingsPath, SettingsWorkspacePath } from '@/types/SettingsPath';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { SettingsExperiencePage } from '~/pages/settings/account/ExperiencePage';

import { usePLuginsSettingsRoutes } from '@/app/hooks/usePluginsRouter';
import { MailConfigPage } from '~/pages/settings/workspace/MailConfigPage';

const FilePage = lazy(() =>
  import('~/pages/settings/workspace/FilePage').then((module) => ({
    default: module.FilePage,
  }))
);
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
        <Route
          path={SettingsWorkspacePath.FileUpload}
          element={<FilePage />}
        />
        <Route
          path={SettingsWorkspacePath.MailConfig}
          element={<MailConfigPage />}
        />

        {usePLuginsSettingsRoutes()}
      </Routes>
    </Suspense>
  );
}
