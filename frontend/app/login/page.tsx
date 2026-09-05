'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUrbanStore } from '@/store/useUrbanStore';
import { UserRole, UserProfile } from '@/types';
import {
  Shield,
  Lock,
  User,
  ArrowRight,
  Crown,
  ShieldAlert,
  Construction,
  Car,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Radio,
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
    if (selectedRole === 'traffic_authority') return 'TRAFFIC AUTHORITY';
    return 'MUNICIPAL AUTHORITY';
  };

  return (
    <div className="min-h-screen -m-6 md:-m-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 text-slate-800 relative overflow-hidden flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. Subtle Atmospheric Background Shapes */}
      <div className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] rounded-full bg-indigo-400/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[800px] h-[300px] bg-gradient-to-t from-blue-100/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* 2. Top Header Bar: Branding Left, Powered By AI Right */}
      <header className="relative z-10 w-full px-6 sm:px-12 py-5 flex items-center justify-between">
        {/* Top Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/30 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 leading-none">
              URBANSENSE OCC
            </div>
            <div className="text-[11px] font-sans text-slate-500 font-medium tracking-wide mt-0.5">
              Safer Roads. Smarter Cities.
            </div>
          </div>
        </div>

        {/* Top Right Subtitle */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
            POWERED BY AI • FOR SMARTER CITIES
          </span>
        </div>
      </header>

      {/* 3. Main Split Screen Body */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-4 lg:py-6 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
        
        {/* LEFT HERO SECTION (52%) */}
        <div className="w-full lg:w-[52%] flex flex-col justify-center space-y-6">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider w-fit">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>MUNICIPAL URBAN INTELLIGENCE PLATFORM</span>
          </div>

          {/* Large Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-sans tracking-tight leading-[1.12]">
            Intelligent Buses <br />
            <span className="text-blue-600">for Smarter Cities</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
            Transforming public transport into mobile urban sensing units for safer roads, efficient infrastructure and a better tomorrow.
          </p>

          {/* Feature Highlights: 4 horizontal blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            
            {/* Feature 1 */}
            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center shrink-0">
                <Construction className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight">Detect</div>
                <div className="text-[11px] font-bold text-slate-600 leading-tight">Road Issues</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight">Monitor</div>
                <div className="text-[11px] font-bold text-slate-600 leading-tight">Traffic</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200/60 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight">Enhance</div>
                <div className="text-[11px] font-bold text-slate-600 leading-tight">Public Safety</div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight">Enable</div>
                <div className="text-[11px] font-bold text-slate-600 leading-tight">Data Decisions</div>
              </div>
            </div>

          </div>

          {/* Hero Visual: Premium Smart-City Bus */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-md shadow-slate-200/60 group bg-slate-100">
            <div className="aspect-[16/8.5] relative w-full overflow-hidden">
              <Image
                src="/images/smart_city_bus.jpg"
                alt="AI-Powered Smart Bus Urban Sensing Unit"
                fill
                priority
                className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Telemetry Badge Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[10px] font-mono">
                <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/20 font-semibold">
                  <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
                  Edge AI Vision Sensing Fleet • 6 Nodes Online
                </span>
                <span className="hidden sm:inline-block bg-blue-600/90 backdrop-blur-xs px-2 py-1 rounded-md font-bold">
                  29.8 FPS Stream
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT LOGIN CARD (48%) */}
        <div className="w-full lg:w-[48%] max-w-[560px]">
          
          {notice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-semibold flex items-center gap-2 shadow-xs">
              <BadgeAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Authentication Card */}
          <div className="bg-white p-7 sm:p-9 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-5">
            
            {/* Card Header */}
            <div className="flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-2 shadow-2xs">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight font-sans">
                URBANSENSE OCC
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Sign in to your account
              </p>
            </div>

            {/* Auth Tabs Segmented Control */}
            <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className={`py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
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
                className={`py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
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
              <form onSubmit={handleSignIn} className="space-y-4">
                
                {/* Authority Branch Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider block">
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
                        icon: ShieldAlert,
                      },
                      {
                        id: 'municipal_authority' as const,
                        label: 'Municipal Authority',
                        desc: 'PWD & BBMP Civil',
                        icon: Construction,
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
                              ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold shadow-2xs ring-1 ring-blue-500/20'
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1 font-mono">
                    Officer Name:
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                      placeholder="Enter your name..."
                      required
                    />
                  </div>
                </div>

                {/* Badge ID Input */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1 font-mono">
                    Officer Badge ID / Token:
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs font-mono text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs font-mono text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                      placeholder="••••••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wide transition-all shadow-md shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 mt-1 cursor-pointer"
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
              <form onSubmit={handleSignUp} className="space-y-3.5">
                
                {/* Select Role for New Officer */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-600 block uppercase">
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

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block font-mono">
                    Officer Full Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter officer full name..."
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Sign Up Button */}
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

            {/* Direct Bypass Secondary Action */}
            <div className="pt-3 border-t border-slate-100 text-center">
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

      {/* 4. Small Footer Text */}
      <footer className="relative z-10 w-full px-6 sm:px-12 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2 border-t border-slate-200/50">
        <div>
          <span>PEOPLE &nbsp;|&nbsp; PLACES &nbsp;|&nbsp; PROGRESS</span>
        </div>
        <div className="tracking-widest uppercase font-semibold text-slate-400">
          CLEANER • SAFER • SMARTER • TOGETHER
        </div>
      </footer>

    </div>
  );
}
