'use client';

import React, { useEffect, useState } from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  colorScheme?: 'mint' | 'emerald' | 'amber' | 'rose' | 'purple' | 'blue';
  changeText?: string;
  isAlert?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  changeText = '+12% today',
  isAlert = false,
}) => {
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    setFlashing(true);
    const timer = setTimeout(() => setFlashing(false), 600);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div
      className={`bg-white p-5 rounded-xl border border-slate-200/80 shadow-clean-card transition-all duration-200 relative overflow-hidden ${
        flashing ? 'ring-2 ring-pewter-blue/30' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
          <Icon className="w-4 h-4 text-pewter-blue" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-slate-900">
          {value.toLocaleString()}
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
          <TrendingUp className="w-3 h-3 text-pewter-blue" />
          <span>{changeText}</span>
        </div>
      </div>

      {isAlert && value > 0 && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
      )}
    </div>
  );
};
