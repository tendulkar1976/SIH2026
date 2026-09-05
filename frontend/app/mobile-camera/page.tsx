'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Camera,
  Layers,
  Radio,
  Wifi,
  Cpu,
  MapPin,
  RefreshCw,
  Video,
  Play,
  Square,
  Sparkles,
} from 'lucide-react';

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export default function MobileCameraPage() {
  const searchParams = useSearchParams();
  const pairParam = searchParams.get('pair') || '1042-7821';

  const [deviceId, setDeviceId] = useState('BUS-NODE-#1042');
  const [pairingCode, setPairingCode] = useState(pairParam);
  const [busId, setBusId] = useState('BUS-102');

  const [cameraReady, setCameraReady] = useState(false);
  const [aiConnected, setAiConnected] = useState(true);
  const [dashboardConnected, setDashboardConnected] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [aiOverlayOn, setAiOverlayOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const [detectionsCount, setDetectionsCount] = useState(45);
  const [currentFrameDetections, setCurrentFrameDetections] = useState<
    Array<{
      id: string;
      label: string;
      confidence: number;
      bbox: [number, number, number, number];
    }>
  >([
    {
      id: 'd1',
      label: 'Person',
      confidence: 0.82,
      bbox: [7, 8, 60, 36],
    },
    {
      id: 'd2',
      label: 'Person',
      confidence: 0.78,
      bbox: [67, 36, 31, 48],
    },
  ]);

  const [fps, setFps] = useState(29.8);
  const [latencyMs, setLatencyMs] = useState(45);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number }>({
    lat: 12.9352,
    lng: 77.6245,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/events';

  // 1. Initialize Camera
  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!mounted) return;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraReady(true);
        console.log('[MobileCamera] Camera started successfully');
      } catch (err) {
        console.warn('[MobileCamera] Could not access physical camera:', err);
        setCameraReady(true); // Allow running in preview mode
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 2. Connect WebSocket & Register Device
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsBaseUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setDashboardConnected(true);
        console.log('[MobileCamera] Connected to UrbanSense Backend WebSocket');

        // Pair device with backend
        try {
          await fetch(`${apiBaseUrl}/api/devices/pair`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              deviceId,
              pairingCode,
              busId,
              deviceType: 'Android Bus Sensing SmartCam',
              appVersion: '1.0',
            }),
          });
        } catch (err) {
          console.warn('[MobileCamera] Pairing call error:', err);
        }

        // Start WebRTC Negotiation as Sender
        initWebRTCBroadcaster();
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'webrtc_answer' && msg.deviceId === deviceId && peerConnectionRef.current) {
            console.log('[MobileCamera] Received WebRTC answer from dashboard receiver');
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription({ type: 'answer', sdp: msg.sdp })
            );
            setIsLiveStreaming(true);
          }
          if (msg.type === 'webrtc_ice' && msg.deviceId === deviceId && msg.role === 'receiver' && peerConnectionRef.current) {
            if (peerConnectionRef.current.remoteDescription) {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
            }
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        setDashboardConnected(false);
      };
    } catch (err) {
      console.warn('WebSocket connection error:', err);
    }

    return () => {
      if (ws) ws.close();
      if (peerConnectionRef.current) peerConnectionRef.current.close();
    };
  }, [deviceId, pairingCode, busId, apiBaseUrl, wsBaseUrl]);

  // 3. WebRTC Broadcaster Initialization
  const initWebRTCBroadcaster = async () => {
    try {
      const pc = new RTCPeerConnection(RTC_CONFIG);
      peerConnectionRef.current = pc;

      // Add local tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, streamRef.current!);
        });
      }

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          try {
            await fetch(`${apiBaseUrl}/api/webrtc/ice`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                deviceId,
                candidate: event.candidate.toJSON(),
                role: 'sender',
              }),
            });
          } catch (err) {
            console.warn('Error sending sender ICE:', err);
          }
        }
      };

      // Create Offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send Offer to backend
      await fetch(`${apiBaseUrl}/api/webrtc/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          sdp: offer.sdp,
          role: 'sender',
          type: 'offer',
        }),
      });

      console.log('[MobileCamera] WebRTC Offer created & sent to signaling backend');
    } catch (err) {
      console.error('[MobileCamera] WebRTC sender init error:', err);
    }
  };

  // 4. GPS & Telemetry Periodic Broadcaster
  useEffect(() => {
    // Real geolocation if available
    let watchId: number | null = null;
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const spd = pos.coords.speed ? pos.coords.speed * 3.6 : 34;
          setCurrentLocation({ lat, lng });

          // Transmit telemetry
          fetch(`${apiBaseUrl}/api/telemetry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              busId,
              deviceId,
              latitude: lat,
              longitude: lng,
              speed: spd,
              fps,
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {});
        },
        (err) => console.warn('Geolocation fallback used:', err),
        { enableHighAccuracy: true }
      );
    }

    // Interval telemetry heartbeat
    const interval = setInterval(() => {
      const latDrift = (Math.random() - 0.5) * 0.0002;
      const lngDrift = (Math.random() - 0.5) * 0.0002;
      const newLat = currentLocation.lat + latDrift;
      const newLng = currentLocation.lng + lngDrift;
      const speed = Math.floor(28 + Math.random() * 12);
      const reportedFps = parseFloat((29 + Math.random() * 2).toFixed(1));
      setFps(reportedFps);

      fetch(`${apiBaseUrl}/api/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId,
          deviceId,
          latitude: newLat,
          longitude: newLng,
          speed,
          fps: reportedFps,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }, 2000);

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      clearInterval(interval);
    };
  }, [apiBaseUrl, busId, deviceId, currentLocation, fps]);

  // Trigger sample AI detection from phone
  const triggerManualDetection = async (type: string, conf: number) => {
    const newCount = detectionsCount + 1;
    setDetectionsCount(newCount);

    try {
      await fetch(`${apiBaseUrl}/api/detections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId,
          deviceId,
          detectionType: type,
          confidence: conf,
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          timestamp: new Date().toISOString(),
          severity: type === 'Wrong Way' || type === 'Hit and Run' ? 'Critical' : 'High',
          bbox: [18, 24, 38, 32],
        }),
      });
    } catch (err) {
      console.warn('Error broadcasting detection:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans select-none overflow-hidden relative">
      {/* Top Phone Status Bar */}
      <div className="px-4 pt-2 pb-1 flex items-center justify-between text-[11px] text-slate-300 font-mono z-30">
        <span className="font-bold">12:44</span>
        <div className="flex items-center gap-3">
          <span>0.02 KB/S</span>
          <span className="text-emerald-400">VoLTE</span>
          <span className="text-emerald-400">⚡ 69%</span>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
        {/* Live Camera View / Fallback Feed */}
        <div className="absolute inset-0 z-0 bg-slate-900 flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* AI Bounding Boxes Overlay on Phone View */}
          {aiOverlayOn && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {currentFrameDetections.map((det) => (
                <div
                  key={det.id}
                  style={{
                    left: `${det.bbox[0]}%`,
                    top: `${det.bbox[1]}%`,
                    width: `${det.bbox[2]}%`,
                    height: `${det.bbox[3]}%`,
                  }}
                  className="absolute border-2 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-mono text-[10px] font-bold">
                    {det.label} {(det.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Header Card (Exact APK Layout) */}
        <div className="p-3 z-20 space-y-2">
          {/* Main Title Row */}
          <div className="bg-slate-900/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-700/80 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span className="font-mono font-extrabold text-sm tracking-wide text-white">
                {deviceId}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-rose-500/80 bg-rose-950/40 text-rose-400 font-mono text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          {/* Substatus Row & Detection Badge */}
          <div className="flex items-stretch gap-2">
            {/* Status indicators */}
            <div className="flex-1 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 flex flex-col justify-center gap-1 text-[11px] font-mono shadow-lg">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cameraReady ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-500'}`} />
                <span className="text-slate-400">Camera:</span>
                <strong className="text-white">{cameraReady ? 'Ready' : 'Initializing'}</strong>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${aiConnected ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-500'}`} />
                <span className="text-slate-400">AI:</span>
                <strong className="text-white">{aiConnected ? 'Connected' : 'Offline'}</strong>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dashboardConnected ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-amber-400 animate-pulse'}`} />
                <span className="text-slate-400">Dashboard:</span>
                <strong className="text-white">
                  {dashboardConnected ? 'Connected' : 'Pairing...'}
                </strong>
              </div>
            </div>

            {/* Total Detections Box */}
            <div className="w-32 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-cyan-500/40 flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">
                AI DETECTIONS
              </span>
              <span className="font-mono text-2xl font-extrabold text-cyan-400 mt-0.5 shadow-cyan-400">
                {detectionsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Testing Bar (Inject Pothole / Wrong Way Detection Event) */}
        <div className="p-3 z-20 flex items-center justify-center gap-2">
          <button
            onClick={() => triggerManualDetection('Pothole', 0.94)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/90 text-slate-950 font-mono text-[11px] font-bold shadow-md hover:bg-amber-400 transition"
          >
            + Send Pothole (94%)
          </button>
          <button
            onClick={() => triggerManualDetection('Zebra Crossing', 0.89)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/90 text-slate-950 font-mono text-[11px] font-bold shadow-md hover:bg-cyan-400 transition"
          >
            + Send Crossing
          </button>
        </div>

        {/* Bottom Metrics & Control Bar (Exact APK Layout) */}
        <div className="p-4 z-20 space-y-3 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-6">
          {/* Metrics String */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 px-1">
            <span>
              AI: <strong>RUNNING</strong> FPS: {fps.toFixed(1)} Latency: {latencyMs}ms
            </span>
            <span>
              Detections: <strong>{currentFrameDetections.length}</strong>
            </span>
          </div>

          {/* Action Buttons: [ AI OVERLAY: ON ] [ RECORD ] [ STOP ] */}
          <div className="grid grid-cols-12 gap-2">
            <button
              onClick={() => setAiOverlayOn(!aiOverlayOn)}
              className={`col-span-5 py-3 rounded-xl border font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                aiOverlayOn
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                  : 'border-slate-700 bg-slate-900 text-slate-400'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>AI OVERLAY: {aiOverlayOn ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`col-span-5 py-3 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span>{isRecording ? 'RECORDING' : 'RECORD'}</span>
            </button>

            <button
              onClick={() => {
                if (streamRef.current) {
                  streamRef.current.getTracks().forEach((t) => t.stop());
                }
                setIsLiveStreaming(false);
              }}
              className="col-span-2 py-3 rounded-xl bg-amber-900/60 border border-amber-700/60 text-amber-200 font-mono text-xs font-bold flex flex-col items-center justify-center tracking-widest text-[10px]"
            >
              <span>STOP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
