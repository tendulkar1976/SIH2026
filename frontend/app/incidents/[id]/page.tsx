'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUrbanStore } from '@/store/useUrbanStore';
import { apiService } from '@/services/api';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EvidenceViewer } from '@/components/incidents/EvidenceViewer';
import { IncidentMiniMap } from '@/components/incidents/IncidentMiniMap';
import { IncidentStatus } from '@/types';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Radio,
  CheckCircle,
  XCircle,
  Search,
  Activity,
  ExternalLink,
  FileText,
} from 'lucide-react';

export default function IncidentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { incidents, updateIncidentStatus } = useUrbanStore();
  const incident = incidents.find((i) => i.id === id);

  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  if (!incident) {
    return (
      <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4 shadow-clean-card">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Search className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900 font-sans">Incident Record Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The requested dossier ID ({id}) could not be located in current operational records.
        </p>
        <Link
          href="/incidents"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pewter-blue text-white text-xs font-semibold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Incident Registry
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: IncidentStatus) => {
    setIsUpdating(true);
    // 1. Optimistic state mutation
    updateIncidentStatus(incident.id, newStatus);
    // 2. Call REST API service abstraction
    await apiService.updateIncidentStatus(incident.id, newStatus);
    setIsUpdating(false);

    setFeedbackNotice(`Status successfully updated to ${newStatus.toUpperCase()}`);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/incidents"
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-sm"
            title="Back to Incidents"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-slate-900 tracking-tight">
                {incident.id}
              </span>
              <SeverityBadge severity={incident.severity} size="md" />
              <StatusBadge status={incident.status} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Category:{' '}
              <strong className="text-pewter-blue uppercase font-semibold">
                {incident.type.replace('_', ' ')}
              </strong>
            </p>
          </div>
        </div>

        {/* Status Workflow Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 mr-1 font-medium">Status Workflow:</span>

          <button
            onClick={() => handleStatusChange('new')}
            disabled={incident.status === 'new' || isUpdating}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              incident.status === 'new'
                ? 'bg-rose-50 text-rose-700 border-rose-300 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            New
          </button>

          <button
            onClick={() => handleStatusChange('investigating')}
            disabled={incident.status === 'investigating' || isUpdating}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
              incident.status === 'investigating'
                ? 'bg-amber-50 text-amber-700 border-amber-300 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Investigating
          </button>

          <button
            onClick={() => handleStatusChange('resolved')}
            disabled={incident.status === 'resolved' || isUpdating}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
              incident.status === 'resolved'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Resolved
          </button>

          <button
            onClick={() => handleStatusChange('dismissed')}
            disabled={incident.status === 'dismissed' || isUpdating}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
              incident.status === 'dismissed'
                ? 'bg-slate-100 text-slate-700 border-slate-300 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Dismissed
          </button>
        </div>
      </div>

      {feedbackNotice && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Main Grid: Evidence Viewer + Forensics Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Optical Evidence Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <EvidenceViewer incident={incident} />

          {/* Incident Full Description */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-clean-card space-y-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-pewter-blue" />
              <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-900">
                Incident Synopsis & Log
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pt-1">
              {incident.description}
            </p>
          </div>
        </div>

        {/* Right Column: Forensics & Mini Map (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Forensics Metadata */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-clean-card space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Activity className="w-4 h-4 text-pewter-blue" />
              <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-900">
                Telemetry & Forensic Metadata
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">AI CONFIDENCE</span>
                <span className="text-base font-bold font-mono text-emerald-700">
                  {(incident.confidence * 100).toFixed(0)}% Match
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">RECORDED TIME</span>
                <span className="text-xs font-mono font-bold text-slate-800">
                  {new Date(incident.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">DETECTING BUS</span>
                <span className="text-sm font-bold font-mono text-pewter-blue">{incident.bus_id}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">MUNICIPAL ROUTE</span>
                <span className="text-sm font-bold font-mono text-slate-800">Route {incident.route_id}</span>
              </div>

              {incident.vehicle_id && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">TRACKED VEHICLE</span>
                  <span className="text-sm font-bold font-mono text-slate-800">{incident.vehicle_id}</span>
                </div>
              )}

              {incident.license_plate && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">LICENSE PLATE</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 text-xs font-mono font-bold inline-block mt-0.5">
                    {incident.license_plate}
                  </span>
                </div>
              )}

              <div className="col-span-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">GPS COORDINATES</span>
                <span className="text-xs font-mono font-bold text-slate-800">
                  {incident.latitude.toFixed(5)}° N, {incident.longitude.toFixed(5)}° E
                </span>
              </div>
            </div>

            {/* Interactive Mini Map Location */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-pewter-blue" />
                  Corridor Map Location:
                </span>
                <Link
                  href="/map"
                  className="text-pewter-blue hover:underline flex items-center gap-1 text-[11px] font-semibold"
                >
                  <span>Full GIS Map</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <IncidentMiniMap incident={incident} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
