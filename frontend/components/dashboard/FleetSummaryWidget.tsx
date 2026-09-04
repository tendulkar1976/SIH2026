'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import Link from 'next/link';
import { Bus, Camera, Wifi, WifiOff, MapPin, ArrowRight } from 'lucide-react';

export const FleetSummaryWidget: React.FC = () => {
  const { buses } = useUrbanStore();

  const totalBuses = buses.length;
  const activeBuses = buses.filter((b) => b.is_online).length;
  const offlineBuses = totalBuses - activeBuses;
  const camerasOnline = buses.filter((b) => b.camera_status === 'LIVE' || b.camera_status === 'CONNECTING').length;
  
  // Calculate unique routes
  const uniqueRoutes = new Set(buses.map((b) => b.route_id)).size;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-brand-600">
            <Bus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">Transit Fleet Health</h3>
            <p className="text-[11px] font-mono text-slate-500">Edge Optical Vision Nodes</p>
          </div>
        </div>

        <Link
          href="/fleet"
          className="text-xs font-mono font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 transition"
        >
          <span>Fleet Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Active Buses */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-slate-600 text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1 font-medium text-emerald-700">
              <Wifi className="w-3 h-3 text-emerald-600" />
              Active Buses
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {activeBuses}
            <span className="text-xs text-slate-500 font-normal ml-1">/ {totalBuses}</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full"
              style={{ width: `${(activeBuses / totalBuses) * 100}%` }}
            />
          </div>
        </div>

        {/* Offline Buses */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-slate-600 text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1 font-medium text-rose-700">
              <WifiOff className="w-3 h-3 text-rose-600" />
              Offline Buses
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {offlineBuses}
            <span className="text-xs text-slate-500 font-normal ml-1">standby</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full"
              style={{ width: `${(offlineBuses / totalBuses) * 100}%` }}
            />
          </div>
        </div>

        {/* Cameras Online */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-slate-600 text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1 font-medium text-brand-700">
              <Camera className="w-3 h-3 text-brand-600" />
              Cameras Online
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {camerasOnline}
            <span className="text-xs text-slate-500 font-normal ml-1">units</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">
            Avg 29.5 FPS @ 42ms
          </div>
        </div>

        {/* Total Routes */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-slate-600 text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-3 h-3 text-slate-500" />
              Active Routes
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {uniqueRoutes}
            <span className="text-xs text-slate-500 font-normal ml-1">lines</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">
            Corridor Coverage: 86%
          </div>
        </div>
      </div>

      {/* Mini Bus Quick Status Bar */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-500">FLEET EDGE COMPUTE</span>
        <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          OPTICAL AI OPERATIONAL
        </span>
      </div>
    </div>
  );
};

