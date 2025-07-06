import { lazy } from 'react';
import { Route, Routes } from 'react-router';

const NotificationSettingsPage = lazy(() =>
  import(
    '~/pages/settings/workspace/notifications/NotificationSettingsPage'
  ).then((module) => ({ default: module.NotificationSettingsPage })),
);

export const NotificationSettingsRoutes = () => {
  return (
    <Routes>
      <Route index element={<NotificationSettingsPage />} />
    </Routes>
  );
};
