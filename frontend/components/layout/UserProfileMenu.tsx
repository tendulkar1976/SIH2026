'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUrbanStore, AUTHORITY_PROFILES } from '@/store/useUrbanStore';
import { UserRole, UserProfile } from '@/types';
import { useRouter } from 'next/navigation';
import {
  Shield,
  UserCheck,
  Building2,
  ChevronDown,
  LogOut,
  LogIn,
  UserPlus,
  Lock,
  KeyRound,
  CheckCircle2,
  X,
  ArrowLeft,
  ShieldAlert,
  Car,
  Construction,
  Crown,
} from 'lucide-react';

export const UserProfileMenu: React.FC = () => {
  const router = useRouter();
  const { currentUser, switchRole, registerOfficer, login, logout, registeredUsers } = useUrbanStore();
  const [isOpen, setIsOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sign In form state
  const [selectedSignInRole, setSelectedSignInRole] = useState<UserRole>('admin');
  const [signInBadgeId, setSignInBadgeId] = useState(currentUser.badgeId);
  const [signInPassword, setSignInPassword] = useState('••••••••••••');

  // Sign Up form state
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('traffic_authority');
  const [signupBadgeId, setSignupBadgeId] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPin, setSignupPin] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setToastMessage(`Switched active console to ${AUTHORITY_PROFILES[role].name} (${AUTHORITY_PROFILES[role].roleTitle})`);
    setTimeout(() => setToastMessage(null), 3000);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/login');
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = AUTHORITY_PROFILES[selectedSignInRole];
    login(profile);
    setAuthModalMode(null);
    setToastMessage(`Signed in successfully as ${profile.name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupBadgeId.trim()) return;

    const defaultDept =
      signupRole === 'admin'
        ? 'Joint Command Authority'
        : signupRole === 'traffic_authority'
        ? 'Bangalore Traffic Police (TMC)'
        : 'Public Works Department (PWD & BBMP)';

    const defaultRoleTitle =
      signupRole === 'admin'
        ? 'Executive Administrator'
        : signupRole === 'traffic_authority'
        ? 'Traffic Enforcement Specialist'
        : 'Civic Infrastructure Engineer';

    const defaultClearance =
      signupRole === 'admin' ? 'Level 5 (Full Authority)' : 'Level 4 (Field Officer)';

    registerOfficer({
      name: signupName.trim().toUpperCase(),
      role: signupRole,
      roleTitle: defaultRoleTitle,
      badgeId: signupBadgeId.trim().toUpperCase().startsWith('#') ? signupBadgeId.trim().toUpperCase() : `#${signupBadgeId.trim().toUpperCase()}`,
      department: signupDepartment.trim() || defaultDept,
      clearanceLevel: defaultClearance,
      email: signupEmail.trim() || `${signupName.toLowerCase().replace(/\s+/g, '.')}@urbansense.gov.in`,
    });

    setAuthModalMode(null);
    setToastMessage(`Officer registration verified. Logged in as ${signupName.toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 3500);

    // Reset fields
    setSignupName('');
    setSignupBadgeId('');
    setSignupDepartment('');
    setSignupEmail('');
    setSignupPin('');
  };

  const getRoleTheme = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          avatarBg: 'bg-slate-900 text-indigo-400 border-slate-800',
          icon: Crown,
          label: 'ADMIN CONSOLE',
        };
      case 'traffic_authority':
        return {
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          avatarBg: 'bg-rose-950 text-rose-400 border-rose-800',
          icon: ShieldAlert,
          label: 'TRAFFIC AUTHORITY',
        };
      case 'municipal_authority':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          avatarBg: 'bg-amber-950 text-amber-400 border-amber-800',
          icon: Construction,
          label: 'MUNICIPAL AUTHORITY',
        };
    }
  };

  const currentTheme = getRoleTheme(currentUser.role);
  const CurrentIcon = currentTheme.icon;

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl flex items-center gap-2.5 text-xs font-mono animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Trigger Container */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all duration-200 shadow-2xs group ${
            isOpen
              ? 'bg-slate-100 border-indigo-300 ring-2 ring-indigo-500/10'
              : 'bg-white hover:bg-slate-50 border-slate-200/90'
          }`}
          title="User Profile & Authority Roles"
        >
          {/* Avatar with Status Dot */}
          <div className="relative">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shadow-2xs border ${currentTheme.avatarBg}`}
            >
              {currentUser.initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          {/* User Info Label */}
          <div className="hidden lg:block text-left font-mono">
            <div className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors flex items-center gap-1">
              <span>{currentUser.name}</span>
            </div>
            <div className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider">
              {currentUser.department.split(' ')[0]} // {currentUser.badgeId}
            </div>
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            {/* Header: Officer Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-xs border ${currentTheme.avatarBg}`}
                  >
                    {currentUser.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-sans leading-tight">
                      {currentUser.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {currentUser.roleTitle}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${currentTheme.badge}`}
                >
                  {currentUser.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/60 font-mono text-[10px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Badge Token:</span>
                  <strong className="text-slate-800">{currentUser.badgeId}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Clearance:</span>
                  <strong className="text-indigo-600">{currentUser.clearanceLevel}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Gov Agency:</span>
                  <span className="text-slate-700 truncate max-w-[150px]">{currentUser.department}</span>
                </div>
              </div>
            </div>

            {/* Role Switcher Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
                <span>SWITCH AUTHORITY ROLE</span>
                <span className="text-indigo-600">3 ROLES</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {/* 1. Admin Profile */}
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    currentUser.role === 'admin'
                      ? 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200/70 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      <Crown className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span>Admin (Joint Command)</span>
                        {currentUser.role === 'admin' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">CMDR. R. Menon • #MC-904</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-700 font-bold bg-white px-2 py-0.5 rounded border border-indigo-200">
                    DIRECTOR
                  </span>
                </button>

                {/* 2. Traffic Authority Profile */}
                <button
                  onClick={() => handleRoleSwitch('traffic_authority')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    currentUser.role === 'traffic_authority'
                      ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-500/20 shadow-xs'
                      : 'bg-white border-slate-200/70 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span>Traffic Authority</span>
                        {currentUser.role === 'traffic_authority' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">ACP V. Sharma • #BTP-412</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-rose-700 font-bold bg-white px-2 py-0.5 rounded border border-rose-200">
                    POLICE TMC
                  </span>
                </button>

                {/* 3. Municipal Authority Profile */}
                <button
                  onClick={() => handleRoleSwitch('municipal_authority')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    currentUser.role === 'municipal_authority'
                      ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-slate-200/70 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      <Construction className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span>Municipal Authority</span>
                        {currentUser.role === 'municipal_authority' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">ENG. K. Priya • #BBMP-780</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-800 font-bold bg-white px-2 py-0.5 rounded border border-amber-200">
                    PWD BBMP
                  </span>
                </button>
              </div>
            </div>

            {/* Auth Actions: Sign In / Sign Up / Log Out */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <button
                onClick={() => {
                  setAuthModalMode('signin');
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center justify-between font-medium font-mono text-xs"
              >
                <div className="flex items-center gap-2">
                  <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sign In / Switch Operator</span>
                </div>
                <span className="text-[10px] text-slate-400">Login Form →</span>
              </button>

              <button
                onClick={() => {
                  setAuthModalMode('signup');
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition flex items-center justify-between font-semibold font-mono text-xs border border-indigo-100"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sign Up / Register Officer</span>
                </div>
                <span className="text-[10px] bg-white text-indigo-600 px-1.5 py-0.5 rounded font-bold border border-indigo-200">
                  + New
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition flex items-center justify-between font-semibold font-mono text-xs border border-rose-100"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Log Out / Lock Console</span>
                </div>
                <span className="text-[10px] text-rose-600">Lock Session</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* AUTH & REGISTRATION MODAL (SIGN IN / SIGN UP)             */}
      {/* ========================================================= */}
      {authModalMode && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-xs">
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAuthModalMode(null)}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition mr-1"
                  title="Back to Command Center"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-sans">
                    {authModalMode === 'signin' ? 'Officer Authentication' : 'New Officer Registration'}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-500">
                    Municipal Urban Intelligence Security Portal
                  </p>
                </div>
              </div>

              {/* Close / Back button */}
              <button
                onClick={() => setAuthModalMode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                title="Close and Return"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 font-mono text-xs">
              <button
                type="button"
                onClick={() => setAuthModalMode('signin')}
                className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                  authModalMode === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sign In (Login)</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthModalMode('signup')}
                className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                  authModalMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sign Up (Register)</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {authModalMode === 'signin' ? (
                /* ================= SIGN IN FORM ================= */
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {/* Select Role Quick Preset */}
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold font-mono text-[11px] block">
                      SELECT AUTHORITY ROLE:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'admin' as const, label: 'Admin', icon: Crown, desc: 'Command' },
                        { id: 'traffic_authority' as const, label: 'Traffic', icon: ShieldAlert, desc: 'Police' },
                        { id: 'municipal_authority' as const, label: 'Municipal', icon: Construction, desc: 'PWD/BBMP' },
                      ].map((r) => {
                        const Icon = r.icon;
                        const isSel = selectedSignInRole === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              setSelectedSignInRole(r.id);
                              setSignInBadgeId(AUTHORITY_PROFILES[r.id].badgeId);
                            }}
                            className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                              isSel
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isSel ? 'text-indigo-600' : 'text-slate-400'}`} />
                            <span className="text-[11px] leading-none">{r.label}</span>
                            <span className="text-[9px] font-mono text-slate-400">{r.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Badge ID Input */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold font-mono text-[11px] block">
                      OFFICER BADGE ID / TOKEN:
                    </label>
                    <input
                      type="text"
                      value={signInBadgeId}
                      onChange={(e) => setSignInBadgeId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold font-mono text-[11px] block">
                      SECURITY PIN / PASSPHRASE:
                    </label>
                    <input
                      type="password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
                      required
                    />
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setAuthModalMode(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Authenticate & Sign In</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* ================= SIGN UP FORM ================= */
                <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                  {/* Select Role for New Officer */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold font-mono text-[11px] block">
                      OFFICER AUTHORITY BRANCH:
                    </label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                    >
                      <option value="admin">👑 Admin / Joint Command Directorate</option>
                      <option value="traffic_authority">👮 Traffic Authority (Traffic Police & TMC)</option>
                      <option value="municipal_authority">🏛️ Municipal Authority (PWD & BBMP Civil)</option>
                    </select>
                  </div>

                  {/* Officer Name */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold font-mono text-[11px] block">
                      OFFICER FULL NAME:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Inspector Anil Rao"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
                      required
                    />
                  </div>

                  {/* Badge ID */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold font-mono text-[11px] block">
                      BADGE NUMBER / TOKEN ID:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. #BTP-992"
                      value={signupBadgeId}
                      onChange={(e) => setSignupBadgeId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
                      required
                    />
                  </div>

                  {/* Email & PIN */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold font-mono text-[11px] block">
                        GOV EMAIL:
                      </label>
                      <input
                        type="email"
                        placeholder="officer@gov.in"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold font-mono text-[11px] block">
                        SECURITY PIN:
                      </label>
                      <input
                        type="password"
                        placeholder="••••••"
                        value={signupPin}
                        onChange={(e) => setSignupPin(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Actions Bar with Back Option */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setAuthModalMode(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register & Authorize</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
