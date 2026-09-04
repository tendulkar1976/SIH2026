'use client';

import React, { useState } from 'react';
import { trendDataByPeriod } from '@/data/mockAnalytics';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export const IncidentTrendChart: React.FC = () => {
  const [period, setPeriod] = useState<'today' | '7d' | '30d'>('today');
  const data = trendDataByPeriod[period];

  const getPeriodLabel = () => {
    switch (period) {
      case 'today':
        return 'Today (Hourly Anomaly Profile)';
      case '7d':
        return 'Last 7 Days (Daily Cumulative)';
      case '30d':
        return 'Last 30 Days (Weekly Trajectory)';
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-clean flex flex-col justify-between h-full space-y-4">
      {/* Header with period toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-pewter-darkBlue">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Incident Occurrence Timeline</h3>
            <p className="text-[11px] font-mono text-slate-500">{getPeriodLabel()}</p>
          </div>
        </div>

        {/* Period Switcher */}
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 self-start sm:self-auto">
          {[
            { id: 'today' as const, label: 'Today' },
            { id: '7d' as const, label: '7 Days' },
            { id: '30d' as const, label: '30 Days' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                period === p.id
                  ? 'bg-white text-slate-900 font-bold border border-slate-200 shadow-clean-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="potholeArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rashArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="crossingArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5C8DC5" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#5C8DC5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" stroke="#64748b" fontSize={11} fontFamily="monospace" />
            <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#0f172a',
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: '11px',
                fontFamily: 'monospace',
                paddingTop: '10px',
              }}
            />
            <Area
              type="monotone"
              dataKey="potholes"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#potholeArea)"
              name="Potholes"
            />
            <Area
              type="monotone"
              dataKey="rash_driving"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#rashArea)"
              name="Rash Driving"
            />
            <Area
              type="monotone"
              dataKey="crossings"
              stroke="#5C8DC5"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#crossingArea)"
              name="Missing Crossings"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>PEAK ANOMALY WINDOW: 18:00 - 20:30 IST</span>
        <span className="text-pewter-darkBlue font-semibold">Aggregate Vision Confidence: 94.2%</span>
      </div>
    </div>
  );
};
