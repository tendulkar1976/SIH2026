'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import Link from 'next/link';
import {
  AlertTriangle,
  Clock,
  ChevronRight,
  ShieldAlert,
  Construction,
  ExternalLink,
  Radio,
  CheckCircle,
} from 'lucide-react';

export const CriticalAlertsSection: React.FC = () => {
  const { alerts, stats, resolveAlert } = useUrbanStore();

  const criticalAlerts = alerts
    .filter((a) => a.severity === 'critical' || a.severity === 'high')
    .slice(0, 3);

  if (criticalAlerts.length === 0) return null;

  const getAlertIcon = (title: string) => {
    if (title.includes('RASH') || title.includes('HIT')) {
      return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    }
    if (title.includes('POTHOLE')) {
      return <Construction className="w-4 h-4 text-amber-600" />;
    }
    if (title.includes('ANPR')) {
      return <ShieldAlert className="w-4 h-4 text-brand-600" />;
    }
    return <AlertTriangle className="w-4 h-4 text-rose-600" />;
  };

  return (
    <div className="p-5 rounded-2xl border border-rose-200/80 bg-rose-50/30 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-rose-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide">
                Critical Priority Alerts
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold">
                {criticalAlerts.length} URGENT
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              High-severity computer vision detections requiring immediate dispatch
            </p>
          </div>
        </div>

        <Link
          href="/incidents"
          className="text-xs font-mono font-medium text-rose-700 hover:text-rose-800 flex items-center gap-1 transition"
        >
          <span>View All Incidents ({stats.total_incidents})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Alert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {criticalAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 rounded-xl bg-white border border-rose-200 hover:border-rose-300 transition flex flex-col justify-between space-y-3 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-rose-700 flex items-center gap-1.5 truncate">
                  {getAlertIcon(alert.title)}
                  <span className="truncate">{alert.title}</span>
                </span>
                <SeverityBadge severity={alert.severity} size="sm" />
              </div>

              <p className="text-xs text-slate-800 font-medium leading-snug line-clamp-2">
                {alert.message}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-600">
                <div className="flex items-center gap-1 truncate">
                  <Radio className="w-3 h-3 text-brand-500 shrink-0" />
                  <span className="font-semibold text-slate-700">{alert.bus_id}</span>
                </div>
                <div className="flex items-center gap-1 truncate text-right justify-end">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {alert.license_plate && (
                  <div className="col-span-2">
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                      Plate: {alert.license_plate}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition text-[10px] font-mono font-semibold flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Resolve
                </button>

                <Link
                  href={`/incidents/${alert.incident_id}`}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition text-[10px] font-mono font-semibold flex items-center gap-1"
                >
                  <span>Dossier</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

