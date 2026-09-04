import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { realtimeService } from '@/services/realtime';
import { Wifi, WifiOff, RefreshCw, Sparkles } from 'lucide-react';

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
          label: 'LIVE GRID',
          dotClass: 'bg-emerald-500',
          borderClass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
          icon: <Wifi className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'RECONNECTING':
      case 'reconnecting':
        return {
          label: 'RECONNECTING',
          dotClass: 'bg-amber-500 animate-ping',
          borderClass: 'border-amber-200 bg-amber-50 text-amber-800',
          icon: <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />,
        };
      case 'OFFLINE':
      case 'disconnected':
        return {
          label: 'OFFLINE',
          dotClass: 'bg-rose-500',
          borderClass: 'border-rose-200 bg-rose-50 text-rose-800',
          icon: <WifiOff className="w-3.5 h-3.5 text-rose-600" />,
        };
      case 'simulating':
      default:
        return {
          label: 'LIVE (SIMULATED)',
          dotClass: 'bg-pewter-blue',
          borderClass: 'border-pewter-blue/30 bg-pewter-blue/10 text-pewter-darkBlue',
          icon: <Sparkles className="w-3.5 h-3.5 text-pewter-darkBlue" />,
        };
    }
  };

  const current = getStatusDisplay();

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-medium shadow-clean-sm transition-all ${current.borderClass}`}
      >
        <span className={`w-2 h-2 rounded-full ${current.dotClass}`} />
        <span className="tracking-wide uppercase font-semibold">{current.label}</span>
        {current.icon}
      </div>

      {connectionStatus !== 'connected' && (
        <button
          onClick={handleReconnect}
          title="Attempt WebSocket Reconnection"
          className="p-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-pewter-blue transition shadow-clean-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
