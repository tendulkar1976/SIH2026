'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUrbanStore } from '@/store/useUrbanStore';
import { UserProfileMenu } from '@/components/layout/UserProfileMenu';
import {
  Bell,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { stats } = useUrbanStore();
  const [timeOnly, setTimeOnly] = useState<string>('');
  const [dateOnly, setDateOnly] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateClock = () => {
      const now = new Date();
      setTimeOnly(
        now.toLocaleTimeString('en-GB', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateOnly(
        now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).toUpperCase()
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Master Dashboard';
    if (pathname === '/live') return 'Live Vision HUD';
    if (pathname === '/map') return 'Live GIS Map';
    if (pathname.startsWith('/incidents/')) return 'Forensic Incident Dossier';
    if (pathname === '/incidents') return 'Incident Registry';
    if (pathname === '/road-intelligence') return 'Road Conditions';
    if (pathname === '/traffic') return 'Traffic Analytics';
    if (pathname === '/fleet') return 'Fleet Monitoring';
    if (pathname === '/analytics') return 'Urban Analytics';
    if (pathname === '/reports') return 'Civic Reports';
    return 'Command Center';
  };

  if (pathname === '/login') return null;

  return (
    <header className="h-14 bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-30 shadow-2xs select-none">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Page Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-slate-900 font-sans tracking-tight">
            {getPageTitle()}
          </h1>
          <span className="hidden sm:inline text-slate-300">/</span>
          <span className="hidden sm:inline text-xs font-mono text-slate-400">
            UrbanSense OCC
          </span>
        </div>

        {/* Right: Clock & User Menu */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Clock */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isMounted ? timeOnly : '00:00:00'} IST</span>
          </div>

          {/* Priority Alert Notification Trigger */}
          <Link
            href="/incidents"
            className="relative p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-2xs"
            title="View Active Incidents"
          >
            <Bell className="w-4 h-4" />
            {stats.active_alerts > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                {stats.active_alerts}
              </span>
            )}
          </Link>

          {/* Authority Profile Dropdown */}
          <div className="pl-2 border-l border-slate-200">
            <UserProfileMenu />
          </div>

        </div>
      </div>
    </header>
  );
};
