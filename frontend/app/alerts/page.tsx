'use client';

import React, { useState } from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { AlertCard } from '@/components/alerts/AlertCard';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Search,
  X,
} from 'lucide-react';

export default function AlertsPage() {
  const { alerts, stats } = useUrbanStore();
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const highCount = alerts.filter((a) => a.severity === 'high').length;
  const mediumCount = alerts.filter((a) => a.severity === 'medium').length;
  const lowCount = alerts.filter((a) => a.severity === 'low').length;

  const filteredAlerts = alerts.filter((alert) => {
    // Priority filter
    if (priorityFilter !== 'all' && alert.severity !== priorityFilter) return false;

    // Status filter
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = alert.title.toLowerCase().includes(q);
      const matchMsg = alert.message.toLowerCase().includes(q);
      const matchPlate = alert.license_plate?.toLowerCase().includes(q) || false;
      const matchVehicle = alert.vehicle_id?.toLowerCase().includes(q) || false;
      const matchBus = alert.bus_id.toLowerCase().includes(q);
      const matchId = alert.incident_id.toLowerCase().includes(q);

      if (!matchTitle && !matchMsg && !matchPlate && !matchVehicle && !matchBus && !matchId) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-600" />
            <span>Municipal Emergency Alert Queue</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Priority anomaly notifications requiring dispatcher review and active investigation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-rose-700 shadow-sm">
            ACTIVE ALERTS: <strong>{stats.active_alerts}</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm">
            TOTAL LOGGED: <strong className="text-pewter-blue">{alerts.length}</strong>
          </span>
        </div>
      </div>

      {/* Priority Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setPriorityFilter(priorityFilter === 'critical' ? 'all' : 'critical')}
          className={`p-3.5 rounded-xl border text-left transition shadow-clean-card ${
            priorityFilter === 'critical'
              ? 'bg-rose-50 border-rose-300'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-rose-700 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Critical Priority
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-900">{criticalCount}</div>
        </button>

        <button
          onClick={() => setPriorityFilter(priorityFilter === 'high' ? 'all' : 'high')}
          className={`p-3.5 rounded-xl border text-left transition shadow-clean-card ${
            priorityFilter === 'high'
              ? 'bg-amber-50 border-amber-300'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-amber-700 font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              High Priority
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-900">{highCount}</div>
        </button>

        <button
          onClick={() => setPriorityFilter(priorityFilter === 'medium' ? 'all' : 'medium')}
          className={`p-3.5 rounded-xl border text-left transition shadow-clean-card ${
            priorityFilter === 'medium'
              ? 'bg-blue-50 border-blue-300'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-pewter-blue font-semibold flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              Medium Priority
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{mediumCount}</div>
        </button>

        <button
          onClick={() => setPriorityFilter(priorityFilter === 'low' ? 'all' : 'low')}
          className={`p-3.5 rounded-xl border text-left transition shadow-clean-card ${
            priorityFilter === 'low'
              ? 'bg-slate-100 border-slate-300'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              Low Priority
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{lowCount}</div>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-clean-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'new', label: 'New Actionable' },
            { id: 'investigating', label: 'Under Review' },
            { id: 'resolved', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-pewter-blue text-white shadow-sm'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Multi-Field Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incident, license plate, bus ID..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-pewter-blue focus:ring-1 focus:ring-pewter-blue transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Alerts Stream List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3 shadow-clean-card">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No Active Alerts In Queue</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All monitored optical sensor streams are within nominal safety thresholds.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        )}
      </div>
    </div>
  );
}
