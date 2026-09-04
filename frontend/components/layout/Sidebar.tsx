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
  Bell,
  Settings,
  Shield,
  Activity,
  Cpu,
  Landmark,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { stats, alerts, buses } = useUrbanStore();

  const activeBusesCount = buses.filter((b) => b.is_online).length;

  const navigation = [
    {
      name: 'Master Command',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Live Vision HUD',
      href: '/live',
      icon: Radio,
      badge: 'LIVE',
      badgeColor: 'bg-pewter-blue/15 text-pewter-darkBlue border-pewter-blue/30 font-bold',
    },
    {
      name: 'GIS Spatial Map',
      href: '/map',
      icon: MapPin,
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
      name: 'Priority Alerts',
      href: '/alerts',
      icon: Bell,
      badge: stats.active_alerts > 0 ? `${stats.active_alerts}` : null,
      badgeColor: 'bg-rose-50 text-rose-600 border-rose-200 font-bold',
    },
    {
      name: 'Transit Fleet Nodes',
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
      name: 'System Settings',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  // Don't render sidebar on /login
  if (pathname === '/login') {
    return null;
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-30 select-none shadow-clean-sm">
      <div>
        {/* Brand & Gov Emblem */}
        <div className="p-4 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pewter-blue to-pewter-darkBlue p-0.5 shadow-clean-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-pewter-darkBlue group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-slate-900">URBANSENSE</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
                Enterprise Gov AI
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
            <span>OPERATIONAL SECTORS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-pewter-blue" />
          </div>

          {navigation.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all group relative ${
                  isActive
                    ? 'bg-pewter-blue/10 text-pewter-darkBlue border border-pewter-blue/30 shadow-clean-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-pewter-darkBlue' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                      item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-pewter-blue rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Corporate Gov Telemetry Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2 shadow-clean-sm">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-700 flex items-center gap-1.5 font-bold">
              <Activity className="w-3.5 h-3.5 text-pewter-darkBlue" />
              EDGE VISION LINK
            </span>
            <span className="text-pewter-darkBlue font-extrabold">29.8 FPS</span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200 p-0.5">
            <div className="bg-pewter-blue h-full w-[94%] rounded-full shadow-sm" />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
            <span>TRANSIT NODES: <strong className="text-slate-900">6 ONLINE</strong></span>
            <span>LATENCY: <strong className="text-pewter-darkBlue">42ms</strong></span>
          </div>
        </div>
      </div>
    </aside>
  );
};
