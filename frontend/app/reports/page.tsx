'use client';

import React, { useState } from 'react';
import { mockCivicReports } from '@/data/mockReports';
import { useUrbanStore } from '@/store/useUrbanStore';
import {
  FileText,
  Download,
  Printer,
  Building2,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  HardDrive,
  FileSpreadsheet,
} from 'lucide-react';

export default function ReportsPage() {
  const { stats, incidents } = useUrbanStore();
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleExportCSV = (reportTitle: string) => {
    // Generate actual CSV download for the incidents
    const rows = [
      ['Incident ID', 'Type', 'Severity', 'Department', 'Confidence', 'Timestamp', 'Bus ID', 'Route', 'License Plate', 'Status', 'Description'],
      ...incidents.map((i) => [
        i.id,
        i.type,
        i.severity,
        i.assigned_department,
        `${(i.confidence * 100).toFixed(0)}%`,
        i.timestamp,
        i.bus_id,
        i.route_id,
        i.license_plate || 'N/A',
        i.status,
        `"${i.description.replace(/"/g, '""')}"`,
      ]),
    ];

    const csvContent = rows.map((e) => e.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(`Generated and downloaded dataset: ${reportTitle}`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handlePrintBriefing = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Civic Reports & Municipal Export Center</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated executive municipal briefings, department work order audits, and forensic traffic police e-challan packs.
          </p>
        </div>

        <button
          onClick={handlePrintBriefing}
          className="px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-2 text-xs font-semibold shadow-xs font-mono"
        >
          <Printer className="w-4 h-4 text-indigo-600" />
          <span>Print Executive Briefing PDF</span>
        </button>
      </div>

      {downloadNotice && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shadow-sm font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Municipal Executive Briefing Summary Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-clean space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Operational Shift Summary (24-Hour Municipal Intelligence)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">
            CONFIDENTIAL / CIVIC AUTHORITY RECORD
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block uppercase">Total Detections</span>
            <strong className="text-xl text-slate-900">{stats.total_incidents} Events</strong>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block uppercase">PWD Road Defects</span>
            <strong className="text-xl text-amber-600">{stats.potholes} Potholes</strong>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block uppercase">Traffic Violations</span>
            <strong className="text-xl text-rose-600">{stats.rash_driving} Violations</strong>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block uppercase">Active Emergency Alerts</span>
            <strong className="text-xl text-rose-700">{stats.active_alerts} Priority</strong>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed pt-2">
          Automated edge AI analytics across Bangalore municipal bus routes R-05, R-12, R-18, R-24, R-09, and R-33 have detected 
          <strong> {stats.total_incidents} discrete civic anomalies</strong> over the current 24-hour cycle. 
          High-priority road surface defects have been routed to the PWD rapid repair cell, and critical safety violations have been logged into the Traffic Management Center queue.
        </p>
      </div>

      {/* Available Audit Packages List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>Departmental Audit Packages & Data Exports</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCivicReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-clean flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {report.id}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                    READY FOR EXPORT
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {report.title}
                </h4>

                <p className="text-xs text-slate-500">
                  Target Agency: <strong className="text-slate-700">{report.assigned_agency}</strong>
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                  <div>Period: <strong className="text-slate-800">{report.period}</strong></div>
                  <div>Items: <strong className="text-slate-800">{report.total_items} records</strong></div>
                  <div>Critical Items: <strong className="text-rose-700">{report.critical_items}</strong></div>
                  <div>Payload Size: <strong className="text-slate-800">{report.file_size_kb} KB</strong></div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleExportCSV(report.title)}
                  className="w-full px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center gap-1.5 text-xs font-semibold font-mono shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Download CSV Pack</span>
                </button>

                <button
                  onClick={handlePrintBriefing}
                  className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition flex items-center justify-center gap-1.5 text-xs font-semibold font-mono shadow-xs"
                  title="Print Official PDF Form"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
