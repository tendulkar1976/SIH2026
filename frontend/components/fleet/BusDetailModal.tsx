'use client';

import React from 'react';
import { BusTelemetry } from '@/types';
import { useUrbanStore } from '@/store/useUrbanStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  X,
  Bus,
  MapPin,
  Camera,
  Activity,
  AlertTriangle,
  Shield,
  Gauge,
  Eye,
  ChevronRight,
} from 'lucide-react';

interface BusDetailModalProps {
  bus: BusTelemetry | null;
  onClose: () => void;
}

export const BusDetailModal: React.FC<BusDetailModalProps> = ({ bus, onClose }) => {
  const { incidents, setSelectedBusId } = useUrbanStore();
  const router = useRouter();

  if (!bus) return null;

  const busIncidents = incidents.filter((i) => i.bus_id === bus.bus_id);

  const handleLaunchLive = () => {
    setSelectedBusId(bus.bus_id);
    router.push('/live');
  };

  const getStatusBadge = () => {
    const status = bus.status || (bus.is_online ? 'ONLINE' : 'OFFLINE');
    switch (status) {
      case 'ONLINE':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ONLINE
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            WARNING (ANOMALY)
          </span>
        );
      case 'OFFLINE':
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            OFFLINE
          </span>
        );
    }
  };

  const getCameraBadge = () => {
    switch (bus.camera_status) {
      case 'LIVE':
        return (
          <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE FEED ({bus.fps} FPS)
          </span>
        );
      case 'CONNECTING':
        return (
          <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-spin" />
            CONNECTING ({bus.fps} FPS)
          </span>
        );
      case 'ERROR':
        return (
          <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            OPTICAL ERROR
          </span>
        );
      case 'OFFLINE':
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            OFFLINE
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div
        className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-2xl overflow-hidden shadow-clean-card flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pewter-blue/10 border border-pewter-blue/20 flex items-center justify-center text-pewter-blue shadow-sm">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-mono text-slate-900 tracking-tight">
                  {bus.bus_id}
                </h2>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Route <strong className="text-slate-900 font-medium">{bus.route_id}</strong> • Driver: {bus.driver_name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">SPEED</span>
              <span className="text-sm font-mono font-bold text-slate-900 mt-1 block">
                {bus.speed_kmh} km/h
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">HEADING</span>
              <span className="text-sm font-mono font-bold text-slate-900 mt-1 block">
                {bus.heading_deg}°
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">LATENCY</span>
              <span className="text-sm font-mono font-bold text-slate-900 mt-1 block">
                {bus.latency_ms} ms
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">DETECTIONS TODAY</span>
              <span className="text-sm font-mono font-bold text-pewter-blue mt-1 block">
                {bus.incidents_today}
              </span>
            </div>
          </div>

          {/* Location & Optical Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Telemetry & Camera Diagnostics
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-pewter-blue" />
                  Current Position:
                </span>
                <span className="font-mono font-semibold text-slate-900">
                  {bus.current_latitude.toFixed(5)}° N, {bus.current_longitude.toFixed(5)}° E
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-pewter-blue" />
                  Camera Stream Status:
                </span>
                <div>{getCameraBadge()}</div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-pewter-blue" />
                  Processing Status:
                </span>
                <span className="font-mono text-emerald-700 font-semibold">
                  {bus.processing_status || 'ACTIVE'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Bus Incidents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Recent AI Inferences ({busIncidents.length})
              </h4>
            </div>

            {busIncidents.length === 0 ? (
              <div className="p-6 text-center text-slate-400 font-mono text-xs border border-dashed border-slate-200 rounded-lg">
                No incidents reported by this vehicle unit today.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {busIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{inc.id}</span>
                        <span className="capitalize font-medium text-slate-700">
                          {inc.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{inc.description}</p>
                    </div>

                    <Link
                      href={`/incidents/${inc.id}`}
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] text-pewter-blue hover:bg-slate-50 font-semibold flex items-center gap-1 shrink-0"
                    >
                      <span>Dossier</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            Close
          </button>
          <button
            onClick={handleLaunchLive}
            className="px-4 py-2 rounded-lg bg-pewter-blue text-white text-xs font-semibold hover:bg-pewter-blue/90 transition flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span>Launch Live Stream HUD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
