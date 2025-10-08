import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { FrontlinePaths } from '@/types/FrontlinePaths';
import { InboxPageChangeEffect } from '@/inbox/components/InboxPageChangeEffect';
import { InboxSettingsLayout } from '@/inbox/components/InboxSettingsLayout';

export const IntegrationSettingsPage = lazy(() =>
  import('~/pages/IntegrationSettingsPage').then((module) => ({
    default: module.IntegrationSettingsPage,
  })),
);

export const ChannelsSettingsPage = lazy(() =>
  import('~/pages/ChannelsSettingsPage').then((module) => ({
    default: module.default,
  })),
);

export const IntegrationDetailPage = lazy(() =>
  import('~/pages/IntegrationDetailPage').then((module) => ({
    default: module.IntegrationDetailPage,
  })),
);

export const IntegrationConfigPage = lazy(() =>
  import('~/pages/IntegrationConfigPage').then((module) => ({
    default: module.IntegrationConfigPage,
  })),
);

export const ErxesMessengerPreview = lazy(() =>
  import('~/pages/ErxesMessengerPreview').then((module) => ({
    default: module.ErxesMessengerPreview,
  })),
);

export const InboxSettings = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route
          element={
            <InboxSettingsLayout>
              <Outlet />
            </InboxSettingsLayout>
          }
        >
          <Route
            path="/"
            element={<Navigate to={FrontlinePaths.Integrations} replace />}
          />
          <Route
            path={FrontlinePaths.Integrations}
            element={<IntegrationSettingsPage />}
          />
          <Route
            path={FrontlinePaths.IntegrationDetail}
            element={<IntegrationDetailPage />}
          />
          <Route
            path={FrontlinePaths.IntegrationConfig}
            element={<IntegrationConfigPage />}
          />
          <Route
            path={FrontlinePaths.Channels}
            element={<ChannelsSettingsPage />}
          />
        </Route>
        <Route
          path={FrontlinePaths.ErxesMessengerPreview}
          element={<ErxesMessengerPreview />}
        />
      </Routes>
      <InboxPageChangeEffect />
    </Suspense>
  );
};
