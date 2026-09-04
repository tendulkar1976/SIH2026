'use client';

import React, { useEffect } from 'react';
import { realtimeService } from '@/services/realtime';

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Connect to WebSocket / realtime listener
    realtimeService.connect();

    return () => {
      realtimeService.disconnect();
    };
  }, []);

  return <>{children}</>;
};
