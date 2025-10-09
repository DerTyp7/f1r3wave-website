'use client';

import { ConfigContext } from '@/contexts/configExports';
import { AppConfig, ConfigContextType } from '@/interfaces/config';
import React, { ReactNode, useEffect, useState } from 'react';

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AppConfig = await response.json();
        setConfig(data);
      } catch (e: unknown) {
        console.error('Failed to fetch config.json:', e);
      }
    };

    fetchConfig();
  }, []);

  const value: ConfigContextType = {
    config,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
