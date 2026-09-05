'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUrbanStore } from '@/store/useUrbanStore';
import { UserRole, UserProfile } from '@/types';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle2,
  BadgeAlert,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { apiService } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const { login, registerOfficer } = useUrbanStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('traffic_authority');
  const [officerName, setOfficerName] = useState('ACP V. Sharma');
  const [badgeId, setBadgeId] = useState('OCC-4821');
  const [password, setPassword] = useState('trafficpassword');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('traffic_authority');
  const [signupBadgeId, setSignupBadgeId] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPin, setSignupPin] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'admin') {
      setOfficerName('Commander R. Menon');
      setBadgeId('MC-904');
      setPassword('adminpassword');
    } else if (role === 'traffic_authority') {
      setOfficerName('ACP V. Sharma');
      setBadgeId('OCC-4821');
      setPassword('trafficpassword');
    } else {
      setOfficerName('Eng. K. Priya');
      setBadgeId('BBMP-780');
      setPassword('municipalpassword');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const username = selectedRole === 'admin' ? 'admin' : selectedRole === 'traffic_authority' ? 'traffic' : 'municipal';
    const pwd = password || (selectedRole === 'admin' ? 'adminpassword' : selectedRole === 'traffic_authority' ? 'trafficpassword' : 'municipalpassword');

    const result = await apiService.login(username, pwd);

    const name = officerName.trim() || (selectedRole === 'admin' ? 'Admin Officer' : selectedRole === 'traffic_authority' ? 'Traffic Officer' : 'Municipal Officer');
    const badge = badgeId.trim() || 'OCC-001';
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'OF';

    const defaultDept =
      selectedRole === 'admin'
        ? 'Civic Command & Urban Intelligence'
        : selectedRole === 'traffic_authority'
        ? 'Bangalore Traffic Police (TMC)'
        : 'Public Works Department (PWD & BBMP)';

    const defaultRoleTitle =
      selectedRole === 'admin'
        ? 'Joint Command Director'
        : selectedRole === 'traffic_authority'
        ? 'Traffic Enforcement Officer'
        : 'Chief Infrastructure Engineer';

    const userProfile: UserProfile = result.user || {
      id: `usr-${Date.now()}`,
      name: name.toUpperCase(),
      initials,
      role: selectedRole,
      roleTitle: defaultRoleTitle,
      badgeId: badge.startsWith('#') ? badge : `#${badge}`,
      department: defaultDept,
      clearanceLevel: selectedRole === 'admin' ? 'Level 5 (Full Authority)' : 'Level 4 (Field Officer)',
      email: `${name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '.')}@urbansense.gov.in`,
    };

    login(userProfile);
    setLoading(false);
    router.push('/dashboard');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupBadgeId.trim()) return;

    setLoading(true);
    setErrorMessage(null);

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

    const username = signupName.toLowerCase().replace(/\s+/g, '_');
    const pwd = signupPin || 'officer123';

    await apiService.register(username, pwd, signupRole);

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

    setNotice(`Officer ${signupName.toUpperCase()} registered successfully! Accessing console...`);

    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  const getRoleButtonText = () => {
    if (selectedRole === 'admin') return 'Sign In as Admin';
    if (selectedRole === 'traffic_authority') return 'Sign In as Traffic';
    return 'Sign In as Municipal';
  };

  return (
    <div className="min-h-screen -m-6 md:-m-8 bg-[#f5f8ff] relative overflow-hidden flex items-center justify-center p-4 sm:p-6 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      
      {/* Subtle Background Grid & Atmospheric Circles */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[linear-gradient(to_right,#e0e7ff_1px,transparent_1px),linear-gradient(to_bottom,#e0e7ff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-200/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Centered Login Card */}
      <div className="relative z-10 w-full max-w-[460px]">
        
        {notice && (
          <div className="mb-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-semibold flex items-center gap-2 shadow-xs">
            <BadgeAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* The Card Container matching screenshot */}
        <div className="bg-white rounded-[2rem] border border-slate-200/70 shadow-2xl shadow-indigo-100/80 p-7 sm:p-9 space-y-5">
          
          {/* Top Circular Shield Emblem */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-indigo-100/70 to-purple-100/40 border border-indigo-200/60 flex items-center justify-center mb-3 shadow-inner">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
              URBANSENSE OCC
            </h1>
            <p className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              MUNICIPAL URBAN INTELLIGENCE • FLEET SENSING GATEWAY
            </p>
          </div>

          {/* Segmented Control: Officer Sign In | New Registration */}
          <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/50 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'signin'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Officer Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>New Registration</span>
            </button>
          </div>

          {activeTab === 'signin' ? (
            /* ================= SIGN IN TAB ================= */
            <form onSubmit={handleSignIn} className="space-y-4">
              
              {/* Authority Branch Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  AUTHORITY BRANCH
                </label>
                
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Admin */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('admin')}
                    className={`py-3 px-2 rounded-2xl border transition flex flex-col items-center justify-center text-center gap-1.5 ${
                      selectedRole === 'admin'
                        ? 'bg-indigo-50/60 border-2 border-indigo-400 text-indigo-700 shadow-2xs'
                        : 'bg-slate-50/50 border border-slate-200/70 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <UserCheck className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-[11px] font-mono font-bold leading-tight">Admin</span>
                  </button>

                  {/* Traffic Authority */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('traffic_authority')}
                    className={`py-3 px-2 rounded-2xl border transition flex flex-col items-center justify-center text-center gap-1.5 ${
                      selectedRole === 'traffic_authority'
                        ? 'bg-indigo-50/60 border-2 border-indigo-400 text-indigo-700 shadow-2xs'
                        : 'bg-slate-50/50 border border-slate-200/70 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-2.5 h-4 rounded-sm border border-current flex flex-col items-center justify-around py-0.5">
                        <div className="w-1 h-1 rounded-full bg-current opacity-80" />
                        <div className="w-1 h-1 rounded-full bg-current opacity-80" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold leading-tight">
                      Traffic<br />Authority
                    </span>
                  </button>

                  {/* Municipal Authority */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('municipal_authority')}
                    className={`py-3 px-2 rounded-2xl border transition flex flex-col items-center justify-center text-center gap-1.5 ${
                      selectedRole === 'municipal_authority'
                        ? 'bg-indigo-50/60 border-2 border-indigo-400 text-indigo-700 shadow-2xs'
                        : 'bg-slate-50/50 border border-slate-200/70 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 ${selectedRole === 'municipal_authority' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-mono font-bold leading-tight">
                      Municipal<br />Authority
                    </span>
                  </button>
                </div>
              </div>

              {/* Officer Name Field */}
              <div>
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  OFFICER NAME
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200/80 text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/60 transition"
                    placeholder="Full name"
                    required
                  />
                </div>
              </div>

              {/* Badge ID Field */}
              <div>
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  BADGE ID
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200/80 text-xs font-mono text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/60 transition"
                    placeholder="e.g. OCC-4821"
                    required
                  />
                </div>
              </div>

              {/* Passphrase Field */}
              <div>
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  PASSPHRASE
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-slate-200/80 text-xs font-mono text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/60 transition"
                    placeholder="Enter passphrase"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition active:scale-[0.99] flex items-center justify-center gap-2 mt-1 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>{getRoleButtonText()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= SIGN UP TAB ================= */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                  AUTHORITY BRANCH
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
                >
                  <option value="traffic_authority">Traffic Authority (Traffic Police & TMC)</option>
                  <option value="admin">Admin (Joint Command Directorate)</option>
                  <option value="municipal_authority">Municipal Authority (PWD & BBMP Civil)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                  OFFICER FULL NAME
                </label>
                <input
                  type="text"
                  placeholder="Officer full name..."
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                  BADGE ID / TOKEN
                </label>
                <input
                  type="text"
                  placeholder="e.g. OCC-4821"
                  value={signupBadgeId}
                  onChange={(e) => setSignupBadgeId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                    GOV EMAIL
                  </label>
                  <input
                    type="email"
                    placeholder="officer@gov.in"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                    SECURITY PIN
                  </label>
                  <input
                    type="password"
                    placeholder="••••••"
                    value={signupPin}
                    onChange={(e) => setSignupPin(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs font-mono uppercase transition shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>ENROLLING CREDENTIALS...</span>
                  </>
                ) : (
                  <>
                    <span>REGISTER & AUTHORIZE CONSOLE ACCESS</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200/80"></div>
            <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-400 font-bold uppercase">
              OR
            </span>
            <div className="flex-grow border-t border-slate-200/80"></div>
          </div>

          {/* Direct Bypass Link */}
          <div className="text-center pt-0.5">
            <Link
              href="/dashboard"
              className="text-xs font-mono text-indigo-600 hover:text-indigo-800 font-medium transition inline-flex items-center gap-1.5"
            >
              <span>Direct Bypass → Enter Live Command Center</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
