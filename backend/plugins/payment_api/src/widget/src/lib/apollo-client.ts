import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { ApolloLink, split } from '@apollo/client/link/core';
import { getMainDefinition } from '@apollo/client/utilities';

declare const __VITE_API_URL__: string;
const apiDomain = typeof import.meta !== 'undefined' 
  ? import.meta.env.VITE_API_URL 
  : process.env['VITE_API_URL'] || __VITE_API_URL__;
  
const wsUri = apiDomain?.replace('http', 'ws');

const httpLink = createHttpLink({
  uri: `${apiDomain}/graphql`,
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${wsUri}/graphql`
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, splitLink]),
  cache: new InMemoryCache(),
});
