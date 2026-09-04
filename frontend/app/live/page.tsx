'use client';

import React from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { BusInfoHeader } from '@/components/live/BusInfoHeader';
import { VideoPanel } from '@/components/live/VideoPanel';
import { DetectionPanel } from '@/components/live/DetectionPanel';
import { LiveActivityFeed } from '@/components/live/LiveActivityFeed';
import { EventSimulatorControls } from '@/components/common/EventSimulatorControls';
import { Radio, Eye, Layers } from 'lucide-react';

export default function LiveMonitoringPage() {
  const { buses, selectedBusId } = useUrbanStore();
  const currentBus = buses.find((b) => b.bus_id === selectedBusId) || buses[0];

  return (
    <div className="space-y-6">
      {/* Simulation Controls Banner */}
      <EventSimulatorControls />

      {/* 1. Bus Info & Telemetry Header */}
      <BusInfoHeader bus={currentBus} />

      {/* 2. Main Live Monitoring Grid: Large Video Area + Detection Panel + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Large Optical Video Panel with Real-time AI Overlays */}
        <div className="lg:col-span-7 space-y-4">
          <VideoPanel bus={currentBus} />
        </div>

        {/* Right 5 Columns: Active Detection Breakdown & Scrolling Event Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Currently Detected Objects Panel */}
          <DetectionPanel
            detections={currentBus.detections_in_frame}
            busId={currentBus.bus_id}
          />

          {/* Real-time Scrolling Activity Feed */}
          <LiveActivityFeed />
        </div>
      </div>
    </div>
  );
}
