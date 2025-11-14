export interface LogoConfig {
    path: string;
    width?: number;
    height?: number;
    alt?: string;
    format?: 'png' | 'svg' | 'jpg' | 'jpeg' | 'webp';
}
export interface BrandingConfig {
    logo?: LogoConfig;
    companyName?: string;
    primaryColor?: string;
    secondaryColor?: string;
    theme?: 'light' | 'dark' | 'auto';
}
export interface EnterpriseConfig {
    modules: {
        ai?: boolean;
        storage?: boolean;
        ui?: boolean;
        project?: boolean;
        auth?: boolean;
        sdk?: boolean;
    };
    runtime?: {
        wasmPath?: string;
        enableWasm?: boolean;
    };
    framework?: 'react' | 'svelte' | 'nextjs' | 'auto';
    debug?: boolean;
    branding?: BrandingConfig;
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
