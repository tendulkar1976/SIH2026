'use client';

import React from 'react';
import { LiveDetection } from '@/types';

interface DetectionOverlayProps {
  detections: LiveDetection[];
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ detections }) => {
  const getStyleForClass = (label: LiveDetection['class_label'], isAlert?: boolean) => {
    if (isAlert) {
      return {
        border: 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.7)]',
        tagBg: 'bg-red-500 text-white font-extrabold shadow-[0_0_10px_rgba(239,68,68,0.5)]',
        cornerColor: 'border-red-300',
      };
    }
    switch (label) {
      case 'pothole':
        return {
          border: 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]',
          tagBg: 'bg-amber-500/90 text-black font-bold',
          cornerColor: 'border-amber-200',
        };
      case 'zebra_crossing':
        return {
          border: 'border-pewter-blue shadow-[0_0_12px_rgba(92,141,197,0.5)]',
          tagBg: 'bg-pewter-blue text-command-950 font-bold',
          cornerColor: 'border-pewter-blue',
        };
      case 'pedestrian':
        return {
          border: 'border-pewter-light shadow-[0_0_12px_rgba(144,158,174,0.5)]',
          tagBg: 'bg-pewter-light text-command-950 font-bold',
          cornerColor: 'border-pewter-light',
        };
      case 'plate':
        return {
          border: 'border-pewter-taupe shadow-[0_0_12px_rgba(173,158,144,0.5)]',
          tagBg: 'bg-pewter-taupe text-command-950 font-bold',
          cornerColor: 'border-pewter-taupe',
        };
      case 'car':
      case 'bus':
      case 'motorcycle':
      case 'truck':
      default:
        return {
          border: 'border-pewter-blue shadow-[0_0_12px_rgba(92,141,197,0.5)]',
          tagBg: 'bg-command-800 text-pewter-blue font-bold border border-pewter-blue/40',
          cornerColor: 'border-pewter-blue',
        };
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
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {detections.map((det) => {
        const [x, y, w, h] = det.bbox;
        const styles = getStyleForClass(det.class_label, det.is_alert);
        const displayName = getDisplayName(det);

        return (
          <div
            key={det.id}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${w}%`,
              height: `${h}%`,
            }}
            className={`absolute border-2 rounded-sm transition-all duration-300 ${styles.border}`}
          >
            {/* Corner Target Reticles */}
            <div className={`absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 ${styles.cornerColor}`} />
            <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 ${styles.cornerColor}`} />
            <div className={`absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 ${styles.cornerColor}`} />
            <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 ${styles.cornerColor}`} />

            {/* Neural Detection HUD Tag (Class, Confidence, ID) */}
            <div
              className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5 whitespace-nowrap shadow-md ${styles.tagBg}`}
            >
              <span>{displayName}</span>
              <span className="bg-black/40 px-1 py-0.2 rounded text-white text-[9px]">
                {(det.confidence * 100).toFixed(0)}%
              </span>

              {det.license_plate && (
                <span className="bg-amber-300 text-black px-1 rounded font-bold text-[9px]">
                  {det.license_plate}
                </span>
              )}

              {det.speed_estimate && (
                <span className="text-[9px] text-white/90">
                  {det.speed_estimate} km/h
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
