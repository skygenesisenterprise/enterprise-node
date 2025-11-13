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
        maxMemoryMB?: number;
    };
    framework?: 'react' | 'svelte' | 'nextjs' | 'vue' | 'auto';
    debug?: boolean;
    telemetry?: {
        enabled?: boolean;
        endpoint?: string;
    };
    performance?: {
        enableProfiling?: boolean;
        enableMetrics?: boolean;
    };
}
export interface ModuleInterface {
    name: string;
    version: string;
    dependencies?: string[];
    init(): Promise<void>;
    destroy(): Promise<void>;
    isInitialized(): boolean;
}
export interface RuntimeCore {
    initialize(): Promise<void>;
    call(method: string, ...args: any[]): Promise<any>;
    destroy(): void;
    getMemoryUsage(): MemoryUsage;
    getPerformanceMetrics(): PerformanceMetrics;
}
export interface MemoryUsage {
    used: number;
    total: number;
    wasmHeap?: number;
}
export interface PerformanceMetrics {
    initTime: number;
    callCount: number;
    averageCallTime: number;
    errorRate: number;
}
export type FrameworkType = 'react' | 'svelte' | 'nextjs' | 'vue' | 'vanilla';
export interface ModuleManifest {
    name: string;
    version: string;
    description: string;
    author: string;
    dependencies: string[];
    exports: Record<string, string>;
    runtime?: 'wasm' | 'js' | 'hybrid';
}
export interface EnterpriseError extends Error {
    code: string;
    module?: string;
    details?: any;
}
export interface LogEntry {
    timestamp: number;
    level: 'debug' | 'info' | 'warn' | 'error';
    module: string;
    message: string;
    data?: any;
}
export interface TelemetryEvent {
    type: string;
    timestamp: number;
    data: any;
    userId?: string;
    sessionId?: string;
}
