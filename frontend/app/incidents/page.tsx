'use client';

import React from 'react';
import { IncidentTable } from '@/components/incidents/IncidentTable';
import { FilterBar } from '@/components/incidents/FilterBar';
import { EventSimulatorControls } from '@/components/common/EventSimulatorControls';
import { useUrbanStore } from '@/store/useUrbanStore';
import { AlertOctagon } from 'lucide-react';

export default function IncidentsPage() {
  const { stats } = useUrbanStore();

  return (
    <div className="space-y-6">
      <EventSimulatorControls />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-pewter-blue" />
            <span>Urban Incident Registry</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated computer-vision detection log across municipal bus sensor telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm">
            TOTAL: <strong className="text-slate-900">{stats.total_incidents}</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-rose-700 shadow-sm">
            ACTIVE ALERTS: <strong>{stats.active_alerts}</strong>
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <FilterBar />

      {/* Full Incident Table */}
      <IncidentTable />
    </div>
  );
}
