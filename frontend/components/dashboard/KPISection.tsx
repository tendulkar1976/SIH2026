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
  ShieldCheck,
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
      colorScheme: 'mint' as const,
      isAlert: false,
    },
    {
      id: 'potholes',
      title: 'Road Potholes',
      value: stats.potholes,
      description: 'Surface craters & damage',
      icon: Construction,
      trend: '+14% vs yesterday',
      colorScheme: 'amber' as const,
      isAlert: false,
    },
    {
      id: 'crossings',
      title: 'Missing Crossings',
      value: stats.missing_crossings,
      description: 'Eroded pedestrian lanes',
      icon: Footprints,
      trend: '3 critical zones',
      colorScheme: 'emerald' as const,
      isAlert: false,
    },
    {
      id: 'rash_driving',
      title: 'Rash Driving',
      value: stats.rash_driving,
      description: 'Speed & hazardous shifts',
      icon: AlertTriangle,
      trend: 'High surveillance',
      colorScheme: 'rose' as const,
      isAlert: stats.rash_driving > 0,
    },
    {
      id: 'vehicles',
      value: stats.vehicles + 3280,
      title: 'Vehicles Tracked',
      description: 'Vision telemetry stream',
      icon: Car,
      trend: '+2.4k/hr pace',
      colorScheme: 'emerald' as const,
      isAlert: false,
    },
    {
      id: 'alerts',
      title: 'Active Alerts',
      value: stats.active_alerts,
      description: 'Requires officer dispatch',
      icon: Bell,
      trend: 'Immediate action',
      colorScheme: 'rose' as const,
      isAlert: stats.active_alerts > 0,
    },
  ];

  const getColorClasses = (scheme: 'mint' | 'emerald' | 'amber' | 'rose') => {
    switch (scheme) {
      case 'amber':
        return {
          border: 'border-amber-500/30 hover:border-amber-500/60',
          iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          textGlow: 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        };
      case 'rose':
        return {
          border: 'border-rose-500/30 hover:border-rose-500/60',
          iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          textGlow: 'text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        };
      case 'emerald':
        return {
          border: 'border-odyssey-vibrant/30 hover:border-odyssey-vibrant/60',
          iconBg: 'bg-odyssey-primary/40 text-odyssey-vibrant border-odyssey-vibrant/30',
          textGlow: 'text-odyssey-vibrant drop-shadow-[0_0_10px_rgba(62,187,158,0.3)]',
          badge: 'bg-odyssey-vibrant/10 text-odyssey-vibrant border-odyssey-vibrant/20',
        };
      case 'mint':
      default:
        return {
          border: 'border-odyssey-mint/30 hover:border-odyssey-mint/60',
          iconBg: 'bg-odyssey-mint/15 text-odyssey-mint border-odyssey-mint/30',
          textGlow: 'text-odyssey-mint drop-shadow-[0_0_10px_rgba(115,230,203,0.3)]',
          badge: 'bg-odyssey-mint/10 text-odyssey-mint border-odyssey-mint/20',
        };
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-odyssey-mint" />
          <span>Real-Time Municipal Key Performance Indicators</span>
        </h2>
        <span className="text-[11px] font-mono text-odyssey-mint flex items-center gap-1.5 bg-odyssey-primary/30 px-2 py-0.5 rounded-full border border-odyssey-vibrant/30">
          <span className="w-1.5 h-1.5 rounded-full bg-odyssey-mint animate-pulse" />
          Live Sensor Grid Telemetry
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const styles = getColorClasses(kpi.colorScheme);

          return (
            <div
              key={kpi.id}
              className={`glass-panel p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between ${styles.border}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold truncate">
                    {kpi.title}
                  </span>
                  <div className={`p-2 rounded-xl border shrink-0 ${styles.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className={`text-2xl lg:text-3xl font-extrabold font-mono tracking-tight ${styles.textGlow}`}>
                  {kpi.value.toLocaleString()}
                </div>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {kpi.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 ${styles.badge}`}>
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
