'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  User,
  Building2,
  ArrowRight,
  Fingerprint,
  Radio,
  CheckCircle,
  KeyRound,
  FileCheck,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [badgeId, setBadgeId] = useState('OFFICER-4882');
  const [password, setPassword] = useState('••••••••••••');
  const [zone, setZone] = useState('zone-4');
  const [authMode, setAuthMode] = useState<'pki' | 'bio' | 'cac'>('pki');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen -m-6 md:-m-8 flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Subtle light ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pewter-blue/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#5C8DC5_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative w-full max-w-md">
        {/* GovTech Header Pill */}
        <div className="flex items-center justify-between px-3.5 py-1.5 mb-3 bg-white border border-slate-200/80 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-slate-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-pewter-blue animate-pulse" />
            <span>MUNICIPAL INTELLIGENCE GATEWAY</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">SEC-AUTH v2.4</span>
        </div>

        {/* Clean White Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 relative z-10 shadow-clean-card">
          {/* Brand & Department Emblem */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-pewter-blue/10 border border-pewter-blue/20 flex items-center justify-center mb-3 shadow-sm text-pewter-blue">
              <Building2 className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">URBANSENSE</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Department of Urban Transit & Intelligent Infrastructure
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600 font-medium">
              <Shield className="w-3.5 h-3.5 text-pewter-blue" />
              <span>OFFICIAL USE ONLY // RESTRICTED ACCESS (LEVEL 4)</span>
            </div>
          </div>

          {/* Authentication Mode Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg mb-5 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => setAuthMode('pki')}
              className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition ${
                authMode === 'pki'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Gov PKI</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('bio')}
              className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition ${
                authMode === 'bio'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span>Biometric</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('cac')}
              className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition ${
                authMode === 'cac'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>CAC / PIV</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Officer Badge ID / Civic Token
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-pewter-blue focus:ring-2 focus:ring-pewter-blue/20 transition"
                  placeholder="e.g. OFFICER-4882"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Cryptographic Access Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-pewter-blue focus:ring-2 focus:ring-pewter-blue/20 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Operational Jurisdiction / Zone
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-pewter-blue transition"
              >
                <option value="zone-4">Sector 4 — Bangalore Central & East Transit</option>
                <option value="zone-1">Sector 1 — North Metro Expressways</option>
                <option value="zone-2">Sector 2 — South Outer Ring & Tech Corridors</option>
                <option value="zone-all">City-Wide Joint Command Authority</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 rounded-lg bg-pewter-blue text-white font-semibold text-xs tracking-wide uppercase hover:bg-pewter-blue/90 active:scale-[0.99] transition shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>VERIFYING CREDENTIALS...</span>
                </>
              ) : (
                <>
                  <span>INITIALIZE SECURE COMMAND CONSOLE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-xs text-pewter-blue hover:text-pewter-blue/80 inline-flex items-center gap-1.5 font-medium transition"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Bypass with Demo Authority Clearance</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
