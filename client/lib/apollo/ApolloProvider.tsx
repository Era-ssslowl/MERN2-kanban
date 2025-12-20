'use client';

import { ApolloProvider as Provider } from '@apollo/client';
import { apolloClient } from './apollo-client';
import { ReactNode } from 'react';

export function ApolloProvider({ children }: { children: ReactNode }) {
  return <Provider client={apolloClient}>{children}</Provider>;
}
