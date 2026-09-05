# Android "Bus Sensing SmartCam" Integration Guide

This guide details how the existing Android APK **"Bus Sensing SmartCam"** (Node ID: `BUS-NODE-#1042`, assigned to `BUS-102`) interfaces with the **UrbanSense OCC Backend & Web Dashboard**.

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│     Android Phone ("Bus Sensing SmartCam" APK v1.0)     │
│  - Device Node: BUS-NODE-#1042                          │
│  - On-Device AI: YOLOv10 / TFLite (Source of Truth)     │
│  - Sensors: Camera2 / WebRTC + GPS Geolocation Engine   │
└──────────────────────────┬──────────────────────────────┘
                           │
             Wi-Fi / 4G / 5G Internet
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 UrbanSense Backend API                  │
│  - WebRTC SDP/ICE Signaling: /api/webrtc/*              │
│  - Device Pairing & Status:  /api/devices/*             │
│  - GPS Telemetry Ingest:     POST /api/telemetry        │
│  - AI Detection Events:      POST /api/detections       │
│  - Realtime WebSocket:       /ws/events                 │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                UrbanSense OCC Dashboard                 │
│  - Live Monitor Video Feed (WebRTC Remote Stream)       │
│  - Neural Bounding Boxes & Confidence Overlays          │
│  - Real-time GPS Telemetry (Lat, Lng, Speed, FPS)       │
│  - Edge Vision Detection History Stream                 │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Network & API Endpoints

- **Backend Base URL:** `http://<SERVER_IP>:8000` (e.g. `http://192.168.1.100:8000`)
- **WebSocket URL:** `ws://<SERVER_IP>:8000/ws/events`
- **Default Pairing Code:** `1042-7821`
- **Device ID:** `BUS-NODE-#1042`
- **Bus ID:** `BUS-102`

---

## 3. Step-by-Step Native Kotlin/Java Code Integration

### Step 3.1: Pair Device Handshake (`POST /api/devices/pair`)

When the app starts or the user inputs the pairing code, send a pairing request:

```kotlin
// DeviceRegistration.kt
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

fun pairDeviceWithUrbanSense(serverUrl: String, deviceId: String = "BUS-NODE-#1042", pairingCode: String = "1042-7821", busId: String = "BUS-102") {
    val client = OkHttpClient()
    val json = JSONObject().apply {
        put("deviceId", deviceId)
        put("pairingCode", pairingCode)
        put("busId", busId)
        put("deviceType", "Android Bus Sensing SmartCam")
        put("appVersion", "1.0")
    }

    val body = json.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
    val request = Request.Builder()
        .url("$serverUrl/api/devices/pair")
        .post(body)
        .build()

    client.newCall(request).enqueue(object : Callback {
        override fun onFailure(call: Call, e: java.io.IOException) {
            println("Pairing failed: ${e.message}")
        }

        override fun onResponse(call: Call, response: Response) {
            val responseBody = response.body?.string()
            println("Device successfully paired: $responseBody")
        }
    })
}
```

---

### Step 3.2: Publish Real-Time GPS Telemetry (`POST /api/telemetry` or WebSocket)

Send periodic vehicle speed, heading, and GPS coordinates:

```kotlin
// TelemetryPublisher.kt
fun publishGpsTelemetry(serverUrl: String, busId: String = "BUS-102", deviceId: String = "BUS-NODE-#1042", lat: Double, lng: Double, speedKmh: Double, fps: Double) {
    val client = OkHttpClient()
    val json = JSONObject().apply {
        put("busId", busId)
        put("deviceId", deviceId)
        put("latitude", lat)
        put("longitude", lng)
        put("speed", speedKmh)
        put("fps", fps)
        put("timestamp", java.time.Instant.now().toString())
    }

    val body = json.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
    val request = Request.Builder()
        .url("$serverUrl/api/telemetry")
        .post(body)
        .build()

    client.newCall(request).execute()
}
```

---

### Step 3.3: Publish On-Device AI Detections (`POST /api/detections`)

When the on-device AI model detects a road anomaly or traffic incident:

```kotlin
// DetectionPublisher.kt
fun publishDetectionEvent(
    serverUrl: String,
    busId: String = "BUS-102",
    deviceId: String = "BUS-NODE-#1042",
    detectionType: String, // e.g. "Pothole", "Zebra Crossing", "Wrong Way", "Person"
    confidence: Float,     // e.g. 0.94f
    lat: Double,
    lng: Double,
    bboxPct: List<Float>   // [x_pct, y_pct, width_pct, height_pct]
) {
    val client = OkHttpClient()
    val json = JSONObject().apply {
        put("busId", busId)
        put("deviceId", deviceId)
        put("detectionType", detectionType)
        put("confidence", confidence)
        put("latitude", lat)
        put("longitude", lng)
        put("severity", if (detectionType == "Wrong Way" || detectionType == "Hit and Run") "Critical" else "High")
        put("bbox", org.json.JSONArray(bboxPct))
        put("timestamp", java.time.Instant.now().toString())
    }

    val body = json.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
    val request = Request.Builder()
        .url("$serverUrl/api/detections")
        .post(body)
        .build()

    client.newCall(request).execute()
}
```

---

### Step 3.4: WebRTC Video Stream Publisher (`webrtc-android`)

Using Google's official `org.webrtc:google-webrtc:1.0.32006` library:

```kotlin
// WebRTCStreamer.kt
import org.webrtc.*

class WebRTCStreamer(val context: android.content.Context, val serverUrl: String, val deviceId: String = "BUS-NODE-#1042") {
    private var peerConnection: PeerConnection? = null
    private val factory: PeerConnectionFactory

    init {
        val options = PeerConnectionFactory.InitializationOptions.builder(context).createInitializationOptions()
        PeerConnectionFactory.initialize(options)
        factory = PeerConnectionFactory.builder().createPeerConnectionFactory()
    }

    fun startStreaming(videoCapturer: VideoCapturer) {
        val iceServers = listOf(
            PeerConnection.IceServer.builder("stun:stun.l.google.com:19302").createIceServer()
        )
        val rtcConfig = PeerConnection.RTCConfiguration(iceServers)

        peerConnection = factory.createPeerConnection(rtcConfig, object : PeerConnection.Observer {
            override fun onIceCandidate(candidate: IceCandidate) {
                // Send ICE candidate to backend: POST /api/webrtc/ice
                sendIceCandidateToBackend(candidate)
            }
            override fun onSignalingChange(state: PeerConnection.SignalingState) {}
            override fun onIceConnectionChange(state: PeerConnection.IceConnectionState) {}
            override fun onIceConnectionReceivingChange(receiving: Boolean) {}
            override fun onIceGatheringChange(state: PeerConnection.IceGatheringState) {}
            override fun onIceCandidatesRemoved(candidates: Array<out IceCandidate>) {}
            override fun onAddStream(stream: MediaStream) {}
            override fun onRemoveStream(stream: MediaStream) {}
            override fun onDataChannel(channel: DataChannel) {}
            override fun onRenegotiationNeeded() {}
        })

        // Add Local Camera Track
        val videoSource = factory.createVideoSource(videoCapturer.isScreencast)
        val videoTrack = factory.createVideoTrack("CAMERA_TRACK_1042", videoSource)
        val mediaStream = factory.createLocalMediaStream("STREAM_1042")
        mediaStream.addTrack(videoTrack)
        peerConnection?.addStream(mediaStream)

        // Create SDP Offer
        val mediaConstraints = MediaConstraints()
        peerConnection?.createOffer(object : SdpObserver {
            override fun onCreateSuccess(desc: SessionDescription) {
                peerConnection?.setLocalDescription(this, desc)
                // POST /api/webrtc/offer
                sendOfferToBackend(desc.description)
            }
            override fun onSetSuccess() {}
            override fun onCreateFailure(error: String) {}
            override fun onSetFailure(error: String) {}
        }, mediaConstraints)
    }

    private fun sendOfferToBackend(sdp: String) {
        val client = OkHttpClient()
        val json = JSONObject().apply {
            put("deviceId", deviceId)
            put("sdp", sdp)
            put("role", "sender")
            put("type", "offer")
        }
        val body = json.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
        val request = Request.Builder().url("$serverUrl/api/webrtc/offer").post(body).build()
        client.newCall(request).execute()
    }

    private fun sendIceCandidateToBackend(candidate: IceCandidate) {
        val client = OkHttpClient()
        val candJson = JSONObject().apply {
            put("sdpMid", candidate.sdpMid)
            put("sdpMLineIndex", candidate.sdpMLineIndex)
            put("candidate", candidate.sdp)
        }
        val json = JSONObject().apply {
            put("deviceId", deviceId)
            put("candidate", candJson)
            put("role", "sender")
        }
        val body = json.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
        val request = Request.Builder().url("$serverUrl/api/webrtc/ice").post(body).build()
        client.newCall(request).execute()
    }
}
```

---

## 4. Immediate Browser Testing

To test the complete workflow without compiling an APK:
1. Open the dashboard at `http://localhost:3000/fleet`
2. Click **Live Monitor** on `BUS-102`
3. Scan the QR code or open `http://localhost:3000/mobile-camera?pair=1042-7821` on your mobile phone or another browser window.
4. Your camera will broadcast live video over WebRTC, transmit real GPS telemetry, and report AI detections instantly!
