'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import {
  Activity,
  MapPin,
  AlertTriangle,
  Car,
  Footprints,
  Construction,
} from 'lucide-react';

export const TelemetryHUD: React.FC = () => {
  const { buses, selectedBusId, setSelectedBusId } = useUrbanStore();
  const currentBus = buses.find((b) => b.bus_id === selectedBusId) || buses[0];

  const inFrameVehicles = currentBus.detections_in_frame.filter(
    (d) => d.class_label === 'car' || d.class_label === 'bus' || d.class_label === 'truck' || d.class_label === 'motorcycle'
  ).length;
  const inFramePedestrians = currentBus.detections_in_frame.filter((d) => d.class_label === 'pedestrian').length;
  const inFramePotholes = currentBus.detections_in_frame.filter((d) => d.class_label === 'pothole').length;
  const inFrameAlerts = currentBus.detections_in_frame.filter((d) => d.is_alert).length;

  return (
    <div className="space-y-4">
      {/* Bus Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-clean-card">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
          Select Fleet Vehicle Stream
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {buses.map((bus) => (
            <button
              key={bus.bus_id}
              onClick={() => setSelectedBusId(bus.bus_id)}
              className={`p-2.5 rounded-lg border text-left transition ${
                selectedBusId === bus.bus_id
                  ? 'bg-pewter-blue text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold">{bus.bus_id}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    bus.is_online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
              </div>
              <div className={`text-[10px] font-mono mt-1 ${selectedBusId === bus.bus_id ? 'text-white/80' : 'text-slate-500'}`}>
                Route {bus.route_id}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Detection Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-clean-card">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-pewter-blue" />
              Vehicles
            </span>
            <span className="text-xl font-bold font-mono text-slate-900">{inFrameVehicles}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-clean-card">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-emerald-600" />
              Pedestrians
            </span>
            <span className="text-xl font-bold font-mono text-emerald-700">{inFramePedestrians}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-clean-card">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Construction className="w-3.5 h-3.5 text-amber-600" />
              Potholes
            </span>
            <span className="text-xl font-bold font-mono text-amber-700">{inFramePotholes}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-clean-card">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Active Alerts
            </span>
            <span className="text-xl font-bold font-mono text-rose-600 animate-pulse">{inFrameAlerts}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
