'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUrbanStore } from '@/store/useUrbanStore';
import { ConnectionIndicator } from '@/components/layout/ConnectionIndicator';
import {
  Bell,
  Search,
  Shield,
  Clock,
  ChevronRight,
  UserCheck,
  Radio,
  Sparkles,
  Lock,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { stats, alerts } = useUrbanStore();
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
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
    if (pathname === '/alerts') return 'Priority Emergency Alerts';
    if (pathname === '/settings') return 'System Configuration & Parameters';
    return 'Urban Intelligence Platform';
  };

  if (pathname === '/login') return null;

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shadow-clean-sm">
      {/* Left: Clean Gov Hierarchy Breadcrumb */}
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-pewter-darkBlue shadow-clean-sm">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            <span className="text-pewter-darkBlue font-bold">MUNICIPAL GOV</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-600">CIVIL INTELLIGENCE</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-pewter-darkBlue font-semibold">{getPageTitle()}</span>
          </div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight">{getPageTitle()}</h1>
        </div>
      </div>

      {/* Center: Live Clock & Security Clearance Chip */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-700 shadow-clean-sm">
          <Lock className="w-3 h-3 text-pewter-darkTaupe" />
          <span>SECURITY LEVEL: <strong className="text-pewter-darkBlue">RESTRICTED // LEVEL 4</strong></span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 font-mono text-xs text-slate-600 shadow-clean-sm">
          <Clock className="w-3.5 h-3.5 text-pewter-darkBlue" />
          <span>{timeString || 'SYNCHRONIZING...'}</span>
        </div>
      </div>

      {/* Right: Real-time Status, Priority Alerts & Officer Profile */}
      <div className="flex items-center gap-3.5">
        <ConnectionIndicator />

        {/* Alerts Button */}
        <Link
          href="/alerts"
          className="relative p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-pewter-blue hover:bg-slate-50 transition shadow-clean-sm"
          title="View Active Alerts"
        >
          <Bell className="w-4 h-4" />
          {stats.active_alerts > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse shadow-sm">
              {stats.active_alerts}
            </span>
          )}
        </Link>

        {/* Officer Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-pewter-blue/10 border border-pewter-blue/30 flex items-center justify-center text-pewter-darkBlue shadow-clean-sm">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">Cmdr. R. Menon</div>
            <div className="text-[10px] font-mono text-slate-500">Municipal Command</div>
          </div>
        </div>
      </div>
    </header>
  );
};
