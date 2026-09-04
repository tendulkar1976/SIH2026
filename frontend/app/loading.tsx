import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-mono text-xs text-slate-400">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-odyssey-primary/40 border border-odyssey-vibrant/40 flex items-center justify-center text-odyssey-mint shadow-[0_0_25px_rgba(115,230,203,0.2)]">
          <Shield className="w-7 h-7 animate-pulse" />
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-odyssey-mint animate-ping" />
      </div>

      <div className="flex items-center gap-2 text-slate-300 font-semibold tracking-wider uppercase">
        <Sparkles className="w-3.5 h-3.5 text-odyssey-mint animate-spin" />
        <span>Syncing Municipal Command Telemetry...</span>
      </div>

      <p className="text-[11px] text-slate-500 max-w-xs text-center">
        Connecting edge inference channels and civic transit camera pipelines.
      </p>
    </div>
  );
}
