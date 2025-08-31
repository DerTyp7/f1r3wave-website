"use client";

import { ConfigContextType } from '@/interfaces/config';
import { createContext, useContext } from 'react';

export const ConfigContext = createContext<ConfigContextType | null>(null);

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === null) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
