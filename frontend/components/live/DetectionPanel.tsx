'use client';

import React from 'react';
import { LiveDetection } from '@/types';
import {
  Layers,
  Car,
  Footprints,
  Construction,
  ShieldAlert,
  Gauge,
} from 'lucide-react';

interface DetectionPanelProps {
  detections: LiveDetection[];
  busId: string;
}

export const DetectionPanel: React.FC<DetectionPanelProps> = ({ detections, busId }) => {
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

  return (
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
              {busId} Forward Inferences ({detections.length} objects)
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-pewter-blue font-medium flex items-center gap-1.5 bg-pewter-blue/10 px-2.5 py-0.5 rounded-full border border-pewter-blue/20">
          <span className="w-1.5 h-1.5 rounded-full bg-pewter-blue animate-pulse" />
          YOLOv10 Tracking
        </span>
      </div>

      <div className="space-y-2">
        {detections.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-mono text-xs border border-dashed border-slate-200 rounded-lg">
            No objects currently detected in the active optical frame.
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
                      Confidence {(det.confidence * 100).toFixed(0)}%
                    </span>
                    {det.speed_estimate && (
                      <>
                        <span>•</span>
                        <span className="text-slate-600 font-semibold">{det.speed_estimate} km/h</span>
                      </>
                    )}
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
  );
};
