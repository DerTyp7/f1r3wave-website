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