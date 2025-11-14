export class BrandingManager {
    constructor() {
        this.config = null;
        this.assetCache = new Map();
    }
    static getInstance() {
        if (!BrandingManager.instance) {
            BrandingManager.instance = new BrandingManager();
        }
        return BrandingManager.instance;
    }
    setConfig(config) {
        this.config = config;
    }
    getConfig() {
        return this.config;
    }
    async getLogoUrl() {
        if (!this.config?.logo) {
            return null;
        }
        const cacheKey = `logo_${this.config.logo.path}`;
        if (this.assetCache.has(cacheKey)) {
            return this.assetCache.get(cacheKey);
        }
        try {
            const logoUrl = await this.loadAsset(this.config.logo.path);
            this.assetCache.set(cacheKey, logoUrl);
            return logoUrl;
        }
        catch (error) {
            console.error('Failed to load logo:', error);
            return null;
        }
    }
    getLogoConfig() {
        return this.config?.logo || null;
    }
    getTheme() {
        return this.config?.theme || 'auto';
    }
    getPrimaryColor() {
        return this.config?.primaryColor || '#007acc';
    }
    getSecondaryColor() {
        return this.config?.secondaryColor || '#004466';
    }
    getCompanyName() {
        return this.config?.companyName || 'Enterprise';
    }
    async loadAsset(path) {
        if (typeof window !== 'undefined') {
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`Failed to fetch asset: ${path}`);
                }
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            }
            catch (error) {
                throw new Error(`Failed to load asset from ${path}: ${error}`);
            }
        }
        else {
            throw new Error('Asset loading not supported in server environment');
        }
    }
    clearCache() {
        this.assetCache.forEach((url) => {
            if (typeof window !== 'undefined') {
                URL.revokeObjectURL(url);
            }
        });
        this.assetCache.clear();
    }
    generateCSSVariables() {
        if (!this.config) {
            return {};
        }
        return {
            '--enterprise-primary-color': this.config.primaryColor || '#007acc',
            '--enterprise-secondary-color': this.config.secondaryColor || '#004466',
            '--enterprise-company-name': `"${this.config.companyName || 'Enterprise'}"`,
        };
    }
    applyTheme() {
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
//# sourceMappingURL=branding.js.map