import { Outlet } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './apollo-provider/apolloClient';
// import { UserProvider } from '@/auth/providers/UserProvider';
import { UserProviderEffect } from '@/auth/providers/UserProviderEffects';
import { UserProvider } from '@/auth/providers/UserProvider';

export const Providers = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <UserProviderEffect />
      <UserProvider>
        <Outlet />
      </UserProvider>
    </ApolloProvider>
  );
};
