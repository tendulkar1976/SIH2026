import React from 'react';
import { CameraStatus } from '@/types';

interface CameraStatusBadgeProps {
  status: CameraStatus;
  fps?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const CameraStatusBadge: React.FC<CameraStatusBadgeProps> = ({
  status,
  fps,
  size = 'md',
}) => {
  const configs: Record<
    CameraStatus,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    LIVE: {
      label: '● LIVE',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700 font-semibold',
      border: 'border-emerald-200 shadow-sm',
      dot: 'bg-emerald-500 animate-pulse',
    },
    CONNECTING: {
      label: '◐ CONNECTING',
      bg: 'bg-amber-50',
      text: 'text-amber-700 font-semibold',
      border: 'border-amber-200 shadow-sm',
      dot: 'bg-amber-500 animate-spin',
    },
    OFFLINE: {
      label: '○ OFFLINE',
      bg: 'bg-slate-100',
      text: 'text-slate-600 font-medium',
      border: 'border-slate-200 shadow-sm',
      dot: 'bg-slate-400',
    },
    ERROR: {
      label: '⚠ ERROR',
      bg: 'bg-rose-50',
      text: 'text-rose-700 font-semibold',
      border: 'border-rose-200 shadow-sm',
      dot: 'bg-rose-500 animate-ping',
    },
  };

  const config = configs[status] || configs.OFFLINE;
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px]'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-xs'
      : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-wide ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label.replace(/^[●◐○⚠]\s*/, '')}</span>
      {fps !== undefined && status === 'LIVE' && (
        <span className="text-[10px] opacity-75 font-normal">({fps} FPS)</span>
      )}
    </span>
  );
};
