
import { createContext, useContext } from 'react';

export const ConfigContext = createContext<ConfigContextType | null>(null);

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === null) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export interface HomeConfig {
  headline: string;
  text: string;
  buttonText: string;
}

export interface ContactLink {
  url: string;
  hoverColor: string;
  image: {
    src: string;
    alt: string;
  };
}

export interface ContactConfig {
  headline: string;
  links: ContactLink[];
  imprint: {
    enable: boolean;
    headline: string;
    name: string;
    address: string;
    country: string;
    email: string;
  }
}

export interface AppConfig {
  home: HomeConfig;
  contact: ContactConfig;
}

export interface ConfigContextType {
  config: AppConfig | null;
}