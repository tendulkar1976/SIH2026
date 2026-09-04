'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import Link from 'next/link';
import {
  AlertTriangle,
  Construction,
  Car,
  Footprints,
  ShieldAlert,
  ArrowRight,
  Radio,
  Clock,
} from 'lucide-react';
import { IncidentType } from '@/types';

export const RecentIncidents: React.FC = () => {
  const { incidents } = useUrbanStore();
  const recent = incidents.slice(0, 7);

  const getTypeIcon = (type: IncidentType) => {
    switch (type) {
      case 'pothole':
        return <Construction className="w-3.5 h-3.5 text-amber-600" />;
      case 'rash_driving':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case 'missing_crossing':
        return <Footprints className="w-3.5 h-3.5 text-brand-600" />;
      case 'anpr':
        return <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />;
      case 'pedestrian':
        return <Footprints className="w-3.5 h-3.5 text-emerald-600" />;
      case 'vehicle':
      default:
        return <Car className="w-3.5 h-3.5 text-brand-600" />;
    }
  };

  const formatType = (type: IncidentType) => {
    return type.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-900 tracking-wide">Live Detected Incidents</h2>
          </div>
          <Link
            href="/incidents"
            className="text-xs font-mono font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 space-y-1 mt-2">
          {recent.map((inc) => (
            <Link
              key={inc.id}
              href={`/incidents/${inc.id}`}
              className="group flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-slate-50 transition block"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 group-hover:border-slate-300 transition shrink-0">
                  {getTypeIcon(inc.type)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 tracking-tight">
                      {inc.id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                      {formatType(inc.type)}
                    </span>
                    <SeverityBadge severity={inc.severity} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 truncate max-w-xs md:max-w-md mt-0.5">
                    {inc.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-right pl-2">
                <div className="hidden sm:block">
                  <div className="text-[11px] font-mono text-brand-600 font-semibold flex items-center justify-end gap-1">
                    <Radio className="w-3 h-3 text-brand-500" />
                    {inc.bus_id}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-end gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
                <StatusBadge status={inc.status} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

