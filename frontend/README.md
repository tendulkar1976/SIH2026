# UrbanSense — AI-Powered Real-Time Urban Intelligence Platform

UrbanSense is a production-grade, high-performance real-time command center interface designed for municipal traffic, road safety, and civic infrastructure authorities.

The platform ingests edge computer-vision intelligence generated from bus-mounted optical camera arrays and updates dashboard statistics, priority alert queues, forensic incident dossiers, spatial GIS city maps, live video monitoring HUDs, transit fleet status, and deep analytics in real time **without requiring manual page refreshes**.

---

## 🏛️ 1. Architecture Overview

UrbanSense uses a single, unified data and event architecture for both live production and real-time simulation:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          EDGE BUS CAMERA NODES                          │
│     Optical Video Feed ──► Edge AI Model (YOLOv10 / OCR / Spatial)      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ JSON Canonical Event Stream
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            BACKEND SERVICES                             │
│       REST API (Historical & CRUD)   │   WebSocket / SSE Server         │
└────────────────────┬─────────────────┴─────────────────┬────────────────┘
                     │                                   │
                     ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND SERVICES                            │
│           REST Client                        WebSocket / SSE Client     │
│       (services/api.ts)                       (services/realtime.ts)    │
│                     │                                   │
│                     └─────────────────┬─────────────────┘
│                                       ▼
│                        Zustand Central Reactive Store                   │
│                            (store/useUrbanStore.ts)                     │
└───────────────────────────────────────┬─────────────────────────────────┘
                                        │ Zero-Refresh State Updates
                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          COMMAND CENTER PAGES                           │
│  /dashboard  │  /live  │  /incidents  │  /alerts  │  /map  │  /fleet    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ 2. Installation & Quickstart

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm or yarn

### 1. Clone & Enter Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the `frontend` root:
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/events
NEXT_PUBLIC_DEMO_DEFAULT=true
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Test
```bash
npm run build
npm run start
```

---

## 🔌 3. API & Real-Time Integration

### REST API Integration (`services/api.ts`)
The frontend communicates with the backend REST API for historical query fetching and status mutations:
- `GET /api/v1/incidents` — Retrieve incident records with query filters (`type`, `severity`, `route`, `status`, `date`).
- `GET /api/v1/incidents/:id` — Retrieve full forensic incident dossier.
- `PATCH /api/v1/incidents/:id/status` — Mutate incident workflow status (`new` | `investigating` | `resolved` | `dismissed`).
- `GET /api/v1/fleet` — Query transit bus fleet telemetry and optical sensor health.
- `GET /api/v1/analytics/summary` — Query time-series analytics, route density rankings, and hotspot indices.

*Graceful Degradation*: If the backend REST server is offline, the API service automatically falls back to local data without throwing uncaught exceptions.

### WebSocket / SSE Real-Time Integration (`services/realtime.ts`)
- Automatically connects to `NEXT_PUBLIC_WS_URL`.
- Listens for canonical incident events and telemetry frames.
- Implements exponential backoff auto-reconnection (up to 5 attempts).
- Automatically triggers zero-refresh state updates via `realtimeService.handleEvent(event)`.

---

## 📦 4. Canonical Event Schema Contract

All incoming real-time events strictly adhere to this 14-field specification:

```json
{
  "id": "INC-1052",
  "type": "pothole",
  "severity": "high",
  "confidence": 0.91,
  "timestamp": "2026-09-04T10:32:00.000Z",
  "latitude": 12.9352,
  "longitude": 77.6245,
  "bus_id": "BUS-102",
  "route_id": "R-12",
  "vehicle_id": null,
  "license_plate": null,
  "status": "new",
  "evidence_image": "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
  "evidence_video": null,
  "description": "Dangerous high-impact road crater detected by front sensor array."
}
```

Supported Event Types:
- `pothole`
- `vehicle`
- `missing_crossing`
- `rash_driving`
- `anpr`
- `hit_and_run`

---

## 🎬 5. Demo Mode & Complete Presentation Walkthrough

The platform features a built-in real-time simulation engine generating realistic events every **3 to 8 seconds** across 6 municipal bus nodes.

### Step-by-Step Demo Flow:
1. **Officer Login (`/login`)**:
   - Access the officer portal with pre-filled commander credentials (`commander@urbansense.gov` / `demo123`).
2. **Master Dashboard (`/dashboard`)**:
   - Observe live KPI cards, real-time trend charts, recent incidents table, alert notifications, and fleet summary.
3. **Live Video Monitoring (`/live`)**:
   - Switch between camera streams, observe AI detection bounding box overlays (cars, pedestrians, potholes, crossings), and live activity stream.
4. **AI Event Simulation & Priority Alert (`/alerts`)**:
   - Use the **Event Simulator HUD** at the top of any page to click **`+ Hit-and-Run`** or **`+ Rash Driving`**.
   - Notice the instant non-intrusive notification toast and emergency alert card creation with zero page refresh.
5. **Incident Dossier Inspection (`/incidents/[id]`)**:
   - Open any incident to inspect zoomable snapshot evidence, video playback, AI bounding boxes, GPS coordinates, and status workflow controls (`New` → `Investigating` → `Resolved`).
6. **Geospatial GIS Map (`/map`)**:
   - View city-wide hazard distribution on Leaflet with OpenStreetMap tiles, 6 category filters, density heatmap layer, and clickable marker popups.
7. **Fleet Telemetry & Bus Details (`/fleet`)**:
   - Inspect active bus nodes, filter by `Online`, `Warning`, or `Offline` status, and open the comprehensive **Bus Details Modal**.
8. **Urban Analytics (`/analytics`)**:
   - Review incidents over time, vehicle classifications, pothole severity distributions, and rash driving corridors.

---

## ⚠️ 6. Known Limitations & Production Notes

1. **Simulated Video Feeds**: Live video channels currently use high-definition loop demonstrations and MP4 canvas overlays; production deployment will hook into WebRTC or HLS camera edge streams.
2. **Leaflet SSR Isolation**: Leaflet is loaded dynamically on client mount inside `useEffect` to ensure static Next.js prerendering safety.
3. **Mock Data Separation**: All mock datasets are centralized in `data/` and `store/` — no hardcoded mock values inside visual presentation components.

---

## 📄 License
UrbanSense Command Intelligence Platform &copy; 2026. Built for Municipal Traffic & Safety Authorities.
