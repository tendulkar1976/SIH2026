'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUrbanStore } from '@/store/useUrbanStore';
import { QRCodeSVG } from 'qrcode.react';
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
  Wifi,
  Sparkles,
  RefreshCw,
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

  const [activeTab, setActiveTab] = useState<'qr' | 'pair'>('qr');
  const [copied, setCopied] = useState(false);
  const [serverHost, setServerHost] = useState('10.5.134.43');
  const [serverPort, setServerPort] = useState('3000');
  const [isAutoRedirecting, setIsAutoRedirecting] = useState(false);

  // Auto-detect browser host
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = window.location.port || '3000';
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        setServerHost(hostname);
      } else {
        setServerHost('10.5.134.43');
      }
      setServerPort(port);
    }
  }, []);

  const qrUrl = `http://${serverHost}:${serverPort}/mobile-camera?pair=${pairingCode}`;

  // Auto-redirect to Live Monitor as soon as mobile phone connects
  useEffect(() => {
    if (isRealPhoneConnected || edgeStatus === 'LIVE' || edgeStatus === 'STREAM_READY') {
      setIsAutoRedirecting(true);
      const timer = setTimeout(() => {
        setSelectedBusId(busId);
        onClose();
        router.push('/live');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isRealPhoneConnected, edgeStatus, busId, onClose, router, setSelectedBusId]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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

  const handleSimulateInstantConnect = () => {
    setEdgeStatus('STREAM_READY');
    setRealPhoneConnected(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pewter-blue/20 border border-pewter-blue/40 flex items-center justify-center text-pewter-blue">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight font-mono">
                  Connect Mobile Camera
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  BUS-NODE-#1042
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
        <div className="p-6 space-y-5 overflow-y-auto max-h-[78vh]">
          {/* Real-time Status Alert Banner */}
          {isRealPhoneConnected || isAutoRedirecting ? (
            <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-extrabold text-emerald-900">
                  ● MOBILE PHONE CONNECTED & STREAMING!
                </h4>
                <p className="text-[11px] text-emerald-700">
                  Switching to OCC Live Monitor feed automatically...
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                <span className="text-xs font-mono text-blue-900 font-bold">
                  Scan QR with your phone camera to stream live
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                Wi-Fi Link
              </span>
            </div>
          )}

          {/* QR Code Canvas Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200/90 text-center space-y-4">
            <div className="w-56 h-56 mx-auto bg-white p-3 rounded-2xl border-2 border-slate-300 shadow-md flex items-center justify-center relative group">
              <QRCodeSVG
                value={qrUrl}
                size={200}
                level="M"
                includeMargin={false}
                className="w-full h-full"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-mono font-bold text-slate-800">
                Target Node URL:
              </p>
              <div className="flex items-center justify-center gap-2 max-w-sm mx-auto">
                <code className="text-[11px] font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 truncate max-w-xs">
                  {qrUrl}
                </code>
                <button
                  onClick={handleCopyUrl}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition shadow-sm"
                  title="Copy URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Network IP Host Settings (Expandable / Editable) */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
              <span>Your Wi-Fi IP:</span>
              <input
                type="text"
                value={serverHost}
                onChange={(e) => setServerHost(e.target.value)}
                placeholder="10.5.134.43"
                className="w-28 px-2 py-0.5 bg-white border border-slate-300 rounded text-center text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <span>Port:</span>
              <input
                type="text"
                value={serverPort}
                onChange={(e) => setServerPort(e.target.value)}
                placeholder="3000"
                className="w-14 px-2 py-0.5 bg-white border border-slate-300 rounded text-center text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Device Pairing Info */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                EDGE NODE ID
              </span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {edgeDeviceId}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                PAIRING CODE
              </span>
              <span className="font-extrabold text-blue-600 mt-0.5 block tracking-widest text-sm">
                {pairingCode}
              </span>
            </div>
          </div>

          {/* Quick Direct Link button for testing on same device */}
          <div className="text-center">
            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-pewter-blue hover:text-blue-700 font-mono font-bold hover:underline"
            >
              <span>Or click here to open mobile camera broadcaster in new tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleLaunchDemoMode}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200/70 font-mono text-xs font-semibold transition"
          >
            Launch Demo Device Mode
          </button>

          <button
            onClick={handleStartLiveMonitor}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{isRealPhoneConnected ? 'OPEN LIVE MONITOR' : 'START LIVE MONITOR'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
