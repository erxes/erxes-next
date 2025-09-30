import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../lib/apollo-client';

interface ApolloProps {
  children: any;
}

export const Apollo = ({ children }: ApolloProps) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
