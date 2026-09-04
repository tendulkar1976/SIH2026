import { create } from 'zustand';
import {
  IncidentEvent,
  IncidentStatus,
  IncidentSeverity,
  IncidentType,
  DepartmentType,
  DashboardStats,
  BusTelemetry,
  AlertItem,
  ConnectionStatus,
  UserProfile,
  UserRole,
} from '@/types';
import { initialIncidents } from '@/data/mockIncidents';
import { initialBuses } from '@/data/mockBuses';

export const AUTHORITY_PROFILES: Record<UserRole, UserProfile> = {
  admin: {
    id: 'usr-admin-01',
    name: 'CMDR. R. MENON',
    initials: 'RM',
    role: 'admin',
    roleTitle: 'Joint Command Director',
    badgeId: '#MC-904',
    department: 'Civic Command & Urban Intelligence',
    clearanceLevel: 'Level 5 (Full Access)',
    email: 'r.menon@urbansense.gov.in',
  },
  traffic_authority: {
    id: 'usr-traffic-02',
    name: 'ACP V. SHARMA',
    initials: 'VS',
    role: 'traffic_authority',
    roleTitle: 'Traffic Enforcement Officer',
    badgeId: '#BTP-412',
    department: 'Bangalore Traffic Police (TMC)',
    clearanceLevel: 'Level 4 (Traffic & ANPR)',
    email: 'v.sharma@btp.gov.in',
  },
  municipal_authority: {
    id: 'usr-municipal-03',
    name: 'ENG. K. PRIYA',
    initials: 'KP',
    role: 'municipal_authority',
    roleTitle: 'Chief Infrastructure Engineer',
    badgeId: '#BBMP-780',
    department: 'Public Works Department (PWD & BBMP)',
    clearanceLevel: 'Level 4 (Roads & Drainage)',
    email: 'k.priya@bbmp.gov.in',
  },
};

interface FilterState {
  type: string;
  severity: string;
  route: string;
  status: string;
  department: string;
  dateRange: string;
  search: string;
}

interface UrbanState {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  registeredUsers: UserProfile[];
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

  // User Actions
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  registerOfficer: (officer: Omit<UserProfile, 'id' | 'initials'>) => void;
  login: (user: UserProfile) => void;
  logout: () => void;

  // Actions
  addIncident: (event: IncidentEvent) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  assignDepartment: (id: string, department: DepartmentType) => void;
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
    rash_driving: incidents.filter((i) => i.type === 'rash_driving' || i.type === 'wrong_way' || i.type === 'red_light_violation').length,
    vehicles: incidents.filter((i) => i.type === 'vehicle' || i.type === 'illegal_parking').length,
    pedestrian_events: incidents.filter((i) => i.type === 'pedestrian' || i.type === 'footpath_encroachment' || i.type === 'bus_footboard').length,
    anpr_events: incidents.filter((i) => i.type === 'anpr').length,
    active_alerts: incidents.filter((i) => (i.severity === 'high' || i.severity === 'critical') && i.status === 'new').length,
  };
};

const getAlertTitle = (type: IncidentType): string => {
  switch (type) {
    case 'bus_footboard':
      return 'BUS FOOTBOARD OVERCROWDING ALERT';
    case 'wrong_way':
      return 'CRITICAL WRONG-WAY DRIVING DETECTED';
    case 'waterlogging':
      return 'ROAD WATERLOGGING & FLOOD HAZARD';
    case 'damaged_divider':
      return 'DAMAGED MEDIAN DIVIDER BREACH';
    case 'missing_signboard':
      return 'MISSING REGULATORY SIGNBOARD';
    case 'open_drain_garbage':
      return 'OPEN DRAIN / WASTE SPILL HAZARD';
    case 'footpath_encroachment':
      return 'SIDEWALK PEDESTRIAN ENCROACHMENT';
    case 'red_light_violation':
      return 'RED LIGHT INTERSECTION BREACH';
    case 'illegal_parking':
      return 'BUS STOP CORRIDOR OBSTRUCTION';
    case 'hit_and_run':
      return 'CRITICAL HIT-AND-RUN DETECTED';
    case 'rash_driving':
      return 'RASH DRIVING & WEAVING DETECTED';
    case 'pothole':
      return 'CRITICAL ASPHALT POTHOLE';
    case 'anpr':
      return 'HOTLIST ANPR VEHICLE MATCH';
    case 'missing_crossing':
      return 'MISSING ZEBRA CROSSING';
    default:
      return 'URBAN SAFETY HAZARD DETECTED';
  }
};

const initialAlertsList: AlertItem[] = initialIncidents
  .filter((inc) => inc.severity === 'high' || inc.severity === 'critical')
  .map((inc) => ({
    id: `ALT-${inc.id}`,
    incident_id: inc.id,
    title: getAlertTitle(inc.type),
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
  currentUser: AUTHORITY_PROFILES.admin,
  isAuthenticated: true,
  registeredUsers: Object.values(AUTHORITY_PROFILES),
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
    department: 'all',
    dateRange: 'all',
    search: '',
  },

  setCurrentUser: (user: UserProfile) => set({ currentUser: user, isAuthenticated: true }),
  
  switchRole: (role: UserRole) => {
    const profile = AUTHORITY_PROFILES[role];
    if (profile) {
      set({ currentUser: profile, isAuthenticated: true });
    }
  },

  registerOfficer: (officer: Omit<UserProfile, 'id' | 'initials'>) => {
    const initials =
      officer.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'OF';

    const newProfile: UserProfile = {
      ...officer,
      id: `usr-${Date.now()}`,
      initials,
    };

    set((state) => ({
      registeredUsers: [newProfile, ...state.registeredUsers],
      currentUser: newProfile,
      isAuthenticated: true,
    }));
  },

  login: (user: UserProfile) => set({ currentUser: user, isAuthenticated: true }),

  logout: () => set({ isAuthenticated: false }),

  addIncident: (event: IncidentEvent) => {
    set((state) => {
      if (state.incidents.some((i) => i.id === event.id)) return state;

      const newIncidents = [event, ...state.incidents];
      const newStats = computeInitialStats(newIncidents);

      let newAlerts = state.alerts;
      if (event.severity === 'high' || event.severity === 'critical') {
        const newAlert: AlertItem = {
          id: `ALT-${event.id}`,
          incident_id: event.id,
          title: getAlertTitle(event.type),
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

  assignDepartment: (id: string, department: DepartmentType) => {
    set((state) => {
      const updatedIncidents = state.incidents.map((inc) =>
        inc.id === id ? { ...inc, assigned_department: department } : inc
      );
      return {
        incidents: updatedIncidents,
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
        department: 'all',
        dateRange: 'all',
        search: '',
      },
    }),

  injectSampleEvent: (typeOverride?: IncidentType): IncidentEvent => {
    const types: IncidentType[] = [
      'pothole',
      'damaged_divider',
      'missing_signboard',
      'waterlogging',
      'open_drain_garbage',
      'missing_crossing',
      'footpath_encroachment',
      'rash_driving',
      'wrong_way',
      'bus_footboard',
      'red_light_violation',
      'illegal_parking',
      'anpr',
      'hit_and_run',
    ];
    const chosenType = typeOverride || types[Math.floor(Math.random() * types.length)];
    const state = get();
    const bus = state.buses[Math.floor(Math.random() * state.buses.length)];
    const idNum = Math.floor(1050 + Math.random() * 8900);
    const id = `INC-${idNum}`;

    const lat = bus.current_latitude + (Math.random() - 0.5) * 0.015;
    const lng = bus.current_longitude + (Math.random() - 0.5) * 0.015;

    const plates = ['KA01AB1234', 'KA03MJ8812', 'KA05EF9901', 'KA04HH4190', 'KA51MD7744', 'KA02TR3319', 'KA04MN9021', 'DL03CA4412'];
    const plate = [
      'rash_driving',
      'anpr',
      'vehicle',
      'hit_and_run',
      'wrong_way',
      'red_light_violation',
      'illegal_parking',
    ].includes(chosenType)
      ? plates[Math.floor(Math.random() * plates.length)]
      : null;

    const departmentMap: Record<IncidentType, DepartmentType> = {
      pothole: 'pwd_roads',
      damaged_divider: 'pwd_roads',
      missing_signboard: 'pwd_roads',
      missing_crossing: 'pwd_roads',
      waterlogging: 'municipal_corp',
      open_drain_garbage: 'municipal_corp',
      footpath_encroachment: 'municipal_corp',
      pedestrian: 'municipal_corp',
      rash_driving: 'traffic_police',
      wrong_way: 'traffic_police',
      red_light_violation: 'traffic_police',
      illegal_parking: 'traffic_police',
      anpr: 'traffic_police',
      hit_and_run: 'traffic_police',
      bus_footboard: 'transit_auth',
      vehicle: 'transit_auth',
    };

    const descriptions: Record<IncidentType, string[]> = {
      pothole: [
        'Dangerous high-impact road crater detected by front sensor array.',
        'Asphalt surface collapse near storm drain intake.',
        'Deep lateral depression spanning two lanes with sharp edge profile.',
      ],
      damaged_divider: [
        'Structural concrete median divider destroyed and dislodged across active lane.',
        'Broken steel crash barrier protruding into high-speed bus corridor.',
      ],
      missing_signboard: [
        'Damaged speed limit & curve warning signboard bent and obscured.',
        'Missing mandatory stop signboard at arterial transit intersection.',
      ],
      waterlogging: [
        'Severe monsoon waterlogging submerging left carriage-way underpass.',
        'Water pooling (depth >15cm) causing severe transit slowdown.',
      ],
      open_drain_garbage: [
        'Uncovered storm drain chamber and waste spill creating pedestrian hazard.',
        'Illegal municipal garbage dumping obstructing public walkway.',
      ],
      missing_crossing: [
        'Pedestrian zebra stripes completely eroded under heavy monsoon wear.',
        'Unmarked mid-block high-density pedestrian transit zone.',
      ],
      footpath_encroachment: [
        'Commercial merchandise obstructing 80% of sidewalk, pushing commuters onto road.',
        'Illegal vendor kiosk blocking pedestrian access to transit shelter.',
      ],
      wrong_way: [
        'Vehicle driving against one-way traffic flow creating head-on collision risk.',
        'Two-wheeler travelling on wrong side of divided dual carriage-way.',
      ],
      bus_footboard: [
        'Commuters traveling on exterior bus footboard while vehicle in motion.',
        'Overcrowded transit bus door left open with passenger spillover.',
      ],
      red_light_violation: [
        'Red light stop-line breach at major urban transit junction.',
        'High-speed intersection crossing during red traffic signal phase.',
      ],
      illegal_parking: [
        'Commercial vehicle illegally parked inside marked bus boarding bay.',
        'Private vehicle double-parked obstructing municipal transit lane.',
      ],
      rash_driving: [
        'Severe zigzag lane weaving exceeding speed threshold (+35 km/h).',
        'Tailgating and abrupt cutoff of heavy municipal transit bus.',
      ],
      anpr: [
        'ANPR Match: Vehicle flagged for unpaid municipal court citations & warrant.',
        'Hotlist plate query hit against municipal enforcement database.',
      ],
      hit_and_run: [
        'CRITICAL: Hit-and-Run collision detected. Vehicle fled scene without stopping.',
        'Motorcycle collision suspect fleeing sector. Optical capture matches rear plate.',
      ],
      pedestrian: [
        'Pedestrian stepping into high-speed bus lane outside designated crosswalk.',
      ],
      vehicle: [
        'Stalled light goods vehicle blocking active municipal transit lane.',
      ],
    };

    const descList = descriptions[chosenType] || descriptions.pothole;
    const desc = descList[Math.floor(Math.random() * descList.length)];
    const severities: IncidentSeverity[] =
      ['hit_and_run', 'wrong_way', 'bus_footboard'].includes(chosenType)
        ? ['critical']
        : ['rash_driving', 'anpr', 'red_light_violation', 'waterlogging'].includes(chosenType)
        ? ['high', 'critical']
        : ['pothole', 'damaged_divider', 'open_drain_garbage'].includes(chosenType)
        ? ['medium', 'high', 'critical']
        : ['low', 'medium', 'high'];

    const severity = severities[Math.floor(Math.random() * severities.length)];

    const event: IncidentEvent = {
      id,
      type: chosenType,
      severity,
      confidence: parseFloat((0.88 + Math.random() * 0.11).toFixed(2)),
      timestamp: new Date().toISOString(),
      latitude: lat,
      longitude: lng,
      bus_id: bus.bus_id,
      route_id: bus.route_id,
      vehicle_id: plate ? `V-${Math.floor(100 + Math.random() * 900)}` : null,
      license_plate: plate,
      status: 'new',
      assigned_department: departmentMap[chosenType],
      work_order_id: `WO-${departmentMap[chosenType].toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      evidence_image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
      evidence_video: ['rash_driving', 'hit_and_run', 'wrong_way'].includes(chosenType)
        ? 'https://assets.mixkit.co/videos/preview/mixkit-traffic-on-a-busy-highway-at-night-42436-large.mp4'
        : null,
      description: desc,
    };

    get().addIncident(event);
    return event;
  },
}));
