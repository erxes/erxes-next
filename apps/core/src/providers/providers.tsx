import { Outlet } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './apollo-provider/apolloClient';
import { UserProviderEffect } from '@/auth/providers/UserProviderEffects';

export const Providers = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <UserProviderEffect />
      <Outlet />
    </ApolloProvider>
  );
};
