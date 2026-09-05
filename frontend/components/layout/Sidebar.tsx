'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUrbanStore } from '@/store/useUrbanStore';
import {
  LayoutDashboard,
  Radio,
  AlertOctagon,
  MapPin,
  Bus,
  BarChart3,
  Construction,
  Car,
  FileText,
  Shield,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { stats, buses, currentUser, logout } = useUrbanStore();

  const activeBusesCount = buses.filter((b) => b.is_online).length;

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Live GIS Map',
      href: '/map',
      icon: MapPin,
      badge: null,
    },
    {
      name: 'Live Vision HUD',
      href: '/live',
      icon: Radio,
      badge: 'LIVE',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      name: 'Road Conditions',
      href: '/road-intelligence',
      icon: Construction,
      badge: stats.potholes > 0 ? `${stats.potholes}` : null,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      name: 'Traffic Analytics',
      href: '/traffic',
      icon: Car,
      badge: null,
    },
    {
      name: 'Incident Registry',
      href: '/incidents',
      icon: AlertOctagon,
      badge: stats.total_incidents > 0 ? `${stats.total_incidents}` : null,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      name: 'Fleet Monitoring',
      href: '/fleet',
      icon: Bus,
      badge: `${activeBusesCount}/${buses.length}`,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      name: 'Urban Analytics',
      href: '/analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      name: 'Civic Reports',
      href: '/reports',
      icon: FileText,
      badge: null,
    },
  ];

  // Don't render sidebar on /login
  if (pathname === '/login') {
    return null;
  }

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-30 select-none shadow-xs">
      <div>
        {/* Simple Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-slate-900 leading-none">
                URBANSENSE
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-medium">
                Urban AI Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Clean Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            NAVIGATION
          </div>

          {navigation.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                      item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Clean User & Telemetry Footer */}
      <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
        <div className="flex items-center justify-between px-2 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Grid Active
          </span>
          <span className="font-semibold text-slate-700">30 FPS</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">
              {currentUser?.initials || 'AD'}
            </div>
            <div className="truncate">
              <div className="text-[11px] font-bold text-slate-900 truncate leading-tight">
                {currentUser?.name || 'Administrator'}
              </div>
              <div className="text-[9px] font-mono text-slate-400 truncate">
                {currentUser?.badgeId || '#MC-904'}
              </div>
            </div>
          </div>

          <Link
            href="/login"
            onClick={logout}
            className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
            title="Sign Out / Switch Authority"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
