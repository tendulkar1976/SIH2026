'use client';

import React, { useState } from 'react';
import { ChartCard } from '@/components/analytics/ChartCard';
import {
  mockAnalyticsData,
  trendDataByPeriod,
} from '@/data/mockAnalytics';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Construction,
  Layers,
  Car,
  Download,
  Filter,
  Route as RouteIcon,
  Footprints,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState<'today' | '7d' | '30d'>('today');
  const [selectedRoute, setSelectedRoute] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const data = mockAnalyticsData;
  const timeSeriesData = trendDataByPeriod[selectedDateRange];

  const COLORS = ['#5c8dc5', '#909eae', '#ad9e90', '#736f60', '#d97706', '#e11d48'];

  const filteredIncidentsByRoute = selectedRoute === 'ALL'
    ? data.incidents_by_route
    : data.incidents_by_route.filter((r) => r.route.startsWith(selectedRoute));

  const filteredIncidentsByType = selectedType === 'ALL'
    ? data.incidents_by_type
    : data.incidents_by_type.filter((t) => t.type.toLowerCase().includes(selectedType.toLowerCase()));

  const customTooltipStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    color: '#0f172a',
    fontSize: '12px',
  };

  const handleExportAnalytics = () => {
    // Generate analytics summary CSV
    const rows = [
      ['Metric / Category', 'Count / Value', 'Period'],
      ['Total Vehicles Counted', data.total_vehicles_counted, selectedDateRange],
      ...data.incidents_by_type.map((t) => [`Incident Type: ${t.type}`, t.count, selectedDateRange]),
      ...data.incidents_by_route.map((r) => [`Route: ${r.route}`, r.count, selectedDateRange]),
      ...data.vehicle_distribution.map((v) => [`Vehicle Class: ${v.category}`, v.count, selectedDateRange]),
      ...data.pothole_distribution.map((p) => [`Pothole Severity: ${p.severity}`, p.count, selectedDateRange]),
    ];

    const csvContent = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `urbansense_analytics_${selectedDateRange}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>Urban Intelligence Analytics & Spatial Frequency</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial-temporal hazard density, fleet vehicle classification, and civil infrastructure distress trends.
          </p>
        </div>

        <button
          onClick={handleExportAnalytics}
          className="px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-2 text-xs font-semibold shadow-xs self-start sm:self-auto font-mono"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* Section 4: Multi-Criteria Filter Bar (Date, Route, Incident Type) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-clean-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <Filter className="w-4 h-4 text-pewter-blue" />
          <span className="font-bold">ANALYTICS FILTERS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* 1. Date Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-slate-500 pl-2 text-[11px] font-semibold">DATE:</span>
            {[
              { id: 'today' as const, label: 'Today (24h)' },
              { id: '7d' as const, label: '7 Days' },
              { id: '30d' as const, label: '30 Days' },
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedDateRange(period.id)}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedDateRange === period.id
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* 2. Route Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
            <RouteIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 text-[11px] font-semibold">ROUTE:</span>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="bg-transparent text-xs text-slate-900 font-semibold focus:outline-none"
            >
              <option value="ALL">All Routes</option>
              <option value="R-05">R-05 (Central Spine)</option>
              <option value="R-12">R-12 (Koramangala - Indiranagar)</option>
              <option value="R-18">R-18 (Whitefield Tech Hub)</option>
              <option value="R-24">R-24 (Silk Board Corridor)</option>
              <option value="R-09">R-09 (Hebbal - Airport Link)</option>
              <option value="R-33">R-33 (South Outer Ring)</option>
            </select>
          </div>

          {/* 3. Incident Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 text-[11px] font-semibold">TYPE:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-xs text-slate-900 font-semibold focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="pothole">Potholes</option>
              <option value="crossing">Missing Crossings</option>
              <option value="rash">Rash Driving</option>
              <option value="anpr">ANPR Violations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Incidents Over Time (Area Chart) */}
        <ChartCard
          title="Incidents Detected Over Time"
          subtitle={`Temporal trend breakdown for ${selectedDateRange.toUpperCase()}`}
          icon={TrendingUp}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5c8dc5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5c8dc5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPotholes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
              <Area
                type="monotone"
                dataKey="total"
                name="Total Incidents"
                stroke="#5c8dc5"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="potholes"
                name="Road Potholes"
                stroke="#d97706"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPotholes)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Incidents by Type (Donut Pie Chart) */}
        <ChartCard
          title="Incidents Distribution by Type"
          subtitle="Breakdown of detected road hazards and civil anomalies"
          icon={Layers}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredIncidentsByType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={88}
                paddingAngle={4}
                dataKey="count"
                nameKey="type"
              >
                {filteredIncidentsByType.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3: Incidents by Route (Horizontal Bar Chart) */}
        <ChartCard
          title="Incident Frequency by Transit Route"
          subtitle="Aggregated safety hazards recorded along municipal bus corridors"
          icon={RouteIcon}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredIncidentsByRoute}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis dataKey="route" type="category" stroke="#94a3b8" fontSize={10} width={90} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" name="Incidents" fill="#5c8dc5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4: Vehicle Counts Classification (Bar Chart) */}
        <ChartCard
          title="Vehicle Classification Counts"
          subtitle="Fleet edge AI object classification breakdown"
          icon={Car}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.vehicle_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" name="Classified Objects" fill="#64748b" radius={[4, 4, 0, 0]}>
                {data.vehicle_distribution.map((entry, index) => (
                  <Cell key={`cell-v-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 5: Pothole Distribution by Severity (Bar Chart) */}
        <ChartCard
          title="Pothole Severity Distribution"
          subtitle="Civil works maintenance prioritization queue"
          icon={Construction}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.pothole_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="severity" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" name="Potholes" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 6: Rash Driving Frequency by Corridor */}
        <ChartCard
          title="Rash Driving Frequency by Violation Type"
          subtitle="Reckless speed violations and dangerous overtaking clusters"
          icon={AlertTriangle}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.rash_driving_frequency}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="speed_tier" stroke="#94a3b8" fontSize={9} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" name="Violations" fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
