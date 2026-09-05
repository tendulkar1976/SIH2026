'use client';

import React from 'react';
import { BusTelemetry } from '@/types';
import { useUrbanStore } from '@/store/useUrbanStore';
import { useRouter } from 'next/navigation';
import {
  Bus,
  MapPin,
  Clock,
  Eye,
} from 'lucide-react';

interface FleetCardProps {
  bus: BusTelemetry;
  onSelect?: (bus: BusTelemetry) => void;
}

export const FleetCard: React.FC<FleetCardProps> = ({ bus, onSelect }) => {
  const { setSelectedBusId, setConnectModalOpen } = useUrbanStore();
  const router = useRouter();

  const handleMonitor = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBusId(bus.bus_id);
    setConnectModalOpen(true);
  };

  const getStatusBadge = () => {
    const status = bus.status || (bus.is_online ? 'ONLINE' : 'OFFLINE');
    switch (status) {
      case 'ONLINE':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ONLINE</span>
          </div>
        );
      case 'WARNING':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>WARNING</span>
          </div>
        );
      case 'OFFLINE':
      default:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>OFFLINE</span>
          </div>
        );
    }
  };

  const getCameraBadge = () => {
    switch (bus.camera_status) {
      case 'LIVE':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE ({bus.fps} FPS)
          </span>
        );
      case 'CONNECTING':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-spin" />
            CONNECTING ({bus.fps} FPS)
          </span>
        );
      case 'ERROR':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            ERROR
          </span>
        );
      case 'OFFLINE':
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            OFFLINE
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(bus)}
      className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-pewter-blue/60 hover:shadow-clean transition flex flex-col justify-between space-y-4 cursor-pointer group shadow-clean-card"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pewter-blue/10 border border-pewter-blue/20 flex items-center justify-center text-pewter-blue group-hover:bg-pewter-blue/20 transition">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight text-base font-mono">
                {bus.bus_id}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Route <strong className="text-slate-800 font-semibold">{bus.route_id}</strong> • {bus.driver_name}
              </p>
            </div>
          </div>

          <div>{getStatusBadge()}</div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">CAMERA STATUS</span>
            <div className="mt-1">{getCameraBadge()}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">INCIDENTS TODAY</span>
            <span className="text-sm font-bold font-mono text-slate-900 mt-0.5 block">
              {bus.incidents_today} DETECTIONS
            </span>
          </div>

          <div className="col-span-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-pewter-blue" />
                LAST REPORTED LOCATION
              </span>
              <span className="font-mono text-slate-700">{bus.speed_kmh} km/h</span>
            </div>
            <p className="text-xs text-slate-800 font-medium truncate">
              {bus.location_name || `${bus.current_latitude.toFixed(4)}°N, ${bus.current_longitude.toFixed(4)}°E`}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
          <Clock className="w-3 h-3" />
          <span>{bus.last_update || 'Just now'}</span>
        </div>

        <button
          onClick={handleMonitor}
          className="px-3 py-1.5 rounded-lg bg-pewter-blue text-white text-xs font-semibold hover:bg-pewter-blue/90 transition flex items-center gap-1.5 shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Monitor</span>
        </button>
      </div>
    </div>
  );
};
