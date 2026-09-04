import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { realtimeService } from '@/services/realtime';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const ConnectionIndicator: React.FC = () => {
  const { connectionStatus } = useUrbanStore();

  const handleReconnect = () => {
    realtimeService.reconnect();
  };

  const getStatusDisplay = () => {
    switch (connectionStatus) {
      case 'LIVE':
      case 'connected':
        return {
          code: 'SYS: ONLINE',
          dotClass: 'bg-emerald-500',
          containerClass: 'border-emerald-200 bg-emerald-50/80 text-emerald-800',
          icon: <Wifi className="w-3 h-3 text-emerald-600 shrink-0" />,
        };
      case 'RECONNECTING':
      case 'reconnecting':
        return {
          code: 'SYS: RECONNECTING',
          dotClass: 'bg-amber-500 animate-ping',
          containerClass: 'border-amber-200 bg-amber-50/80 text-amber-800',
          icon: <RefreshCw className="w-3 h-3 text-amber-600 animate-spin shrink-0" />,
        };
      case 'OFFLINE':
      case 'disconnected':
        return {
          code: 'SYS: OFFLINE',
          dotClass: 'bg-rose-500',
          containerClass: 'border-rose-200 bg-rose-50/80 text-rose-800',
          icon: <WifiOff className="w-3 h-3 text-rose-600 shrink-0" />,
        };
      case 'simulating':
      default:
        return {
          code: 'SYS: SIMULATION',
          dotClass: 'bg-indigo-500',
          containerClass: 'border-indigo-200 bg-indigo-50/80 text-indigo-800',
          icon: <Wifi className="w-3 h-3 text-indigo-600 shrink-0" />,
        };
    }
  };

  const current = getStatusDisplay();

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono font-bold tracking-wider shadow-2xs transition-all ${current.containerClass}`}
        title={`Connection Telemetry: ${connectionStatus}`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${current.dotClass}`} />
        <span>{current.code}</span>
        {current.icon}
      </div>

      {(connectionStatus === 'OFFLINE' || connectionStatus === 'disconnected' || connectionStatus === 'RECONNECTING') && (
        <button
          onClick={handleReconnect}
          title="Attempt Immediate Grid Reconnection"
          className="p-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-indigo-500 transition shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
