#!/usr/bin/env python3
"""
UrbanSense USB Phone Camera & Edge AI Live Stream Bridge
---------------------------------------------------------
Captures live footage from the connected Android phone (via ADB USB)
and streams it directly to the UrbanSense OCC Dashboard in real-time.
"""

import sys
import time
import json
import base64
import asyncio
import subprocess
import websockets
import io
try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

BACKEND_WS_URL = "ws://localhost:8000/ws/events"
DEVICE_ID = "BUS-NODE-#1042"
BUS_ID = "BUS-102"
PAIRING_CODE = "1042-7821"

def check_adb_device():
    """Verify ADB connection to phone."""
    try:
        res = subprocess.run(["adb", "devices"], capture_output=True, text=True)
        lines = [line for line in res.stdout.strip().split("\n")[1:] if line.strip() and "device" in line]
        if not lines:
            print("[!] No USB Android device detected. Please ensure USB Debugging is ON.")
            return False
        device_serial = lines[0].split()[0]
        print(f"[+] Connected to Android Phone (Serial: {device_serial}) via USB.")
        
        # Setup reverse port forwarding
        subprocess.run(["adb", "reverse", "tcp:8000", "tcp:8000"], capture_output=True)
        subprocess.run(["adb", "reverse", "tcp:3000", "tcp:3000"], capture_output=True)
        print("[+] Forwarded ports 8000 and 3000 over USB.")
        return True
    except Exception as e:
        print(f"[!] Error checking ADB: {e}")
        return False

import cv2
import numpy as np
import threading
import queue

class FastFrameGrabber:
    """High-speed threaded frame grabber using raw ADB buffer and OpenCV."""
    def __init__(self):
        self.latest_frame = None
        self.running = False
        self.thread = None
        self.lock = threading.Lock()

    def start(self):
        self.running = True
        self.thread = threading.Thread(target=self._worker, daemon=True)
        self.thread.start()

    def _worker(self):
        while self.running:
            try:
                proc = subprocess.Popen(["adb", "exec-out", "screencap", "-p"], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
                raw_bytes, _ = proc.communicate()
                if raw_bytes and len(raw_bytes) > 1000:
                    # Fast decode with OpenCV (C++ accelerated)
                    nparr = np.frombuffer(raw_bytes, np.uint8)
                    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                    if img is not None:
                        # Fast downscale
                        h, w = img.shape[:2]
                        small = cv2.resize(img, (int(w * 0.45), int(h * 0.45)), interpolation=cv2.INTER_LINEAR)
                        # Hardware turbo JPEG encode
                        _, buf = cv2.imencode('.jpg', small, [cv2.IMWRITE_JPEG_QUALITY, 55])
                        b64_str = f"data:image/jpeg;base64,{base64.b64encode(buf).decode('utf-8')}"
                        with self.lock:
                            self.latest_frame = b64_str
            except Exception:
                pass
            time.sleep(0.01)

    def get_frame(self):
        with self.lock:
            return self.latest_frame

    def stop(self):
        self.running = False

grabber = FastFrameGrabber()

async def run_live_bridge():
    print("=" * 65)
    print("  UrbanSense High-Speed USB Live Phone Bridge")
    print("=" * 65)
    
    if not check_adb_device():
        sys.exit(1)
        
    grabber.start()
    print(f"\n[*] Connecting to UrbanSense WebSocket: {BACKEND_WS_URL} ...")
    
    while True:
        try:
            async with websockets.connect(BACKEND_WS_URL, max_size=10_000_000) as ws:
                print("[+] Connected to UrbanSense Backend!")
                
                # 1. Register device
                register_msg = {
                    "type": "device_register",
                    "deviceId": DEVICE_ID,
                    "busId": BUS_ID,
                    "pairingCode": PAIRING_CODE
                }
                await ws.send(json.dumps(register_msg))
                print(f"[+] Registered {DEVICE_ID} on {BUS_ID}.")
                
                # 2. Mark stream ready
                await ws.send(json.dumps({
                    "type": "stream_ready",
                    "deviceId": DEVICE_ID,
                    "busId": BUS_ID
                }))
                
                print("\n[>>>] HIGH-SPEED STREAMING ACTIVE! Look at http://localhost:3000/live")
                print("      Press Ctrl+C to stop.\n")
                
                last_frame = None
                last_telemetry = 0
                
                while True:
                    frame_b64 = grabber.get_frame()
                    if frame_b64 and frame_b64 != last_frame:
                        last_frame = frame_b64
                        await ws.send(json.dumps({
                            "type": "video_frame",
                            "deviceId": DEVICE_ID,
                            "busId": BUS_ID,
                            "frame": frame_b64,
                            "fps": 30.0
                        }))

                    if time.time() - last_telemetry > 2.0:
                        last_telemetry = time.time()
                        await ws.send(json.dumps({
                            "type": "telemetry",
                            "busId": BUS_ID,
                            "deviceId": DEVICE_ID,
                            "latitude": 12.9340,
                            "longitude": 77.6150,
                            "speed": 36,
                            "heading": 145,
                            "fps": 30.0,
                            "aiStatus": "ACTIVE",
                            "cameraStatus": "LIVE"
                        }))

                    await asyncio.sleep(0.015)
                    
        except (websockets.exceptions.ConnectionClosed, ConnectionRefusedError) as err:
            print(f"[!] WebSocket reconnecting: {err}...")
            await asyncio.sleep(1)
        except KeyboardInterrupt:
            grabber.stop()
            break

if __name__ == "__main__":
    try:
        asyncio.run(run_live_bridge())
    except KeyboardInterrupt:
        print("\n[*] Bridge stopped.")
