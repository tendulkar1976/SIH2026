/**
 * WebRTC Service for UrbanSense Edge Vision Streaming
 * Handles PeerConnection, SDP Offer/Answer negotiation, ICE Candidates,
 * and remote MediaStream delivery for BUS-NODE-#1042.
 */

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

type StreamCallback = (stream: MediaStream) => void;
type ConnectionStateCallback = (state: RTCPeerConnectionState) => void;

class WebRTCReceiver {
  private peerConnection: RTCPeerConnection | null = null;
  private onStreamCallbacks: Set<StreamCallback> = new Set();
  private onStateCallbacks: Set<ConnectionStateCallback> = new Set();
  private remoteStream: MediaStream | null = null;
  private deviceId: string = 'BUS-NODE-#1042';
  private apiBaseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  public init(deviceId: string = 'BUS-NODE-#1042') {
    this.deviceId = deviceId;
    this.close();

    if (typeof window === 'undefined') return;

    this.peerConnection = new RTCPeerConnection(RTC_CONFIG);

    this.remoteStream = new MediaStream();

    this.peerConnection.ontrack = (event) => {
      console.log('[WebRTC Receiver] Received remote track:', event.track.kind);
      if (this.remoteStream) {
        this.remoteStream.addTrack(event.track);
        this.notifyStream(this.remoteStream);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection) {
        console.log('[WebRTC Receiver] Connection state:', this.peerConnection.connectionState);
        this.notifyState(this.peerConnection.connectionState);
      }
    };

    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        try {
          await fetch(`${this.apiBaseUrl}/api/webrtc/ice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              deviceId: this.deviceId,
              candidate: event.candidate.toJSON(),
              role: 'receiver',
            }),
          });
        } catch (err) {
          console.warn('[WebRTC Receiver] Failed to send ICE candidate:', err);
        }
      }
    };
  }

  public async handleRemoteOffer(offerSdp: string): Promise<string | null> {
    if (!this.peerConnection) {
      this.init(this.deviceId);
    }

    if (!this.peerConnection) return null;

    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: 'offer', sdp: offerSdp })
      );

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      // Send answer to backend signaling
      await fetch(`${this.apiBaseUrl}/api/webrtc/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: this.deviceId,
          role: 'receiver',
          sdp: answer.sdp,
          type: 'answer',
        }),
      });

      return answer.sdp || null;
    } catch (err) {
      console.error('[WebRTC Receiver] Error handling remote offer:', err);
      return null;
    }
  }

  public async addIceCandidate(candidateInit: RTCIceCandidateInit) {
    if (this.peerConnection && this.peerConnection.remoteDescription) {
      try {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidateInit));
      } catch (err) {
        console.warn('[WebRTC Receiver] Error adding ICE candidate:', err);
      }
    }
  }

  public onStream(callback: StreamCallback): () => void {
    this.onStreamCallbacks.add(callback);
    if (this.remoteStream && this.remoteStream.getTracks().length > 0) {
      callback(this.remoteStream);
    }
    return () => this.onStreamCallbacks.delete(callback);
  }

  public onConnectionState(callback: ConnectionStateCallback): () => void {
    this.onStateCallbacks.add(callback);
    return () => this.onStateCallbacks.delete(callback);
  }

  private notifyStream(stream: MediaStream) {
    this.onStreamCallbacks.forEach((cb) => {
      try {
        cb(stream);
      } catch (err) {
        console.error('Error in onStream callback:', err);
      }
    });
  }

  private notifyState(state: RTCPeerConnectionState) {
    this.onStateCallbacks.forEach((cb) => {
      try {
        cb(state);
      } catch (err) {
        console.error('Error in onConnectionState callback:', err);
      }
    });
  }

  public getStream(): MediaStream | null {
    return this.remoteStream;
  }

  public close() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.remoteStream = null;
  }
}

export const webrtcReceiver = new WebRTCReceiver();
