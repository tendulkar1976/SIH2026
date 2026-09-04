'use client';

import React, { useState } from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { realtimeService } from '@/services/realtime';
import {
  Settings,
  Sliders,
  Radio,
  Bell,
  RefreshCw,
  Save,
  CheckCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const { connectionStatus, isDemoMode, setDemoMode } = useUrbanStore();

  const [apiUrl, setApiUrl] = useState(
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  );
  const [wsUrl, setWsUrl] = useState(
    process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/events'
  );
  const [potholeThreshold, setPotholeThreshold] = useState(85);
  const [rashSpeedThreshold, setRashSpeedThreshold] = useState(45);
  const [anprConfidence, setAnprConfidence] = useState(90);
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleReconnectWs = () => {
    realtimeService.reconnect();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-pewter-blue" />
          <span>Command Center System Configuration</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure edge AI model parameters, municipal network endpoints, and alert dispatch criteria.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Network & Endpoints */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-clean-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Radio className="w-4 h-4 text-pewter-blue" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Backend Network Services
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                REST API Endpoint
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-pewter-blue transition"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Default: http://localhost:8000/api/v1
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                WebSocket / SSE Ingestion URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={wsUrl}
                  onChange={(e) => setWsUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-pewter-blue transition"
                />
                <button
                  type="button"
                  onClick={handleReconnectWs}
                  className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition shrink-0"
                  title="Test Connection"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Current Status: <strong className="text-emerald-700 uppercase font-bold">{connectionStatus}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* AI Confidence Thresholds */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-clean-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-pewter-blue" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Edge AI Detection Thresholds
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700">Pothole Confidence Minimum</span>
                <span className="font-mono font-bold text-pewter-blue">{potholeThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={potholeThreshold}
                onChange={(e) => setPotholeThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pewter-blue"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700">Rash Driving Speed Trigger Threshold</span>
                <span className="font-mono font-bold text-amber-600">{rashSpeedThreshold} km/h</span>
              </div>
              <input
                type="range"
                min="30"
                max="80"
                value={rashSpeedThreshold}
                onChange={(e) => setRashSpeedThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700">ANPR License Plate OCR Confidence</span>
                <span className="font-mono font-bold text-emerald-700">{anprConfidence}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={anprConfidence}
                onChange={(e) => setAnprConfidence(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Dispatch Notification Rules */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-clean-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-pewter-blue" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Notification & Demonstration Modes
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Synthetic Real-Time Event Generator
                </span>
                <span className="text-[11px] text-slate-500">
                  Periodically synthesize realistic transit bus edge computer-vision detections (3-8s)
                </span>
              </div>
              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="rounded border-slate-300 text-pewter-blue focus:ring-pewter-blue h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Critical Audio Alert Chimes
                </span>
                <span className="text-[11px] text-slate-500">
                  Emit audio tone when High or Critical severity incidents arrive in dispatch queue
                </span>
              </div>
              <input
                type="checkbox"
                checked={audioAlerts}
                onChange={(e) => setAudioAlerts(e.target.checked)}
                className="rounded border-slate-300 text-pewter-blue focus:ring-pewter-blue h-4 w-4"
              />
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedNotice ? (
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle className="w-4 h-4" />
              <span>Configuration successfully saved to local system storage.</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-pewter-blue text-white font-semibold text-xs hover:bg-pewter-blue/90 active:scale-[0.99] transition flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
