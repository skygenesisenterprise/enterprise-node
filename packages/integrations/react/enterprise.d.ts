declare module '@skygenesisenterprise/enterprise' {
  export class EnterpriseSDK {
    constructor(userConfig?: any);
    initialize(): Promise<void>;
    get ai(): any;
    get storage(): any;
    get ui(): any;
    get project(): any;
    get auth(): any;
    get runtime(): any;
    get framework(): any;
    getConfig(): any;
    updateConfig(updates: any): void;
    getDiagnostics(): any;
    exportDiagnosticReport(): string;
    reloadModule(name: string): Promise<void>;
    destroy(): Promise<void>;
    static create(userConfig?: any): Promise<EnterpriseSDK>;
    static getInstance(): EnterpriseSDK;
  }

  export const Enterprise: EnterpriseSDK;

  export interface EnterpriseConfig {
    modules: {
      ai: boolean;
      storage: boolean;
      ui: boolean;
      project: boolean;
      auth: boolean;
    };
    runtime: {
      wasmPath: string;
      enableWasm: boolean;
      maxMemoryMB: number;
    };
    framework: string;
    debug: boolean;
    telemetry: {
      enabled: boolean;
      endpoint: string;
    };
    performance: {
      enableProfiling: boolean;
      enableMetrics: boolean;
    };
  }
}
