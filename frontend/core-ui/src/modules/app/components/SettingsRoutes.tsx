import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import {
  SettingsPath,
  SettingsWorkspacePath,
} from '@/types/paths/SettingsPath';
import { SettingsExperiencePage } from '~/pages/settings/account/ExperiencePage';
import { getPluginsSettingsRoutes } from '@/app/hooks/usePluginsRouter';
import { Skeleton } from 'erxes-ui';
import { SettingsPageEffect } from '@/settings/components/SettingsPageEffect';

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
const TeamMemberSettings = lazy(() =>
  import('~/pages/settings/workspace/TeamMemberPage').then((module) => ({
    default: module.TeamMemberPage,
  })),
);
const StructureSettings = lazy(() =>
  import('~/pages/settings/workspace/structure/StructureSettingsPage').then(
    (module) => ({
      default: module.StructureSettingsPage,
    }),
  ),
);

const TagsSettings = lazy(() =>
  import('~/pages/settings/workspace/tags/TagsSettingPage').then((module) => ({
    default: module.TagsSettingPage,
  })),
);

const ProductsSettings = lazy(() =>
  import('~/pages/settings/modules/ProductsSettingPage').then((module) => ({
    default: module.ProductsSettingPage,
  })),
);

export function SettingsRoutes() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`${SettingsPath.Profile}`} replace />}
        />
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
          path={SettingsWorkspacePath.TeamMember}
          element={<TeamMemberSettings />}
        />
        <Route
          path={SettingsWorkspacePath.StructureCatchAll}
          element={<StructureSettings />}
        />
        <Route path={SettingsWorkspacePath.Tags} element={<TagsSettings />} />
        <Route
          path={SettingsWorkspacePath.Products}
          element={<ProductsSettings />}
        />
        {getPluginsSettingsRoutes()}
      </Routes>
      <SettingsPageEffect />
    </Suspense>
  );
}
