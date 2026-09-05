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
  Crown,
  ShieldAlert,
  Building2,
  Construction,
  Car,
  BarChart3,
  CheckCircle2,
  Sparkles,
  BadgeAlert,
  LogIn,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { apiService } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const { login, registerOfficer } = useUrbanStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [officerName, setOfficerName] = useState('Commander R. Menon');
  const [badgeId, setBadgeId] = useState('#MC-904');
  const [password, setPassword] = useState('adminpassword');
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
      setBadgeId('#MC-904');
      setPassword('adminpassword');
    } else if (role === 'traffic_authority') {
      setOfficerName('ACP V. Sharma');
      setBadgeId('#BTP-412');
      setPassword('trafficpassword');
    } else {
      setOfficerName('Eng. K. Priya');
      setBadgeId('#BBMP-780');
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
    const badge = badgeId.trim() || '#OCC-001';
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

  const getRoleDisplayName = () => {
    if (selectedRole === 'admin') return 'ADMIN';
    if (selectedRole === 'traffic_authority') return 'TRAFFIC';
    return 'MUNICIPAL';
  };

  return (
    <div className="min-h-screen -m-6 md:-m-8 bg-[#f5f8fc] text-slate-800 relative overflow-hidden flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 font-sans">
      
      {/* 1. Background City Bus Graphic (BMTC Electric Bus) across lower left */}
      <div className="absolute bottom-0 left-0 w-full lg:w-[62%] h-[55%] lg:h-[68%] pointer-events-none -z-0">
        <Image
          src="/images/bmtc_bus.jpg"
          alt="BMTC Electric Bus in Bangalore"
          fill
          priority
          className="object-cover object-left-bottom opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f5f8fc]/40 via-transparent to-[#f5f8fc]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f5f8fc]/30 to-[#f5f8fc]" />
      </div>

      {/* Atmospheric glow shapes */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-sky-200/15 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* 2. Top Header Bar: Powered By AI on Right */}
      <header className="relative z-10 w-full px-6 sm:px-12 py-5 flex items-center justify-end">
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
          POWERED BY AI • FOR SMARTER CITIES
        </span>
      </header>

      {/* 3. Main Split Screen Body */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-2 lg:py-4 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
        
        {/* LEFT HERO SECTION (52%) */}
        <div className="w-full lg:w-[52%] flex flex-col justify-center space-y-6">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50/90 backdrop-blur-xs border border-blue-200/90 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider w-fit shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>MUNICIPAL URBAN INTELLIGENCE PLATFORM</span>
          </div>

          {/* Large Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 font-sans tracking-tight leading-[1.08]">
            Intelligent Buses <br />
            <span className="text-blue-600">for Smarter Cities</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-lg">
            Transforming public transport into mobile urban sensing units for safer roads, efficient infrastructure and a better tomorrow.
          </p>

          {/* 4 Feature Highlights Side-by-Side */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl pt-2">
            
            {/* Feature 1 */}
            <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200/80 shadow-xs flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Construction className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">Detect</div>
                <div className="text-[11px] font-medium text-slate-500 leading-tight">Road Issues</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200/80 shadow-xs flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">Monitor</div>
                <div className="text-[11px] font-medium text-slate-500 leading-tight">Traffic</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200/80 shadow-xs flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">Enhance</div>
                <div className="text-[11px] font-medium text-slate-500 leading-tight">Public Safety</div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200/80 shadow-xs flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">Enable</div>
                <div className="text-[11px] font-medium text-slate-500 leading-tight">Data-Driven Decisions</div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT LOGIN CARD (48%) */}
        <div className="w-full lg:w-[48%] max-w-[480px]">
          
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

          {/* Authentication Card matching screenshot exactly */}
          <div className="bg-white/95 backdrop-blur-md p-7 sm:p-9 rounded-[2rem] border border-slate-200/90 shadow-2xl shadow-blue-100/60 space-y-4">
            
            {/* Top Shield Emblem */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-2 shadow-2xs">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight font-sans">
                URBANSENSE OCC
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Sign in to your account
              </p>
            </div>

            {/* Auth Tabs Segmented Control */}
            <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 text-xs font-mono gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'signin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Officer Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'signup'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>New Registration</span>
              </button>
            </div>

            {activeTab === 'signin' ? (
              /* ================= SIGN IN TAB ================= */
              <form onSubmit={handleSignIn} className="space-y-3.5">
                
                {/* Authority Branch Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    1. SELECT AUTHORITY BRANCH:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        id: 'admin' as const,
                        label: 'Admin',
                        desc: 'Joint Command',
                        icon: Crown,
                      },
                      {
                        id: 'traffic_authority' as const,
                        label: 'Traffic Authority',
                        desc: 'Traffic Police & TMC',
                        icon: Shield,
                      },
                      {
                        id: 'municipal_authority' as const,
                        label: 'Municipal Authority',
                        desc: 'PWD & BBMP Civil',
                        icon: Building2,
                      },
                    ].map((r) => {
                      const Icon = r.icon;
                      const isSel = selectedRole === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleRoleSelect(r.id)}
                          className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                            isSel
                              ? 'border-2 border-blue-500 bg-blue-50/70 text-blue-900 font-bold shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSel ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold leading-tight">{r.label}</span>
                          <span className="text-[9px] font-mono text-slate-400 truncate max-w-full">
                            {r.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Officer Name */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1 font-mono">
                    Officer Name:
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                      placeholder="Enter your name..."
                      required
                    />
                  </div>
                </div>

                {/* Badge ID Input */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1 font-mono">
                    Officer Badge ID / Token:
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs font-mono text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                      placeholder="e.g. #MC-904"
                      required
                    />
                  </div>
                </div>

                {/* Passphrase Input with Eye Toggle */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1 font-mono">
                    Security Passphrase / Token PIN:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs font-mono text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                      placeholder="••••••••••••"
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

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-600/20 transition active:scale-[0.99] flex items-center justify-center gap-2 mt-1 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>AUTHENTICATING OPERATOR...</span>
                    </>
                  ) : (
                    <>
                      <span>SIGN IN AS {getRoleDisplayName()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* ================= SIGN UP TAB ================= */
              <form onSubmit={handleSignUp} className="space-y-3">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500 block uppercase">
                    Select Authority Branch:
                  </label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="admin">👑 Admin / Joint Command Directorate</option>
                    <option value="traffic_authority">👮 Traffic Authority (Traffic Police & TMC)</option>
                    <option value="municipal_authority">🏛️ Municipal Authority (PWD & BBMP Civil)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 block font-mono">
                    Officer Full Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter officer full name..."
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 block font-mono">
                    Badge ID / Token:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. #BTP-902"
                    value={signupBadgeId}
                    onChange={(e) => setSignupBadgeId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block font-mono">
                      Gov Email:
                    </label>
                    <input
                      type="email"
                      placeholder="officer@gov.in"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block font-mono">
                      Security PIN:
                    </label>
                    <input
                      type="password"
                      placeholder="••••••"
                      value={signupPin}
                      onChange={(e) => setSignupPin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 mt-2 cursor-pointer"
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

            {/* Direct Bypass */}
            <div className="pt-2 border-t border-slate-100 text-center">
              <Link
                href="/dashboard"
                className="text-xs text-blue-600 hover:text-blue-800 font-mono font-semibold inline-flex items-center gap-1.5 transition"
              >
                <span>Direct Bypass → Enter Live Command Center</span>
              </Link>
            </div>

          </div>
        </div>

      </main>

      {/* 4. Footer: People Places Progress on Left, Cleaner Safer Smarter Together on Right */}
      <footer className="relative z-10 w-full px-6 sm:px-12 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
        <div>
          <span className="font-semibold tracking-wider">PEOPLE &nbsp;|&nbsp; PLACES &nbsp;|&nbsp; PROGRESS</span>
        </div>
        <div className="flex flex-col text-right text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase leading-tight">
          <span>CLEANER</span>
          <span>SAFER</span>
          <span>SMARTER</span>
          <span>TOGETHER</span>
        </div>
      </footer>

    </div>
  );
}
