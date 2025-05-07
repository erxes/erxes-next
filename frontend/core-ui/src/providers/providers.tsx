import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { ApolloProvider } from '@apollo/client';

import apolloClient from './apollo-provider/apolloClient';

import { PluginConfigsProvidersEffect } from '@/plugins/providers/PluginConfigsProvidersEffect';
import { UserProviderEffect } from '@/auth/providers/UserProviderEffect';
import { OrganizationProviderEffect } from '@/organization/providers/OrganizationProviderEffect';
import { PageChangeEffect } from '@/app/effect-components/PageChangeEffect';
import { WidgetsComponent } from '@/widgets/components/WidgetsComponent';
import { useWidgetsModules } from '@/widgets/hooks/useWidgetsModules';
import { WidgetProvider } from 'ui-modules';

export const Providers = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <OrganizationProviderEffect />
      <UserProviderEffect />
      <PluginConfigsProvidersEffect />
      <WidgetProvider
        Widget={WidgetsComponent}
        widgetsModules={useWidgetsModules()}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </WidgetProvider>
      <PageChangeEffect />
    </ApolloProvider>
  );
};
