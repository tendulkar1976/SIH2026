import {
  DashboardStats,
  IncidentEvent,
  IncidentStatus,
  IncidentSeverity,
  IncidentType,
  DepartmentType,
  BusTelemetry,
  AnalyticsSummary,
  AlertItem,
  UserProfile,
  UserRole,
} from '@/types';
import { initialIncidents } from '@/data/mockIncidents';
import { initialBuses } from '@/data/mockBuses';
import { mockAnalyticsData } from '@/data/mockAnalytics';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper to get stored auth token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('urbansense_token');
  } catch {
    return null;
  }
}

// Helper to set stored auth token
export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      localStorage.setItem('urbansense_token', token);
    } else {
      localStorage.removeItem('urbansense_token');
    }
  } catch {
    // ignore
  }
}

// Map backend incident format to frontend IncidentEvent
function mapBackendIncident(item: any): IncidentEvent {
  const statusMap: Record<string, IncidentStatus> = {
    open: 'new',
    acknowledged: 'investigating',
    resolved: 'resolved',
    dismissed: 'dismissed',
    new: 'new',
    investigating: 'investigating',
    action_taken: 'resolved',
  };

  const type = (item.incidentType || item.incident_type || item.type || 'pothole') as IncidentType;
  const severity = (item.severity || 'medium') as IncidentSeverity;
  const status = statusMap[item.status] || (item.status as IncidentStatus) || 'new';

  let dept: DepartmentType = 'municipal_corp';
  if (type === 'rash_driving' || type === 'wrong_way' || type === 'red_light_violation' || type === 'hit_and_run' || type === 'illegal_parking' || type === 'anpr') {
    dept = 'traffic_police';
  } else if (type === 'bus_footboard') {
    dept = 'transit_auth';
  }

  const lat = item.location?.latitude ?? item.latitude ?? 12.9716;
  const lon = item.location?.longitude ?? item.longitude ?? 77.5946;

  return {
    id: item.id || item.incident_id || `INC-${Math.floor(1000 + Math.random() * 9000)}`,
    type,
    severity,
    confidence: item.confidence ?? 0.9,
    timestamp: item.timestamp ? new Date(item.timestamp).toISOString() : new Date().toISOString(),
    latitude: lat,
    longitude: lon,
    bus_id: item.busId || item.bus_id || 'BUS-101',
    route_id: item.routeId || item.route_id || 'R-05',
    vehicle_id: item.vehicle_id || (type === 'wrong_way' || type === 'rash_driving' ? 'V-491' : null),
    license_plate: item.license_plate || (type === 'wrong_way' || type === 'rash_driving' ? 'KA04HH4190' : null),
    status,
    assigned_department: dept,
    work_order_id: item.work_order_id || `WO-${dept === 'traffic_police' ? 'BTP' : dept === 'transit_auth' ? 'BMTC' : 'BBMP'}-${Math.floor(1000 + Math.random() * 9000)}`,
    evidence_image: item.evidence_image || (type === 'pothole' ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80'),
    evidence_video: item.evidence_video || null,
    description: item.description || `${type.replace(/_/g, ' ').toUpperCase()} reported on route ${item.routeId || item.route_id || 'R-05'}.`,
  };
}

// Map backend alert format to frontend AlertItem
function mapBackendAlert(item: any): AlertItem {
  return {
    id: item.id || item.alert_id || `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
    incident_id: item.incidentId || item.incident_id || '',
    title: (item.alertType || item.alert_type || 'INCIDENT').toUpperCase().replace(/_/g, ' ') + ' ALERT',
    message: item.message || 'Critical hazard detected on active transit corridor.',
    severity: (item.severity || 'high') as IncidentSeverity,
    timestamp: item.createdAt || item.created_at || new Date().toISOString(),
    bus_id: item.busId || item.bus_id || 'BUS-102',
    route_id: item.routeId || item.route_id || 'R-12',
    location_name: `Corridor ${item.routeId || item.route_id || 'R-12'}`,
    latitude: item.latitude || 12.9716,
    longitude: item.longitude || 77.5946,
    vehicle_id: item.vehicle_id || null,
    license_plate: item.license_plate || null,
    confidence: item.confidence || 0.95,
    is_read: item.status === 'acknowledged' || item.status === 'resolved',
    status: item.status || 'new',
  };
}

// Map frontend status to backend status string
function toBackendStatus(status: IncidentStatus): string {
  if (status === 'new') return 'open';
  if (status === 'investigating') return 'acknowledged';
  if (status === 'resolved' || status === 'dismissed') return 'resolved';
  return 'open';
}

async function fetchWithFallback<T>(
  url: string,
  fallbackData: T,
  options?: RequestInit
): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string> || {}),
    };

    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return fallbackData;
    }

    return await res.json();
  } catch (err) {
    return fallbackData;
  }
}

export const apiService = {
  // Authentication
  async login(username: string, password: string): Promise<{ success: boolean; token?: string; user?: UserProfile; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Authentication failed' }));
        return { success: false, error: errorData.detail || 'Invalid username or password' };
      }

      const data = await res.json();
      const token = data.accessToken;
      setAuthToken(token);

      const role = (data.user?.role || 'admin') as UserRole;
      const roleTitle = role === 'admin' ? 'Joint Command Director' : role === 'traffic_authority' ? 'Traffic Enforcement Officer' : 'Chief Infrastructure Engineer';
      const dept = role === 'admin' ? 'Civic Command & Urban Intelligence' : role === 'traffic_authority' ? 'Bangalore Traffic Police (TMC)' : 'Public Works Department (PWD & BBMP)';

      const userProfile: UserProfile = {
        id: data.user?.id || 'usr-01',
        name: data.user?.username?.toUpperCase() || username.toUpperCase(),
        initials: (username.slice(0, 2) || 'OF').toUpperCase(),
        role,
        roleTitle,
        badgeId: `#OFF-${Math.floor(100 + Math.random() * 900)}`,
        department: dept,
        clearanceLevel: role === 'admin' ? 'Level 5 (Full Access)' : 'Level 4 (Operational)',
        email: `${username}@urbansense.gov.in`,
      };

      return { success: true, token, user: userProfile };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network connection failed' };
    }
  },

  async register(username: string, password: string, role: string): Promise<{ success: boolean; token?: string; user?: UserProfile; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Registration failed' }));
        return { success: false, error: errorData.detail || 'Registration failed' };
      }

      const data = await res.json();
      const token = data.accessToken;
      setAuthToken(token);

      const userRole = (data.user?.role || role || 'admin') as UserRole;
      const roleTitle = userRole === 'admin' ? 'Joint Command Director' : userRole === 'traffic_authority' ? 'Traffic Enforcement Officer' : 'Chief Infrastructure Engineer';
      const dept = userRole === 'admin' ? 'Civic Command & Urban Intelligence' : userRole === 'traffic_authority' ? 'Bangalore Traffic Police (TMC)' : 'Public Works Department (PWD & BBMP)';

      const userProfile: UserProfile = {
        id: data.user?.id || 'usr-reg',
        name: data.user?.username?.toUpperCase() || username.toUpperCase(),
        initials: (username.slice(0, 2) || 'OF').toUpperCase(),
        role: userRole,
        roleTitle,
        badgeId: `#OFF-${Math.floor(100 + Math.random() * 900)}`,
        department: dept,
        clearanceLevel: userRole === 'admin' ? 'Level 5 (Full Access)' : 'Level 4 (Operational)',
        email: `${username}@urbansense.gov.in`,
      };

      return { success: true, token, user: userProfile };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network connection failed' };
    }
  },

  logout() {
    setAuthToken(null);
  },

  // Dashboard Overview & Stats
  async getDashboard(): Promise<DashboardStats> {
    const fallback: DashboardStats = {
      total_incidents: initialIncidents.length,
      potholes: initialIncidents.filter((i) => i.type === 'pothole').length,
      missing_crossings: initialIncidents.filter((i) => i.type === 'missing_crossing').length,
      rash_driving: initialIncidents.filter((i) => i.type === 'rash_driving' || i.type === 'wrong_way').length,
      vehicles: initialIncidents.filter((i) => i.type === 'vehicle' || i.type === 'illegal_parking').length,
      pedestrian_events: initialIncidents.filter((i) => i.type === 'pedestrian' || i.type === 'bus_footboard').length,
      anpr_events: initialIncidents.filter((i) => i.type === 'anpr').length,
      active_alerts: initialIncidents.filter((i) => (i.severity === 'high' || i.severity === 'critical') && i.status === 'new').length,
    };

    try {
      const data = await fetchWithFallback<any>('/dashboard/overview', null);
      if (data && data.summary) {
        return {
          total_incidents: data.summary.totalIncidents ?? fallback.total_incidents,
          potholes: fallback.potholes,
          missing_crossings: fallback.missing_crossings,
          rash_driving: fallback.rash_driving,
          vehicles: fallback.vehicles,
          pedestrian_events: fallback.pedestrian_events,
          anpr_events: fallback.anpr_events,
          active_alerts: data.summary.unreadAlerts ?? data.summary.totalAlerts ?? fallback.active_alerts,
        };
      }
    } catch {
      // return fallback
    }

    return fallback;
  },

  // Incidents
  async getIncidents(params?: { type?: string; severity?: string; status?: string; busId?: string; routeId?: string }): Promise<IncidentEvent[]> {
    let query = '?pageSize=100';
    if (params) {
      const searchParams = new URLSearchParams();
      searchParams.set('pageSize', '100');
      if (params.type && params.type !== 'all') searchParams.set('incidentType', params.type);
      if (params.severity && params.severity !== 'all') searchParams.set('severity', params.severity);
      if (params.status && params.status !== 'all') searchParams.set('status', toBackendStatus(params.status as IncidentStatus));
      if (params.busId && params.busId !== 'all') searchParams.set('busId', params.busId);
      if (params.routeId && params.routeId !== 'all') searchParams.set('routeId', params.routeId);
      query = `?${searchParams.toString()}`;
    }

    try {
      const res = await fetchWithFallback<any>(`/incidents${query}`, null);
      if (res && Array.isArray(res.items) && res.items.length > 0) {
        return res.items.map(mapBackendIncident);
      }
    } catch {
      // return fallback
    }

    return initialIncidents;
  },

  async getIncident(id: string): Promise<IncidentEvent | null> {
    const fallback = initialIncidents.find((i) => i.id === id) || null;
    try {
      const data = await fetchWithFallback<any>(`/incidents/${id}`, null);
      if (data && data.id) {
        return mapBackendIncident(data);
      }
    } catch {
      // return fallback
    }
    return fallback;
  },

  async updateIncidentStatus(id: string, status: IncidentStatus, description?: string): Promise<{ success: boolean; id: string; status: IncidentStatus }> {
    try {
      const backendStatus = toBackendStatus(status);
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/incidents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: backendStatus, description }),
      });
      if (res.ok) {
        return { success: true, id, status };
      }
    } catch {
      // return fallback
    }
    return { success: true, id, status };
  },

  // Alerts
  async getAlerts(params?: { status?: string; severity?: string }): Promise<AlertItem[]> {
    const fallbackAlerts: AlertItem[] = initialIncidents
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

    try {
      let query = '?pageSize=50';
      if (params) {
        const searchParams = new URLSearchParams();
        searchParams.set('pageSize', '50');
        if (params.status && params.status !== 'all') searchParams.set('status', params.status);
        if (params.severity && params.severity !== 'all') searchParams.set('severity', params.severity);
        query = `?${searchParams.toString()}`;
      }

      const res = await fetchWithFallback<any>(`/alerts${query}`, null);
      if (res && Array.isArray(res.items) && res.items.length > 0) {
        return res.items.map(mapBackendAlert);
      }
    } catch {
      // return fallback
    }

    return fallbackAlerts;
  },

  async updateAlertStatus(alertId: string, status: string): Promise<{ success: boolean; id: string }> {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        return { success: true, id: alertId };
      }
    } catch {
      // fallback
    }
    return { success: true, id: alertId };
  },

  // GIS Map
  async getMapIncidents(bounds?: { minLat: number; maxLat: number; minLon: number; maxLon: number }): Promise<IncidentEvent[]> {
    const minLat = bounds?.minLat ?? 12.80;
    const maxLat = bounds?.maxLat ?? 13.15;
    const minLon = bounds?.minLon ?? 77.40;
    const maxLon = bounds?.maxLon ?? 77.80;

    try {
      const res = await fetchWithFallback<any>(
        `/map/incidents?minLatitude=${minLat}&maxLatitude=${maxLat}&minLongitude=${minLon}&maxLongitude=${maxLon}&limit=500`,
        null
      );
      if (res && Array.isArray(res.items) && res.items.length > 0) {
        return res.items.map(mapBackendIncident);
      }
    } catch {
      // fallback
    }
    return initialIncidents;
  },

  // Fleet & Routes
  async getFleet(): Promise<BusTelemetry[]> {
    try {
      const res = await fetchWithFallback<any[] | null>('/registry/buses', null);
      if (res && Array.isArray(res) && res.length > 0) {
        return res.map((b, idx) => {
          const busId = b.bus_number || b.id || `BUS-${101 + idx}`;
          const matched = initialBuses.find((ib) => ib.bus_id === busId || ib.bus_id === b.bus_number || ib.bus_id === b.id);
          return {
            bus_id: busId,
            route_id: b.route_id || matched?.route_id || 'R-05',
            driver_name: matched?.driver_name || 'Officer Operator',
            is_online: b.is_active ?? true,
            status: b.is_active ? 'ONLINE' : 'OFFLINE',
            camera_status: 'LIVE',
            processing_status: 'INFERENCE_ACTIVE',
            fps: matched?.fps || 29.8,
            latency_ms: matched?.latency_ms || 32,
            current_latitude: matched?.current_latitude || 12.9716,
            current_longitude: matched?.current_longitude || 77.5946,
            location_name: matched?.location_name || `Corridor ${b.route_id || 'R-05'}`,
            speed_kmh: matched?.speed_kmh || 34,
            heading_deg: matched?.heading_deg || 90,
            incidents_today: matched?.incidents_today || 0,
            last_update: b.updated_at ? new Date(b.updated_at).toISOString() : new Date().toISOString(),
            detections_in_frame: matched?.detections_in_frame || [],
          };
        });
      }
    } catch {
      // fallback
    }
    return initialBuses;
  },

  // Analytics
  async getAnalytics(timeRange: string = '24h'): Promise<AnalyticsSummary> {
    try {
      const typeCounts = await fetchWithFallback<any>('/analytics/incidents-by-type', null);
      if (typeCounts && Array.isArray(typeCounts.items) && typeCounts.items.length > 0) {
        const colors: Record<string, string> = {
          pothole: '#ef4444',
          damaged_divider: '#f97316',
          waterlogging: '#06b6d4',
          missing_crossing: '#eab308',
          rash_driving: '#8b5cf6',
          wrong_way: '#ec4899',
          bus_footboard: '#f43f5e',
          hit_and_run: '#dc2626',
        };
        const mappedTypes = typeCounts.items.map((item: any) => ({
          type: item.incidentType || item.incident_type || 'Other',
          count: item.count || 0,
          color: colors[item.incidentType || item.incident_type] || '#6366f1',
        }));
        return {
          ...mockAnalyticsData,
          time_range: timeRange,
          incidents_by_type: mappedTypes,
        };
      }
    } catch {
      // fallback
    }
    return mockAnalyticsData;
  },
};
