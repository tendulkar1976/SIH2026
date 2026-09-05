import logging
import asyncio
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
from app.services.websocket_manager import manager

logger = logging.getLogger(__name__)

class EdgeDeviceHub:
    def __init__(self):
        # Default assigned device for BUS-102
        self.devices: Dict[str, Dict[str, Any]] = {
            "BUS-NODE-#1042": {
                "deviceId": "BUS-NODE-#1042",
                "pairingCode": "1042-7821",
                "busId": "BUS-102",
                "routeId": "R-12",
                "status": "DISCONNECTED",  # DISCONNECTED, CONNECTING, CONNECTED, LIVE
                "cameraStatus": "OFFLINE",  # OFFLINE, CONNECTING, LIVE, ERROR
                "aiStatus": "INACTIVE",    # INACTIVE, CONNECTED, ACTIVE, RUNNING
                "gpsStatus": "INACTIVE",   # INACTIVE, ACTIVE
                "streamStatus": "NOT_READY", # NOT_READY, READY, STREAMING
                "latitude": 12.9352,
                "longitude": 77.6245,
                "speed": 0.0,
                "heading": 0.0,
                "fps": 0.0,
                "latencyMs": 0,
                "detectionsCount": 0,
                "latestDetection": None,
                "lastSeen": None,
                "isRealPhone": False,
                # WebRTC session negotiation store
                "webrtcOffer": None,
                "webrtcAnswer": None,
                "iceCandidatesSender": [],
                "iceCandidatesReceiver": [],
            }
        }
        # Registered device signaling WebSocket connections: deviceId -> set of WebSockets
        self.device_signaling_sockets: Dict[str, List[Any]] = {}

    def get_device(self, device_id: str) -> Dict[str, Any]:
        if device_id not in self.devices:
            # Dynamically register
            self.devices[device_id] = {
                "deviceId": device_id,
                "pairingCode": "1042-7821",
                "busId": "BUS-102",
                "routeId": "R-12",
                "status": "DISCONNECTED",
                "cameraStatus": "OFFLINE",
                "aiStatus": "INACTIVE",
                "gpsStatus": "INACTIVE",
                "streamStatus": "NOT_READY",
                "latitude": 12.9352,
                "longitude": 77.6245,
                "speed": 0.0,
                "heading": 0.0,
                "fps": 0.0,
                "latencyMs": 0,
                "detectionsCount": 0,
                "latestDetection": None,
                "lastSeen": None,
                "isRealPhone": False,
                "webrtcOffer": None,
                "webrtcAnswer": None,
                "iceCandidatesSender": [],
                "iceCandidatesReceiver": [],
            }
        return self.devices[device_id]

    async def pair_device(self, device_id: str, pairing_code: str, bus_id: str = "BUS-102", is_real_phone: bool = True) -> Dict[str, Any]:
        dev = self.get_device(device_id)
        if pairing_code != dev.get("pairingCode", "1042-7821") and pairing_code != "1042-7821":
            return {"success": False, "message": "Invalid pairing code"}

        now_str = datetime.now(timezone.utc).isoformat()
        dev["status"] = "CONNECTED"
        dev["cameraStatus"] = "LIVE"
        dev["aiStatus"] = "ACTIVE"
        dev["gpsStatus"] = "ACTIVE"
        dev["streamStatus"] = "READY"
        dev["busId"] = bus_id
        dev["lastSeen"] = now_str
        dev["isRealPhone"] = is_real_phone
        dev["fps"] = 30.0
        dev["latencyMs"] = 45

        # Broadcast event across all WebSocket clients
        await manager.broadcast({
            "type": "device_connected",
            "deviceId": device_id,
            "busId": bus_id,
            "isRealPhone": is_real_phone,
            "timestamp": now_str,
            "device": dev
        })

        return {
            "success": True,
            "deviceId": device_id,
            "busId": bus_id,
            "status": "CONNECTED",
            "message": f"Device {device_id} successfully paired with {bus_id}",
            "token": f"token-{device_id}-{int(datetime.now().timestamp())}"
        }

    async def update_status(self, device_id: str, camera_status: str, ai_status: str, fps: float, latency_ms: int, detections_count: int, is_streaming: bool):
        dev = self.get_device(device_id)
        dev["cameraStatus"] = camera_status
        dev["aiStatus"] = ai_status
        dev["fps"] = fps
        dev["latencyMs"] = latency_ms
        if detections_count > 0:
            dev["detectionsCount"] = detections_count
        dev["streamStatus"] = "STREAMING" if is_streaming else "READY"
        dev["lastSeen"] = datetime.now(timezone.utc).isoformat()

        await manager.broadcast({
            "type": "camera_status",
            "deviceId": device_id,
            "busId": dev.get("busId", "BUS-102"),
            "cameraStatus": camera_status,
            "aiStatus": ai_status,
            "fps": fps,
            "latencyMs": latency_ms,
            "streamStatus": dev["streamStatus"],
            "timestamp": dev["lastSeen"]
        })

    async def update_telemetry(self, bus_id: str, device_id: str, latitude: float, longitude: float, speed: float, heading: float, fps: float, timestamp: Optional[str] = None):
        dev = self.get_device(device_id)
        now_str = timestamp or datetime.now(timezone.utc).isoformat()
        dev["latitude"] = latitude
        dev["longitude"] = longitude
        dev["speed"] = speed
        dev["heading"] = heading
        dev["fps"] = fps or dev.get("fps", 30.0)
        dev["lastSeen"] = now_str
        dev["gpsStatus"] = "ACTIVE"

        await manager.broadcast({
            "type": "gps_update",
            "busId": bus_id,
            "deviceId": device_id,
            "latitude": latitude,
            "longitude": longitude,
            "speed": speed,
            "heading": heading,
            "fps": fps,
            "timestamp": now_str
        })

    async def record_detection(self, detection_data: Dict[str, Any]):
        device_id = detection_data.get("deviceId", "BUS-NODE-#1042")
        bus_id = detection_data.get("busId", "BUS-102")
        dev = self.get_device(device_id)
        dev["detectionsCount"] = dev.get("detectionsCount", 0) + 1
        dev["latestDetection"] = {
            "type": detection_data.get("detectionType", "Pothole"),
            "confidence": detection_data.get("confidence", 0.94),
            "severity": detection_data.get("severity", "High"),
            "timestamp": detection_data.get("timestamp") or datetime.now(timezone.utc).isoformat(),
            "bbox": detection_data.get("bbox", [20, 30, 40, 30])
        }

        # Broadcast detection event
        await manager.broadcast({
            "type": "detection",
            "busId": bus_id,
            "deviceId": device_id,
            "detectionType": detection_data.get("detectionType", "Pothole"),
            "confidence": detection_data.get("confidence", 0.94),
            "severity": detection_data.get("severity", "High"),
            "latitude": detection_data.get("latitude", dev.get("latitude", 12.9352)),
            "longitude": detection_data.get("longitude", dev.get("longitude", 77.6245)),
            "timestamp": detection_data.get("timestamp") or datetime.now(timezone.utc).isoformat(),
            "bbox": detection_data.get("bbox"),
            "licensePlate": detection_data.get("licensePlate"),
            "speedEstimate": detection_data.get("speedEstimate"),
            "description": detection_data.get("description")
        })

    # WebRTC Signaling Session Store
    async def set_webrtc_offer(self, device_id: str, sdp: str):
        dev = self.get_device(device_id)
        dev["webrtcOffer"] = {"type": "offer", "sdp": sdp}
        dev["webrtcAnswer"] = None  # Reset answer on new offer
        dev["iceCandidatesSender"] = []
        dev["iceCandidatesReceiver"] = []

        await manager.broadcast({
            "type": "webrtc_offer",
            "deviceId": device_id,
            "sdp": sdp
        })

    async def set_webrtc_answer(self, device_id: str, sdp: str):
        dev = self.get_device(device_id)
        dev["webrtcAnswer"] = {"type": "answer", "sdp": sdp}

        await manager.broadcast({
            "type": "webrtc_answer",
            "deviceId": device_id,
            "sdp": sdp
        })

    async def add_ice_candidate(self, device_id: str, candidate: Dict[str, Any], role: str):
        dev = self.get_device(device_id)
        if role == "sender":
            dev["iceCandidatesSender"].append(candidate)
        else:
            dev["iceCandidatesReceiver"].append(candidate)

        await manager.broadcast({
            "type": "webrtc_ice",
            "deviceId": device_id,
            "candidate": candidate,
            "role": role
        })

edge_hub = EdgeDeviceHub()
