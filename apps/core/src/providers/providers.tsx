import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './apollo-provider/apolloClient';
import { UserProviderEffect } from '@/auth/providers/UserProviderEffect';
import { OrganizationProviderEffect } from '@/organization/providers/OrganizationProviderEffect';

export const Providers = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <OrganizationProviderEffect />
      <UserProviderEffect />
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </ApolloProvider>
  );
};
