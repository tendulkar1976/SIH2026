'use client';

import React, { useState } from 'react';
import { mockCorridorHealth, mockRoadDefects } from '@/data/mockRoadIntelligence';
import { RoadDefectRecord, RepairStatus } from '@/types';
import {
  Construction,
  AlertTriangle,
  Droplets,
  Layers,
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

export default function RoadIntelligencePage() {
  const [defects, setDefects] = useState<RoadDefectRecord[]>(mockRoadDefects);
  const [selectedStatus, setSelectedStatus] = useState<'all' | RepairStatus>('all');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const totalDefects = defects.length;
  const potholesCount = defects.filter((d) => d.defect_type === 'pothole').length;
  const waterloggingCount = defects.filter((d) => d.defect_type === 'waterlogging').length;
  const dividerCount = defects.filter((d) => d.defect_type === 'damaged_divider').length;
  const backlogCount = defects.filter((d) => d.repair_status === 'backlog').length;
  const inProgressCount = defects.filter((d) => d.repair_status === 'in_progress').length;

  const avgRci = Math.round(
    mockCorridorHealth.reduce((acc, c) => acc + c.road_condition_index, 0) / mockCorridorHealth.length
  );

  const handleUpdateStatus = (id: string, newStatus: RepairStatus) => {
    setDefects((prev) =>
      prev.map((d) => (d.id === id ? { ...d, repair_status: newStatus } : d))
    );
    setNotification(`Work order for defect ${id} updated to ${newStatus.toUpperCase()}`);
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredDefects = defects.filter((d) => {
    if (selectedStatus !== 'all' && d.repair_status !== selectedStatus) return false;
    if (selectedCorridor !== 'all' && d.corridor_id !== selectedCorridor) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = d.id.toLowerCase().includes(q);
      const matchLandmark = d.location_landmark.toLowerCase().includes(q);
      const matchCorridor = d.corridor_name.toLowerCase().includes(q);
      const matchWO = d.work_order_id.toLowerCase().includes(q);
      return matchId || matchLandmark || matchCorridor || matchWO;
    }
    return true;
  });

  const getDefectBadge = (type: RoadDefectRecord['defect_type']) => {
    switch (type) {
      case 'pothole':
        return <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-mono text-[10px] font-bold">Pothole</span>;
      case 'waterlogging':
        return <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-900 border border-sky-200 font-mono text-[10px] font-bold">Waterlogging</span>;
      case 'damaged_divider':
        return <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-900 border border-orange-200 font-mono text-[10px] font-bold">Damaged Divider</span>;
      case 'missing_crossing':
        return <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200 font-mono text-[10px] font-bold">Missing Crossing</span>;
      case 'road_cracking':
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[10px] font-bold">Road Cracking</span>;
    }
  };

  const getStatusBadge = (status: RepairStatus) => {
    switch (status) {
      case 'backlog':
        return <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold">Backlog (Urgent)</span>;
      case 'scheduled':
        return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono font-bold">Scheduled</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">In Progress</span>;
      case 'repaired':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">Repaired</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Construction className="w-5 h-5 text-amber-600" />
            <span>Road & Infrastructure Intelligence Center</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated civil road distress tracking, PWD repair prioritization queue, and corridor health index.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-sm">
            CITY ROAD INDEX: <strong className="text-indigo-600">{avgRci} / 100</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-rose-700 shadow-sm">
            PWD BACKLOG: <strong>{backlogCount} DEFECTS</strong>
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-clean space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>ROAD CONDITION INDEX</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{avgRci} <span className="text-xs text-slate-400 font-normal">/ 100</span></div>
          <p className="text-[11px] text-slate-500">Aggregated across 6 key transit corridors</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-clean space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>DETECTED POTHOLES</span>
            <Construction className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">{potholesCount} Active</div>
          <p className="text-[11px] text-slate-500">Surface area & depth estimated</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-clean space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>WATERLOGGING ZONES</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-600">{waterloggingCount} Spots</div>
          <p className="text-[11px] text-slate-500">Drainage obstruction telemetry</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-clean space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>REPAIRS IN PROGRESS</span>
            <Wrench className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600">{inProgressCount} Work Orders</div>
          <p className="text-[11px] text-slate-500">Active municipal field teams</p>
        </div>
      </div>

      {/* Corridor Health Status Cards */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-clean space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Transit Corridor Road Condition Index (RCI)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Updated from live bus optical passes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCorridorHealth.map((corridor) => {
            const isCritical = corridor.status === 'critical';
            const isDegraded = corridor.status === 'degraded';

            return (
              <div
                key={corridor.corridor_id}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical
                    ? 'border-rose-200 bg-rose-50/40'
                    : isDegraded
                    ? 'border-amber-200 bg-amber-50/30'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                    {corridor.corridor_id}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800'
                        : isDegraded
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {corridor.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-tight mb-2">
                  {corridor.name}
                </h4>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/60 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Road Health Score:</span>
                    <strong className="text-slate-900">{corridor.road_condition_index} / 100</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Defect Density:</span>
                    <strong className={isCritical ? 'text-rose-700' : 'text-slate-900'}>
                      {corridor.total_defects_per_km} defects/km
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Potholes / Waterlog:</span>
                    <span>{corridor.pothole_count} / {corridor.waterlogging_spots}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PWD Road Defect Maintenance Prioritization Queue */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-clean overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-indigo-600" />
              <span>PWD Road Maintenance Prioritization Queue</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Automated scoring based on surface area, depth estimate, and daily bus commuter volume.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none"
            >
              <option value="all">All Repair Statuses</option>
              <option value="backlog">Backlog (Urgent)</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="repaired">Repaired</option>
            </select>

            {/* Corridor Filter */}
            <select
              value={selectedCorridor}
              onChange={(e) => setSelectedCorridor(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none"
            >
              <option value="all">All Corridors</option>
              <option value="R-05">R-05 Electronic City</option>
              <option value="R-12">R-12 Koramangala</option>
              <option value="R-18">R-18 Whitefield</option>
              <option value="R-24">R-24 Silk Board</option>
              <option value="R-09">R-09 Hebbal</option>
              <option value="R-33">R-33 Outer Ring</option>
            </select>
          </div>
        </div>

        {/* Defects Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3">Defect ID</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Location & Landmark</th>
                <th className="py-3 px-3">Dimensions / Severity</th>
                <th className="py-3 px-3">Priority Score</th>
                <th className="py-3 px-3">Work Order / Contractor</th>
                <th className="py-3 px-3">Repair Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDefects.map((defect) => (
                <tr key={defect.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    <span className="text-indigo-600">{defect.id}</span>
                    <span className="block text-[10px] text-slate-400 font-normal">{defect.detecting_bus_id}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getDefectBadge(defect.defect_type)}
                  </td>
                  <td className="py-3 px-3 max-w-[220px]">
                    <div className="font-semibold text-slate-800 text-[11px] truncate">
                      {defect.location_landmark}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>{defect.corridor_name} ({defect.corridor_id})</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                    <div>Area: <strong>{defect.estimated_area_sqm} m²</strong></div>
                    {defect.estimated_depth_cm && (
                      <div className="text-rose-700 font-semibold">Depth: <strong>{defect.estimated_depth_cm} cm</strong></div>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${defect.priority_score > 80 ? 'text-rose-700' : 'text-amber-700'}`}>
                        {defect.priority_score}
                      </span>
                      <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full ${defect.priority_score > 80 ? 'bg-rose-600' : 'bg-amber-500'}`}
                          style={{ width: `${defect.priority_score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <span className="font-bold text-indigo-900">{defect.work_order_id}</span>
                    <span className="block text-[10px] text-slate-500 truncate max-w-[140px]">
                      {defect.assigned_contractor}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getStatusBadge(defect.repair_status)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      value={defect.repair_status}
                      onChange={(e) => handleUpdateStatus(defect.id, e.target.value as RepairStatus)}
                      className="px-2 py-1 rounded bg-white border border-slate-200 text-[11px] font-mono font-semibold text-slate-700 focus:outline-none shadow-xs"
                    >
                      <option value="backlog">Set Backlog</option>
                      <option value="scheduled">Set Scheduled</option>
                      <option value="in_progress">Set In Progress</option>
                      <option value="repaired">Set Repaired</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
