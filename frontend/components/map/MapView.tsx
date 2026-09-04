'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useUrbanStore } from '@/store/useUrbanStore';
import { IncidentEvent, BusTelemetry } from '@/types';
import {
  Filter,
  Flame,
  Globe,
  Radio,
  Navigation,
  Layers,
} from 'lucide-react';

export type MapFilterCategory =
  | 'all'
  | 'potholes'
  | 'waterlogging'
  | 'damaged_divider'
  | 'missing_crossings'
  | 'rash_driving'
  | 'bus_footboard'
  | 'hit_and_run'
  | 'traffic';

interface MapViewProps {
  selectedFilter?: MapFilterCategory;
  showHeatmap?: boolean;
  tileProvider?: 'light' | 'osm';
  height?: string;
}

// Key municipal bus transit corridor trajectories in Bangalore
const routePolylines: Record<string, [number, number][]> = {
  'R-05': [
    [12.8452, 77.6602],
    [12.8900, 77.6400],
    [12.9200, 77.6200],
    [12.9716, 77.5946],
    [12.9750, 77.6090],
  ],
  'R-12': [
    [12.9352, 77.6245],
    [12.9279, 77.6271],
    [12.9341, 77.6189],
    [12.9500, 77.6000],
    [12.9716, 77.5946],
  ],
  'R-18': [
    [12.9279, 77.6833],
    [12.9550, 77.7000],
    [12.9856, 77.7312],
    [13.0000, 77.7100],
  ],
  'R-24': [
    [12.9141, 77.6101],
    [12.9400, 77.5900],
    [12.9784, 77.5721],
    [13.0000, 77.5600],
  ],
  'R-09': [
    [12.9716, 77.5946],
    [13.0000, 77.5900],
    [13.0358, 77.5970],
    [13.0600, 77.6000],
  ],
};

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
  const routeLayersRef = useRef<any[]>([]);

  const { incidents, buses } = useUrbanStore();

  const [activeFilter, setActiveFilter] = useState<MapFilterCategory>(selectedFilter);
  const [isHeatmapActive, setIsHeatmapActive] = useState<boolean>(initialHeatmap);
  const [tileMode, setTileMode] = useState<'light' | 'osm'>(initialTileProvider);
  const [showBusFleet, setShowBusFleet] = useState<boolean>(true);
  const [showRoutePolylines, setShowRoutePolylines] = useState<boolean>(true);

  // Synchronize prop filter if updated externally
  useEffect(() => {
    setActiveFilter(selectedFilter);
  }, [selectedFilter]);

  const isHitAndRun = (inc: IncidentEvent) => {
    return inc.type === 'hit_and_run' || inc.description.toLowerCase().includes('hit-and-run');
  };

  const getMarkerCategory = (inc: IncidentEvent): MapFilterCategory => {
    if (isHitAndRun(inc)) return 'hit_and_run';
    if (inc.type === 'pothole') return 'potholes';
    if (inc.type === 'waterlogging') return 'waterlogging';
    if (inc.type === 'damaged_divider') return 'damaged_divider';
    if (inc.type === 'missing_crossing') return 'missing_crossings';
    if (inc.type === 'rash_driving' || inc.type === 'wrong_way') return 'rash_driving';
    if (inc.type === 'bus_footboard') return 'bus_footboard';
    return 'traffic';
  };

  const getMarkerColor = (inc: IncidentEvent) => {
    if (isHitAndRun(inc)) return '#dc2626'; // Red
    if (inc.type === 'wrong_way' || inc.type === 'rash_driving') return '#e11d48'; // Rose
    if (inc.type === 'bus_footboard') return '#7c3aed'; // Violet
    if (inc.type === 'pothole') return '#d97706'; // Amber
    if (inc.type === 'damaged_divider') return '#ea580c'; // Orange
    if (inc.type === 'waterlogging') return '#0284c7'; // Sky blue
    if (inc.type === 'missing_crossing') return '#4f46e5'; // Indigo
    if (inc.type === 'anpr') return '#9333ea'; // Purple
    return '#475569'; // Slate
  };

  const getTypeName = (inc: IncidentEvent) => {
    if (isHitAndRun(inc)) return 'Hit-and-Run Suspect';
    if (inc.type === 'wrong_way') return 'Wrong-Way Driving';
    if (inc.type === 'bus_footboard') return 'Bus Footboard Hazard';
    if (inc.type === 'waterlogging') return 'Road Waterlogging';
    if (inc.type === 'damaged_divider') return 'Damaged Divider';
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

  // Render Bus Route Polylines
  useEffect(() => {
    if (typeof window === 'undefined' || !mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      routeLayersRef.current.forEach((layer) => map.removeLayer(layer));
      routeLayersRef.current = [];

      if (showRoutePolylines) {
        const routeColors = ['#4f46e5', '#0284c7', '#7c3aed', '#10b981', '#f59e0b'];
        let colorIdx = 0;

        Object.entries(routePolylines).forEach(([routeId, coords]) => {
          const color = routeColors[colorIdx % routeColors.length];
          colorIdx++;

          const poly = L.polyline(coords, {
            color: color,
            weight: 3.5,
            opacity: 0.65,
            dashArray: '6, 6',
          }).addTo(map);

          poly.bindTooltip(`<strong>Bus Route ${routeId}</strong>`, {
            permanent: false,
            direction: 'center',
            className: 'route-poly-tooltip',
          });

          routeLayersRef.current.push(poly);
        });
      }
    });
  }, [showRoutePolylines]);

  // Update Markers and Heatmap architecture reactively
  useEffect(() => {
    if (typeof window === 'undefined' || !mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // 1. Clear previous heatmap circle layers
      heatmapCirclesRef.current.forEach((circle) => map.removeLayer(circle));
      heatmapCirclesRef.current = [];

      // 2. Render Heatmap Architecture
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
              <div>Dept: <strong style="color: #4f46e5;">${inc.assigned_department || 'PWD'}</strong></div>
              <div>Bus: <strong style="color: #4f46e5;">${inc.bus_id}</strong></div>
              <div>Confidence: <strong style="color: #16a34a;">${(inc.confidence * 100).toFixed(0)}%</strong></div>
              <div style="grid-column: span 2;">Location: <strong style="color: #334155;">${inc.latitude.toFixed(4)}° N, ${inc.longitude.toFixed(4)}° E</strong></div>
              <div style="grid-column: span 2;">Time: <strong style="color: #475569;">${new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • ${new Date(inc.timestamp).toLocaleDateString()}</strong></div>
            </div>

            <div style="margin-top: 8px; text-align: right;">
              <a href="/incidents/${inc.id}" style="display: inline-block; font-size: 11px; font-weight: 600; color: #4f46e5; text-decoration: none; padding: 4px 8px; border-radius: 4px; background: #eef2ff;">
                Inspect Dossier →
              </a>
            </div>
          </div>
        `;

        if (markersRef.current[inc.id]) {
          markersRef.current[inc.id].setLatLng([inc.latitude, inc.longitude]);
          markersRef.current[inc.id].setIcon(customIcon);
          markersRef.current[inc.id].setPopupContent(popupContent);
        } else {
          const marker = L.marker([inc.latitude, inc.longitude], {
            icon: customIcon,
          }).addTo(map);
          marker.bindPopup(popupContent, { maxWidth: 280 });
          markersRef.current[inc.id] = marker;
        }
      });

      // 5. Render / Update Live Bus Fleet Markers
      const currentBusIds = new Set(buses.map((b) => b.bus_id));
      Object.keys(busMarkersRef.current).forEach((busId) => {
        if (!currentBusIds.has(busId) || !showBusFleet) {
          map.removeLayer(busMarkersRef.current[busId]);
          delete busMarkersRef.current[busId];
        }
      });

      if (showBusFleet) {
        buses.forEach((bus: BusTelemetry) => {
          const busHtml = `
            <div class="relative flex items-center justify-center">
              <div class="px-2 py-1 rounded bg-indigo-600 border border-white text-white text-[10px] font-mono font-bold shadow-md flex items-center gap-1 cursor-pointer">
                <span>🚌 ${bus.bus_id}</span>
              </div>
            </div>
          `;

          const busIcon = L.divIcon({
            html: busHtml,
            className: 'custom-bus-marker',
            iconSize: [60, 24],
            iconAnchor: [30, 12],
          });

          const busPopupContent = `
            <div style="font-family: inherit; min-width: 200px; padding: 4px;">
              <div style="font-weight: 700; color: #4f46e5; font-size: 12px; margin-bottom: 2px;">
                ${bus.bus_id} • Route ${bus.route_id}
              </div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
                Driver: <strong>${bus.driver_name}</strong>
              </div>
              <div style="font-family: monospace; font-size: 10px; color: #475569; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px; display: grid; grid-template-columns: 1fr 1fr; gap: 2px;">
                <div>Speed: <strong>${bus.speed_kmh} km/h</strong></div>
                <div>Status: <strong style="color: #16a34a;">${bus.status}</strong></div>
                <div>FPS: <strong>${bus.fps}</strong></div>
                <div>Today: <strong>${bus.incidents_today} detections</strong></div>
              </div>
            </div>
          `;

          if (busMarkersRef.current[bus.bus_id]) {
            busMarkersRef.current[bus.bus_id].setLatLng([bus.current_latitude, bus.current_longitude]);
            busMarkersRef.current[bus.bus_id].setPopupContent(busPopupContent);
          } else {
            const marker = L.marker([bus.current_latitude, bus.current_longitude], {
              icon: busIcon,
              zIndexOffset: 1000,
            }).addTo(map);
            marker.bindPopup(busPopupContent);
            busMarkersRef.current[bus.bus_id] = marker;
          }
        });
      }
    });
  }, [incidents, buses, activeFilter, isHeatmapActive, showBusFleet]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-clean bg-slate-50">
      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-0" />

      {/* Floating Category & Layer Filter Panel */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-clean-card text-xs space-y-3 max-w-[280px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            GIS Layer Controls
          </span>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
            {incidents.length} Pins
          </span>
        </div>

        {/* Categories */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 font-semibold block uppercase">
            Filter Incident Category
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'all', label: 'All Incidents' },
              { id: 'potholes', label: 'Road Potholes' },
              { id: 'waterlogging', label: 'Waterlogging' },
              { id: 'damaged_divider', label: 'Dividers' },
              { id: 'missing_crossings', label: 'Missing Zebra' },
              { id: 'rash_driving', label: 'Rash Driving' },
              { id: 'bus_footboard', label: 'Footboard' },
              { id: 'hit_and_run', label: 'Hit-and-Run' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id as MapFilterCategory)}
                className={`px-2 py-1 rounded text-left transition text-[11px] font-mono truncate ${
                  activeFilter === cat.id
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-700 font-mono flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-600" />
              Bus Route Traces:
            </span>
            <input
              type="checkbox"
              checked={showRoutePolylines}
              onChange={(e) => setShowRoutePolylines(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-700 font-mono flex items-center gap-1">
              <Radio className="w-3 h-3 text-indigo-600" />
              Active Bus Fleet:
            </span>
            <input
              type="checkbox"
              checked={showBusFleet}
              onChange={(e) => setShowBusFleet(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-700 font-mono flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              Hazard Heatmap:
            </span>
            <input
              type="checkbox"
              checked={isHeatmapActive}
              onChange={(e) => setIsHeatmapActive(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-700 font-mono flex items-center gap-1">
              <Globe className="w-3 h-3 text-indigo-600" />
              Carto Tile Provider:
            </span>
            <button
              onClick={() => setTileMode(tileMode === 'light' ? 'osm' : 'light')}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
            >
              {tileMode.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
