'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUrbanStore } from '@/store/useUrbanStore';
import { ConnectionIndicator } from '@/components/layout/ConnectionIndicator';
import {
  Bell,
  Clock,
  Lock,
  Activity,
  Shield,
  Radio,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { stats, buses } = useUrbanStore();
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

  const getModuleMeta = () => {
    if (pathname === '/dashboard') return { title: 'Executive Overview', code: 'SYS-OVERVIEW', section: 'MASTER DASHBOARD' };
    if (pathname === '/live') return { title: 'Optical Vision HUD', code: 'CAM-HUD-01', section: 'LIVE VIDEO STREAM' };
    if (pathname === '/map') return { title: 'Geospatial GIS Intelligence', code: 'GIS-SPATIAL', section: 'CIVIL MAP GRID' };
    if (pathname.startsWith('/incidents/')) return { title: 'Forensic Incident Dossier', code: 'EVID-INSPECT', section: 'CIVIC DOSSIER' };
    if (pathname === '/incidents') return { title: 'Incident Action Registry', code: 'INC-REGISTRY', section: 'DEPARTMENT QUEUE' };
    if (pathname === '/fleet') return { title: 'Edge Telemetry Nodes', code: 'FLEET-TELEMETRY', section: 'TRANSIT BUS FLEET' };
    if (pathname === '/analytics') return { title: 'Spatial & Temporal Trends', code: 'URBAN-ANALYTICS', section: 'CIVIL ANALYTICS' };
    return { title: 'Urban Intelligence Platform', code: 'OCC-MAIN', section: 'OPERATIONS' };
  };

  const meta = getModuleMeta();
  const onlineBuses = buses.filter((b) => b.is_online).length;

  if (pathname === '/login') return null;

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 text-slate-800 sticky top-0 z-30 shadow-2xs select-none">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3 md:gap-6">
        
        {/* ========================================================= */}
        {/* LEFT: MUNICIPAL IDENTITY & MASTER COMMAND TITLE           */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Municipal Insignia Crest */}
          <div className="w-9 h-9 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-2xs shrink-0">
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-slate-900 font-sans uppercase">
                MASTER COMMAND
              </h1>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-mono font-bold uppercase tracking-wider">
                {meta.code}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              <span className="font-semibold text-slate-800">URBANSENSE OCC</span>
              <span className="text-slate-300">/</span>
              <span className="hidden md:inline text-slate-500">{meta.section}</span>
              <span className="hidden md:inline text-slate-300">/</span>
              <span className="text-indigo-600 font-semibold">{meta.title}</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER: COMPACT LIVE SYSTEM METRICS (MISSION CONTROL HUD) */}
        {/* ========================================================= */}
        <div className="hidden xl:flex items-center divide-x divide-slate-200 bg-slate-50 border border-slate-200 rounded-md px-1 py-1 text-xs font-mono shadow-2xs">
          
          {/* Metric 1: Fleet Sensor Grid */}
          <div className="px-3 py-0.5 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block leading-tight">FLEET NODES</span>
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {onlineBuses}/{buses.length} ACTIVE
              </span>
            </div>
          </div>

          {/* Metric 2: AI Vision Inference Pipeline */}
          <div className="px-3 py-0.5 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block leading-tight">INFERENCE PIPELINE</span>
              <span className="text-xs font-bold text-slate-800 leading-tight">
                30.0 FPS <span className="text-slate-400 text-[10px] font-normal">/ 42ms</span>
              </span>
            </div>
          </div>

          {/* Metric 3: Critical Dispatch Queue */}
          <div className="px-3 py-0.5 flex items-center gap-2">
            <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${stats.active_alerts > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block leading-tight">DISPATCH QUEUE</span>
              <span className={`text-xs font-bold leading-tight ${stats.active_alerts > 0 ? 'text-rose-700' : 'text-slate-800'}`}>
                {stats.active_alerts} CRITICAL
              </span>
            </div>
          </div>

          {/* Metric 4: Security Clearance Protocol */}
          <div className="px-3 py-0.5 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block leading-tight">SECURITY PROTOCOL</span>
              <span className="text-xs font-bold text-slate-800 leading-tight">
                RESTRICTED // L4
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT: IST CHRONO, STATUS, NOTIFICATIONS, OPERATOR        */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* High-Precision IST Military Time Clock */}
          <div className="hidden sm:flex flex-col items-end pr-2.5 border-r border-slate-200 text-right font-mono">
            <div className="text-xs font-bold text-slate-900 tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isMounted ? timeOnly : '00:00:00'} IST</span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {isMounted ? dateOnly : 'SYNCHRONIZING'}
            </div>
          </div>

          {/* Mission Control Connection Indicator */}
          <ConnectionIndicator />

          {/* Priority Alert Notification Trigger */}
          <Link
            href="/incidents"
            className="relative p-2 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition shadow-2xs"
            title="View Priority Incident Queue"
          >
            <Bell className="w-4 h-4" />
            {stats.active_alerts > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded bg-rose-600 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse shadow-xs">
                {stats.active_alerts}
              </span>
            )}
          </Link>

          {/* Duty Officer Profile Box */}
          <div className="flex items-center gap-2 pl-2 sm:pl-2.5 border-l border-slate-200">
            <div className="w-8 h-8 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-mono font-bold text-xs shadow-2xs">
              RM
            </div>
            <div className="hidden lg:block text-left font-mono">
              <div className="text-xs font-bold text-slate-900 leading-tight">CMDR. R. MENON</div>
              <div className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider">
                CIVIC COMMAND // #MC-904
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
