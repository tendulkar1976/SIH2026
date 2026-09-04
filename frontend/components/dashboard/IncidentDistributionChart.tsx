'use client';

import React from 'react';
import { mockIncidentDistribution } from '@/data/mockAnalytics';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

export const IncidentDistributionChart: React.FC = () => {
  const data = mockIncidentDistribution;
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-clean flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-pewter-darkBlue">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Incident Distribution</h3>
            <p className="text-[11px] font-mono text-slate-500">AI Computer Vision Class Breakdown</p>
          </div>
        </div>
        <span className="text-xs font-mono text-pewter-darkBlue font-bold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100">
          {totalCount} Total
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Donut Chart */}
        <div className="md:col-span-5 h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold font-mono text-slate-900">100%</span>
            <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider font-semibold">Classified</span>
          </div>
        </div>

        {/* Legend & Breakdown Bars */}
        <div className="md:col-span-7 space-y-2.5 text-xs font-mono">
          {data.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0 shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 font-bold">{item.count}</span>
                  <span className="text-slate-400 w-8 text-right font-semibold">({item.percentage}%)</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>PRIMARY HAZARD: ROAD POTHOLES (34%)</span>
        <span className="text-pewter-darkBlue font-semibold">MODELS: YOLOv10 + OCR</span>
      </div>
    </div>
  );
};
