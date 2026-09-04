'use client';

import React, { useState, useEffect } from 'react';
import { IncidentEvent } from '@/types';
import { realtimeService } from '@/services/realtime';
import Link from 'next/link';
import {
  X,
  AlertTriangle,
  Construction,
  Footprints,
  Car,
  ShieldAlert,
  ChevronRight,
  Radio,
} from 'lucide-react';

export const EventNotificationToast: React.FC = () => {
  const [latestEvent, setLatestEvent] = useState<IncidentEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = realtimeService.onEvent((event: IncidentEvent) => {
      setLatestEvent(event);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!visible || !latestEvent) return null;

  const getEventIcon = () => {
    switch (latestEvent.type) {
      case 'pothole':
        return <Construction className="w-4 h-4 text-amber-600" />;
      case 'missing_crossing':
        return <Footprints className="w-4 h-4 text-pewter-darkBlue" />;
      case 'rash_driving':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'hit_and_run':
        return <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />;
      case 'anpr':
        return <ShieldAlert className="w-4 h-4 text-purple-600" />;
      default:
        return <Car className="w-4 h-4 text-pewter-darkBlue" />;
    }
  };

  const getSeverityBadge = () => {
    switch (latestEvent.severity) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200 font-bold';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200 font-bold';
      case 'medium':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-medium';
      case 'low':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200 font-medium';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xl space-y-2.5">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-slate-100 border border-slate-200 text-pewter-darkBlue">
              <Radio className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-mono font-bold text-slate-900 tracking-wide uppercase">
              Live AI Detection
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${getSeverityBadge()}`}
            >
              {latestEvent.severity}
            </span>
            <button
              onClick={() => setVisible(false)}
              className="p-1 rounded text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">{getEventIcon()}</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="font-bold text-pewter-darkBlue">{latestEvent.id}</span>
              <span className="text-slate-700 font-semibold capitalize">
                {latestEvent.type.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {latestEvent.description}
            </p>
            <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 pt-0.5">
              <span>Bus: <strong className="text-slate-800">{latestEvent.bus_id}</strong></span>
              <span>•</span>
              <span>Route: <strong className="text-pewter-darkBlue">{latestEvent.route_id}</strong></span>
              <span>•</span>
              <span>Conf: <strong className="text-emerald-700">{(latestEvent.confidence * 100).toFixed(0)}%</strong></span>
            </div>
          </div>
        </div>

        {/* Action Link */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">
            {new Date(latestEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <Link
            href={`/incidents/${latestEvent.id}`}
            onClick={() => setVisible(false)}
            className="text-pewter-darkBlue hover:text-pewter-blue font-bold flex items-center gap-1 group"
          >
            <span>View Dossier</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
