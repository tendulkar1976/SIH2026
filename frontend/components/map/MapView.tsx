'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { IncidentEvent, BusTelemetry } from '@/types';
import {
  Filter,
  Flame,
  Globe,
  Radio,
} from 'lucide-react';

export type MapFilterCategory =
  | 'all'
  | 'potholes'
  | 'missing_crossings'
  | 'rash_driving'
  | 'hit_and_run'
  | 'traffic';

interface MapViewProps {
  selectedFilter?: MapFilterCategory;
  showHeatmap?: boolean;
  tileProvider?: 'light' | 'osm';
  height?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  selectedFilter = 'all',
  showHeatmap: initialHeatmap = false,
  tileProvider: initialTileProvider = 'light',
  height = '680px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const busMarkersRef = useRef<{ [key: string]: any }>({});
  const heatmapCirclesRef = useRef<any[]>([]);

  const { incidents, buses } = useUrbanStore();

  const [activeFilter, setActiveFilter] = useState<MapFilterCategory>(selectedFilter);
  const [isHeatmapActive, setIsHeatmapActive] = useState<boolean>(initialHeatmap);
  const [tileMode, setTileMode] = useState<'light' | 'osm'>(initialTileProvider);
  const [showBusFleet, setShowBusFleet] = useState<boolean>(true);

  // Synchronize prop filter if updated externally
  useEffect(() => {
    setActiveFilter(selectedFilter);
  }, [selectedFilter]);

  const isHitAndRun = (inc: IncidentEvent) => {
    return inc.description.toLowerCase().includes('hit-and-run') || inc.id === 'INC-1051';
  };

  const getMarkerCategory = (inc: IncidentEvent): MapFilterCategory => {
    if (isHitAndRun(inc)) return 'hit_and_run';
    if (inc.type === 'pothole') return 'potholes';
    if (inc.type === 'missing_crossing') return 'missing_crossings';
    if (inc.type === 'rash_driving') return 'rash_driving';
    return 'traffic';
  };

  const getMarkerColor = (inc: IncidentEvent) => {
    if (isHitAndRun(inc)) return '#dc2626'; // Red
    if (inc.type === 'rash_driving') return '#e11d48'; // Rose
    if (inc.type === 'pothole') return '#d97706'; // Amber
    if (inc.type === 'missing_crossing') return '#5c8dc5'; // Cobalt Blue
    if (inc.type === 'anpr') return '#7c3aed'; // Purple
    return '#475569'; // Slate
  };

  const getTypeName = (inc: IncidentEvent) => {
    if (isHitAndRun(inc)) return 'Hit-and-Run Suspect';
    if (inc.type === 'pothole') return 'Road Pothole';
    if (inc.type === 'missing_crossing') return 'Missing Zebra Crossing';
    if (inc.type === 'rash_driving') return 'Rash Driving';
    if (inc.type === 'anpr') return 'ANPR Hotlist Hit';
    return 'Traffic Anomaly';
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current) {
        // Centered around central Bangalore command zone
        const map = L.map(mapContainerRef.current, {
          center: [12.9516, 77.6346],
          zoom: 12,
          zoomControl: false,
        });

        // Add Tile Layer (Default: OpenStreetMap)
        const tileUrl =
          tileMode === 'osm'
            ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

        const layer = L.tileLayer(tileUrl, {
          attribution,
          maxZoom: 19,
        }).addTo(map);

        tileLayerRef.current = layer;
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        mapInstanceRef.current = map;
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Tile Layer when tileMode toggles
  useEffect(() => {
    if (typeof window === 'undefined' || !mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }

      const tileUrl =
        tileMode === 'osm'
          ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

      const newLayer = L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = newLayer;
    });
  }, [tileMode]);

  // Update Markers and Heatmap architecture reactively
  useEffect(() => {
    if (typeof window === 'undefined' || !mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // 1. Clear previous heatmap circle layers
      heatmapCirclesRef.current.forEach((circle) => map.removeLayer(circle));
      heatmapCirclesRef.current = [];

      // 2. Render Heatmap Architecture (Density clusters preparation)
      if (isHeatmapActive) {
        incidents.forEach((inc) => {
          const color = getMarkerColor(inc);
          const circle = L.circle([inc.latitude, inc.longitude], {
            color: color,
            fillColor: color,
            fillOpacity: 0.18,
            radius: 450,
            weight: 1,
          }).addTo(map);
          heatmapCirclesRef.current.push(circle);
        });
      }

      // 3. Clean up incident markers not in store
      const currentIds = new Set(incidents.map((i) => i.id));
      Object.keys(markersRef.current).forEach((id) => {
        if (!currentIds.has(id)) {
          map.removeLayer(markersRef.current[id]);
          delete markersRef.current[id];
        }
      });

      // 4. Render / Update Incident Markers
      incidents.forEach((inc) => {
        const cat = getMarkerCategory(inc);
        const isVisible = activeFilter === 'all' || activeFilter === cat;

        if (!isVisible) {
          if (markersRef.current[inc.id]) {
            map.removeLayer(markersRef.current[inc.id]);
            delete markersRef.current[inc.id];
          }
          return;
        }

        const color = getMarkerColor(inc);
        const isCritical = inc.severity === 'critical' || inc.severity === 'high';
        const typeName = getTypeName(inc);

        const customHtml = `
          <div class="relative flex items-center justify-center">
            ${
              isCritical
                ? `<div class="absolute w-7 h-7 rounded-full animate-ping" style="background-color: ${color}; opacity: 0.3;"></div>`
                : ''
            }
            <div class="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-md cursor-pointer" style="background-color: ${color}">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: customHtml,
          className: 'custom-incident-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        // Clean light popup
        const popupContent = `
          <div style="font-family: inherit; min-width: 230px; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
              <span style="font-weight: 700; color: ${color}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
                ${typeName}
              </span>
              <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: #f1f5f9; color: #475569;">
                ${inc.severity.toUpperCase()}
              </span>
            </div>
            
            <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 4px;">
              ${inc.id}
            </div>
            
            <div style="font-size: 11px; color: #64748b; margin-bottom: 8px; line-height: 1.4;">
              ${inc.description}
            </div>

            <div style="font-family: monospace; font-size: 10px; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
              <div>Type: <strong style="color: #1e293b;">${inc.type}</strong></div>
              <div>Severity: <strong style="color: #dc2626;">${inc.severity}</strong></div>
              <div>Bus: <strong style="color: #5c8dc5;">${inc.bus_id}</strong></div>
              <div>Confidence: <strong style="color: #16a34a;">${(inc.confidence * 100).toFixed(0)}%</strong></div>
              <div style="grid-column: span 2;">Location: <strong style="color: #334155;">${inc.latitude.toFixed(4)}° N, ${inc.longitude.toFixed(4)}° E</strong></div>
              <div style="grid-column: span 2;">Time: <strong style="color: #475569;">${new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • ${new Date(inc.timestamp).toLocaleDateString()}</strong></div>
            </div>

            <div style="margin-top: 10px; text-align: right; border-top: 1px solid #f1f5f9; padding-top: 6px;">
              <a href="/incidents/${inc.id}" style="color: #5c8dc5; text-decoration: none; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; background: #f0f6fc; border: 1px solid #d0e1fd;">
                View Incident Dossier →
              </a>
            </div>
          </div>
        `;

        if (markersRef.current[inc.id]) {
          markersRef.current[inc.id].setLatLng([inc.latitude, inc.longitude]);
        } else {
          const marker = L.marker([inc.latitude, inc.longitude], { icon: customIcon })
            .bindPopup(popupContent)
            .addTo(map);
          markersRef.current[inc.id] = marker;
        }
      });

      // 5. Render / Update Bus Fleet Markers
      buses.forEach((bus) => {
        if (!showBusFleet || !bus.is_online) {
          if (busMarkersRef.current[bus.bus_id]) {
            map.removeLayer(busMarkersRef.current[bus.bus_id]);
            delete busMarkersRef.current[bus.bus_id];
          }
          return;
        }

        const busHtml = `
          <div class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-300 text-slate-900 font-mono text-[10px] font-bold shadow-md whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-pewter-blue animate-pulse"></span>
            <span>${bus.bus_id}</span>
          </div>
        `;

        const busIcon = L.divIcon({
          html: busHtml,
          className: 'custom-bus-marker',
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });

        const busPopupContent = `
          <div style="font-family: inherit; min-width: 180px;">
            <div style="font-weight: bold; color: #5c8dc5; font-size: 12px; margin-bottom: 4px;">
              ${bus.bus_id} — Route ${bus.route_id}
            </div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
              Driver: <strong style="color: #1e293b;">${bus.driver_name}</strong>
            </div>
            <div style="font-family: monospace; font-size: 10px; color: #64748b;">
              Speed: <strong style="color: #0f172a;">${bus.speed_kmh} km/h</strong> | Camera: <strong style="color: #16a34a;">${bus.camera_status}</strong>
            </div>
            <div style="margin-top: 8px;">
              <a href="/live" style="color: #5c8dc5; text-decoration: none; font-size: 11px; font-weight: 600;">
                Open Live Video HUD →
              </a>
            </div>
          </div>
        `;

        if (busMarkersRef.current[bus.bus_id]) {
          busMarkersRef.current[bus.bus_id].setLatLng([bus.current_latitude, bus.current_longitude]);
        } else {
          const marker = L.marker([bus.current_latitude, bus.current_longitude], { icon: busIcon })
            .bindPopup(busPopupContent)
            .addTo(map);
          busMarkersRef.current[bus.bus_id] = marker;
        }
      });
    });
  }, [incidents, buses, activeFilter, isHeatmapActive, showBusFleet]);

  const visibleCount = incidents.filter((inc) => {
    if (activeFilter === 'all') return true;
    return getMarkerCategory(inc) === activeFilter;
  }).length;

  return (
    <div
      style={{ height }}
      className="relative w-full rounded-xl overflow-hidden border border-slate-200/80 shadow-clean-card bg-slate-50"
    >
      {/* Leaflet Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Filter Bar */}
      <div className="absolute top-4 left-4 z-20 bg-white/95 p-3.5 rounded-xl border border-slate-200/80 text-xs font-sans space-y-2.5 max-w-xs shadow-clean backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-900 font-bold flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-pewter-blue" />
            <span>Map Layers</span>
          </span>
          <span className="text-[10px] text-pewter-blue font-mono font-bold px-1.5 py-0.5 rounded bg-pewter-blue/10 border border-pewter-blue/20">
            {visibleCount} Active
          </span>
        </div>

        {/* 6 Map Filter Categories */}
        <div className="space-y-1 text-xs">
          {[
            { id: 'all' as const, label: 'All Incidents', count: incidents.length, dot: 'bg-slate-900' },
            { id: 'potholes' as const, label: 'Road Potholes', count: incidents.filter((i) => i.type === 'pothole').length, dot: 'bg-amber-500' },
            { id: 'missing_crossings' as const, label: 'Missing Crossings', count: incidents.filter((i) => i.type === 'missing_crossing').length, dot: 'bg-pewter-blue' },
            { id: 'rash_driving' as const, label: 'Rash Driving', count: incidents.filter((i) => i.type === 'rash_driving' && !isHitAndRun(i)).length, dot: 'bg-rose-500' },
            { id: 'hit_and_run' as const, label: 'Hit-and-Run Suspects', count: incidents.filter((i) => isHitAndRun(i)).length, dot: 'bg-red-600' },
            { id: 'traffic' as const, label: 'Traffic & ANPR', count: incidents.filter((i) => i.type === 'vehicle' || i.type === 'pedestrian' || i.type === 'anpr').length, dot: 'bg-purple-600' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition ${
                activeFilter === cat.id
                  ? 'bg-pewter-blue text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${activeFilter === cat.id ? 'bg-white' : cat.dot}`} />
                <span>{cat.label}</span>
              </div>
              <span className={`text-[10px] font-mono ${activeFilter === cat.id ? 'text-white/80' : 'text-slate-400'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Layer & Tile Toggles */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
          {/* Heatmap Toggle */}
          <label className="flex items-center justify-between cursor-pointer hover:text-slate-900 p-1 rounded hover:bg-slate-50">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Density Heatmap
            </span>
            <input
              type="checkbox"
              checked={isHeatmapActive}
              onChange={(e) => setIsHeatmapActive(e.target.checked)}
              className="rounded border-slate-300 text-pewter-blue focus:ring-pewter-blue"
            />
          </label>

          {/* Bus Fleet Toggle */}
          <label className="flex items-center justify-between cursor-pointer hover:text-slate-900 p-1 rounded hover:bg-slate-50">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-pewter-blue" />
              Transit Bus Fleet
            </span>
            <input
              type="checkbox"
              checked={showBusFleet}
              onChange={(e) => setShowBusFleet(e.target.checked)}
              className="rounded border-slate-300 text-pewter-blue focus:ring-pewter-blue"
            />
          </label>

          {/* CartoDB vs OSM Tiles Toggle */}
          <label className="flex items-center justify-between cursor-pointer hover:text-slate-900 p-1 rounded hover:bg-slate-50">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              CartoDB Positron
            </span>
            <input
              type="checkbox"
              checked={tileMode === 'light'}
              onChange={(e) => setTileMode(e.target.checked ? 'light' : 'osm')}
              className="rounded border-slate-300 text-pewter-blue focus:ring-pewter-blue"
            />
          </label>
        </div>
      </div>

      {/* Floating Bottom Telemetry Badge */}
      <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-white/95 border border-slate-200/80 font-mono text-[10px] text-slate-600 shadow-sm backdrop-blur-md flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-pewter-blue animate-pulse" />
        <span>EPSG:3857 • CENTER: 12.9516° N, 77.6346° E • TILES: {tileMode.toUpperCase()}</span>
      </div>
    </div>
  );
};
