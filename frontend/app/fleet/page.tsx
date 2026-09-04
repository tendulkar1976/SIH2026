'use client';

import React, { useState } from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { FleetCard } from '@/components/fleet/FleetCard';
import { BusDetailModal } from '@/components/fleet/BusDetailModal';
import { BusTelemetry, BusStatus } from '@/types';
import {
  Bus,
  Search,
} from 'lucide-react';

export default function FleetPage() {
  const { buses } = useUrbanStore();
  const [selectedBusForModal, setSelectedBusForModal] = useState<BusTelemetry | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | BusStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const totalBuses = buses.length;
  const onlineBuses = buses.filter((b) => b.status === 'ONLINE' || (b.is_online && b.status !== 'WARNING')).length;
  const warningBuses = buses.filter((b) => b.status === 'WARNING').length;
  const offlineBuses = buses.filter((b) => b.status === 'OFFLINE' || !b.is_online).length;
  const totalIncidentsToday = buses.reduce((acc, b) => acc + b.incidents_today, 0);

  const filteredBuses = buses.filter((b) => {
    // Status filter
    if (statusFilter !== 'ALL') {
      const bStatus = b.status || (b.is_online ? 'ONLINE' : 'OFFLINE');
      if (bStatus !== statusFilter) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = b.bus_id.toLowerCase().includes(q);
      const matchRoute = b.route_id.toLowerCase().includes(q);
      const matchDriver = b.driver_name.toLowerCase().includes(q);
      const matchLoc = (b.location_name || '').toLowerCase().includes(q);
      return matchId || matchRoute || matchDriver || matchLoc;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Fleet Overview Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bus className="w-5 h-5 text-pewter-blue" />
            <span>Transit Fleet & Edge Vision Nodes</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Live telemetry, GPS coordinates, optical sensor health, and anomaly telemetry of camera-equipped buses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm">
            TOTAL FLEET: <strong className="text-slate-900">{totalBuses} NODES</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-emerald-700 shadow-sm">
            ONLINE: <strong>{onlineBuses}</strong>
          </span>
          {warningBuses > 0 && (
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-amber-700 shadow-sm">
              WARNING: <strong>{warningBuses}</strong>
            </span>
          )}
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-pewter-blue shadow-sm">
            DETECTIONS TODAY: <strong>{totalIncidentsToday}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-clean-card">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL' as const, label: 'All Fleet', count: totalBuses, color: 'text-slate-900' },
            { id: 'ONLINE' as const, label: 'Online', count: onlineBuses, color: 'text-emerald-700' },
            { id: 'WARNING' as const, label: 'Warning', count: warningBuses, color: 'text-amber-700' },
            { id: 'OFFLINE' as const, label: 'Offline', count: offlineBuses, color: 'text-rose-700' },
          ].map((tab) => {
            const isSel = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(isSel && tab.id !== 'ALL' ? 'ALL' : tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 shrink-0 ${
                  isSel
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={isSel && tab.id !== 'ALL' ? 'Click to deselect filter' : tab.label}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono ${
                    isSel ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Fleet Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bus, route, driver..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-pewter-blue focus:ring-1 focus:ring-pewter-blue transition"
          />
        </div>
      </div>

      {/* Fleet Cards Grid */}
      {filteredBuses.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3 shadow-clean-card">
          <Bus className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Fleet Nodes Matched</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different status filter above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuses.map((bus) => (
            <FleetCard
              key={bus.bus_id}
              bus={bus}
              onSelect={(b) => setSelectedBusForModal(b)}
            />
          ))}
        </div>
      )}

      {/* Bus Details Interactive Modal */}
      <BusDetailModal
        bus={selectedBusForModal}
        onClose={() => setSelectedBusForModal(null)}
      />
    </div>
  );
}
