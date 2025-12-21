'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';

const PUBLIC_ROUTES = ['/login', '/register', '/'];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  return (
    <>
      {!isPublicRoute && <Navigation />}
      <main>{children}</main>
    </>
  );
}
