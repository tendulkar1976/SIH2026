import React from 'react';
import { IncidentSeverity } from '@/types';

interface SeverityBadgeProps {
  severity: IncidentSeverity;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'sm' }) => {
  const configs: Record<
    IncidentSeverity,
    { label: string; bg: string; text: string; border: string }
  > = {
    critical: {
      label: 'CRITICAL',
      bg: 'bg-rose-50',
      text: 'text-rose-700 font-bold',
      border: 'border-rose-200 shadow-sm',
    },
    high: {
      label: 'HIGH',
      bg: 'bg-orange-50',
      text: 'text-orange-700 font-semibold',
      border: 'border-orange-200',
    },
    medium: {
      label: 'MEDIUM',
      bg: 'bg-amber-50',
      text: 'text-amber-700 font-medium',
      border: 'border-amber-200',
    },
    low: {
      label: 'LOW',
      bg: 'bg-slate-100',
      text: 'text-slate-700 font-medium',
      border: 'border-slate-200',
    },
  };

  const config = configs[severity] || configs.low;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-md border font-mono uppercase tracking-wide ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
};
