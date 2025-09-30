import {
  split,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { API_URL } from '../../config';

interface Definition {
  kind: string;
  operation?: string;
}

const wsUri = API_URL.replace(/^http/, 'ws');

export const httpLink = createHttpLink({
  uri: `${API_URL}/graphql`,
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

export const wsLink = new GraphQLWsLink(
  createClient({
    url: `${wsUri}/graphql`,
    lazyCloseTimeout: 30000,
    retryAttempts: 100,
    retryWait: () => new Promise((resolve) => setTimeout(resolve, 1000)),
    connectionParams: () => {
      const params: Record<string, unknown> = {};
      params.messengerDataJson = localStorage.getItem('messengerDataJson');
      return params;
    },
  }),
);

const splitLink = split(
  ({ query }) => {
    const { kind, operation }: Definition = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, splitLink]),
  cache: new InMemoryCache(),
});
