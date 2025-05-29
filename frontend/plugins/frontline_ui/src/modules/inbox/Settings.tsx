import { lazy, Suspense, useState } from 'react';
import { IIntegrationItem } from '../settings/types/integration';
import {
  INTEGRATIONS,
  OTHER_INTEGRATIONS,
} from '../settings/constants/integrations';
import { IntegrationContext } from '../settings/context/IntegrationContext';
import { Button, PageContainer, Spinner } from 'erxes-ui';

import { InboxSettingsTopbar } from '../settings/components/InboxSettingsTopbar';
import { InboxSettingsSidebar } from '../settings/components/Sidebar';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageHeader, PageHeaderEnd, PageHeaderStart } from 'ui-modules';
import { IconMailFilled } from '@tabler/icons-react';

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
      <div className="flex flex-auto w-full overflow-hidden">
        <InboxSettingsSidebar />
        <PageContainer className="flex-1">
          <PageHeader>
            <PageHeaderStart>
              <Button variant={'ghost'} className="font-semibold">
                <IconMailFilled className="w-4 h-4 text-accent-foreground" />
                Team inbox
              </Button>
            </PageHeaderStart>
            <PageHeaderEnd>
              <InboxSettingsTopbar />
            </PageHeaderEnd>
          </PageHeader>

          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            }
          >
            <Routes>
              <Route
                path="/"
                element={<Navigate to="integrations" replace />}
              />
              <Route
                path="integrations"
                element={<IntegrationSettingsPage />}
              />
              <Route
                path="integrations/:integrationType"
                element={<IntegrationDetailPage />}
              />
              <Route path="channels" element={<ChannelsSettingsPage />} />
            </Routes>
          </Suspense>
        </PageContainer>
      </div>
    </IntegrationContext.Provider>
  );
};

export default InboxSettings;
