import { lazy, Suspense, useState } from 'react';
import { IIntegrationItem } from '../settings/types/integration';
import {
  INTEGRATIONS,
  OTHER_INTEGRATIONS,
} from '../settings/constants/integrations';
import { IntegrationContext } from '../settings/context/IntegrationContext';
import { Filter, SettingsHeader, Spinner } from 'erxes-ui';
import { InboxSettingsBreadcrumb } from '../settings/components/InboxSettingsBreadcrumb';
import { InboxSettingsTopbar } from '../settings/components/InboxSettingsTopbar';
import { InboxSettingsSidebar } from '../settings/components/Sidebar';
import { Route, Routes } from 'react-router-dom';

export const InboxMainConfig = lazy(() =>
  import('~/pages/SettingsPage').then((module) => ({
    default: module.SettingsPage,
  })),
);

export const IntegrationDetailPage = lazy(() =>
  import('~/pages/IntegrationCreatePage').then((module) => ({
    default: module.IntegrationCreatePage,
  })),
);

const InboxSettings = () => {
  const [integrations, setIntegrations] =
    useState<Record<string, IIntegrationItem>>(INTEGRATIONS);
  const [otherIntegrations, setOtherIntegrations] =
    useState<Record<string, IIntegrationItem>>(OTHER_INTEGRATIONS);
  return (
    <IntegrationContext.Provider
      value={{
        integrations,
        setIntegrations,
        otherIntegrations,
        setOtherIntegrations,
      }}
    >
      <Filter id="inbox-settings">
        <div className="flex flex-col flex-auto overflow-hidden">
          <SettingsHeader breadcrumbs={<InboxSettingsBreadcrumb />}>
            <div className="flex ml-auto">
              <InboxSettingsTopbar />
            </div>
          </SettingsHeader>
          <div className="flex flex-auto overflow-hidden">
            <InboxSettingsSidebar />
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-full">
                  <Spinner />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<InboxMainConfig />} />
                <Route
                  path="/details/:kind"
                  element={<IntegrationDetailPage />}
                />
              </Routes>
            </Suspense>
          </div>
        </div>
      </Filter>
    </IntegrationContext.Provider>
  );
};

export default InboxSettings;
