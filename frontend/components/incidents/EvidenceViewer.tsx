'use client';

import React, { useState } from 'react';
import { IncidentEvent } from '@/types';
import {
  Image as ImageIcon,
  Video,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
} from 'lucide-react';

interface EvidenceViewerProps {
  incident: IncidentEvent;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ incident }) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'image' | 'video'>('image');
  const [showOverlay, setShowOverlay] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 1));

  const imageSrc =
    incident.evidence_image ||
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-clean-card space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-pewter-blue/10 border border-pewter-blue/20 text-pewter-blue">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Computer Vision Evidence Inspection
            </h3>
            <p className="text-[11px] font-mono text-slate-500">
              Edge camera capture & neural detection bounding boxes
            </p>
          </div>
        </div>

        {/* Media Switcher & Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls (for image) */}
          {activeMediaTab === 'image' && (
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-semibold text-slate-700 w-10 text-center">
                {(zoomLevel * 100).toFixed(0)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2.5}
                className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* HUD Overlay Toggle */}
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold transition flex items-center gap-1.5 ${
              showOverlay
                ? 'bg-pewter-blue text-white shadow-sm'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI HUD</span>
          </button>

          {/* Image / Video Tab */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveMediaTab('image')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition ${
                activeMediaTab === 'image'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Snapshot</span>
            </button>

            <button
              onClick={() => setActiveMediaTab('video')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition ${
                activeMediaTab === 'video'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Buffer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Evidence Visual Canvas */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200">
        {activeMediaTab === 'image' ? (
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
            {/* Image Preview with Zoom Scale */}
            <img
              src={imageSrc}
              alt={incident.description}
              style={{ transform: `scale(${zoomLevel})` }}
              className="w-full h-full object-cover transition-transform duration-200"
            />

            {/* Neural Bounding Box Overlay */}
            {showOverlay && (
              <div className="absolute inset-0 pointer-events-none z-10">
                <div
                  style={{
                    left: '25%',
                    top: '35%',
                    width: '45%',
                    height: '40%',
                  }}
                  className="absolute border-2 border-pewter-blue rounded shadow-md"
                >
                  <div className="absolute -top-6 left-0 px-2 py-0.5 rounded bg-pewter-blue text-white font-mono text-[10px] font-bold whitespace-nowrap shadow-sm">
                    <span>{incident.type.toUpperCase().replace('_', ' ')}</span>
                    <span className="ml-1 opacity-80">
                      {(incident.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Video Buffer Mode */
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              controls
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
              src={
                incident.evidence_video ||
                'https://assets.mixkit.co/videos/preview/mixkit-traffic-on-a-busy-highway-at-night-42436-large.mp4'
              }
            />
          </div>
        )}

        {/* Telemetry Stamp Pill */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-slate-300 pointer-events-none shadow-sm flex items-center gap-2">
          <span>OPTICAL SENSOR: {incident.bus_id}</span>
          <span>•</span>
          <span>LATENCY: 42ms</span>
        </div>
      </div>
    </div>
  );
};
