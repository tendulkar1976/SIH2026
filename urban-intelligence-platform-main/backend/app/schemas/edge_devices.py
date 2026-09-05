from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime

class DeviceRegisterRequest(BaseModel):
    deviceId: str = Field(default="BUS-NODE-#1042")
    busId: str = Field(default="BUS-102")
    deviceType: Optional[str] = "mobile-edge-vision"
    pairingCode: Optional[str] = "1042-7821"
    capabilities: Optional[Dict[str, Any]] = Field(default_factory=lambda: {
        "camera": True,
        "ai": True,
        "gps": True,
        "webrtc": True
    })

class DevicePairRequest(BaseModel):
    deviceId: str = Field(default="BUS-NODE-#1042")
    pairingCode: Optional[str] = "1042-7821"
    busId: Optional[str] = "BUS-102"
    deviceType: Optional[str] = "mobile-edge-vision"
    appVersion: Optional[str] = "1.0"
    capabilities: Optional[Dict[str, Any]] = None

class DevicePairResponse(BaseModel):
    success: bool
    deviceId: str
    busId: str
    status: str
    message: str
    token: Optional[str] = None

class DeviceStatusUpdate(BaseModel):
    deviceId: str
    busId: Optional[str] = "BUS-102"
    cameraStatus: str = "LIVE"  # LIVE, CONNECTING, OFFLINE, ERROR
    aiStatus: str = "ACTIVE"     # ACTIVE, RUNNING, PAUSED, IDLE
    fps: Optional[float] = 30.0
    latencyMs: Optional[int] = 45
    detectionsCount: Optional[int] = 0
    isStreaming: Optional[bool] = True

class DeviceTelemetryRequest(BaseModel):
    busId: str = "BUS-102"
    deviceId: Optional[str] = "BUS-NODE-#1042"
    latitude: float
    longitude: float
    speed: Optional[float] = 0.0
    heading: Optional[float] = 0.0
    altitude: Optional[float] = None
    fps: Optional[float] = 30.0
    timestamp: Optional[str] = None

class BoundingBoxCoord(BaseModel):
    # Normalized [0..1] or percentages [0..100] or [x, y, w, h]
    x: Optional[float] = None
    y: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None

class EdgeDetectionRequest(BaseModel):
    busId: str = "BUS-102"
    deviceId: str = "BUS-NODE-#1042"
    detectionType: Optional[str] = None  # "Pothole", "Zebra Crossing", "Person", "Vehicle", etc.
    label: Optional[str] = None          # "Person", "Pothole", "Vehicle", etc.
    confidence: float
    latitude: Optional[float] = 12.9352
    longitude: Optional[float] = 77.6245
    timestamp: Optional[str] = None
    severity: Optional[str] = "High"
    bbox: Optional[List[float]] = None # [x_pct, y_pct, width_pct, height_pct]
    boundingBox: Optional[Dict[str, float]] = None # {"x": 0.21, "y": 0.18, "width": 0.30, "height": 0.42}
    licensePlate: Optional[str] = None
    speedEstimate: Optional[float] = None
    description: Optional[str] = None

class WebRTCSessionDescription(BaseModel):
    type: str  # "offer" or "answer"
    sdp: str

class WebRTCOfferRequest(BaseModel):
    deviceId: str = "BUS-NODE-#1042"
    role: str = "sender"  # "sender" (phone) or "receiver" (dashboard)
    sdp: str
    type: str = "offer"

class WebRTCAnswerRequest(BaseModel):
    deviceId: str = "BUS-NODE-#1042"
    role: str = "receiver"
    sdp: str
    type: str = "answer"

class WebRTCICECandidate(BaseModel):
    deviceId: str = "BUS-NODE-#1042"
    candidate: Dict[str, Any]
    role: Optional[str] = "sender"
