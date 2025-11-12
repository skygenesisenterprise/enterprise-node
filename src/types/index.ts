export interface EnterpriseConfig {
  modules: {
    ai?: boolean;
    storage?: boolean;
    ui?: boolean;
    project?: boolean;
    auth?: boolean;
  };
  runtime?: {
    wasmPath?: string;
    enableWasm?: boolean;
  };
  framework?: 'react' | 'svelte' | 'nextjs' | 'auto';
  debug?: boolean;
}

export interface ModuleInterface {
  name: string;
  version: string;
  init(): Promise<void>;
  destroy(): Promise<void>;
}

export interface RuntimeCore {
  initialize(): Promise<void>;
  call(method: string, ...args: any[]): Promise<any>;
  destroy(): void;
}

export type FrameworkType = 'react' | 'svelte' | 'nextjs' | 'vanilla';