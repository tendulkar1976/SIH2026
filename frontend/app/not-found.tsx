import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center font-mono p-4">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">404 — SECTOR NOT FOUND</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          The requested command corridor, telemetry feed, or incident dossier does not exist in the municipal registry.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="px-5 py-2.5 rounded-xl bg-odyssey-primary text-odyssey-mint border border-odyssey-mint/50 font-bold text-xs flex items-center gap-2 hover:bg-odyssey-primary/80 transition shadow-[0_0_20px_rgba(115,230,203,0.3)]"
      >
        <ArrowLeft className="w-4 h-4 text-odyssey-mint" />
        <span>Return to Command Center</span>
      </Link>
    </div>
  );
}
