'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { Search, RotateCcw, Calendar, X, AlertTriangle, Construction, Car, ShieldAlert } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filter, setFilter, resetFilters, buses, stats } = useUrbanStore();

  const routes = Array.from(new Set(buses.map((b) => b.route_id))).sort();

  const hasActiveFilters =
    filter.type !== 'all' ||
    filter.severity !== 'all' ||
    filter.status !== 'all' ||
    filter.route !== 'all' ||
    filter.dateRange !== 'all' ||
    filter.search.trim() !== '';

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-clean-card space-y-3">
      {/* Quick Filter Presets Row */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
        <span className="text-[11px] font-mono text-slate-500 font-semibold mr-1">QUICK QUEUE:</span>
        <button
          onClick={() => setFilter({ severity: 'all', type: 'all' })}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            filter.severity === 'all' && filter.type === 'all'
              ? 'bg-indigo-600 text-white shadow-xs font-semibold'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All ({stats.total_incidents})
        </button>

        <button
          onClick={() => setFilter({ severity: 'critical', type: 'all' })}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
            filter.severity === 'critical'
              ? 'bg-rose-600 text-white shadow-xs font-semibold'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Critical Queue ({stats.active_alerts})</span>
        </button>

        <button
          onClick={() => setFilter({ type: 'pothole', severity: 'all' })}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
            filter.type === 'pothole'
              ? 'bg-amber-600 text-white shadow-xs font-semibold'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <Construction className="w-3.5 h-3.5" />
          <span>Road Potholes ({stats.potholes})</span>
        </button>

        <button
          onClick={() => setFilter({ type: 'rash_driving', severity: 'all' })}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
            filter.type === 'rash_driving'
              ? 'bg-rose-600 text-white shadow-xs font-semibold'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Car className="w-3.5 h-3.5 text-rose-600" />
          <span>Rash Driving ({stats.rash_driving})</span>
        </button>

        <button
          onClick={() => setFilter({ type: 'anpr', severity: 'all' })}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
            filter.type === 'anpr'
              ? 'bg-purple-600 text-white shadow-xs font-semibold'
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>ANPR Flags ({stats.anpr_events})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Search Bar - Multi-field search */}
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ID, Location, Plate, Vehicle, Bus..."
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition font-mono"
          />
          {filter.search && (
            <button
              onClick={() => setFilter({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Incident Type Filter */}
        <div>
          <select
            value={filter.type}
            onChange={(e) => setFilter({ type: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white font-mono"
          >
            <option value="all">All Incident Types</option>
            <option value="pothole">Road Pothole</option>
            <option value="rash_driving">Rash Driving</option>
            <option value="missing_crossing">Missing Crossing</option>
            <option value="anpr">ANPR Violation</option>
            <option value="pedestrian">Pedestrian Hazard</option>
            <option value="vehicle">Vehicle Obstruction</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <select
            value={filter.severity}
            onChange={(e) => setFilter({ severity: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white font-mono"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ status: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white font-mono"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        {/* Route Filter */}
        <div>
          <select
            value={filter.route}
            onChange={(e) => setFilter({ route: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white font-mono"
          >
            <option value="all">All Transit Routes</option>
            {routes.map((r) => (
              <option key={r} value={r}>
                Route {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Second Row: Date Filter & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            Date Range:
          </span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: '7d', label: 'Past 7 Days' },
              { id: '30d', label: 'Past 30 Days' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setFilter({ dateRange: d.id })}
                className={`px-2.5 py-1 rounded transition text-[11px] ${
                  filter.dateRange === d.id
                    ? 'bg-white text-indigo-700 font-bold border border-slate-200 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition flex items-center gap-1.5 text-xs font-mono shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

