'use client';

import React, { useState } from 'react';
import {
  mockBottlenecks,
  mockCorridorCongestion,
  mockODMatrix,
} from '@/data/mockTrafficData';
import { CongestionLevel } from '@/types';
import {
  Car,
  Activity,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Clock,
  MapPin,
  Flame,
  BarChart3,
  Layers,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';

export default function TrafficIntelligencePage() {
  const [selectedCorridor, setSelectedCorridor] = useState<string>('R-18');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'all' | CongestionLevel>('all');

  const activeCorridorData =
    mockCorridorCongestion.find((c) => c.corridor_id === selectedCorridor) ||
    mockCorridorCongestion[0];

  const totalBottlenecks = mockBottlenecks.length;
  const severeBottlenecks = mockBottlenecks.filter(
    (b) => b.congestion_level === 'severe' || b.congestion_level === 'gridlock'
  ).length;

  const filteredBottlenecks = mockBottlenecks.filter((b) => {
    if (selectedLevelFilter !== 'all' && b.congestion_level !== selectedLevelFilter) return false;
    return true;
  });

  const getCongestionBadge = (level: CongestionLevel) => {
    switch (level) {
      case 'gridlock':
        return <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-mono text-[10px] font-bold">GRIDLOCK (&lt;10 km/h)</span>;
      case 'severe':
        return <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[10px] font-bold">SEVERE</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[10px] font-bold">MODERATE</span>;
      case 'low':
      default:
        return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">OPTIMAL</span>;
    }
  };

  const customTooltipStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    color: '#0f172a',
    fontSize: '12px',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Car className="w-5 h-5 text-indigo-600" />
            <span>Traffic Intelligence & OD Congestion Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fleet-derived vehicular speed profiles, bottleneck queue detection, and Origin-Destination passenger flows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-sm">
            MONITORED CORRIDORS: <strong>4 ACTIVE</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-rose-700 shadow-sm">
            ACTIVE BOTTLENECKS: <strong>{severeBottlenecks} CRITICAL</strong>
          </span>
        </div>
      </div>

      {/* Corridor Speed & Congestion Benchmark Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Hourly Speed Profile vs Benchmark Limit */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200/90 shadow-clean space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>Corridor Speed Profile vs Speed Limit (km/h)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Real-time transit speed vs nominal free-flow traffic design speed.
              </p>
            </div>

            {/* Corridor Selector */}
            <select
              value={selectedCorridor}
              onChange={(e) => setSelectedCorridor(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none"
            >
              {mockCorridorCongestion.map((c) => (
                <option key={c.corridor_id} value={c.corridor_id}>
                  {c.corridor_id} ({c.name})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">CURRENT AVG SPEED</span>
              <strong className="text-indigo-600 text-sm">{activeCorridorData.average_speed_kmh} km/h</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">SPEED LIMIT</span>
              <strong className="text-slate-800 text-sm">{activeCorridorData.speed_limit_kmh} km/h</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">CONGESTION LEVEL</span>
              <div>{getCongestionBadge(activeCorridorData.congestion_level)}</div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeCorridorData.hourly_speed_profile} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 70]} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                <Line
                  type="monotone"
                  dataKey="speed"
                  name="Transit Recorded Speed (km/h)"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name="Nominal Speed Limit"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 Columns: Active Bottleneck Queue List */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200/90 shadow-clean space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Active Traffic Bottlenecks
              </h3>
            </div>
            <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
              {filteredBottlenecks.length} Critical Spots
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredBottlenecks.map((bn) => (
              <div
                key={bn.id}
                className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                    {bn.corridor_id} • {bn.id}
                  </span>
                  {getCongestionBadge(bn.congestion_level)}
                </div>

                <h4 className="text-xs font-bold text-slate-900">
                  {bn.junction_name}
                </h4>

                <p className="text-[11px] text-slate-600 leading-tight">
                  {bn.primary_cause}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 font-mono text-[10px] text-slate-500">
                  <div>Speed: <strong className="text-rose-700">{bn.current_speed_kmh} km/h</strong></div>
                  <div>Delay: <strong className="text-rose-700">+{bn.delay_minutes} mins</strong></div>
                  <div className="col-span-2">Queue: <strong className="text-slate-800">{bn.queue_length_meters} meters</strong> ({bn.last_updated})</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Origin–Destination (OD) Traffic Flow Matrix */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-clean space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Origin–Destination (OD) Transit & Traffic Pattern Matrix</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Aggregated commuter journey volume and vehicle distribution between metropolitan urban zones.
            </p>
          </div>
          <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">
            Urban Macro-Mobility Flow
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3">Origin Zone</th>
                <th className="py-3 px-3 text-center">Direction</th>
                <th className="py-3 px-3">Destination Zone</th>
                <th className="py-3 px-3">Corridor Utilized</th>
                <th className="py-3 px-3 font-semibold">Est. Passenger Trips</th>
                <th className="py-3 px-3 font-semibold">Vehicle Flow Volume</th>
                <th className="py-3 px-3 font-semibold text-right">Avg Travel Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {mockODMatrix.map((od, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-bold text-slate-900 font-sans">
                    {od.origin_zone}
                  </td>
                  <td className="py-3 px-3 text-center text-indigo-600">
                    <ArrowRight className="w-4 h-4 mx-auto" />
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 font-sans">
                    {od.destination_zone}
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                    {od.corridor_utilized}
                  </td>
                  <td className="py-3 px-3 text-indigo-900 font-bold">
                    {od.passenger_trips_est.toLocaleString()} trips/day
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {od.vehicle_flow_volume.toLocaleString()} veh/day
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-rose-700">
                    {od.avg_travel_time_mins} mins
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
