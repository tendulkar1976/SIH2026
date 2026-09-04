import React from 'react';
import { IncidentStatus } from '@/types';

interface StatusBadgeProps {
  status: IncidentStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const configs: Record<
    IncidentStatus,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    new: {
      label: 'NEW',
      bg: 'bg-rose-50',
      text: 'text-rose-700 font-semibold',
      border: 'border-rose-200',
      dot: 'bg-rose-500 animate-pulse',
    },
    investigating: {
      label: 'INVESTIGATING',
      bg: 'bg-amber-50',
      text: 'text-amber-700 font-semibold',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    resolved: {
      label: 'RESOLVED',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700 font-semibold',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    dismissed: {
      label: 'DISMISSED',
      bg: 'bg-slate-100',
      text: 'text-slate-600 font-medium',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
    },
  };

  const config = configs[status] || configs.new;
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px]'
      : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wide uppercase ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
