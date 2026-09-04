'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUrbanStore } from '@/store/useUrbanStore';
import { ConnectionIndicator } from '@/components/layout/ConnectionIndicator';
import {
  Bell,
  Clock,
  ChevronRight,
  UserCheck,
  Lock,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { stats } = useUrbanStore();
  const [timeString, setTimeString] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) +
          ' IST • ' +
          now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Master Command Dashboard';
    if (pathname === '/live') return 'Real-Time Camera & Optical Vision';
    if (pathname === '/map') return 'City Geospatial GIS Intelligence Map';
    if (pathname.startsWith('/incidents/')) return 'Incident Investigation Dossier';
    if (pathname === '/incidents') return 'Incident Management Registry';
    if (pathname === '/fleet') return 'Transit Fleet Telemetry & Health';
    if (pathname === '/analytics') return 'Spatial & Temporal Analytics';
    return 'Urban Intelligence Platform';
  };

  if (pathname === '/login') return null;

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Clean Gov Hierarchy Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-indigo-600 shadow-xs">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <span className="text-indigo-600 font-semibold">MUNICIPAL GOV</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-500">CIVIL INTELLIGENCE</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-indigo-600 font-semibold">{getPageTitle()}</span>
          </div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight">{getPageTitle()}</h1>
        </div>
      </div>

      {/* Center: Live Clock & Security Clearance Chip */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-700 shadow-xs">
          <Lock className="w-3 h-3 text-slate-500" />
          <span>SECURITY: <strong className="text-indigo-600">RESTRICTED // LEVEL 4</strong></span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 font-mono text-xs text-slate-600 shadow-xs">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>{isMounted ? timeString : 'SYNCHRONIZING...'}</span>
        </div>
      </div>

      {/* Right: Real-time Status, Priority Alerts & Officer Profile */}
      <div className="flex items-center gap-3">
        <ConnectionIndicator />

        {/* Alerts Notification Button linking to Incident Registry */}
        <Link
          href="/incidents"
          className="relative p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-indigo-300 hover:bg-slate-50 transition shadow-xs"
          title="View High-Priority Incidents"
        >
          <Bell className="w-4 h-4" />
          {stats.active_alerts > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse shadow-xs">
              {stats.active_alerts}
            </span>
          )}
        </Link>

        {/* Officer Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">Cmdr. R. Menon</div>
            <div className="text-[10px] font-mono text-slate-400">Municipal Command</div>
          </div>
        </div>
      </div>
    </header>
  );
};


