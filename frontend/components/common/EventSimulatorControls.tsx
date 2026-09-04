'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { realtimeService } from '@/services/realtime';
import { IncidentType } from '@/types';
import {
  Sparkles,
  Play,
  Pause,
  AlertTriangle,
  ShieldAlert,
  Car,
  Construction,
  Footprints,
  Wifi,
  WifiOff,
  RefreshCw,
} from 'lucide-react';

export const EventSimulatorControls: React.FC = () => {
  const {
    isDemoMode,
    simulationSpeed,
    connectionStatus,
    setDemoMode,
    setSimulationSpeed,
    injectSampleEvent,
  } = useUrbanStore();

  const handleInject = (type?: IncidentType) => {
    injectSampleEvent(type);
  };

  const handleConnectionChange = (status: 'LIVE' | 'RECONNECTING' | 'OFFLINE') => {
    realtimeService.setSimulatedState(status);
  };

  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-clean-card space-y-2.5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Real-time Simulation Engine Header & Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-800 font-semibold uppercase tracking-wider text-xs">
            <Sparkles className="w-4 h-4 text-pewter-blue" />
            <span>AI Simulation Engine</span>
          </div>
          <span className="text-slate-200">|</span>

          {/* Active / Paused Switch */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isDemoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-7 h-4 rounded-full transition-colors relative ${
                isDemoMode ? 'bg-pewter-blue' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform absolute top-0.5 left-0.5 ${
                  isDemoMode ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="text-slate-600 font-mono text-[11px] font-medium">
              {isDemoMode ? 'STREAMING (3–8s)' : 'PAUSED (MANUAL)'}
            </span>
          </label>
        </div>

        {/* Section 5: Connection State Simulator (LIVE, RECONNECTING, OFFLINE) */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px]">Link State:</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px]">
            {[
              { id: 'LIVE' as const, label: 'LIVE', icon: Wifi, color: 'text-emerald-600' },
              { id: 'RECONNECTING' as const, label: 'RETRY', icon: RefreshCw, color: 'text-amber-600' },
              { id: 'OFFLINE' as const, label: 'OFFLINE', icon: WifiOff, color: 'text-rose-600' },
            ].map((st) => {
              const Icon = st.icon;
              const isActive =
                connectionStatus === st.id ||
                (st.id === 'LIVE' && connectionStatus === 'connected') ||
                (st.id === 'LIVE' && connectionStatus === 'simulating');

              return (
                <button
                  key={st.id}
                  onClick={() => handleConnectionChange(st.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
                    isActive
                      ? 'bg-white text-slate-900 border border-slate-200 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${st.color}`} />
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Speed Multiplier */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px]">Freq:</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {[
              { label: '0x', val: 0 },
              { label: '1x', val: 1 },
              { label: '2x', val: 2 },
              { label: '5x', val: 5 },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setSimulationSpeed(item.val)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                  simulationSpeed === item.val
                    ? 'bg-white text-slate-900 border border-slate-200 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: 6 Simulated Incident Event Triggers (Clean 60-30-10 secondary styling) */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
        <span className="text-slate-500 text-[11px] mr-1 font-medium">Test Event Trigger:</span>

        {/* 1. Pothole */}
        <button
          onClick={() => handleInject('pothole')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition text-[11px] font-medium shadow-sm"
          title="Inject Road Pothole Anomaly"
        >
          <Construction className="w-3 h-3 text-amber-600" />
          <span>+ Pothole</span>
        </button>

        {/* 2. Vehicle Detection */}
        <button
          onClick={() => handleInject('vehicle')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition text-[11px] font-medium shadow-sm"
          title="Inject Vehicle Corridor Obstruction"
        >
          <Car className="w-3 h-3 text-slate-600" />
          <span>+ Vehicle</span>
        </button>

        {/* 3. Missing Zebra Crossing */}
        <button
          onClick={() => handleInject('missing_crossing')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition text-[11px] font-medium shadow-sm"
          title="Inject Missing / Eroded Zebra Crossing"
        >
          <Footprints className="w-3 h-3 text-pewter-blue" />
          <span>+ Missing Crossing</span>
        </button>

        {/* 4. Rash Driving */}
        <button
          onClick={() => handleInject('rash_driving')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition text-[11px] font-medium shadow-sm"
          title="Inject High-Speed Rash Driving Event"
        >
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          <span>+ Rash Driving</span>
        </button>

        {/* 5. ANPR Match */}
        <button
          onClick={() => handleInject('anpr')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition text-[11px] font-medium shadow-sm"
          title="Inject ANPR Hotlist Plate Detection"
        >
          <ShieldAlert className="w-3 h-3 text-purple-600" />
          <span>+ ANPR Flag</span>
        </button>

        {/* 6. Hit-and-Run */}
        <button
          onClick={() => handleInject('hit_and_run')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition text-[11px] font-medium shadow-sm"
          title="Inject Critical Hit-and-Run Suspect Event"
        >
          <AlertTriangle className="w-3 h-3 text-red-600" />
          <span>+ Hit-and-Run</span>
        </button>
      </div>
    </div>
  );
};
