'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const QuickAlertFeed: React.FC = () => {
  const { alerts } = useUrbanStore();
  const topAlerts = alerts.filter((a) => a.status === 'new').slice(0, 3);

  if (topAlerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {topAlerts.map((alert) => (
        <div
          key={alert.id}
          className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-800 font-mono tracking-wide truncate">
                  {alert.title}
                </span>
                {alert.license_plate && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold">
                    {alert.license_plate}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 truncate">{alert.message}</p>
            </div>
          </div>

          <Link
            href={`/incidents/${alert.incident_id}`}
            className="px-2.5 py-1 rounded-lg bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 transition text-[11px] font-mono font-semibold flex items-center gap-1 shrink-0 shadow-xs"
          >
            <span>Review</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      ))}
    </div>
  );
};

