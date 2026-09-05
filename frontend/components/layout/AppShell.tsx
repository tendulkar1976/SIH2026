'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLandingOrLogin = pathname === '/' || pathname === '/login';

  if (isLandingOrLogin) {
    return <div className="flex-1 min-w-0">{children}</div>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <Header />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {children}
        </main>
      </div>
    </>
  );
};
