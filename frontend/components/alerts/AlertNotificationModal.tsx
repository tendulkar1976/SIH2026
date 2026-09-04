'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  X,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Car,
  Radio,
} from 'lucide-react';
import { SeverityBadge } from '@/components/common/SeverityBadge';

export const AlertNotificationModal: React.FC = () => {
  const { activeAlertModal, setActiveAlertModal, resolveAlert, dismissAlert } = useUrbanStore();
  const router = useRouter();

  if (!activeAlertModal) return null;

  const handleView = () => {
    const incId = activeAlertModal.incident_id;
    setActiveAlertModal(null);
    router.push(`/incidents/${incId}`);
  };

  const handleResolve = () => {
    resolveAlert(activeAlertModal.id);
    setActiveAlertModal(null);
  };

  const handleDismiss = () => {
    dismissAlert(activeAlertModal.id);
    setActiveAlertModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-rose-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider text-rose-700 font-bold">
                  HIGH-PRIORITY ALERT
                </span>
                <SeverityBadge severity={activeAlertModal.severity} size="sm" />
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {activeAlertModal.title}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setActiveAlertModal(null)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            {activeAlertModal.message}
          </p>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            {activeAlertModal.vehicle_id && (
              <div className="flex items-center gap-2 text-slate-600">
                <Car className="w-4 h-4 text-pewter-darkBlue" />
                <span>Vehicle: <strong className="text-slate-900">{activeAlertModal.vehicle_id}</strong></span>
              </div>
            )}
            {activeAlertModal.license_plate && (
              <div className="flex items-center gap-2 text-slate-600">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold">
                  {activeAlertModal.license_plate}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Time: <strong className="text-slate-900">{new Date(activeAlertModal.timestamp).toLocaleTimeString()}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Radio className="w-4 h-4 text-pewter-darkBlue" />
              <span>Bus: <strong className="text-pewter-darkBlue">{activeAlertModal.bus_id}</strong></span>
            </div>
            <div className="col-span-2 flex items-center gap-2 text-slate-600 pt-2 border-t border-slate-200">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span className="truncate">Location: <strong className="text-slate-900">{activeAlertModal.location_name}</strong></span>
            </div>
            <div className="col-span-2 flex items-center justify-between text-slate-500 pt-1">
              <span>AI Confidence: <strong className="text-emerald-700">{(activeAlertModal.confidence * 100).toFixed(0)}%</strong></span>
              <span>Incident ID: <strong className="text-pewter-darkBlue">{activeAlertModal.incident_id}</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              onClick={handleDismiss}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition flex items-center gap-1.5 text-xs font-mono font-medium shadow-clean-sm"
            >
              <XCircle className="w-4 h-4" />
              Dismiss
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResolve}
                className="px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1.5 text-xs font-mono font-semibold"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Resolve
              </button>

              <button
                onClick={handleView}
                className="px-4 py-2 rounded-xl bg-pewter-blue hover:bg-pewter-darkBlue text-white font-bold shadow-clean hover:shadow-clean-md transition flex items-center gap-1.5 text-xs font-mono"
              >
                <Eye className="w-4 h-4 text-white" />
                <span>Investigate Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
