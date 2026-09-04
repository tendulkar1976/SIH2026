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
  const data = trendDataByPeriod['today'];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-clean-card flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">24-Hour Anomaly Distribution Profile</h3>
            <p className="text-[11px] font-mono text-slate-500">Real-time hourly hazard density across monitored sectors</p>
          </div>
        </div>

        <a
          href="/analytics"
          className="text-xs font-mono text-indigo-600 hover:text-indigo-700 font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 transition"
        >
          Historical Trends →
        </a>
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
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
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
              stroke="#4F46E5"
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
        <span className="text-indigo-600 font-semibold">Aggregate Vision Confidence: 94.2%</span>
      </div>
    </div>
  );
};

