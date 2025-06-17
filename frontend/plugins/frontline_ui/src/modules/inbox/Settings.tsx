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
import { FrontlinePaths } from '@/types/FrontlinePaths';
import { InboxPageChangeEffect } from '@/inbox/components/InboxPageChangeEffect';

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
              <Route path="channels" element={<ChannelsSettingsPage />} />
            </Routes>
            <InboxPageChangeEffect />
          </Suspense>
        </PageContainer>
      </div>
    </IntegrationContext.Provider>
  );
};

export default InboxSettings;
