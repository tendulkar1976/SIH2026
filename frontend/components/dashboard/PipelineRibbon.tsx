'use client';

import React from 'react';
import {
  Bus,
  Cpu,
  MapPin,
  AlertTriangle,
  Server,
  Map as MapIcon,
  ShieldAlert,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const PipelineRibbon: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Bus Fleet',
      desc: 'Transit Mobile Units',
      icon: Bus,
      href: '/fleet',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      step: '02',
      title: 'Edge AI Unit',
      desc: 'YOLOv8 & ANPR Core',
      icon: Cpu,
      href: '/live',
      color: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      step: '03',
      title: 'Event Detection',
      desc: 'BBox + OCR + GPS',
      icon: MapPin,
      href: '/live',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      step: '04',
      title: 'Central Command',
      desc: 'UrbanSense Hub',
      icon: Server,
      href: '/dashboard',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      step: '05',
      title: 'GIS Spatial Map',
      desc: 'Dynamic Heatmaps',
      icon: MapIcon,
      href: '/map',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      step: '06',
      title: 'Priority Alert',
      desc: 'Triage Queue',
      icon: ShieldAlert,
      href: '/alerts',
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      step: '07',
      title: 'Civic Action',
      desc: 'PWD & Police Dispatch',
      icon: Wrench,
      href: '/road-intelligence',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-clean space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
            Autonomous Urban Sensing Pipeline Architecture
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          BANDWIDTH OPTIMIZED • ONBOARD EDGE INFERENCE
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.step}
              href={item.href}
              className="group p-2.5 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition relative flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9px] font-bold text-slate-400 group-hover:text-indigo-600">
                  STAGE {item.step}
                </span>
                <div className={`p-1 rounded-md border ${item.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 leading-tight">
                  {item.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
