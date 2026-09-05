'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { BusInfoHeader } from '@/components/live/BusInfoHeader';
import { VideoPanel } from '@/components/live/VideoPanel';
import { DetectionPanel } from '@/components/live/DetectionPanel';
import {
  Clock,
  Layers,
  ShieldAlert,
  AlertTriangle,
  Info,
  MapPin,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function LiveMonitoringPage() {
  const { buses, selectedBusId, detectionHistory } = useUrbanStore();
  const currentBus = buses.find((b) => b.bus_id === selectedBusId) || buses[0];

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300">
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-100 text-blue-800 border border-blue-300">
            MEDIUM
          </span>
        );
      case 'low':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700 border border-slate-300">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Bus Info & Telemetry Header */}
      <BusInfoHeader bus={currentBus} />

      {/* 2. Main Live Monitoring Grid: Large Video Area + Right Telemetry / Detection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Large Optical Video Panel with Real-time WebRTC/Demo Feed & AI Overlays */}
        <div className="lg:col-span-7 space-y-4">
          <VideoPanel bus={currentBus} />
        </div>

        {/* Right 5 Columns: Edge Device Status & Active Neural Detections */}
        <div className="lg:col-span-5">
          <DetectionPanel
            detections={currentBus.detections_in_frame}
            bus={currentBus}
          />
        </div>
      </div>

      {/* 3. Bottom: Real-Time Edge Vision Detection History */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-clean-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-pewter-blue/10 border border-pewter-blue/20 text-pewter-blue">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Edge Vision Detection History
              </h3>
              <p className="text-[11px] font-mono text-slate-500">
                Live stream of on-device inferences received from BUS-NODE-#1042 ({currentBus.bus_id})
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            Total Logged: <strong>{detectionHistory.length} events</strong>
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">TIME</th>
                <th className="py-2.5 px-4">DETECTION</th>
                <th className="py-2.5 px-4">CONFIDENCE</th>
                <th className="py-2.5 px-4">LOCATION</th>
                <th className="py-2.5 px-4">SEVERITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {detectionHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    No edge detections recorded yet.
                  </td>
                </tr>
              ) : (
                detectionHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition"
                  >
                    <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">
                      {item.time}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-pewter-blue" />
                        <span>{item.detection}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-semibold">
                      {(item.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs">{item.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getSeverityBadge(item.severity)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
