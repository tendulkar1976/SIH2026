from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from typing import Dict, Any, Optional, List
from app.schemas.edge_devices import (
    DevicePairRequest, DevicePairResponse,
    DeviceStatusUpdate, DeviceTelemetryRequest,
    EdgeDetectionRequest
)
from app.services.edge_hub import edge_hub

router = APIRouter(prefix="/api/devices", tags=["Edge Devices"])

@router.post("/pair", response_model=DevicePairResponse)
async def pair_edge_device(payload: DevicePairRequest):
    """
    Pair Android edge vision camera (e.g. Bus Sensing SmartCam on BUS-NODE-#1042)
    using the pairing code (1042-7821).
    """
    result = await edge_hub.pair_device(
        device_id=payload.deviceId,
        pairing_code=payload.pairingCode,
        bus_id=payload.busId,
        is_real_phone=True
    )
    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("message", "Pairing failed")
        )
    return DevicePairResponse(
        success=True,
        deviceId=result["deviceId"],
        busId=result["busId"],
        status=result["status"],
        message=result["message"],
        token=result.get("token")
    )

@router.post("/register", response_model=DevicePairResponse)
async def register_edge_device(payload: DevicePairRequest):
    """Alias for registering or pairing an edge device node."""
    return await pair_edge_device(payload)

@router.get("/status")
async def get_device_status_query(deviceId: Optional[str] = "BUS-NODE-#1042"):
    """Get real-time operational status for a connected edge node via query parameter."""
    return edge_hub.get_device(deviceId or "BUS-NODE-#1042")

@router.get("/{device_id:path}/status")
async def get_device_status(device_id: str):
    """Get real-time operational status for a connected edge node."""
    return edge_hub.get_device(device_id)

@router.post("/{device_id}/status")
async def update_device_status(device_id: str, payload: DeviceStatusUpdate):
    """Update camera, AI engine, and streaming status from Android phone."""
    await edge_hub.update_status(
        device_id=device_id,
        camera_status=payload.cameraStatus,
        ai_status=payload.aiStatus,
        fps=payload.fps or 30.0,
        latency_ms=payload.latencyMs or 45,
        detections_count=payload.detectionsCount or 0,
        is_streaming=payload.isStreaming if payload.isStreaming is not None else True
    )
    return {"status": "ok", "deviceId": device_id}

# Global /api/telemetry endpoint
telemetry_router = APIRouter(prefix="/api", tags=["Telemetry & Detections"])

@telemetry_router.post("/telemetry")
async def ingest_device_telemetry(payload: DeviceTelemetryRequest):
    """
    Ingest GPS coordinates, speed, heading, and FPS from the Android phone.
    """
    device_id = payload.deviceId or "BUS-NODE-#1042"
    await edge_hub.update_telemetry(
        bus_id=payload.busId,
        device_id=device_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        speed=payload.speed or 0.0,
        heading=payload.heading or 0.0,
        fps=payload.fps or 30.0,
        timestamp=payload.timestamp
    )
    return {"status": "ok", "busId": payload.busId, "deviceId": device_id}

@telemetry_router.post("/detections")
async def ingest_edge_detection(payload: EdgeDetectionRequest):
    """
    Ingest real-time on-device AI detection results (bounding boxes, class label, confidence).
    """
    await edge_hub.record_detection({
        "busId": payload.busId,
        "deviceId": payload.deviceId,
        "detectionType": payload.detectionType,
        "confidence": payload.confidence,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "timestamp": payload.timestamp,
        "severity": payload.severity or "High",
        "bbox": payload.bbox,
        "licensePlate": payload.licensePlate,
        "speedEstimate": payload.speedEstimate,
        "description": payload.description
    })
    return {"status": "ok", "message": "Detection recorded and broadcasted"}
