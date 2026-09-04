import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { RealtimeProvider } from '@/components/layout/RealtimeProvider';

export const metadata: Metadata = {
  title: 'UrbanSense — AI Real-Time Urban Intelligence Command Center',
  description:
    'Edge AI real-time computer vision urban monitoring dashboard processing bus-mounted camera telemetry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 flex min-h-screen font-sans antialiased selection:bg-pewter-blue selection:text-white">
        <RealtimeProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
            <Header />
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
              {children}
            </main>
          </div>
        </RealtimeProvider>
      </body>
    </html>
  );
}
