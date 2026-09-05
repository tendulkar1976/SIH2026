import { IncidentEvent, ConnectionStatus } from '@/types';
import { useUrbanStore } from '@/store/useUrbanStore';
import { webrtcReceiver } from '@/services/webrtc';

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/events';

type EventListener = (event: IncidentEvent) => void;
type StatusListener = (status: ConnectionStatus) => void;

class RealtimeService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private simulationTimer: NodeJS.Timeout | null = null;
  private telemetryTimer: NodeJS.Timeout | null = null;
  private eventListeners: Set<EventListener> = new Set();
  private statusListeners: Set<StatusListener> = new Set();
  private isExplicitlyClosed = false;

  constructor() {
    // Will be initialized when mounted in client
  }

  public connect(url: string = WS_BASE_URL) {
    if (typeof window === 'undefined') return;

    this.isExplicitlyClosed = false;
    this.updateStatus('reconnecting');

    try {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.updateStatus('connected');
        console.log('[UrbanSense Realtime] Connected to backend WebSocket server at:', url);
        this.stopSimulation();
      };

      this.socket.onmessage = async (messageEvent) => {
        try {
          const payload = JSON.parse(messageEvent.data);
          const store = useUrbanStore.getState();

          // 1. Edge Device Connection Broadcast
          if (payload.type === 'device_connected') {
            console.log('[Realtime] Device connected:', payload.deviceId);
            store.setRealPhoneConnected(true);
            store.setEdgeStatus('STREAM_READY');
          }

          // 1b. Edge Device Disconnected Broadcast
          if (payload.type === 'device_disconnected') {
            console.log('[Realtime] Device disconnected:', payload.deviceId);
            store.setRealPhoneConnected(false);
            store.setEdgeStatus('DISCONNECTED');
            store.setLivePhoneFrame(null);
          }

          // 2. Live Video Frame Broadcast (Dual-Channel Backup)
          if (payload.type === 'video_frame' && payload.frame) {
            store.setLivePhoneFrame(payload.frame);
            store.setRealPhoneConnected(true);
            if (payload.fps) {
              store.updateEdgeTelemetry({ fps: payload.fps });
            }
          }

          // 3. Camera & Sensor Status Broadcast
          if (payload.type === 'camera_status') {
            if (payload.cameraStatus === 'LIVE') {
              store.setEdgeStatus('LIVE');
            }
            store.updateEdgeTelemetry({
              fps: payload.fps,
              latencyMs: payload.latencyMs,
            });
          }

          // 3b. Real-time GPS & Device Telemetry
          if (payload.type === 'telemetry' || payload.type === 'gps_update') {
            store.updateEdgeTelemetry({
              latitude: payload.latitude,
              longitude: payload.longitude,
              speed: payload.speed,
              fps: payload.fps,
            });
            if (payload.busId) {
              store.updateBusTelemetry(payload.busId, {
                current_latitude: payload.latitude,
                current_longitude: payload.longitude,
                speed_kmh: payload.speed,
                fps: payload.fps,
              });
            }
          }

          // 4. Real-time AI Detections from Phone
          if (payload.type === 'detection') {
            store.recordEdgeDetection({
              type: payload.detectionType || payload.type || 'Pothole',
              confidence: payload.confidence ?? 0.94,
              severity: payload.severity || 'High',
              timestamp: payload.timestamp,
              bbox: payload.bbox,
              busId: payload.busId || 'BUS-102',
            });
          }

          // 5. WebRTC SDP Offer from Phone Camera
          if (payload.type === 'webrtc_offer' && payload.sdp) {
            console.log('[Realtime] Received WebRTC offer for device:', payload.deviceId);
            await webrtcReceiver.handleRemoteOffer(payload.sdp);
          }

          // 6. WebRTC ICE Candidate from Phone
          if (payload.type === 'webrtc_ice' && payload.candidate && payload.role === 'sender') {
            await webrtcReceiver.addIceCandidate(payload.candidate);
          }

          // 7. General Incident Events
          const eventItem = payload?.data || payload;
          if (eventItem && (eventItem.id || eventItem.incident_id)) {
            const mappedEvent: IncidentEvent = {
              id: eventItem.id || eventItem.incident_id,
              type: eventItem.type || eventItem.incident_type || eventItem.incidentType || 'pothole',
              severity: eventItem.severity || 'medium',
              confidence: eventItem.confidence ?? 0.95,
              timestamp: eventItem.timestamp || new Date().toISOString(),
              latitude: eventItem.location?.latitude ?? eventItem.latitude ?? 12.9716,
              longitude: eventItem.location?.longitude ?? eventItem.longitude ?? 77.5946,
              bus_id: eventItem.busId || eventItem.bus_id || 'BUS-101',
              route_id: eventItem.routeId || eventItem.route_id || 'R-05',
              vehicle_id: eventItem.vehicle_id || null,
              license_plate: eventItem.license_plate || null,
              status: eventItem.status || 'new',
              assigned_department: eventItem.assigned_department || 'municipal_corp',
              work_order_id: eventItem.work_order_id,
              evidence_image: eventItem.evidence_image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
              evidence_video: eventItem.evidence_video || null,
              description: eventItem.description || 'AI Edge vision detection recorded.',
            };
            this.handleEvent(mappedEvent);
          }
        } catch (err) {
          console.error('[UrbanSense Realtime] Error parsing WebSocket payload:', err);
        }
      };

      this.socket.onerror = () => {
        // Socket error, onclose will trigger next
      };

      this.socket.onclose = () => {
        if (!this.isExplicitlyClosed) {
          this.handleDisconnect();
        } else {
          this.updateStatus('disconnected');
        }
      };
    } catch (err) {
      this.handleDisconnect();
    }
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.stopSimulation();
    this.updateStatus('disconnected');
  }

  public reconnect() {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }

  private handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.updateStatus('reconnecting');
      const delay = Math.min(this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1), 15000);
      
      this.reconnectTimer = setTimeout(() => {
        console.log(`[UrbanSense Realtime] Attempting reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect();
      }, delay);
    } else {
      // Fallback to active demo simulation mode if backend server is not yet deployed
      this.updateStatus('simulating');
      this.startSimulation();
    }
  }

  public handleEvent(event: IncidentEvent) {
    // Notify all registered listeners
    this.eventListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in event listener:', err);
      }
    });

    // Update global state store automatically
    useUrbanStore.getState().addIncident(event);
  }

  public onEvent(listener: EventListener): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  public onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  private updateStatus(status: ConnectionStatus) {
    useUrbanStore.getState().setConnectionStatus(status);
    this.statusListeners.forEach((listener) => listener(status));
  }

  public setSimulatedState(status: 'LIVE' | 'RECONNECTING' | 'OFFLINE') {
    if (status === 'OFFLINE') {
      this.stopSimulation();
      this.updateStatus('OFFLINE');
    } else if (status === 'RECONNECTING') {
      this.updateStatus('RECONNECTING');
    } else {
      this.updateStatus('LIVE');
      this.startSimulation();
    }
  }

  // --- REAL-TIME EVENT SIMULATION ENGINE (PHASE 7) ---

  public startSimulation() {
    if (this.simulationTimer) return;

    // Simulation loop for AI edge detection events (every 3 to 8 seconds)
    const triggerSimulatedEvent = () => {
      const state = useUrbanStore.getState();
      if (!state.isDemoMode || state.simulationSpeed === 0) return;

      const event = state.injectSampleEvent();
      this.eventListeners.forEach((listener) => listener(event));

      // Schedule next dynamic event every 3–8 seconds divided by simulation multiplier
      const baseInterval = (3000 + Math.random() * 5000) / (state.simulationSpeed || 1);
      this.simulationTimer = setTimeout(triggerSimulatedEvent, baseInterval);
    };

    // First event delayed 2 seconds
    this.simulationTimer = setTimeout(triggerSimulatedEvent, 2000);

    // Telemetry jitter loop for live HUD & bus movement
    this.startTelemetryJitter();
  }

  private startTelemetryJitter() {
    if (this.telemetryTimer) return;

    this.telemetryTimer = setInterval(() => {
      const state = useUrbanStore.getState();
      const currentBuses = state.buses;

      currentBuses.forEach((bus) => {
        if (!bus.is_online) return;

        // Subtle realistic GPS drift along route
        const latDrift = (Math.random() - 0.5) * 0.0004;
        const lngDrift = (Math.random() - 0.5) * 0.0004;
        const speedDelta = Math.floor((Math.random() - 0.5) * 6);
        const newSpeed = Math.max(15, Math.min(65, bus.speed_kmh + speedDelta));
        const fpsDrift = parseFloat((29 + Math.random() * 2).toFixed(1));
        const latencyDrift = Math.floor(35 + Math.random() * 15);

        // Jitter bounding boxes on live feed
        const updatedDetections = bus.detections_in_frame.map((det) => ({
          ...det,
          bbox: [
            Math.max(5, Math.min(85, det.bbox[0] + (Math.random() - 0.5) * 2)),
            Math.max(20, Math.min(75, det.bbox[1] + (Math.random() - 0.5) * 2)),
            det.bbox[2],
            det.bbox[3],
          ] as [number, number, number, number],
          confidence: parseFloat(Math.min(0.99, Math.max(0.75, det.confidence + (Math.random() - 0.5) * 0.02)).toFixed(2)),
        }));

        state.updateBusTelemetry(bus.bus_id, {
          current_latitude: bus.current_latitude + latDrift,
          current_longitude: bus.current_longitude + lngDrift,
          speed_kmh: newSpeed,
          fps: fpsDrift,
          latency_ms: latencyDrift,
          detections_in_frame: updatedDetections,
        });
      });
    }, 1500);
  }

  public stopSimulation() {
    if (this.simulationTimer) {
      clearTimeout(this.simulationTimer);
      this.simulationTimer = null;
    }
    if (this.telemetryTimer) {
      clearInterval(this.telemetryTimer);
      this.telemetryTimer = null;
    }
  }
}

export const realtimeService = new RealtimeService();
