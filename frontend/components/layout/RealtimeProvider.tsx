'use client';

import React, { useEffect } from 'react';
import { realtimeService } from '@/services/realtime';
import { useUrbanStore } from '@/store/useUrbanStore';

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Fetch initial database records from FastAPI backend
    useUrbanStore.getState().fetchInitialData();

    // Connect to WebSocket / realtime listener
    realtimeService.connect();

    return () => {
      realtimeService.disconnect();
    };
  }, []);

  return <>{children}</>;
};
