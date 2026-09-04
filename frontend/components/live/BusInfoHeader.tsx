'use client';

import React from 'react';
import { BusTelemetry } from '@/types';
import { CameraStatusBadge } from '@/components/live/CameraStatusBadge';
import { useUrbanStore } from '@/store/useUrbanStore';
import {
  Bus,
  MapPin,
  Cpu,
  Activity,
  Gauge,
} from 'lucide-react';

interface BusInfoHeaderProps {
  bus: BusTelemetry;
}

export const BusInfoHeader: React.FC<BusInfoHeaderProps> = ({ bus }) => {
  const { buses, setSelectedBusId } = useUrbanStore();

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-clean-card space-y-4">
      {/* Top Banner: Bus Selector & Camera Status Tester */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-pewter-blue/10 border border-pewter-blue/20 flex items-center justify-center text-pewter-blue shadow-sm">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-mono text-slate-900 tracking-tight">
                {bus.bus_id}
              </h2>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                ROUTE {bus.route_id}
              </span>
              <CameraStatusBadge status={bus.camera_status} fps={bus.fps} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Assigned Driver: <strong className="text-slate-800 font-medium">{bus.driver_name}</strong>
            </p>
          </div>
        </div>

        {/* Bus Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400 mr-1">Switch Node:</span>
          {buses.map((b) => (
            <button
              key={b.bus_id}
              onClick={() => setSelectedBusId(b.bus_id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                bus.bus_id === b.bus_id
                  ? 'bg-pewter-blue text-white font-semibold shadow-sm'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {b.bus_id}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* GPS Coordinates */}
        <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">CURRENT GPS</span>
            <span className="text-xs font-mono font-bold text-slate-800">
              {bus.current_latitude.toFixed(4)}° N, {bus.current_longitude.toFixed(4)}° E
            </span>
          </div>
          <MapPin className="w-4 h-4 text-pewter-blue shrink-0" />
        </div>

        {/* Processing Status */}
        <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">PROCESSING STATUS</span>
            <span className="text-xs font-mono font-semibold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {bus.processing_status || 'INFERENCE_ACTIVE'}
            </span>
          </div>
          <Cpu className="w-4 h-4 text-pewter-blue shrink-0" />
        </div>

        {/* Speed & Heading */}
        <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">SPEED & HEADING</span>
            <span className="text-xs font-mono font-bold text-slate-900">
              {bus.speed_kmh} km/h • {bus.heading_deg}°
            </span>
          </div>
          <Gauge className="w-4 h-4 text-pewter-blue shrink-0" />
        </div>

        {/* Neural Inferences */}
        <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">FRAME INFERENCES</span>
            <span className="text-xs font-mono font-bold text-pewter-blue">
              {bus.detections_in_frame.length} OBJECTS TRACKED
            </span>
          </div>
          <Activity className="w-4 h-4 text-pewter-blue shrink-0" />
        </div>
      </div>
    </div>
  );
};
