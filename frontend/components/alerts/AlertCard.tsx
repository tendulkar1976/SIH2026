'use client';

import React from 'react';
import { AlertItem } from '@/types';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useUrbanStore } from '@/store/useUrbanStore';
import Link from 'next/link';
import {
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  ExternalLink,
  Radio,
  Search,
} from 'lucide-react';

interface AlertCardProps {
  alert: AlertItem;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const { resolveAlert, dismissAlert, updateIncidentStatus } = useUrbanStore();

  return (
    <div
      className={`bg-white p-5 rounded-xl border transition-all shadow-clean-card ${
        alert.severity === 'critical'
          ? 'border-rose-300 bg-rose-50/30'
          : alert.severity === 'high'
          ? 'border-amber-300 bg-amber-50/30'
          : 'border-slate-200/80'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left: Alert Icon & Title */}
        <div className="flex items-start gap-3.5 flex-1">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              alert.severity === 'critical'
                ? 'bg-rose-100 text-rose-600 border border-rose-200'
                : 'bg-amber-100 text-amber-600 border border-amber-200'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">{alert.title}</h3>
              <SeverityBadge severity={alert.severity} size="sm" />
              <StatusBadge status={alert.status} size="sm" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{alert.message}</p>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
              <span className="flex items-center gap-1 text-pewter-blue font-semibold">
                <Radio className="w-3.5 h-3.5" />
                {alert.bus_id} ({alert.route_id})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {alert.location_name}
              </span>
              {alert.license_plate && (
                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-bold">
                  {alert.license_plate}
                </span>
              )}
              <span>AI Conf: <strong className="text-emerald-700 font-semibold">{(alert.confidence * 100).toFixed(0)}%</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <Link
            href={`/incidents/${alert.incident_id}`}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition flex items-center gap-1 text-xs font-semibold shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-pewter-blue" />
            Dossier
          </Link>

          {alert.status !== 'investigating' && alert.status !== 'resolved' && (
            <button
              onClick={() => updateIncidentStatus(alert.incident_id, 'investigating')}
              className="px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition flex items-center gap-1 text-xs font-semibold shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              Investigate
            </button>
          )}

          {alert.status !== 'resolved' && (
            <button
              onClick={() => {
                resolveAlert(alert.id);
                updateIncidentStatus(alert.incident_id, 'resolved');
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1 text-xs font-semibold shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Resolve
            </button>
          )}

          <button
            onClick={() => dismissAlert(alert.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Dismiss Alert"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
