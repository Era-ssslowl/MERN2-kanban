import type { Metadata } from 'next';
import './globals.css';
import { ApolloProvider } from '@/lib/apollo/ApolloProvider';

export const metadata: Metadata = {
  title: 'TaskFlow - Manage your projects',
  description: 'A modern task management application built with Next.js and GraphQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
