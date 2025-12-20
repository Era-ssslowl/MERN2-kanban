'use client';

import { ApolloClient, InMemoryCache, HttpLink, split, ApolloLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP || 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create WebSocket link for subscriptions (only on client)
const createWsLink = () => {
  if (typeof window === 'undefined') return null;

  return new GraphQLWsLink(
    createClient({
      url: process.env.NEXT_PUBLIC_GRAPHQL_WS || 'ws://localhost:4000/graphql',
      connectionParams: () => {
        const token = localStorage.getItem('token');
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
    })
  );
};

// Split link based on operation type
const createSplitLink = () => {
  const wsLink = createWsLink();

  if (!wsLink) {
    return authLink.concat(httpLink);
  }

  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink)
  );
};

export const apolloClient = new ApolloClient({
  link: createSplitLink(),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          boards: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
      Board: {
        fields: {
          lists: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
      List: {
        fields: {
          cards: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
