'use client';

import React, { useEffect, useRef } from 'react';
import { IncidentEvent } from '@/types';
import { MapPin, Navigation } from 'lucide-react';

interface IncidentMiniMapProps {
  incident: IncidentEvent;
}

export const IncidentMiniMap: React.FC<IncidentMiniMapProps> = ({ incident }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [incident.latitude, incident.longitude],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
        });

        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          {
            maxZoom: 19,
          }
        ).addTo(map);

        const customHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-7 h-7 rounded-full bg-rose-500/30 animate-ping"></div>
            <div class="w-5 h-5 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center shadow-md">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: customHtml,
          className: 'custom-pin',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([incident.latitude, incident.longitude], { icon: customIcon }).addTo(map);
        mapInstanceRef.current = map;
      } else {
        mapInstanceRef.current.setView([incident.latitude, incident.longitude], 14);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [incident]);

  return (
    <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute bottom-2.5 left-2.5 z-10 px-2.5 py-1 rounded-md bg-white/95 border border-slate-200 font-mono text-[10px] text-slate-700 shadow-sm backdrop-blur-md flex items-center gap-1.5">
        <MapPin className="w-3 h-3 text-pewter-blue" />
        <span>
          {incident.latitude.toFixed(5)}° N, {incident.longitude.toFixed(5)}° E
        </span>
      </div>
    </div>
  );
};
