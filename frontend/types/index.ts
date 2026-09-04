export type IncidentType =
  | 'pothole'
  | 'damaged_divider'
  | 'missing_signboard'
  | 'waterlogging'
  | 'open_drain_garbage'
  | 'missing_crossing'
  | 'footpath_encroachment'
  | 'rash_driving'
  | 'wrong_way'
  | 'bus_footboard'
  | 'red_light_violation'
  | 'illegal_parking'
  | 'anpr'
  | 'hit_and_run'
  | 'vehicle'
  | 'pedestrian';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus = 'new' | 'investigating' | 'resolved' | 'dismissed';

export type DepartmentType =
  | 'pwd_roads'
  | 'traffic_police'
  | 'transit_auth'
  | 'municipal_corp';

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
  assigned_department: DepartmentType;
  work_order_id?: string | null;
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

// Road & Infrastructure Intelligence
export type RepairStatus = 'backlog' | 'scheduled' | 'in_progress' | 'repaired';

export interface RoadDefectRecord {
  id: string;
  defect_type: 'pothole' | 'waterlogging' | 'damaged_divider' | 'missing_crossing' | 'road_cracking';
  severity: IncidentSeverity;
  corridor_id: string;
  corridor_name: string;
  location_landmark: string;
  latitude: number;
  longitude: number;
  estimated_depth_cm?: number;
  estimated_area_sqm?: number;
  priority_score: number; // 1-100 (Higher = more urgent)
  repair_status: RepairStatus;
  work_order_id: string;
  assigned_contractor?: string;
  detecting_bus_id: string;
  timestamp: string;
  evidence_image: string;
}

export interface CorridorHealthScore {
  corridor_id: string;
  name: string;
  road_condition_index: number; // 0-100 (Higher = Better)
  status: 'excellent' | 'good' | 'degraded' | 'critical';
  pothole_count: number;
  waterlogging_spots: number;
  divider_issues: number;
  missing_crossings: number;
  total_defects_per_km: number;
  last_surveyed: string;
}

// Traffic Intelligence & OD Analytics
export type CongestionLevel = 'low' | 'moderate' | 'severe' | 'gridlock';

export interface TrafficBottleneck {
  id: string;
  junction_name: string;
  corridor_id: string;
  latitude: number;
  longitude: number;
  congestion_level: CongestionLevel;
  current_speed_kmh: number;
  free_flow_speed_kmh: number;
  delay_minutes: number;
  queue_length_meters: number;
  primary_cause: string;
  last_updated: string;
}

export interface CorridorCongestion {
  corridor_id: string;
  name: string;
  congestion_level: CongestionLevel;
  average_speed_kmh: number;
  speed_limit_kmh: number;
  vehicle_volume_per_hour: number;
  travel_time_index: number;
  hourly_speed_profile: { hour: string; speed: number; benchmark: number }[];
}

export interface ODTrafficFlow {
  origin_zone: string;
  destination_zone: string;
  passenger_trips_est: number;
  vehicle_flow_volume: number;
  avg_travel_time_mins: number;
  corridor_utilized: string;
}

export interface CivicReportSummary {
  id: string;
  report_type: 'pwd_road_maintenance' | 'police_traffic_violations' | 'transit_safety_audit' | 'executive_briefing';
  title: string;
  period: string;
  generated_at: string;
  total_items: number;
  critical_items: number;
  assigned_agency: string;
  status: 'ready' | 'archived';
  file_size_kb: number;
}

// User Profile & Roles
export type UserRole = 'admin' | 'traffic_authority' | 'municipal_authority';

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  roleTitle: string;
  badgeId: string;
  department: string;
  clearanceLevel: string;
  email: string;
}
