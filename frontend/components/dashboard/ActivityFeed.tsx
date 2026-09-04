'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { Activity } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const { incidents } = useUrbanStore();
  const latestEvents = incidents.slice(0, 6);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-wide">Live Edge Activity Stream</h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Feed
          </span>
        </div>

        <div className="space-y-3 mt-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
          {latestEvents.map((item, idx) => (
            <div key={item.id} className="relative flex items-start gap-3 pl-1">
              <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center text-[10px] font-mono font-bold z-10 shrink-0 mt-0.5 shadow-xs">
                {idx + 1}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-brand-600 font-semibold">{item.bus_id} ({item.route_id})</span>
                  <span className="text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5 leading-snug">
                  Detected <span className="text-slate-900 font-semibold capitalize">{item.type.replace('_', ' ')}</span> with {(item.confidence * 100).toFixed(0)}% AI confidence.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>INFERENCE: YOLOv10-EDGE</span>
        <span className="text-emerald-700 font-semibold">LATENCY: 42ms AVG</span>
      </div>
    </div>
  );
};

