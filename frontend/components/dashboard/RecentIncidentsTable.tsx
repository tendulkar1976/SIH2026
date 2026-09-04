'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { IncidentType } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Construction,
  Car,
  Footprints,
  ShieldAlert,
  Radio,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export const RecentIncidentsTable: React.FC = () => {
  const { incidents } = useUrbanStore();
  const router = useRouter();
  const recent = incidents.slice(0, 6);

  const getTypeIcon = (type: IncidentType) => {
    switch (type) {
      case 'pothole':
        return <Construction className="w-3.5 h-3.5 text-amber-600" />;
      case 'rash_driving':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case 'missing_crossing':
        return <Footprints className="w-3.5 h-3.5 text-pewter-darkBlue" />;
      case 'anpr':
        return <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />;
      case 'pedestrian':
        return <Footprints className="w-3.5 h-3.5 text-emerald-600" />;
      case 'vehicle':
      default:
        return <Car className="w-3.5 h-3.5 text-pewter-darkBlue" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-clean overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Municipal Incidents</h3>
          </div>
          <Link
            href="/incidents"
            className="text-xs font-mono text-pewter-darkBlue hover:text-pewter-blue flex items-center gap-1 font-semibold transition"
          >
            <span>View All Registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Incident ID</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Severity</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Bus</th>
                <th className="py-3 px-4 font-semibold">Time</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => router.push(`/incidents/${inc.id}`)}
                  className="hover:bg-slate-50/80 transition cursor-pointer group"
                >
                  {/* ID */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 group-hover:text-pewter-darkBlue transition">
                    {inc.id}
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                        {getTypeIcon(inc.type)}
                      </div>
                      <span className="capitalize font-medium text-slate-800">
                        {inc.type.replace('_', ' ')}
                      </span>
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="py-3 px-4">
                    <SeverityBadge severity={inc.severity} size="sm" />
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px] max-w-[180px] truncate">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">Route {inc.route_id} Corridor</span>
                    </div>
                  </td>

                  {/* Bus */}
                  <td className="py-3 px-4 font-mono text-pewter-darkBlue font-semibold text-[11px]">
                    <div className="flex items-center gap-1">
                      <Radio className="w-3 h-3 text-pewter-blue" />
                      <span>{inc.bus_id}</span>
                    </div>
                  </td>

                  {/* Time */}
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {new Date(inc.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={inc.status} size="sm" />
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 group-hover:text-slate-900 group-hover:border-slate-300 text-[11px] font-mono shadow-clean-sm transition">
                      <span>Dossier</span>
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-pewter-darkBlue" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
