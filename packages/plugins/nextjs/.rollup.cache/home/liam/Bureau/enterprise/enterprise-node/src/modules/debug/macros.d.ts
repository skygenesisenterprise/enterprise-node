export declare function debug_macro(target: string, message: string, ...fields: any[]): void;
export declare function info_macro(target: string, message: string, ...fields: any[]): void;
export declare function warn_macro(target: string, message: string, ...fields: any[]): void;
export declare function error_macro(target: string, message: string, ...fields: any[]): void;
export declare function trace_macro(target: string, message: string, ...fields: any[]): void;
export declare function span_macro<T>(target: string, name: string, fn: (span: any) => T, metadata?: Record<string, any>): T;
export declare function async_span_macro<T>(target: string, name: string, fn: (span: any) => Promise<T>, metadata?: Record<string, any>): Promise<T>;
export declare function create_macros(target: string): {
    trace: (message: string, ...fields: any[]) => void;
    debug: (message: string, ...fields: any[]) => void;
    info: (message: string, ...fields: any[]) => void;
    warn: (message: string, ...fields: any[]) => void;
    error: (message: string, ...fields: any[]) => void;
    span: <T>(name: string, fn: () => T, metadata?: Record<string, any>) => T;
    asyncSpan: <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>) => Promise<T>;
};
export declare const log: {
    trace: (message: string, ...fields: any[]) => void;
    debug: (message: string, ...fields: any[]) => void;
    info: (message: string, ...fields: any[]) => void;
    warn: (message: string, ...fields: any[]) => void;
    error: (message: string, ...fields: any[]) => void;
    span: <T>(name: string, fn: () => T, metadata?: Record<string, any>) => T;
    asyncSpan: <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>) => Promise<T>;
};
export declare const runtime_log: {
    trace: (message: string, ...fields: any[]) => void;
    debug: (message: string, ...fields: any[]) => void;
    info: (message: string, ...fields: any[]) => void;
    warn: (message: string, ...fields: any[]) => void;
    error: (message: string, ...fields: any[]) => void;
    span: <T>(name: string, fn: () => T, metadata?: Record<string, any>) => T;
    asyncSpan: <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>) => Promise<T>;
};
export declare const wasm_log: {
    trace: (message: string, ...fields: any[]) => void;
    debug: (message: string, ...fields: any[]) => void;
    info: (message: string, ...fields: any[]) => void;
    warn: (message: string, ...fields: any[]) => void;
    error: (message: string, ...fields: any[]) => void;
    span: <T>(name: string, fn: () => T, metadata?: Record<string, any>) => T;
    asyncSpan: <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>) => Promise<T>;
};
export declare const ai_log: {
    trace: (message: string, ...fields: any[]) => void;
    debug: (message: string, ...fields: any[]) => void;
    info: (message: string, ...fields: any[]) => void;
    warn: (message: string, ...fields: any[]) => void;
    error: (message: string, ...fields: any[]) => void;
    span: <T>(name: string, fn: () => T, metadata?: Record<string, any>) => T;
    asyncSpan: <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>) => Promise<T>;
};
export declare const storage_log: {
    trace: (message: string, ...fields: any[]) => void;
    debug: (message: string, ...fields: any[]) => void;
    info: (message: string, ...fields: any[]) => void;
    warn: (message: string, ...fields: any[]) => void;
    error: (message: string, ...fields: any[]) => void;
    span: <T>(name: string, fn: () => T, metadata?: Record<string, any>) => T;
    asyncSpan: <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>) => Promise<T>;
};
export declare const auth_log: {
    trace: (message: string, ...fields: any[]) => void;
    debug: (message: string, ...fields: any[]) => void;
    info: (message: string, ...fields: any[]) => void;
    warn: (message: string, ...fields: any[]) => void;
    error: (message: string, ...fields: any[]) => void;
    span: <T>(name: string, fn: () => T, metadata?: Record<string, any>) => T;
    asyncSpan: <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>) => Promise<T>;
};
export declare const ui_log: {
    trace: (message: string, ...fields: any[]) => void;
    debug: (message: string, ...fields: any[]) => void;
    info: (message: string, ...fields: any[]) => void;
    warn: (message: string, ...fields: any[]) => void;
    error: (message: string, ...fields: any[]) => void;
    span: <T>(name: string, fn: () => T, metadata?: Record<string, any>) => T;
    asyncSpan: <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>) => Promise<T>;
};
export declare const project_log: {
    trace: (message: string, ...fields: any[]) => void;
    debug: (message: string, ...fields: any[]) => void;
    info: (message: string, ...fields: any[]) => void;
    warn: (message: string, ...fields: any[]) => void;
    error: (message: string, ...fields: any[]) => void;
    span: <T>(name: string, fn: () => T, metadata?: Record<string, any>) => T;
    asyncSpan: <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>) => Promise<T>;
};
//# sourceMappingURL=macros.d.ts.map