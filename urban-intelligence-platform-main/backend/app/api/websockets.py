from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import logging
from app.services.websocket_manager import manager
from app.services.edge_hub import edge_hub

logger = logging.getLogger(__name__)

router = APIRouter(tags=["WebSockets"])

@router.websocket("/ws/events")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data_text = await websocket.receive_text()
            try:
                msg = json.loads(data_text)
                msg_type = msg.get("type")
                if msg_type == "ping":
                    await websocket.send_json({"type": "pong"})
                elif msg_type == "device_register":
                    await edge_hub.pair_device(
                        device_id=msg.get("deviceId", "BUS-NODE-#1042"),
                        pairing_code=msg.get("pairingCode", "1042-7821"),
                        bus_id=msg.get("busId", "BUS-102"),
                        is_real_phone=True
                    )
                elif msg_type == "device_connected":
                    dev = edge_hub.get_device(msg.get("deviceId", "BUS-NODE-#1042"))
                    dev["status"] = "CONNECTED"
                    dev["isRealPhone"] = True
                    await manager.broadcast({
                        "type": "device_connected",
                        "deviceId": msg.get("deviceId", "BUS-NODE-#1042"),
                        "busId": msg.get("busId", "BUS-102")
                    })
                elif msg_type == "device_disconnected":
                    dev = edge_hub.get_device(msg.get("deviceId", "BUS-NODE-#1042"))
                    dev["status"] = "DISCONNECTED"
                    dev["cameraStatus"] = "OFFLINE"
                    dev["isRealPhone"] = False
                    await manager.broadcast({
                        "type": "device_disconnected",
                        "deviceId": msg.get("deviceId", "BUS-NODE-#1042"),
                        "busId": msg.get("busId", "BUS-102")
                    })
                elif msg_type == "stream_ready":
                    dev = edge_hub.get_device(msg.get("deviceId", "BUS-NODE-#1042"))
                    dev["streamStatus"] = "READY"
                    dev["cameraStatus"] = "LIVE"
                    await manager.broadcast({
                        "type": "stream_ready",
                        "deviceId": msg.get("deviceId", "BUS-NODE-#1042"),
                        "busId": msg.get("busId", "BUS-102")
                    })
                elif msg_type == "stream_stopped":
                    dev = edge_hub.get_device(msg.get("deviceId", "BUS-NODE-#1042"))
                    dev["streamStatus"] = "NOT_READY"
                    await manager.broadcast({
                        "type": "stream_stopped",
                        "deviceId": msg.get("deviceId", "BUS-NODE-#1042"),
                        "busId": msg.get("busId", "BUS-102")
                    })
                elif msg_type == "telemetry":
                    await edge_hub.update_telemetry(
                        bus_id=msg.get("busId", "BUS-102"),
                        device_id=msg.get("deviceId", "BUS-NODE-#1042"),
                        latitude=float(msg.get("latitude", 12.9352)),
                        longitude=float(msg.get("longitude", 77.6245)),
                        speed=float(msg.get("speed", 0.0)),
                        heading=float(msg.get("heading", 0.0)),
                        fps=float(msg.get("fps", 30.0)),
                        timestamp=msg.get("timestamp")
                    )
                elif msg_type == "video_frame":
                    await edge_hub.broadcast_video_frame(
                        device_id=msg.get("deviceId", "BUS-NODE-#1042"),
                        frame_base64=msg.get("frame", ""),
                        fps=float(msg.get("fps", 30.0))
                    )
                elif msg_type == "detection":
                    await edge_hub.record_detection(msg)
                elif msg_type == "webrtc_offer":
                    await edge_hub.set_webrtc_offer(msg.get("deviceId", "BUS-NODE-#1042"), msg.get("sdp", ""))
                elif msg_type == "webrtc_answer":
                    await edge_hub.set_webrtc_answer(msg.get("deviceId", "BUS-NODE-#1042"), msg.get("sdp", ""))
                elif msg_type in ["webrtc_ice", "webrtc_ice_candidate"]:
                    candidate = msg.get("candidate") or msg.get("iceCandidate") or {}
                    await edge_hub.add_ice_candidate(msg.get("deviceId", "BUS-NODE-#1042"), candidate, msg.get("role", "sender"))
            except Exception as parse_err:
                # Text ping or non-JSON message
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
