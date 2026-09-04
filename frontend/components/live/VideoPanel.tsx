'use client';

import React, { useState, useRef } from 'react';
import { BusTelemetry } from '@/types';
import { DetectionOverlay } from '@/components/live/DetectionOverlay';
import { CameraStatusBadge } from '@/components/live/CameraStatusBadge';
import {
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Layers,
  Upload,
  WifiOff,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface VideoPanelProps {
  bus: BusTelemetry;
}

const DEMO_STREAMS = [
  {
    id: 'highway_night',
    name: 'Corridor Stream Alpha (Night Traffic)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-traffic-on-a-busy-highway-at-night-42436-large.mp4',
  },
  {
    id: 'urban_day',
    name: 'Expressway Stream Beta (Urban Transit)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-daytime-traffic-on-a-busy-avenue-42438-large.mp4',
  },
  {
    id: 'intersection',
    name: 'City Center Intersection Stream',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41551-large.mp4',
  },
];

export const VideoPanel: React.FC<VideoPanelProps> = ({ bus }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showDetections, setShowDetections] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState(DEMO_STREAMS[0].url);
  const [customStreamNotice, setCustomStreamNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setCurrentStreamUrl(fileUrl);
      setCustomStreamNotice(`Loaded local video stream: ${file.name}`);
      setTimeout(() => setCustomStreamNotice(null), 4000);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Render camera status fallback screens
  if (bus.camera_status === 'OFFLINE') {
    return (
      <div className="bg-white aspect-video rounded-xl border border-slate-200/80 flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-clean-card">
        <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
          <WifiOff className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <CameraStatusBadge status="OFFLINE" size="lg" />
          <h3 className="text-sm font-bold text-slate-900 font-mono mt-2">{bus.bus_id} Camera Standby</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Optical edge sensor unit is powered down or in low-power depot maintenance mode.
          </p>
        </div>
      </div>
    );
  }

  if (bus.camera_status === 'CONNECTING') {
    return (
      <div className="bg-white aspect-video rounded-xl border border-amber-200 flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-clean-card">
        <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 animate-spin">
          <RotateCcw className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <CameraStatusBadge status="CONNECTING" size="lg" />
          <h3 className="text-sm font-bold text-slate-900 font-mono mt-2">Negotiating Optical RTSP Stream</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Establishing WebRTC/HLS link to {bus.bus_id} Edge Optical Unit...
          </p>
        </div>
      </div>
    );
  }

  if (bus.camera_status === 'ERROR') {
    return (
      <div className="bg-white aspect-video rounded-xl border border-rose-200 flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-clean-card">
        <div className="w-14 h-14 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 animate-pulse">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <CameraStatusBadge status="ERROR" size="lg" />
          <h3 className="text-sm font-bold text-slate-900 font-mono mt-2">Optical Stream Link Error (Code 502)</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Sensor lens occlusion, hardware driver fault, or network packet drops detected on {bus.bus_id}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-900 rounded-xl border border-slate-200/80 overflow-hidden relative shadow-clean-card ${
        isFullscreen ? 'fixed inset-4 z-50 aspect-auto bg-slate-950' : 'aspect-video w-full'
      }`}
    >
      {/* Hidden File Input for Custom Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCustomUpload}
        accept="video/mp4,video/webm"
        className="hidden"
      />

      {/* Main Stream Canvas */}
      <div className="relative w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center">
        <video
          key={currentStreamUrl}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isPlaying ? 'opacity-95' : 'opacity-40'
          }`}
          src={currentStreamUrl}
        />

        {/* Real-time AI Overlays */}
        {showDetections && isPlaying && (
          <DetectionOverlay detections={bus.detections_in_frame} />
        )}

        {/* Top Watermark / Status Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs font-mono font-bold text-white flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-pewter-blue animate-pulse" />
              <span>{bus.bus_id}</span>
              <span className="text-pewter-blue">ROUTE {bus.route_id}</span>
            </div>

            <CameraStatusBadge status={bus.camera_status} fps={bus.fps} size="sm" />
          </div>

          <div className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-[10px] font-mono text-slate-300 shadow-sm">
            {new Date().toLocaleTimeString()} IST | {bus.latency_ms}ms
          </div>
        </div>

        {/* Notice Banner */}
        {customStreamNotice && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-pewter-blue text-white font-mono text-xs font-semibold shadow-md animate-bounce">
            {customStreamNotice}
          </div>
        )}

        {/* Bottom Floating Control Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-20">
          <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs shadow-sm">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title={isPlaying ? 'Pause Feed' : 'Play Feed'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* AI HUD Overlay Toggle */}
            <button
              onClick={() => setShowDetections(!showDetections)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md font-mono text-[11px] transition ${
                showDetections
                  ? 'bg-pewter-blue text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle AI Bounding Box Overlays"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>AI HUD</span>
            </button>

            {/* Stream Selector */}
            <select
              value={currentStreamUrl}
              onChange={(e) => setCurrentStreamUrl(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-pewter-blue"
            >
              {DEMO_STREAMS.map((s) => (
                <option key={s.id} value={s.url}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Custom Video Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 text-[11px] font-mono"
              title="Upload Local Video Stream for Testing"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500 transition shadow-sm"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
