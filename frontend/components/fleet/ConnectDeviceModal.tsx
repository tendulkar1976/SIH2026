'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUrbanStore } from '@/store/useUrbanStore';
import {
  Smartphone,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Radio,
  Camera,
  Cpu,
  Navigation,
  Tv,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface ConnectDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  busId?: string;
  routeId?: string;
}

export const ConnectDeviceModal: React.FC<ConnectDeviceModalProps> = ({
  isOpen,
  onClose,
  busId = 'BUS-102',
  routeId = 'R-12',
}) => {
  const router = useRouter();
  const {
    edgeDeviceId,
    pairingCode,
    edgeStatus,
    isRealPhoneConnected,
    setEdgeStatus,
    setRealPhoneConnected,
    setSelectedBusId,
  } = useUrbanStore();

  const [activeTab, setActiveTab] = useState<'pair' | 'qr'>('pair');
  const [isSimulatingPair, setIsSimulatingPair] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localChecklist, setLocalChecklist] = useState({
    deviceDetected: false,
    cameraReady: false,
    aiConnected: false,
    gpsActive: false,
    streamReady: false,
  });

  // Synchronize status with real phone connection or local state
  useEffect(() => {
    if (isRealPhoneConnected || edgeStatus === 'LIVE' || edgeStatus === 'STREAM_READY') {
      setLocalChecklist({
        deviceDetected: true,
        cameraReady: true,
        aiConnected: true,
        gpsActive: true,
        streamReady: true,
      });
    }
  }, [isRealPhoneConnected, edgeStatus]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConnectMobileCamera = async () => {
    setIsSimulatingPair(true);
    setEdgeStatus('CONNECTING');

    // Progressive verification of subsystems
    setTimeout(() => {
      setLocalChecklist((prev) => ({ ...prev, deviceDetected: true }));
      setEdgeStatus('DEVICE_CONNECTED');
    }, 600);

    setTimeout(() => {
      setLocalChecklist((prev) => ({ ...prev, cameraReady: true }));
    }, 1200);

    setTimeout(() => {
      setLocalChecklist((prev) => ({ ...prev, aiConnected: true }));
    }, 1800);

    setTimeout(() => {
      setLocalChecklist((prev) => ({ ...prev, gpsActive: true }));
    }, 2400);

    setTimeout(() => {
      setLocalChecklist((prev) => ({ ...prev, streamReady: true }));
      setEdgeStatus('STREAM_READY');
      setRealPhoneConnected(true);
      setIsSimulatingPair(false);
    }, 3000);
  };

  const handleStartLiveMonitor = () => {
    setSelectedBusId(busId);
    onClose();
    router.push('/live');
  };

  const handleLaunchDemoMode = () => {
    setSelectedBusId(busId);
    setRealPhoneConnected(false);
    setEdgeStatus('LIVE');
    onClose();
    router.push('/live');
  };

  const isReadyToStream =
    localChecklist.deviceDetected &&
    localChecklist.cameraReady &&
    localChecklist.aiConnected &&
    localChecklist.gpsActive &&
    localChecklist.streamReady;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pewter-blue/20 border border-pewter-blue/40 flex items-center justify-center text-pewter-blue">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight font-mono">
                  Connect Edge Vision Device
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  v1.0 APK
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {busId} • Route <strong className="text-white font-mono">{routeId}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Edge Node & Status Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">
                EDGE DEVICE NODE
              </span>
              <div className="font-mono text-base font-bold text-slate-900 mt-0.5">
                {edgeDeviceId}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider block">
                STATUS
              </span>
              {isReadyToStream ? (
                <div className="flex items-center gap-1.5 mt-0.5 font-mono text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>STREAM READY</span>
                </div>
              ) : isSimulatingPair ? (
                <div className="flex items-center gap-1.5 mt-0.5 font-mono text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                  <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                  <span>NEGOTIATING...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-0.5 font-mono text-xs font-bold text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full border border-rose-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>DISCONNECTED</span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Selector: [ CONNECT MOBILE CAMERA ] vs [ SCAN QR CODE ] */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('pair')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono transition flex items-center justify-center gap-2 ${
                activeTab === 'pair'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4 text-pewter-blue" />
              <span>CONNECT MOBILE CAMERA</span>
            </button>

            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono transition flex items-center justify-center gap-2 ${
                activeTab === 'qr'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-4 h-4 text-pewter-blue" />
              <span>SCAN QR CODE</span>
            </button>
          </div>

          {activeTab === 'pair' ? (
            /* Pairing Code Box */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-center space-y-2">
                <p className="text-xs text-blue-900 font-medium">
                  Open <strong>&quot;Bus Sensing SmartCam&quot;</strong> on the assigned Android phone.
                </p>

                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  PAIRING CODE
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="px-6 py-2 rounded-xl bg-white border-2 border-pewter-blue/60 text-2xl font-mono font-extrabold text-slate-900 tracking-widest shadow-sm">
                    {pairingCode}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition shadow-sm"
                    title="Copy Pairing Code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-xs font-mono text-slate-500 mt-1">
                  Connection:{' '}
                  <span className={isReadyToStream ? 'text-emerald-600 font-bold' : 'text-amber-600 animate-pulse'}>
                    {isReadyToStream ? 'BUS-NODE-#1042 Linked & Synchronized' : 'Waiting for mobile device...'}
                  </span>
                </div>
              </div>

              {/* Action Button: Connect / Trigger Handshake */}
              {!isReadyToStream && (
                <button
                  onClick={handleConnectMobileCamera}
                  disabled={isSimulatingPair}
                  className="w-full py-3 rounded-xl bg-pewter-blue hover:bg-pewter-blue/90 text-white font-mono font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSimulatingPair ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>CONNECTING TO BUS-NODE-#1042...</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4 animate-pulse" />
                      <span>CONNECT MOBILE CAMERA (VERIFY HANDSHAKE)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            /* QR Code Scanner Interface */
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                Scan this QR code using the <strong>Bus Sensing SmartCam</strong> app on your Android phone:
              </p>

              <div className="w-44 h-44 mx-auto bg-white p-3 rounded-xl border-2 border-slate-300 shadow-sm flex flex-col items-center justify-center relative">
                {/* Visual SVG QR Representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-900">
                  <rect x="0" y="0" width="30" height="30" rx="3" fill="#1e293b" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="9" y="9" width="12" height="12" fill="#1e293b" />

                  <rect x="70" y="0" width="30" height="30" rx="3" fill="#1e293b" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="79" y="9" width="12" height="12" fill="#1e293b" />

                  <rect x="0" y="70" width="30" height="30" rx="3" fill="#1e293b" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="9" y="79" width="12" height="12" fill="#1e293b" />

                  {/* QR Data Matrix dots */}
                  <rect x="36" y="10" width="6" height="6" />
                  <rect x="48" y="10" width="6" height="6" />
                  <rect x="36" y="22" width="6" height="6" />
                  <rect x="48" y="22" width="6" height="6" />
                  <rect x="58" y="22" width="6" height="6" />

                  <rect x="10" y="38" width="6" height="6" />
                  <rect x="22" y="38" width="6" height="6" />
                  <rect x="36" y="38" width="8" height="8" />
                  <rect x="50" y="38" width="6" height="6" />
                  <rect x="62" y="38" width="6" height="6" />
                  <rect x="74" y="38" width="6" height="6" />
                  <rect x="86" y="38" width="6" height="6" />

                  <rect x="38" y="52" width="8" height="8" />
                  <rect x="52" y="52" width="6" height="6" />
                  <rect x="66" y="52" width="8" height="8" />
                  <rect x="80" y="52" width="6" height="6" />

                  <rect x="38" y="68" width="6" height="6" />
                  <rect x="52" y="68" width="8" height="8" />
                  <rect x="68" y="68" width="6" height="6" />
                  <rect x="82" y="68" width="6" height="6" />

                  <rect x="38" y="82" width="8" height="8" />
                  <rect x="54" y="82" width="6" height="6" />
                  <rect x="70" y="82" width="8" height="8" />
                  <rect x="86" y="82" width="6" height="6" />
                </svg>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
                <span>Node: <strong>BUS-NODE-#1042</strong></span>
                <span>•</span>
                <span>Code: <strong>{pairingCode}</strong></span>
              </div>

              <a
                href={`/mobile-camera?pair=${pairingCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-pewter-blue hover:underline font-mono font-bold"
              >
                <span>Or open Mobile Broadcaster in browser</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Connection Checklist (Real Connection States) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider block mb-1">
              EDGE NODE SUBSYSTEM CHECKLIST
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                {localChecklist.deviceDetected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                )}
                <span className={localChecklist.deviceDetected ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                  ● DEVICE CONNECTED
                </span>
              </div>

              <div className="flex items-center gap-2">
                {localChecklist.cameraReady ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                )}
                <span className={localChecklist.cameraReady ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                  ● CAMERA READY
                </span>
              </div>

              <div className="flex items-center gap-2">
                {localChecklist.aiConnected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                )}
                <span className={localChecklist.aiConnected ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                  ● AI CONNECTED
                </span>
              </div>

              <div className="flex items-center gap-2">
                {localChecklist.gpsActive ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                )}
                <span className={localChecklist.gpsActive ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                  ● GPS ACTIVE
                </span>
              </div>

              <div className="col-span-2 flex items-center gap-2 pt-1 border-t border-slate-200">
                {localChecklist.streamReady ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                )}
                <span className={localChecklist.streamReady ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                  ● STREAM READY (WebRTC Live Stream)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleLaunchDemoMode}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200/70 font-mono text-xs font-semibold transition"
          >
            Launch in Demo Device Mode
          </button>

          <button
            onClick={handleStartLiveMonitor}
            disabled={!isReadyToStream}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>START LIVE MONITOR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
