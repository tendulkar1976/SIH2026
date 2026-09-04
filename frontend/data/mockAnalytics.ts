import { AnalyticsSummary } from '@/types';

export interface TrendDataPoint {
  label: string;
  total: number;
  potholes: number;
  rash_driving: number;
  crossings: number;
  anpr: number;
}

export const trendDataByPeriod: Record<'today' | '7d' | '30d', TrendDataPoint[]> = {
  today: [
    { label: '00:00', total: 14, potholes: 4, rash_driving: 8, crossings: 1, anpr: 1 },
    { label: '02:00', total: 16, potholes: 2, rash_driving: 12, crossings: 0, anpr: 2 },
    { label: '04:00', total: 11, potholes: 3, rash_driving: 6, crossings: 1, anpr: 1 },
    { label: '06:00', total: 32, potholes: 12, rash_driving: 14, crossings: 3, anpr: 3 },
    { label: '08:00', total: 58, potholes: 28, rash_driving: 22, crossings: 4, anpr: 4 },
    { label: '10:00', total: 62, potholes: 34, rash_driving: 18, crossings: 5, anpr: 5 },
    { label: '12:00', total: 44, potholes: 22, rash_driving: 15, crossings: 4, anpr: 3 },
    { label: '14:00', total: 38, potholes: 19, rash_driving: 12, crossings: 4, anpr: 3 },
    { label: '16:00', total: 52, potholes: 25, rash_driving: 20, crossings: 3, anpr: 4 },
    { label: '18:00', total: 78, potholes: 38, rash_driving: 31, crossings: 4, anpr: 5 },
    { label: '20:00', total: 60, potholes: 26, rash_driving: 27, crossings: 3, anpr: 4 },
    { label: '22:00', total: 38, potholes: 14, rash_driving: 19, crossings: 2, anpr: 3 },
  ],
  '7d': [
    { label: 'Mon', total: 340, potholes: 140, rash_driving: 110, crossings: 42, anpr: 48 },
    { label: 'Tue', total: 385, potholes: 162, rash_driving: 124, crossings: 45, anpr: 54 },
    { label: 'Wed', total: 410, potholes: 178, rash_driving: 130, crossings: 48, anpr: 54 },
    { label: 'Thu', total: 395, potholes: 170, rash_driving: 122, crossings: 46, anpr: 57 },
    { label: 'Fri', total: 460, potholes: 195, rash_driving: 158, crossings: 49, anpr: 58 },
    { label: 'Sat', total: 320, potholes: 130, rash_driving: 115, crossings: 35, anpr: 40 },
    { label: 'Sun', total: 290, potholes: 118, rash_driving: 105, crossings: 32, anpr: 35 },
  ],
  '30d': [
    { label: 'Week 1', total: 2420, potholes: 1020, rash_driving: 810, crossings: 290, anpr: 300 },
    { label: 'Week 2', total: 2680, potholes: 1150, rash_driving: 890, crossings: 310, anpr: 330 },
    { label: 'Week 3', total: 2510, potholes: 1080, rash_driving: 840, crossings: 295, anpr: 295 },
    { label: 'Week 4', total: 2790, potholes: 1210, rash_driving: 920, crossings: 330, anpr: 330 },
  ],
};

export const mockIncidentDistribution = [
  { name: 'Road Potholes', count: 184, percentage: 34, color: '#f59e0b' },
  { name: 'Rash Driving', count: 96, percentage: 18, color: '#f43f5e' },
  { name: 'Missing Crossings', count: 42, percentage: 8, color: '#5C8DC5' },
  { name: 'ANPR Violations', count: 68, percentage: 13, color: '#AD9E90' },
  { name: 'Traffic / Obstruction', count: 112, percentage: 21, color: '#909EAE' },
  { name: 'Other Hazards', count: 34, percentage: 6, color: '#736F60' },
];

export const mockAnalyticsData: AnalyticsSummary = {
  time_range: 'Last 24 Hours',
  total_vehicles_counted: 6750,
  incidents_by_type: [
    { type: 'Potholes', count: 184, color: '#f59e0b' },
    { type: 'Rash Driving', count: 96, color: '#f43f5e' },
    { type: 'Missing Crossings', count: 42, color: '#5C8DC5' },
    { type: 'ANPR Violations', count: 68, color: '#AD9E90' },
    { type: 'Traffic / Obstruction', count: 112, color: '#909EAE' },
    { type: 'Other Hazards', count: 34, color: '#736F60' },
  ],
  incidents_by_route: [
    { route: 'R-05 (Central Spine)', count: 142 },
    { route: 'R-12 (Koramangala - Indiranagar)', count: 118 },
    { route: 'R-18 (Whitefield Tech Hub)', count: 96 },
    { route: 'R-24 (Silk Board Corridor)', count: 88 },
    { route: 'R-09 (Hebbal - Airport Link)', count: 64 },
    { route: 'R-33 (South Outer Ring)', count: 48 },
  ],
  hourly_trends: [
    { hour: '00:00', potholes: 4, rash_driving: 8, crossings: 1, vehicles: 120 },
    { hour: '02:00', potholes: 2, rash_driving: 12, crossings: 0, vehicles: 80 },
    { hour: '04:00', potholes: 3, rash_driving: 6, crossings: 1, vehicles: 150 },
    { hour: '06:00', potholes: 12, rash_driving: 14, crossings: 3, vehicles: 450 },
    { hour: '08:00', potholes: 28, rash_driving: 22, crossings: 6, vehicles: 980 },
    { hour: '10:00', potholes: 34, rash_driving: 18, crossings: 8, vehicles: 1100 },
    { hour: '12:00', potholes: 22, rash_driving: 15, crossings: 5, vehicles: 850 },
    { hour: '14:00', potholes: 19, rash_driving: 12, crossings: 4, vehicles: 760 },
    { hour: '16:00', potholes: 25, rash_driving: 20, crossings: 5, vehicles: 920 },
    { hour: '18:00', potholes: 38, rash_driving: 31, crossings: 7, vehicles: 1350 },
    { hour: '20:00', potholes: 26, rash_driving: 27, crossings: 4, vehicles: 1150 },
    { hour: '22:00', potholes: 14, rash_driving: 19, crossings: 2, vehicles: 600 },
  ],
  vehicle_distribution: [
    { category: 'Cars / Sedans', count: 3240, percentage: 48 },
    { category: 'Two Wheelers', count: 2150, percentage: 32 },
    { category: 'Buses / Heavy Transit', count: 820, percentage: 12 },
    { category: 'Commercial Trucks', count: 540, percentage: 8 },
  ],
  pothole_distribution: [
    { severity: 'Critical Crater (>15cm depth)', count: 48, color: '#ef4444' },
    { severity: 'Major Subsurface Void (8-15cm)', count: 76, color: '#f59e0b' },
    { severity: 'Moderate Surface Fracture (<8cm)', count: 60, color: '#5C8DC5' },
  ],
  rash_driving_frequency: [
    { speed_tier: 'Excessive Speed (>85 km/h)', count: 34, route: 'R-05 / Electronic City Tollway' },
    { speed_tier: 'Dangerous Weaving / Overtake', count: 28, route: 'R-09 / Airport Express' },
    { speed_tier: 'Sudden Braking / Tailgating', count: 22, route: 'R-24 / Silk Board' },
    { speed_tier: 'Wrong-Side Driving Anomaly', count: 12, route: 'R-12 / Indiranagar 100ft' },
  ],
  missing_crossing_frequency: [
    { location: 'Indiranagar 12th Main Crossing', route_id: 'R-12', erosion_level: '90% Paint Worn Away', count: 14 },
    { location: 'Hosur Road Madiwala Police Station', route_id: 'R-05', erosion_level: 'Complete Absence / Missing', count: 12 },
    { location: 'Silk Board Underpass Junction', route_id: 'R-24', erosion_level: 'Faded / Low Night Contrast', count: 9 },
    { location: 'Whitefield ITPL Gate 2', route_id: 'R-18', erosion_level: 'Obstructed / Damaged Surface', count: 7 },
  ],
  pothole_hotspots: [
    { route_id: 'R-12', name: '100ft Road / 12th Main Indiranagar', potholes: 38, rash_driving: 12, total_incidents: 50, risk_score: 88 },
    { route_id: 'R-24', name: 'Silk Board Junction Underpass', potholes: 32, rash_driving: 24, total_incidents: 56, risk_score: 92 },
    { route_id: 'R-05', name: 'Hosur Main Road near Madiwala', potholes: 29, rash_driving: 18, total_incidents: 47, risk_score: 82 },
    { route_id: 'R-18', name: 'ITPL Main Road Whitefield', potholes: 24, rash_driving: 14, total_incidents: 38, risk_score: 74 },
    { route_id: 'R-09', name: 'Nagavara Ring Road Flyover ramp', potholes: 18, rash_driving: 9, total_incidents: 27, risk_score: 65 },
  ],
  rash_driving_hotspots: [
    { route_id: 'R-05', name: 'Electronic City Elevated Tollway', potholes: 6, rash_driving: 42, total_incidents: 48, risk_score: 95 },
    { route_id: 'R-09', name: 'Airport Express Highway Bellary Rd', potholes: 4, rash_driving: 35, total_incidents: 39, risk_score: 89 },
    { route_id: 'R-24', name: 'Outer Ring Road Bellandur Flyover', potholes: 14, rash_driving: 28, total_incidents: 42, risk_score: 86 },
    { route_id: 'R-12', name: 'Intermediate Ring Road Domlur', potholes: 11, rash_driving: 22, total_incidents: 33, risk_score: 79 },
  ],
};
