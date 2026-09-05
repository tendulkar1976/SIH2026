from fastapi import APIRouter, HTTPException, status
from app.schemas.edge_devices import (
    WebRTCOfferRequest, WebRTCAnswerRequest, WebRTCICECandidate
)
from app.services.edge_hub import edge_hub

router = APIRouter(prefix="/api/webrtc", tags=["WebRTC Signaling"])

@router.post("/offer")
async def post_webrtc_offer(payload: WebRTCOfferRequest):
    """
    Store and broadcast WebRTC SDP Offer from phone camera broadcaster.
    """
    await edge_hub.set_webrtc_offer(
        device_id=payload.deviceId,
        sdp=payload.sdp
    )
    return {"status": "ok", "deviceId": payload.deviceId, "type": "offer"}

@router.post("/answer")
async def post_webrtc_answer(payload: WebRTCAnswerRequest):
    """
    Store and broadcast WebRTC SDP Answer from dashboard receiver.
    """
    await edge_hub.set_webrtc_answer(
        device_id=payload.deviceId,
        sdp=payload.sdp
    )
    return {"status": "ok", "deviceId": payload.deviceId, "type": "answer"}

@router.post("/ice")
async def post_webrtc_ice(payload: WebRTCICECandidate):
    """
    Exchange ICE candidate information between phone and dashboard.
    """
    await edge_hub.add_ice_candidate(
        device_id=payload.deviceId,
        candidate=payload.candidate,
        role=payload.role or "sender"
    )
    return {"status": "ok", "deviceId": payload.deviceId}

@router.get("/session")
async def get_webrtc_session_query(deviceId: str = "BUS-NODE-#1042"):
    dev = edge_hub.get_device(deviceId or "BUS-NODE-#1042")
    return {
        "deviceId": deviceId,
        "offer": dev.get("webrtcOffer"),
        "answer": dev.get("webrtcAnswer"),
        "iceCandidatesSender": dev.get("iceCandidatesSender", []),
        "iceCandidatesReceiver": dev.get("iceCandidatesReceiver", []),
        "status": dev.get("streamStatus", "NOT_READY")
    }

@router.get("/session/{device_id:path}")
async def get_webrtc_session(device_id: str):
    """
    Retrieve active WebRTC session info (SDP offer/answer and ICE candidates).
    """
    dev = edge_hub.get_device(device_id)
    return {
        "deviceId": device_id,
        "offer": dev.get("webrtcOffer"),
        "answer": dev.get("webrtcAnswer"),
        "iceCandidatesSender": dev.get("iceCandidatesSender", []),
        "iceCandidatesReceiver": dev.get("iceCandidatesReceiver", []),
        "status": dev.get("streamStatus", "NOT_READY")
    }

@router.delete("/session/{device_id}")
async def reset_webrtc_session(device_id: str):
    """
    Reset WebRTC signaling session for a device node.
    """
    dev = edge_hub.get_device(device_id)
    dev["webrtcOffer"] = None
    dev["webrtcAnswer"] = None
    dev["iceCandidatesSender"] = []
    dev["iceCandidatesReceiver"] = []
    dev["streamStatus"] = "NOT_READY"
    return {"status": "reset", "deviceId": device_id}
