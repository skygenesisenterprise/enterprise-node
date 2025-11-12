// Déclarations de types pour l'environnement Enterprise SDK

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test';
      ENTERPRISE_SDK_DEBUG?: string;
      ENTERPRISE_SDK_LOG_LEVEL?: 'error' | 'warn' | 'info' | 'debug';
      ENTERPRISE_SDK_WASM_PATH?: string;
      ENTERPRISE_SDK_CACHE_DIR?: string;
      ENTERPRISE_SDK_CONFIG_PATH?: string;
      ENTERPRISE_SDK_API_KEY?: string;
      ENTERPRISE_SDK_ENDPOINT?: string;
      ENTERPRISE_SDK_TIMEOUT?: string;
      ENTERPRISE_SDK_MAX_RETRIES?: string;
      ENTERPRISE_SDK_ENABLE_METRICS?: string;
      ENTERPRISE_SDK_ENABLE_TRACING?: string;
    }
  }

  interface Window {
    EnterpriseSDK?: any;
    __ENTERPRISE_SDK__?: any;
  }

  interface Global {
    EnterpriseSDK?: any;
    __ENTERPRISE_SDK__?: any;
  }
}

// Types pour les variables globales du SDK
declare const __DEV__: boolean;
declare const __PROD__: boolean;
declare const __TEST__: boolean;

declare module '*.env' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.config.js' {
  const content: any;
  export default content;
}

declare module '*.config.ts' {
  const content: any;
  export default content;
}

// Types pour les assets
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}

// Types pour les fichiers WASM
declare module '*.wasm' {
  const content: Promise<any>;
  export default content;
}

// Types pour les workers
declare module '*.worker.ts' {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}

// Types pour les styles
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.sass' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.less' {
  const content: Record<string, string>;
  export default content;
}

// Types pour les modules CSS
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

export {};
