'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  children,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-clean-card space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-1.5 rounded-lg bg-pewter-blue/10 border border-pewter-blue/20 text-pewter-blue">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-500 font-sans mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="w-full h-64">{children}</div>
    </div>
  );
};
