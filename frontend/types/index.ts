export type IncidentType =
  | 'pothole'
  | 'missing_crossing'
  | 'rash_driving'
  | 'vehicle'
  | 'pedestrian'
  | 'anpr'
  | 'hit_and_run';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus = 'new' | 'investigating' | 'resolved' | 'dismissed';

export type CameraStatus = 'LIVE' | 'CONNECTING' | 'OFFLINE' | 'ERROR';

export type ProcessingStatus =
  | 'INFERENCE_ACTIVE'
  | 'PROCESSING'
  | 'PAUSED'
  | 'IDLE'
  | 'ERROR';

export interface IncidentEvent {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  confidence: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  bus_id: string;
  route_id: string;
  vehicle_id: string | null;
  license_plate: string | null;
  status: IncidentStatus;
  evidence_image: string | null;
  evidence_video: string | null;
  description: string;
}

export interface DashboardStats {
  total_incidents: number;
  potholes: number;
  missing_crossings: number;
  rash_driving: number;
  vehicles: number;
  pedestrian_events: number;
  anpr_events: number;
  active_alerts: number;
}

export type BusStatus = 'ONLINE' | 'OFFLINE' | 'WARNING';

export interface BusTelemetry {
  bus_id: string;
  route_id: string;
  driver_name: string;
  is_online: boolean;
  status: BusStatus;
  camera_status: CameraStatus;
  processing_status?: ProcessingStatus;
  fps: number;
  latency_ms: number;
  current_latitude: number;
  current_longitude: number;
  location_name?: string;
  speed_kmh: number;
  heading_deg: number;
  incidents_today: number;
  last_update: string;
  detections_in_frame: LiveDetection[];
}

export interface LiveDetection {
  id: string;
  class_label:
    | 'car'
    | 'bus'
    | 'motorcycle'
    | 'truck'
    | 'pedestrian'
    | 'pothole'
    | 'plate'
    | 'zebra_crossing';
  confidence: number;
  track_id: number;
  name?: string;
  bbox: [number, number, number, number]; // [x_pct, y_pct, width_pct, height_pct] (0 to 100)
  license_plate?: string;
  speed_estimate?: number;
  is_alert?: boolean;
}

export interface LiveActivityItem {
  id: string;
  time: string;
  text: string;
  type: 'pothole' | 'vehicle' | 'rash_driving' | 'pedestrian' | 'crossing' | 'anpr';
  severity?: IncidentSeverity;
  bus_id?: string;
}

export interface AlertItem {
  id: string;
  incident_id: string;
  title: string;
  message: string;
  severity: IncidentSeverity;
  timestamp: string;
  bus_id: string;
  route_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  vehicle_id?: string | null;
  license_plate?: string | null;
  confidence: number;
  is_read: boolean;
  status: IncidentStatus;
}

export interface RouteHotspot {
  route_id: string;
  name: string;
  potholes: number;
  rash_driving: number;
  total_incidents: number;
  risk_score: number; // 0-100
}

export interface AnalyticsSummary {
  time_range: string;
  total_vehicles_counted: number;
  incidents_by_type: { type: string; count: number; color: string }[];
  incidents_by_route: { route: string; count: number }[];
  hourly_trends: { hour: string; potholes: number; rash_driving: number; crossings: number; vehicles: number }[];
  vehicle_distribution: { category: string; count: number; percentage: number }[];
  pothole_distribution: { severity: string; count: number; color: string }[];
  rash_driving_frequency: { speed_tier: string; count: number; route: string }[];
  missing_crossing_frequency: { location: string; route_id: string; erosion_level: string; count: number }[];
  pothole_hotspots: RouteHotspot[];
  rash_driving_hotspots: RouteHotspot[];
}

export type ConnectionStatus = 'LIVE' | 'RECONNECTING' | 'OFFLINE' | 'connected' | 'reconnecting' | 'disconnected' | 'simulating';
