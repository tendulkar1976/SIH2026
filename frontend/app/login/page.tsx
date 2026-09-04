'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUrbanStore, AUTHORITY_PROFILES } from '@/store/useUrbanStore';
import { UserRole } from '@/types';
import {
  Shield,
  Lock,
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  Crown,
  ShieldAlert,
  Construction,
  KeyRound,
  LogIn,
  UserPlus,
  CheckCircle2,
  Fingerprint,
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, registerOfficer } = useUrbanStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [badgeId, setBadgeId] = useState(AUTHORITY_PROFILES.admin.badgeId);
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('traffic_authority');
  const [signupBadgeId, setSignupBadgeId] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPin, setSignupPin] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setBadgeId(AUTHORITY_PROFILES[role].badgeId);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const profile = AUTHORITY_PROFILES[selectedRole];
    login(profile);

    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupBadgeId.trim()) return;

    setLoading(true);

    const defaultDept =
      signupRole === 'admin'
        ? 'Joint Command Directorate'
        : signupRole === 'traffic_authority'
        ? 'Bangalore Traffic Police (TMC)'
        : 'Public Works Department (PWD & BBMP)';

    const defaultRoleTitle =
      signupRole === 'admin'
        ? 'Executive Administrator'
        : signupRole === 'traffic_authority'
        ? 'Traffic Enforcement Specialist'
        : 'Civic Infrastructure Engineer';

    registerOfficer({
      name: signupName.trim().toUpperCase(),
      role: signupRole,
      roleTitle: defaultRoleTitle,
      badgeId: signupBadgeId.trim().toUpperCase().startsWith('#')
        ? signupBadgeId.trim().toUpperCase()
        : `#${signupBadgeId.trim().toUpperCase()}`,
      department: signupDepartment.trim() || defaultDept,
      clearanceLevel: signupRole === 'admin' ? 'Level 5 (Full Authority)' : 'Level 4 (Field Officer)',
      email: signupEmail.trim() || `${signupName.toLowerCase().replace(/\s+/g, '.')}@urbansense.gov.in`,
    });

    setNotice(`Officer registered successfully! Redirecting to Command Console...`);

    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen -m-6 md:-m-8 flex flex-col items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background ambient elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative w-full max-w-lg">
        {/* Top Bar with Back Option */}
        <div className="flex items-center justify-between px-3.5 py-2 mb-3 bg-white border border-slate-200/90 rounded-xl shadow-xs">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Command Center</span>
          </Link>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-bold">
            SEC-AUTH v2.8
          </span>
        </div>

        {notice && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Main Authentication Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-clean space-y-6">
          {/* Brand Emblem */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-0.5 shadow-sm flex items-center justify-center mb-2">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight font-sans">
              URBANSENSE OCC
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Municipal Urban Intelligence & Fleet Sensing Gateway
            </p>
          </div>

          {/* Sign In / Sign Up Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                activeTab === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-600" />
              <span>Officer Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                activeTab === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span>New Registration</span>
            </button>
          </div>

          {activeTab === 'signin' ? (
            /* ================= SIGN IN TAB ================= */
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Select Authority Preset */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider block">
                  1. SELECT AUTHORITY ROLE:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'admin' as const,
                      label: 'Admin',
                      name: 'CMDR. R. Menon',
                      icon: Crown,
                      color: 'text-indigo-600',
                      border: 'border-indigo-400 bg-indigo-50 text-indigo-900',
                    },
                    {
                      id: 'traffic_authority' as const,
                      label: 'Traffic',
                      name: 'ACP V. Sharma',
                      icon: ShieldAlert,
                      color: 'text-rose-600',
                      border: 'border-rose-400 bg-rose-50 text-rose-900',
                    },
                    {
                      id: 'municipal_authority' as const,
                      label: 'Municipal',
                      name: 'ENG. K. Priya',
                      icon: Construction,
                      color: 'text-amber-600',
                      border: 'border-amber-400 bg-amber-50 text-amber-900',
                    },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSel = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleRoleSelect(r.id)}
                        className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                          isSel
                            ? `${r.border} font-bold shadow-xs ring-1 ring-indigo-500/20`
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSel ? r.color : 'text-slate-400'}`} />
                        <span className="text-xs font-bold leading-none">{r.label}</span>
                        <span className="text-[9px] font-mono text-slate-400 truncate max-w-full">
                          {r.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Badge ID Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1 font-mono">
                  Officer Badge ID / Token:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
                    placeholder="e.g. #MC-904"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1 font-mono">
                  Security Passphrase / Token PIN:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
                    required
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold uppercase transition shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>AUTHENTICATING OPERATOR...</span>
                  </>
                ) : (
                  <>
                    <span>INITIALIZE {selectedRole.replace('_', ' ').toUpperCase()} CONSOLE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= SIGN UP TAB ================= */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Select Role for New Officer */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-slate-700 block uppercase">
                  Select Authority Branch:
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  <option value="admin">👑 Admin / Joint Command Directorate</option>
                  <option value="traffic_authority">👮 Traffic Authority (Traffic Police & TMC)</option>
                  <option value="municipal_authority">🏛️ Municipal Authority (PWD & BBMP Civil)</option>
                </select>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block font-mono">
                  Officer Full Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Commander Rajesh Menon"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
                  required
                />
              </div>

              {/* Badge ID */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block font-mono">
                  Badge ID / Officer Token:
                </label>
                <input
                  type="text"
                  placeholder="e.g. #BTP-902"
                  value={signupBadgeId}
                  onChange={(e) => setSignupBadgeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
                  required
                />
              </div>

              {/* Email & PIN */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block font-mono">
                    Gov Email:
                  </label>
                  <input
                    type="email"
                    placeholder="officer@gov.in"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block font-mono">
                    Security PIN:
                  </label>
                  <input
                    type="password"
                    placeholder="••••••"
                    value={signupPin}
                    onChange={(e) => setSignupPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold uppercase transition shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>ENROLLING CREDENTIALS...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>REGISTER & AUTHORIZE CONSOLE ACCESS</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Direct Back Option Footer */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <Link
              href="/dashboard"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-mono font-semibold inline-flex items-center gap-1.5 transition"
            >
              <span>Direct Bypass → Enter Live Command Center</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
