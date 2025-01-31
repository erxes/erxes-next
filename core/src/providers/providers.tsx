import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { ApolloProvider } from '@apollo/client';

import apolloClient from './apollo-provider/apolloClient';

import { PluginsProvidersEffect } from '@/plugins/providers/PluginsProvidersEffect';
import { UserProviderEffect } from '@/auth/providers/UserProviderEffect';
import { OrganizationProviderEffect } from '@/organization/providers/OrganizationProviderEffect';

export const Providers = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <OrganizationProviderEffect />
      <UserProviderEffect />
      <PluginsProvidersEffect />
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </ApolloProvider>
  );
};
