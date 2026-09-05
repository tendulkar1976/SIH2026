import type { Metadata } from 'next';
import './globals.css';
import { RealtimeProvider } from '@/components/layout/RealtimeProvider';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'UrbanSense — AI-Powered Smart Bus Urban Intelligence Platform',
  description:
    'Transforming public transport buses into mobile AI sensing units for real-time road condition, traffic, infrastructure, and public safety intelligence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 flex min-h-screen font-sans antialiased selection:bg-indigo-600 selection:text-white">
        <RealtimeProvider>
          <AppShell>{children}</AppShell>
        </RealtimeProvider>
      </body>
    </html>
  );
}
