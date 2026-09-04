import {
  DashboardStats,
  IncidentEvent,
  IncidentStatus,
  BusTelemetry,
  AnalyticsSummary,
  AlertItem,
} from '@/types';
import { initialIncidents } from '@/data/mockIncidents';
import { initialBuses } from '@/data/mockBuses';
import { mockAnalyticsData } from '@/data/mockAnalytics';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchWithFallback<T>(url: string, fallbackData: T, options?: RequestInit): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`API request to ${url} returned ${res.status}. Using fallback data.`);
      return fallbackData;
    }

    return await res.json();
  } catch (err) {
    // Graceful offline/mock fallback
    // console.info(`Backend API unreachable at ${url}. Operating with client store / mock dataset.`);
    return fallbackData;
  }
}

export const apiService = {
  async getDashboard(): Promise<DashboardStats> {
    const fallback: DashboardStats = {
      total_incidents: initialIncidents.length,
      potholes: initialIncidents.filter((i) => i.type === 'pothole').length,
      missing_crossings: initialIncidents.filter((i) => i.type === 'missing_crossing').length,
      rash_driving: initialIncidents.filter((i) => i.type === 'rash_driving').length,
      vehicles: initialIncidents.filter((i) => i.type === 'vehicle').length,
      pedestrian_events: initialIncidents.filter((i) => i.type === 'pedestrian').length,
      anpr_events: initialIncidents.filter((i) => i.type === 'anpr').length,
      active_alerts: initialIncidents.filter((i) => (i.severity === 'high' || i.severity === 'critical') && i.status === 'new').length,
    };
    return fetchWithFallback<DashboardStats>('/dashboard/stats', fallback);
  },

  async getIncidents(params?: { type?: string; severity?: string; status?: string }): Promise<IncidentEvent[]> {
    let query = '';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.type && params.type !== 'all') searchParams.append('type', params.type);
      if (params.severity && params.severity !== 'all') searchParams.append('severity', params.severity);
      if (params.status && params.status !== 'all') searchParams.append('status', params.status);
      const q = searchParams.toString();
      if (q) query = `?${q}`;
    }
    return fetchWithFallback<IncidentEvent[]>(`/incidents${query}`, initialIncidents);
  },

  async getIncident(id: string): Promise<IncidentEvent | null> {
    const fallback = initialIncidents.find((i) => i.id === id) || null;
    return fetchWithFallback<IncidentEvent | null>(`/incidents/${id}`, fallback);
  },

  async getFleet(): Promise<BusTelemetry[]> {
    return fetchWithFallback<BusTelemetry[]>('/fleet', initialBuses);
  },

  async getAnalytics(timeRange: string = '24h'): Promise<AnalyticsSummary> {
    return fetchWithFallback<AnalyticsSummary>(`/analytics?range=${timeRange}`, mockAnalyticsData);
  },

  async getAlerts(): Promise<AlertItem[]> {
    const fallback: AlertItem[] = initialIncidents
      .filter((inc) => inc.severity === 'high' || inc.severity === 'critical')
      .map((inc) => ({
        id: `ALT-${inc.id}`,
        incident_id: inc.id,
        title: inc.type === 'rash_driving' ? 'RASH DRIVING DETECTED' : 'CRITICAL INCIDENT',
        message: inc.description,
        severity: inc.severity,
        timestamp: inc.timestamp,
        bus_id: inc.bus_id,
        route_id: inc.route_id,
        location_name: `Route ${inc.route_id}`,
        latitude: inc.latitude,
        longitude: inc.longitude,
        vehicle_id: inc.vehicle_id,
        license_plate: inc.license_plate,
        confidence: inc.confidence,
        is_read: false,
        status: inc.status,
      }));
    return fetchWithFallback<AlertItem[]>('/alerts', fallback);
  },

  async updateIncidentStatus(id: string, status: IncidentStatus): Promise<{ success: boolean; id: string; status: IncidentStatus }> {
    try {
      const res = await fetch(`${API_BASE_URL}/incidents/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // Backend not yet connected
    }
    return { success: true, id, status };
  },
};
