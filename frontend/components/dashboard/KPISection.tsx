'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import {
  Layers,
  Construction,
  Footprints,
  AlertTriangle,
  Car,
  Bell,
  TrendingUp,
  Activity,
} from 'lucide-react';

export const KPISection: React.FC = () => {
  const { stats } = useUrbanStore();

  const kpis = [
    {
      id: 'total',
      title: 'Total Incidents',
      value: stats.total_incidents,
      description: 'Citywide anomalies logged',
      icon: Layers,
      trend: '+8.4% today',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      isAlert: false,
    },
    {
      id: 'potholes',
      title: 'Road Potholes',
      value: stats.potholes,
      description: 'Surface craters & damage',
      icon: Construction,
      trend: '+14% vs yesterday',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      isAlert: false,
    },
    {
      id: 'crossings',
      title: 'Missing Crossings',
      value: stats.missing_crossings,
      description: 'Eroded pedestrian lanes',
      icon: Footprints,
      trend: '3 critical zones',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      isAlert: false,
    },
    {
      id: 'rash_driving',
      title: 'Rash Driving',
      value: stats.rash_driving,
      description: 'Speed & hazardous shifts',
      icon: AlertTriangle,
      trend: 'High surveillance',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      isAlert: stats.rash_driving > 0,
    },
    {
      id: 'vehicles',
      title: 'Vehicles Tracked',
      value: stats.vehicles + 3280,
      description: 'Vision telemetry stream',
      icon: Car,
      trend: '+2.4k/hr pace',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      isAlert: false,
    },
    {
      id: 'alerts',
      title: 'Active Alerts',
      value: stats.active_alerts,
      description: 'Requires officer dispatch',
      icon: Bell,
      trend: 'Immediate action',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      isAlert: stats.active_alerts > 0,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-indigo-600" />
          <span>Real-Time Municipal Key Performance Indicators</span>
        </h2>
        <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Telemetry Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <div
              key={kpi.id}
              className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold truncate">
                    {kpi.title}
                  </span>
                  <div className={`p-1.5 rounded-lg border shrink-0 ${kpi.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-2xl font-black text-slate-900 font-sans tracking-tight">
                  {kpi.value.toLocaleString()}
                </div>

                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {kpi.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 font-semibold ${kpi.badgeBg}`}>
                  <TrendingUp className="w-2.5 h-2.5" />
                  {kpi.trend}
                </span>

                {kpi.isAlert && kpi.value > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
