'use client';

import React, { useState } from 'react';
import { MapView, MapFilterCategory } from '@/components/map/MapView';
import { EventSimulatorControls } from '@/components/common/EventSimulatorControls';
import { useUrbanStore } from '@/store/useUrbanStore';
import {
  MapPin,
  Layers,
  AlertTriangle,
  Construction,
  Footprints,
  Car,
} from 'lucide-react';

export default function MapPage() {
  const { stats, incidents, buses } = useUrbanStore();
  const [selectedCategory, setSelectedCategory] = useState<MapFilterCategory>('all');

  const filterButtons = [
    { id: 'all' as const, label: 'All Incidents', count: incidents.length, icon: Layers, color: 'text-slate-700' },
    { id: 'potholes' as const, label: 'Road Potholes', count: stats.potholes, icon: Construction, color: 'text-amber-600' },
    { id: 'missing_crossings' as const, label: 'Missing Crossings', count: stats.missing_crossings, icon: Footprints, color: 'text-pewter-blue' },
    { id: 'rash_driving' as const, label: 'Rash Driving', count: stats.rash_driving, icon: AlertTriangle, color: 'text-rose-600' },
    { id: 'hit_and_run' as const, label: 'Hit-and-Run', count: incidents.filter((i) => i.description.toLowerCase().includes('hit-and-run') || i.id === 'INC-1051').length, icon: AlertTriangle, color: 'text-red-600' },
    { id: 'traffic' as const, label: 'Traffic Anomalies', count: stats.vehicles + stats.pedestrian_events + stats.anpr_events, icon: Car, color: 'text-slate-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Simulation Controls Banner */}
      <EventSimulatorControls />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-pewter-blue" />
            <span>Geospatial Urban Intelligence GIS Map</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial distribution of hazards, civil infrastructure distress, and bus telemetry across city sectors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm">
            TOTAL MARKERS: <strong className="text-pewter-blue">{incidents.length}</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm">
            BUS NODES: <strong className="text-emerald-700">{buses.filter((b) => b.is_online).length} ONLINE</strong>
          </span>
        </div>
      </div>

      {/* Top Quick Category Switcher */}
      <div className="flex flex-wrap items-center gap-2">
        {filterButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = selectedCategory === btn.id;

          return (
            <button
              key={btn.id}
              onClick={() => setSelectedCategory(btn.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs transition ${
                isActive
                  ? 'bg-pewter-blue text-white font-semibold shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : btn.color}`} />
              <span>{btn.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {btn.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Map View */}
      <div className="w-full">
        <MapView selectedFilter={selectedCategory} height="700px" />
      </div>
    </div>
  );
}
