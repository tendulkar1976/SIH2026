import { create } from 'zustand';
import {
  IncidentEvent,
  IncidentStatus,
  IncidentSeverity,
  IncidentType,
  DashboardStats,
  BusTelemetry,
  AlertItem,
  ConnectionStatus,
} from '@/types';
import { initialIncidents } from '@/data/mockIncidents';
import { initialBuses } from '@/data/mockBuses';

interface FilterState {
  type: string;
  severity: string;
  route: string;
  status: string;
  dateRange: string;
  search: string;
}

interface UrbanState {
  incidents: IncidentEvent[];
  stats: DashboardStats;
  buses: BusTelemetry[];
  selectedBusId: string;
  alerts: AlertItem[];
  activeAlertModal: AlertItem | null;
  connectionStatus: ConnectionStatus;
  isDemoMode: boolean;
  simulationSpeed: number; // 1, 2, 5, 0 (paused)
  filter: FilterState;

  // Actions
  addIncident: (event: IncidentEvent) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  setSelectedBusId: (busId: string) => void;
  updateBusTelemetry: (busId: string, updates: Partial<BusTelemetry>) => void;
  dismissAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  setActiveAlertModal: (alert: AlertItem | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setDemoMode: (enabled: boolean) => void;
  setSimulationSpeed: (speed: number) => void;
  setFilter: (filterUpdates: Partial<FilterState>) => void;
  resetFilters: () => void;
  injectSampleEvent: (typeOverride?: IncidentType) => IncidentEvent;
}

const computeInitialStats = (incidents: IncidentEvent[]): DashboardStats => {
  return {
    total_incidents: incidents.length,
    potholes: incidents.filter((i) => i.type === 'pothole').length,
    missing_crossings: incidents.filter((i) => i.type === 'missing_crossing').length,
    rash_driving: incidents.filter((i) => i.type === 'rash_driving').length,
    vehicles: incidents.filter((i) => i.type === 'vehicle').length,
    pedestrian_events: incidents.filter((i) => i.type === 'pedestrian').length,
    anpr_events: incidents.filter((i) => i.type === 'anpr').length,
    active_alerts: incidents.filter((i) => (i.severity === 'high' || i.severity === 'critical') && i.status === 'new').length,
  };
};

const initialAlertsList: AlertItem[] = initialIncidents
  .filter((inc) => inc.severity === 'high' || inc.severity === 'critical')
  .map((inc) => ({
    id: `ALT-${inc.id}`,
    incident_id: inc.id,
    title:
      inc.type === 'rash_driving'
        ? 'RASH DRIVING DETECTED'
        : inc.type === 'pothole'
        ? 'CRITICAL ROAD POTHOLE'
        : inc.type === 'anpr'
        ? 'HOTLIST ANPR VEHICLE DETECTED'
        : inc.type === 'missing_crossing'
        ? 'MISSING ZEBRAS CROSSING'
        : 'SAFETY ALERT',
    message: inc.description,
    severity: inc.severity,
    timestamp: inc.timestamp,
    bus_id: inc.bus_id,
    route_id: inc.route_id,
    location_name: `Route ${inc.route_id} Corridor`,
    latitude: inc.latitude,
    longitude: inc.longitude,
    vehicle_id: inc.vehicle_id,
    license_plate: inc.license_plate,
    confidence: inc.confidence,
    is_read: false,
    status: inc.status,
  }));

export const useUrbanStore = create<UrbanState>((set, get) => ({
  incidents: initialIncidents,
  stats: computeInitialStats(initialIncidents),
  buses: initialBuses,
  selectedBusId: 'BUS-102',
  alerts: initialAlertsList,
  activeAlertModal: null,
  connectionStatus: 'LIVE',
  isDemoMode: false,
  simulationSpeed: 1,
  filter: {
    type: 'all',
    severity: 'all',
    route: 'all',
    status: 'all',
    dateRange: 'all',
    search: '',
  },

  addIncident: (event: IncidentEvent) => {
    set((state) => {
      // Avoid duplicate IDs
      if (state.incidents.some((i) => i.id === event.id)) return state;

      const newIncidents = [event, ...state.incidents];

      // Update counters automatically
      const newStats: DashboardStats = {
        ...state.stats,
        total_incidents: state.stats.total_incidents + 1,
        potholes: event.type === 'pothole' ? state.stats.potholes + 1 : state.stats.potholes,
        missing_crossings: event.type === 'missing_crossing' ? state.stats.missing_crossings + 1 : state.stats.missing_crossings,
        rash_driving: event.type === 'rash_driving' ? state.stats.rash_driving + 1 : state.stats.rash_driving,
        vehicles: event.type === 'vehicle' ? state.stats.vehicles + 1 : state.stats.vehicles,
        pedestrian_events: event.type === 'pedestrian' ? state.stats.pedestrian_events + 1 : state.stats.pedestrian_events,
        anpr_events: event.type === 'anpr' ? state.stats.anpr_events + 1 : state.stats.anpr_events,
        active_alerts:
          (event.severity === 'high' || event.severity === 'critical') && event.status === 'new'
            ? state.stats.active_alerts + 1
            : state.stats.active_alerts,
      };

      // Create alert item if severity high or critical (logs quietly into Alerts queue)
      let newAlerts = state.alerts;

      if (event.severity === 'high' || event.severity === 'critical') {
        const newAlert: AlertItem = {
          id: `ALT-${event.id}`,
          incident_id: event.id,
          title:
            event.type === 'rash_driving'
              ? 'RASH DRIVING DETECTED'
              : event.type === 'pothole'
              ? 'CRITICAL ROAD POTHOLE'
              : event.type === 'anpr'
              ? 'ANPR FLAGGED VEHICLE MATCH'
              : event.type === 'missing_crossing'
              ? 'MISSING CROSSING HAZARD'
              : 'CRITICAL HAZARD DETECTED',
          message: event.description,
          severity: event.severity,
          timestamp: event.timestamp,
          bus_id: event.bus_id,
          route_id: event.route_id,
          location_name: `Route ${event.route_id} / GPS (${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)})`,
          latitude: event.latitude,
          longitude: event.longitude,
          vehicle_id: event.vehicle_id,
          license_plate: event.license_plate,
          confidence: event.confidence,
          is_read: false,
          status: event.status,
        };

        newAlerts = [newAlert, ...state.alerts];
      }

      // Update bus incidents today counter
      const updatedBuses = state.buses.map((bus) => {
        if (bus.bus_id === event.bus_id) {
          return {
            ...bus,
            incidents_today: bus.incidents_today + 1,
            last_update: new Date().toISOString(),
          };
        }
        return bus;
      });

      return {
        incidents: newIncidents,
        stats: newStats,
        alerts: newAlerts,
        activeAlertModal: null,
        buses: updatedBuses,
      };
    });
  },

  updateIncidentStatus: (id: string, status: IncidentStatus) => {
    set((state) => {
      const updatedIncidents = state.incidents.map((inc) =>
        inc.id === id ? { ...inc, status } : inc
      );
      const updatedAlerts = state.alerts.map((alt) =>
        alt.incident_id === id ? { ...alt, status } : alt
      );
      const updatedStats = computeInitialStats(updatedIncidents);
      return {
        incidents: updatedIncidents,
        alerts: updatedAlerts,
        stats: updatedStats,
        activeAlertModal: state.activeAlertModal?.incident_id === id ? null : state.activeAlertModal,
      };
    });
  },

  setSelectedBusId: (busId: string) => set({ selectedBusId: busId }),

  updateBusTelemetry: (busId: string, updates: Partial<BusTelemetry>) => {
    set((state) => ({
      buses: state.buses.map((b) => (b.bus_id === busId ? { ...b, ...updates } : b)),
    }));
  },

  dismissAlert: (alertId: string) => {
    const alert = get().alerts.find((a) => a.id === alertId);
    if (alert) {
      get().updateIncidentStatus(alert.incident_id, 'dismissed');
    }
  },

  resolveAlert: (alertId: string) => {
    const alert = get().alerts.find((a) => a.id === alertId);
    if (alert) {
      get().updateIncidentStatus(alert.incident_id, 'resolved');
    }
  },

  setActiveAlertModal: (alert: AlertItem | null) => set({ activeAlertModal: alert }),

  setConnectionStatus: (status: ConnectionStatus) => set({ connectionStatus: status }),

  setDemoMode: (enabled: boolean) => set({ isDemoMode: enabled }),

  setSimulationSpeed: (speed: number) => set({ simulationSpeed: speed }),

  setFilter: (filterUpdates: Partial<FilterState>) =>
    set((state) => ({ filter: { ...state.filter, ...filterUpdates } })),

  resetFilters: () =>
    set({
      filter: {
        type: 'all',
        severity: 'all',
        route: 'all',
        status: 'all',
        dateRange: 'all',
        search: '',
      },
    }),

  injectSampleEvent: (typeOverride?: IncidentType): IncidentEvent => {
    const types: IncidentType[] = ['pothole', 'vehicle', 'missing_crossing', 'rash_driving', 'anpr', 'hit_and_run'];
    const chosenType = typeOverride || types[Math.floor(Math.random() * types.length)];
    const state = get();
    const bus = state.buses[Math.floor(Math.random() * state.buses.length)];
    const idNum = Math.floor(1050 + Math.random() * 8900);
    const id = `INC-${idNum}`;

    // slight delta around bus location
    const lat = bus.current_latitude + (Math.random() - 0.5) * 0.015;
    const lng = bus.current_longitude + (Math.random() - 0.5) * 0.015;

    const plates = ['KA01AB1234', 'KA03MJ8812', 'KA05EF9901', 'KA04HH4190', 'KA51MD7744', 'KA02TR3319', 'KA04MN9021', 'DL03CA4412'];
    const plate = chosenType === 'rash_driving' || chosenType === 'anpr' || chosenType === 'vehicle' || chosenType === 'hit_and_run'
      ? plates[Math.floor(Math.random() * plates.length)]
      : null;

    const descriptions: Record<IncidentType, string[]> = {
      pothole: [
        'Dangerous high-impact road crater detected by front sensor array.',
        'Asphalt surface collapse near storm drain intake.',
        'Deep lateral depression spanning two lanes with sharp edge profile.',
        'Subsurface void hazard with loose aggregate on high-speed lane.',
      ],
      vehicle: [
        'Commercial vehicle double-parked obstructing emergency bus corridor.',
        'Stalled light goods vehicle blocking active municipal transit lane.',
        'Unregistered commercial tractor operating in rapid transit sector.',
      ],
      missing_crossing: [
        'Pedestrian zebra stripes completely eroded under monsoon wear.',
        'Unmarked mid-block high-density pedestrian transit zone.',
        'Faded school crossing markings with near-zero nighttime retroreflectivity.',
      ],
      rash_driving: [
        'Severe zigzag lane weaving exceeding speed threshold (+35 km/h).',
        'Tailgating and abrupt cutoff of heavy municipal transit bus.',
        'High-speed cornering without deceleration in school crossing zone.',
        'Excessive speed and blind-spot lane changing recorded on optical HUD.',
      ],
      anpr: [
        'ANPR Match: Vehicle flagged for unpaid municipal court citations & warrant.',
        'Stolen vehicle registry match on forward vision module.',
        'High-interest plate query hit against municipal enforcement database.',
      ],
      hit_and_run: [
        'CRITICAL: Hit-and-Run collision detected. Vehicle fled scene without stopping.',
        'Motorcycle collision suspect fleeing sector. Optical capture matches rear plate.',
        'Pedestrian sideswipe impact detected. Vehicle accelerated toward outbound arterial.',
      ],
      pedestrian: [
        'Pedestrian stepping into high-speed bus lane outside designated crosswalk.',
        'Crowd spillover on narrowed arterial pedestrian walkway.',
      ],
    };

    const descList = descriptions[chosenType] || descriptions.pothole;
    const desc = descList[Math.floor(Math.random() * descList.length)];
    const severities: IncidentSeverity[] =
      chosenType === 'hit_and_run'
        ? ['critical']
        : chosenType === 'rash_driving' || chosenType === 'anpr'
        ? ['high', 'critical']
        : chosenType === 'pothole'
        ? ['medium', 'high', 'critical']
        : ['low', 'medium', 'high'];

    const severity = severities[Math.floor(Math.random() * severities.length)];

    const event: IncidentEvent = {
      id,
      type: chosenType,
      severity,
      confidence: parseFloat((0.85 + Math.random() * 0.14).toFixed(2)),
      timestamp: new Date().toISOString(),
      latitude: lat,
      longitude: lng,
      bus_id: bus.bus_id,
      route_id: bus.route_id,
      vehicle_id: plate ? `V-${Math.floor(100 + Math.random() * 900)}` : null,
      license_plate: plate,
      status: 'new',
      evidence_image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
      evidence_video: chosenType === 'rash_driving' || chosenType === 'hit_and_run' ? 'https://assets.mixkit.co/videos/preview/mixkit-traffic-on-a-busy-highway-at-night-42436-large.mp4' : null,
      description: desc,
    };

    get().addIncident(event);
    return event;
  },
}));
