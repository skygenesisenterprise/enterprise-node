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
export declare class BrandingManager {
    private static instance;
    private config;
    private assetCache;
    private constructor();
    static getInstance(): BrandingManager;
    setConfig(config: BrandingConfig): void;
    getConfig(): BrandingConfig | null;
    getLogoUrl(): Promise<string | null>;
    getLogoConfig(): LogoConfig | null;
    getTheme(): 'light' | 'dark' | 'auto';
    getPrimaryColor(): string;
    getSecondaryColor(): string;
    getCompanyName(): string;
    private loadAsset;
    clearCache(): void;
    generateCSSVariables(): Record<string, string>;
    applyTheme(): void;
}
export declare const brandingManager: BrandingManager;
//# sourceMappingURL=branding.d.ts.map