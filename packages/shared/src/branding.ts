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

export class BrandingManager {
  private static instance: BrandingManager;
  private config: BrandingConfig | null = null;
  private assetCache: Map<string, string> = new Map();

  private constructor() {}

  static getInstance(): BrandingManager {
    if (!BrandingManager.instance) {
      BrandingManager.instance = new BrandingManager();
    }
    return BrandingManager.instance;
  }

  setConfig(config: BrandingConfig): void {
    this.config = config;
  }

  getConfig(): BrandingConfig | null {
    return this.config;
  }

  async getLogoUrl(): Promise<string | null> {
    if (!this.config?.logo) {
      return null;
    }

    const cacheKey = `logo_${this.config.logo.path}`;

    if (this.assetCache.has(cacheKey)) {
      return this.assetCache.get(cacheKey)!;
    }

    try {
      const logoUrl = await this.loadAsset(this.config.logo.path);
      this.assetCache.set(cacheKey, logoUrl);
      return logoUrl;
    } catch (error) {
      console.error('Failed to load logo:', error);
      return null;
    }
  }

  getLogoConfig(): LogoConfig | null {
    return this.config?.logo || null;
  }

  getTheme(): 'light' | 'dark' | 'auto' {
    return this.config?.theme || 'auto';
  }

  getPrimaryColor(): string {
    return this.config?.primaryColor || '#007acc';
  }

  getSecondaryColor(): string {
    return this.config?.secondaryColor || '#004466';
  }

  getCompanyName(): string {
    return this.config?.companyName || 'Enterprise';
  }

  private async loadAsset(path: string): Promise<string> {
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to fetch asset: ${path}`);
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } catch (error) {
        throw new Error(`Failed to load asset from ${path}: ${error}`);
      }
    } else {
      throw new Error('Asset loading not supported in server environment');
    }
  }

  clearCache(): void {
    this.assetCache.forEach((url) => {
      if (typeof window !== 'undefined') {
        URL.revokeObjectURL(url);
      }
    });
    this.assetCache.clear();
  }

  generateCSSVariables(): Record<string, string> {
    if (!this.config) {
      return {};
    }

    return {
      '--enterprise-primary-color': this.config.primaryColor || '#007acc',
      '--enterprise-secondary-color': this.config.secondaryColor || '#004466',
      '--enterprise-company-name': `"${this.config.companyName || 'Enterprise'}"`,
    };
  }

  applyTheme(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const cssVars = this.generateCSSVariables();

    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    const theme = this.getTheme();
    if (theme !== 'auto') {
      root.setAttribute('data-theme', theme);
    }
  }
}

export const brandingManager = BrandingManager.getInstance();
