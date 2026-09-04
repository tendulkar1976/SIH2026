'use client';

import React from 'react';
import { KPISection } from '@/components/dashboard/KPISection';
import { CriticalAlertsSection } from '@/components/dashboard/CriticalAlertsSection';
import { IncidentTrendChart } from '@/components/dashboard/IncidentTrendChart';
import { IncidentDistributionChart } from '@/components/dashboard/IncidentDistributionChart';
import { RecentIncidentsTable } from '@/components/dashboard/RecentIncidentsTable';
import { MapPreview } from '@/components/dashboard/MapPreview';
import { FleetSummaryWidget } from '@/components/dashboard/FleetSummaryWidget';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. KPI Section: Total Incidents, Potholes, Missing Zebra Crossings, Rash Driving, Vehicles Detected, Active Alerts */}
      <KPISection />

      {/* 2. Critical Priority Alerts Section */}
      <CriticalAlertsSection />

      {/* 3. Incident Trend & Incident Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incident Trend (Today, 7D, 30D) - 7 cols */}
        <div className="lg:col-span-7">
          <IncidentTrendChart />
        </div>

        {/* Incident Distribution (Potholes, Rash Driving, Crossings, ANPR, Traffic, Other) - 5 cols */}
        <div className="lg:col-span-5">
          <IncidentDistributionChart />
        </div>
      </div>

      {/* 4. Recent Incidents Table */}
      <RecentIncidentsTable />

      {/* 5. Map Preview & Fleet Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* City Map Preview - 7 cols */}
        <div className="lg:col-span-7">
          <MapPreview />
        </div>

        {/* Fleet Summary (Active, Offline, Cameras, Routes) - 5 cols */}
        <div className="lg:col-span-5">
          <FleetSummaryWidget />
        </div>
      </div>
    </div>
  );
}
