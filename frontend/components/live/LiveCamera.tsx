'use client';

import React, { useState } from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { DetectionOverlay } from '@/components/live/DetectionOverlay';
import {
  Maximize2,
  Minimize2,
  Camera,
  Play,
  Pause,
  WifiOff,
  Layers,
} from 'lucide-react';

export const LiveCamera: React.FC = () => {
  const { buses, selectedBusId } = useUrbanStore();
  const currentBus = buses.find((b) => b.bus_id === selectedBusId) || buses[0];

  const [isPlaying, setIsPlaying] = useState(true);
  const [showDetections, setShowDetections] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [snapshotNotice, setSnapshotNotice] = useState<string | null>(null);

  const handleCaptureSnapshot = () => {
    setSnapshotNotice(`Snapshot captured at ${new Date().toLocaleTimeString()}`);
    setTimeout(() => setSnapshotNotice(null), 3000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!currentBus.is_online || currentBus.camera_status === 'OFFLINE') {
    return (
      <div className="bg-white aspect-video rounded-xl border border-rose-200 flex flex-col items-center justify-center p-6 text-center space-y-3 shadow-clean-card">
        <div className="w-14 h-14 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <WifiOff className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-mono">{currentBus.bus_id} CAMERA OFFLINE</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Edge optical unit unreachable or in low-power standby mode.
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          Last Checkin: {new Date(currentBus.last_update).toLocaleTimeString()}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-950 rounded-xl border border-slate-200/80 overflow-hidden relative shadow-clean-card ${
        isFullscreen ? 'fixed inset-4 z-50 aspect-auto bg-slate-950' : 'aspect-video w-full'
      }`}
    >
      {/* Background Live Stream Video Canvas */}
      <div className="relative w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity ${isPlaying ? 'opacity-90' : 'opacity-40'}`}
          src="https://assets.mixkit.co/videos/preview/mixkit-traffic-on-a-busy-highway-at-night-42436-large.mp4"
        />

        {/* AI Detection HUD Overlay */}
        {showDetections && isPlaying && (
          <DetectionOverlay detections={currentBus.detections_in_frame} />
        )}

        {/* Top Watermark / HUD Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700 text-xs font-mono font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentBus.bus_id}</span>
              <span className="text-pewter-blue">R-{currentBus.route_id}</span>
            </div>

            <div className="px-2 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span>● LIVE</span>
              <span>{currentBus.fps} FPS</span>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-slate-300">
            {new Date().toLocaleTimeString()} IST
          </div>
        </div>

        {/* Snapshot Notification Toast */}
        {snapshotNotice && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold shadow-md animate-bounce">
            {snapshotNotice}
          </div>
        )}

        {/* Bottom HUD Controls */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 text-slate-300 hover:text-white transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowDetections(!showDetections)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono transition ${
                showDetections
                  ? 'bg-pewter-blue text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle AI HUD"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>AI HUD</span>
            </button>

            <button
              onClick={handleCaptureSnapshot}
              className="p-1 text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px] font-mono"
              title="Capture Frame"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Snapshot</span>
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
