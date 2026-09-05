'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { IncidentType, DepartmentType } from '@/types';
import Link from 'next/link';
import {
  ExternalLink,
  Radio,
  MapPin,
  Car,
  ChevronRight,
  Search,
  Construction,
  AlertTriangle,
  Footprints,
  ShieldAlert,
  Droplets,
  Bus,
  Trash2,
  Building2,
  ShieldX,
} from 'lucide-react';

export const IncidentTable: React.FC = () => {
  const { incidents, filter } = useUrbanStore();

  const now = new Date().getTime();

  const filteredIncidents = incidents.filter((inc) => {
    // 1. Incident Type
    if (filter.type !== 'all' && inc.type !== filter.type) return false;

    // 2. Department
    if (filter.department !== 'all' && inc.assigned_department !== filter.department) return false;

    // 3. Severity
    if (filter.severity !== 'all' && inc.severity !== filter.severity) return false;

    // 4. Status
    if (filter.status !== 'all' && inc.status !== filter.status) return false;

    // 5. Route
    if (filter.route !== 'all' && inc.route_id !== filter.route) return false;

    // 6. Date Range
    if (filter.dateRange !== 'all') {
      const incTime = new Date(inc.timestamp).getTime();
      const diffHours = (now - incTime) / (1000 * 60 * 60);
      if (filter.dateRange === 'today' && diffHours > 24) return false;
      if (filter.dateRange === '7d' && diffHours > 24 * 7) return false;
      if (filter.dateRange === '30d' && diffHours > 24 * 30) return false;
    }

    // 7. Search across ID, Location, Vehicle ID, License Plate, Bus ID, Work Order ID
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      const matchId = inc.id.toLowerCase().includes(q);
      const matchDesc = inc.description.toLowerCase().includes(q);
      const matchPlate = inc.license_plate?.toLowerCase().includes(q) || false;
      const matchVehicle = inc.vehicle_id?.toLowerCase().includes(q) || false;
      const matchBus = inc.bus_id.toLowerCase().includes(q);
      const matchRoute = inc.route_id.toLowerCase().includes(q);
      const matchWO = inc.work_order_id?.toLowerCase().includes(q) || false;

      if (!matchId && !matchDesc && !matchPlate && !matchVehicle && !matchBus && !matchRoute && !matchWO) {
        return false;
      }
    }

    return true;
  });

  const getTypeIcon = (type: IncidentType) => {
    switch (type) {
      case 'pothole':
        return <Construction className="w-3.5 h-3.5 text-amber-600" />;
      case 'damaged_divider':
        return <Construction className="w-3.5 h-3.5 text-orange-600" />;
      case 'missing_signboard':
        return <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />;
      case 'waterlogging':
        return <Droplets className="w-3.5 h-3.5 text-sky-600" />;
      case 'open_drain_garbage':
        return <Trash2 className="w-3.5 h-3.5 text-emerald-700" />;
      case 'footpath_encroachment':
        return <Footprints className="w-3.5 h-3.5 text-amber-700" />;
      case 'missing_crossing':
        return <Footprints className="w-3.5 h-3.5 text-indigo-600" />;
      case 'rash_driving':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case 'wrong_way':
        return <ShieldX className="w-3.5 h-3.5 text-rose-700" />;
      case 'bus_footboard':
        return <Bus className="w-3.5 h-3.5 text-violet-600" />;
      case 'red_light_violation':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case 'illegal_parking':
        return <Car className="w-3.5 h-3.5 text-slate-600" />;
      case 'anpr':
        return <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />;
      case 'hit_and_run':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />;
      case 'pedestrian':
        return <Footprints className="w-3.5 h-3.5 text-emerald-600" />;
      case 'vehicle':
      default:
        return <Car className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  const getDepartmentBadge = (dept?: DepartmentType) => {
    switch (dept) {
      case 'pwd_roads':
        return <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-semibold">PWD Roads</span>;
      case 'traffic_police':
        return <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-mono font-semibold">Traffic Police</span>;
      case 'transit_auth':
        return <span className="px-2 py-0.5 rounded bg-violet-50 text-violet-800 border border-violet-200 text-[10px] font-mono font-semibold">Transit Auth</span>;
      case 'municipal_corp':
        return <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-semibold">Municipal Corp</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-mono">Civic Admin</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-clean overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="text-xs font-mono text-slate-500 font-medium">
          SHOWING <strong className="text-slate-900">{filteredIncidents.length}</strong> OF{' '}
          <strong className="text-slate-900">{incidents.length}</strong> TOTAL INCIDENTS
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-3 font-semibold">Incident ID</th>
              <th className="py-3.5 px-3 font-semibold">Type</th>
              <th className="py-3.5 px-3 font-semibold">Department</th>
              <th className="py-3.5 px-3 font-semibold">Severity</th>
              <th className="py-3.5 px-3 font-semibold">Timestamp</th>
              <th className="py-3.5 px-3 font-semibold">Location</th>
              <th className="py-3.5 px-3 font-semibold">Bus / Route</th>
              <th className="py-3.5 px-3 font-semibold">Plate / Vehicle</th>
              <th className="py-3.5 px-3 font-semibold">AI Confidence</th>
              <th className="py-3.5 px-3 font-semibold">Status</th>
              <th className="py-3.5 px-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-16 text-slate-400 font-mono">
                  <div className="max-w-sm mx-auto space-y-2">
                    <Search className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">No matching incidents found</p>
                    <p className="text-xs text-slate-400">
                      Try adjusting your search terms or clearing the selected department / category filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredIncidents.map((inc) => (
                <tr
                  key={inc.id}
                  className="hover:bg-slate-50/80 transition group"
                >
                  {/* ID */}
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    <Link
                      href={`/incidents/${inc.id}`}
                      className="hover:text-indigo-600 flex items-center gap-1 transition"
                    >
                      <span>{inc.id}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition" />
                    </Link>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded-md bg-slate-50 border border-slate-200 shrink-0">
                        {getTypeIcon(inc.type)}
                      </div>
                      <span className="capitalize font-medium text-slate-800 truncate">
                        {inc.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {getDepartmentBadge(inc.assigned_department)}
                  </td>

                  {/* Severity */}
                  <td className="py-3.5 px-3">
                    <SeverityBadge severity={inc.severity} size="sm" />
                  </td>

                  {/* Timestamp */}
                  <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {new Date(inc.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600 max-w-[180px] truncate">
                    <div className="flex items-center gap-1.5 truncate" title={`${inc.location_name || `Route ${inc.route_id}`} • GPS: ${inc.latitude.toFixed(4)}, ${inc.longitude.toFixed(4)}`}>
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate font-medium text-slate-700">{inc.location_name || `Route ${inc.route_id} Corridor`}</span>
                    </div>
                  </td>

                  {/* Bus & Route */}
                  <td className="py-3.5 px-3 font-mono text-slate-800 text-[11px] whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Radio className="w-3 h-3 text-indigo-600" />
                      <span className="font-semibold text-indigo-900">{inc.bus_id}</span>
                      <span className="text-slate-400">·</span>
                      <span>R-{inc.route_id}</span>
                    </div>
                  </td>

                  {/* Plate / Vehicle */}
                  <td className="py-3.5 px-3 font-mono">
                    {inc.license_plate ? (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold whitespace-nowrap">
                        {inc.license_plate}
                      </span>
                    ) : inc.vehicle_id ? (
                      <span className="text-slate-700 font-semibold text-[11px]">{inc.vehicle_id}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Confidence */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-10 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200 shrink-0">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${inc.confidence * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-indigo-950 font-semibold">
                        {(inc.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <StatusBadge status={inc.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href={`/incidents/${inc.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-clean-sm transition text-[11px] font-mono"
                    >
                      <span>Dossier</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
