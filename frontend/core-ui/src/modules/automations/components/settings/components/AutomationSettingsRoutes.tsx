import { AutomationSettingsLayout } from '@/automations/components/settings/components/AutomationsSettingsLayout';
import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router';

const AutomationsBotsSettingsPage = lazy(() =>
  import(
    '~/pages/settings/workspace/automations/AutomationsBotsSettingsPage'
  ).then((module) => ({ default: module.AutomationsBotsSettingsPage })),
);

export const AutomationsSettingRoutes = () => {
  return (
    <AutomationSettingsLayout>
      <Routes>
        <Route path="/" element={<Navigate to="bots" replace />} />
        <Route path="/bots" element={<AutomationsBotsSettingsPage />} />
      </Routes>
    </AutomationSettingsLayout>
  );
};
