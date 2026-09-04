'use client';

import React from 'react';
import { MapView } from '@/components/map/MapView';
import Link from 'next/link';
import { MapPin, Maximize2 } from 'lucide-react';
import { useUrbanStore } from '@/store/useUrbanStore';

export const MapPreview: React.FC = () => {
  const { incidents } = useUrbanStore();

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-brand-600">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">Live City Geospatial Intelligence</h3>
            <p className="text-[11px] font-mono text-slate-500">
              Active incident markers & bus positions across urban sectors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500">Markers:</span>
            <span className="text-brand-600 font-bold">{incidents.length}</span>
          </div>

          <Link
            href="/map"
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-1.5 text-xs font-mono font-semibold shadow-xs"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full GIS Map</span>
          </Link>
        </div>
      </div>

      {/* Embedded Map */}
      <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200">
        <MapView />
      </div>
    </div>
  );
};

