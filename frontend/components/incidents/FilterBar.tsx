'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { Search, RotateCcw, Calendar, X } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filter, setFilter, resetFilters, buses } = useUrbanStore();

  const routes = Array.from(new Set(buses.map((b) => b.route_id))).sort();

  const hasActiveFilters =
    filter.type !== 'all' ||
    filter.severity !== 'all' ||
    filter.status !== 'all' ||
    filter.route !== 'all' ||
    filter.dateRange !== 'all' ||
    filter.search.trim() !== '';

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-clean space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Search Bar - Multi-field search */}
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ID, Location, Plate, Vehicle, Bus..."
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-pewter-blue focus:bg-white transition font-mono"
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
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-pewter-blue focus:bg-white font-mono"
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
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-pewter-blue focus:bg-white font-mono"
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
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-pewter-blue focus:bg-white font-mono"
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
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-pewter-blue focus:bg-white font-mono"
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
            <Calendar className="w-3.5 h-3.5 text-pewter-darkBlue" />
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
                    ? 'bg-white text-slate-900 font-bold border border-slate-200 shadow-clean-sm'
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
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition flex items-center gap-1.5 text-xs font-mono shadow-clean-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pewter-darkBlue" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
