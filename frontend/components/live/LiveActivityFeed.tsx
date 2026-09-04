'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import {
  Activity,
  AlertTriangle,
  Construction,
  Car,
  Footprints,
  ShieldAlert,
  Clock,
  Radio,
} from 'lucide-react';
import { IncidentType } from '@/types';

export const LiveActivityFeed: React.FC = () => {
  const { incidents } = useUrbanStore();

  const getTypeIcon = (type: IncidentType) => {
    switch (type) {
      case 'pothole':
        return <Construction className="w-3.5 h-3.5 text-amber-600" />;
      case 'rash_driving':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case 'missing_crossing':
        return <Footprints className="w-3.5 h-3.5 text-pewter-blue" />;
      case 'anpr':
        return <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />;
      case 'pedestrian':
        return <Footprints className="w-3.5 h-3.5 text-emerald-600" />;
      case 'vehicle':
      default:
        return <Car className="w-3.5 h-3.5 text-pewter-blue" />;
    }
  };

  const getEventText = (inc: (typeof incidents)[0]) => {
    switch (inc.type) {
      case 'pothole':
        return 'Pothole road hazard detected';
      case 'rash_driving':
        return inc.license_plate
          ? `Possible rash driving: Vehicle ${inc.license_plate}`
          : 'Possible rash driving detected';
      case 'missing_crossing':
        return 'Eroded pedestrian zebra crossing hazard';
      case 'anpr':
        return `ANPR Flagged: Vehicle ${inc.license_plate || inc.vehicle_id || 'unregistered'}`;
      case 'pedestrian':
        return 'Pedestrian detected in transit corridor';
      case 'vehicle':
      default:
        return `Vehicle ${inc.vehicle_id || '#44'} detected`;
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-clean-card flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-pewter-blue/10 border border-pewter-blue/20 text-pewter-blue">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Live Edge Activity Feed
            </h3>
            <p className="text-[11px] font-mono text-slate-500">
              Real-time asynchronous computer-vision event stream
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Streaming
        </span>
      </div>

      {/* Scrolling Events Feed */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {incidents.slice(0, 10).map((inc) => (
          <div
            key={inc.id}
            className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 transition flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5 shadow-sm">
              {getTypeIcon(inc.type)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[11px] font-mono mb-0.5">
                <span className="text-pewter-blue font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {new Date(inc.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
                <span className="text-[10px] text-slate-500 font-sans font-medium">{inc.bus_id}</span>
              </div>

              <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                {getEventText(inc)}
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 mt-1">
                <span>Route {inc.route_id} • {inc.latitude.toFixed(4)}°N, {inc.longitude.toFixed(4)}°E</span>
                <span>•</span>
                <span>{(inc.confidence * 100).toFixed(0)}% AI Conf</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
