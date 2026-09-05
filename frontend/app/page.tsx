'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Bus,
  Cpu,
  Activity,
  ArrowRight,
  Eye,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileText,
  Lock,
  Compass,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-indigo-500 selection:text-white flex flex-col font-sans">
      
      {/* 1. TOP MUNICIPAL HEADER */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white font-sans uppercase">URBANSENSE</span>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">SMART BUS URBAN INTELLIGENCE PLATFORM</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-xs font-mono font-semibold text-slate-300 hover:text-white transition px-3 py-1.5 rounded-lg border border-slate-700/80 hover:bg-slate-800/60"
            >
              Authority Login
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono tracking-wide transition shadow-lg shadow-indigo-600/25 flex items-center gap-2"
            >
              <span>Launch OCC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.2),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-mono font-semibold mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Smart City Transit AI • Real-Time Edge Vision</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto font-sans">
            Turning Every Bus Into a <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-indigo-200 to-indigo-400">
              Mobile Urban Sensor
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            AI-powered road condition, traffic flow, and public-safety intelligence continuously collected from public transport buses moving across the city.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold font-mono tracking-wide transition shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-sm font-bold font-mono tracking-wide transition flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>See How It Works</span>
            </a>
          </div>

          {/* 3. CORE STORY PIPELINE VISUALIZATION */}
          <div className="mt-16 pt-10 border-t border-slate-800/80 max-w-5xl mx-auto">
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-6 font-bold">
              Autonomous Urban Sensing Architecture
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-left relative overflow-hidden group hover:border-indigo-500/50 transition">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                  <Bus className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white font-mono">1. Bus Cameras</div>
                <div className="text-[11px] text-slate-400 mt-1">Multi-angle onboard optical feeds monitor active transit routes.</div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-left relative overflow-hidden group hover:border-indigo-500/50 transition">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white font-mono">2. Edge AI Unit</div>
                <div className="text-[11px] text-slate-400 mt-1">Onboard YOLOv8 & ANPR inference detects potholes, hazards & vehicles.</div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-left relative overflow-hidden group hover:border-indigo-500/50 transition">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white font-mono">3. Urban Intelligence</div>
                <div className="text-[11px] text-slate-400 mt-1">Only lightweight event metadata + GPS + bounding boxes sent to OCC.</div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-left relative overflow-hidden group hover:border-indigo-500/50 transition">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white font-mono">4. Authority Action</div>
                <div className="text-[11px] text-slate-400 mt-1">Automatic triage & dispatch for Traffic Police & Municipal BBMP/PWD.</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section className="border-y border-slate-800 bg-slate-950/90 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black font-mono text-indigo-400">24+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">Buses Connected</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black font-mono text-indigo-400">142 km</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">Roads Monitored</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black font-mono text-indigo-400">1,280+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">AI Events Detected</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">94.2%</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">Incidents Resolved</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS & TWO-PILLAR ARCHITECTURE */}
      <section id="how-it-works" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">System Architecture</h2>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-sans">
              Two-Pillar Real-Time Architecture
            </p>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Designed for extreme bandwidth efficiency and high-fidelity civic intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-950/60 relative flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold mb-4">
                  PILLAR 01 • ONBOARD BUS EDGE UNIT
                </div>
                <h3 className="text-xl font-black text-white tracking-tight mb-3">
                  Edge AI &amp; Local Computer Vision
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Raw camera video never needs continuous transmission. The onboard edge unit processes multi-camera feeds locally at 30 FPS, recognizing asphalt defects, traffic violations, and vulnerable pedestrians.
                </p>

                <ul className="space-y-3 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-Time YOLOv8 Defect &amp; Hazard Classification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Automated Number Plate Recognition (ANPR OCR)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Edge Bandwidth Optimization: 99.4% Data Reduction</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <Link
                  href="/live"
                  className="text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5 transition"
                >
                  <span>Inspect Live Bus HUD Telemetry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-950/60 relative flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold mb-4">
                  PILLAR 02 • CENTRAL OPERATIONS CENTER
                </div>
                <h3 className="text-xl font-black text-white tracking-tight mb-3">
                  Centralized Urban Intelligence OCC
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  The central platform ingests verified event envelopes across the entire bus network, triangulating multi-bus detections to build GIS spatial heatmaps, corridor RCI ratings, and automated work orders.
                </p>

                <ul className="space-y-3 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Live Geospatial GIS Grid &amp; Color-Coded RCI Corridors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Multi-Bus Spatial Verification &amp; Confidence Rating</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Automated PWD &amp; Traffic Police E-Challan Workflow</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <Link
                  href="/dashboard"
                  className="text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5 transition"
                >
                  <span>Open Master Command Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CORE PLATFORM CAPABILITIES */}
      <section className="py-20 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">Operations Capabilities</h2>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-sans">
              Comprehensive Civic Sensing Modules
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Road &amp; Pothole Intelligence</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated detection of asphalt potholes, waterlogging, damaged dividers, and missing zebra crossings with depth estimation.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Traffic &amp; OD Flow Analytics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vehicle classification (cars, buses, autos, 2-wheelers), bottleneck hotspot analysis, and origin-destination traffic matrices.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Pedestrian &amp; School Safety</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Detection of vulnerable pedestrians, school-zone crossings, door footboard overcrowding, and high collision-risk situations.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">GIS Geospatial Map Grid</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive city map with live moving buses, color-coded corridor health polylines, and multi-layer hazard filtering.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Incident Action Registry</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Forensic dossiers with optical evidence frames, video snippets, ANPR plate OCR, and work order assignment lifecycle.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Civic Reports &amp; Audit Export</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated daily executive briefing packs with 1-click CSV downloads and printable municipal PDF audit sheets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white font-sans">UrbanSense Platform</span>
              <span className="text-[10px] text-slate-500 block font-mono">Smart India Hackathon (SIH 2026)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <Link href="/map" className="hover:text-white transition">GIS Map</Link>
            <Link href="/live" className="hover:text-white transition">Live Vision</Link>
            <Link href="/login" className="hover:text-white transition">Authority Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
