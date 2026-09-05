'use client';

import React from 'react';
import { LiveDetection, BusTelemetry } from '@/types';
import { useUrbanStore } from '@/store/useUrbanStore';
import {
  Layers,
  Car,
  Footprints,
  Construction,
  ShieldAlert,
  Radio,
  Cpu,
  Navigation,
  Camera,
  Activity,
  MapPin,
  Clock,
} from 'lucide-react';

interface DetectionPanelProps {
  detections: LiveDetection[];
  bus: BusTelemetry;
}

export const DetectionPanel: React.FC<DetectionPanelProps> = ({ detections, bus }) => {
  const {
    edgeDeviceId,
    isRealPhoneConnected,
    edgeStatus,
    latestEdgeDetection,
    livePhoneFps,
  } = useUrbanStore();

  const getIcon = (label: LiveDetection['class_label']) => {
    switch (label) {
      case 'pothole':
        return <Construction className="w-4 h-4 text-amber-600" />;
      case 'zebra_crossing':
        return <Footprints className="w-4 h-4 text-pewter-blue" />;
      case 'pedestrian':
        return <Footprints className="w-4 h-4 text-emerald-600" />;
      case 'plate':
        return <ShieldAlert className="w-4 h-4 text-purple-600" />;
      case 'car':
      case 'bus':
      case 'motorcycle':
      case 'truck':
      default:
        return <Car className="w-4 h-4 text-pewter-blue" />;
    }
  };

  const getDisplayName = (det: LiveDetection) => {
    if (det.name) return det.name;
    if (det.class_label === 'car') return `Vehicle V-${det.track_id}`;
    if (det.class_label === 'pedestrian') return `Person P-${det.track_id.toString().padStart(3, '0')}`;
    if (det.class_label === 'pothole') return `Pothole #${det.track_id}`;
    if (det.class_label === 'zebra_crossing') return `Zebra Crossing #${det.track_id}`;
    return `${det.class_label.toUpperCase()} #${det.track_id}`;
  };

  const isLive = isRealPhoneConnected || edgeStatus === 'LIVE' || bus.is_online;

  return (
    <div className="space-y-6">
      {/* 1. Edge Node & Vehicle Telemetry Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-clean-card space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 font-mono tracking-tight">
                {bus.bus_id}
              </h3>
              <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Route <strong className="text-slate-800 font-semibold">{bus.route_id}</strong> • {bus.driver_name}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
              EDGE DEVICE
            </span>
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {edgeDeviceId}
            </span>
          </div>
        </div>

        {/* Subsystem Health Matrix */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold mb-1">
              <Camera className="w-3 h-3 text-pewter-blue" />
              CAMERA
            </div>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold mb-1">
              <Cpu className="w-3 h-3 text-pewter-blue" />
              AI ENGINE
            </div>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ACTIVE
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold mb-1">
              <Navigation className="w-3 h-3 text-pewter-blue" />
              GPS
            </div>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ACTIVE
            </span>
          </div>
        </div>

        {/* Live Coordinate & Speed Matrix */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">LAT</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {bus.current_latitude.toFixed(4)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">LNG</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {bus.current_longitude.toFixed(4)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">SPEED</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {bus.speed_kmh} km/h
            </span>
          </div>
        </div>

        {/* Detections Counter & Latest Detection */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-200">
            <span className="text-[10px] text-blue-700 font-bold uppercase block">DETECTIONS TODAY</span>
            <span className="font-extrabold text-blue-950 text-base mt-0.5 block">
              {bus.incidents_today}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200">
            <span className="text-[10px] text-amber-800 font-bold uppercase block">LATEST DETECTION</span>
            <span className="font-extrabold text-amber-950 text-xs mt-0.5 block truncate">
              {latestEdgeDetection ? (
                `${latestEdgeDetection.type} (${(latestEdgeDetection.confidence * 100).toFixed(0)}%)`
              ) : (
                'Pothole (94%)'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Active Neural Detections in Optical Frame */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-clean-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-pewter-blue/10 border border-pewter-blue/20 text-pewter-blue">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Active Neural Detections
              </h3>
              <p className="text-[11px] font-mono text-slate-500">
                {bus.bus_id} Inferences ({detections.length} in frame)
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-pewter-blue font-medium flex items-center gap-1.5 bg-pewter-blue/10 px-2.5 py-0.5 rounded-full border border-pewter-blue/20">
            <span className="w-1.5 h-1.5 rounded-full bg-pewter-blue animate-pulse" />
            On-Device Edge AI
          </span>
        </div>

        <div className="space-y-2">
          {detections.length === 0 ? (
            <div className="p-6 text-center text-slate-400 font-mono text-xs border border-dashed border-slate-200 rounded-lg">
              Scanning roadway optical frame for infrastructure anomalies...
            </div>
          ) : (
            detections.map((det) => (
              <div
                key={det.id}
                className={`p-3 rounded-lg border transition flex items-center justify-between gap-3 ${
                  det.is_alert
                    ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                    : 'bg-slate-50/60 border-slate-200/80 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg border shrink-0 ${
                      det.is_alert
                        ? 'bg-rose-100 border-rose-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    {getIcon(det.class_label)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 truncate">
                        {getDisplayName(det)}
                      </span>
                      {det.is_alert && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-rose-600 text-white font-bold animate-pulse">
                          ALERT
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="capitalize">{det.class_label.replace('_', ' ')}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-700">
                        {(det.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                </div>

                {det.license_plate && (
                  <div className="px-2 py-1 rounded bg-amber-50 border border-amber-300 text-[11px] font-mono font-bold text-amber-900 shrink-0">
                    {det.license_plate}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
