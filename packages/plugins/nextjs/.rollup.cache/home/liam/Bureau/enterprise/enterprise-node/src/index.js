import { ModuleLoader } from './core/loader';
import { loadConfig, setConfig } from './core/config';
// Import module classes for direct export
import { Ai } from '../packages/modules/ai/src/index';
import { Storage } from '../packages/modules/storage/src/index';
import { UIManager } from '../packages/modules/ui/src/index';
import { AuthManager } from '../packages/modules/auth/src/index';
import { ProjectManager } from '../packages/modules/project/src/index';
import { SDK } from '../packages/modules/sdk/src/index';
// Import Next.js bridge (lazy loading pour éviter les erreurs côté serveur)
let nextjsBridge = null;
const loadNextjsBridge = async () => {
    if (!nextjsBridge && typeof window !== 'undefined') {
        try {
            // Import dynamique pour éviter les erreurs de build
            const bridgeModule = await import('../packages/integrations/nextjs/src/index');
            nextjsBridge = bridgeModule;
        }
        catch (error) {
            // Next.js bridge non disponible, silent fail
            console.debug('Next.js bridge not available');
        }
    }
    return nextjsBridge;
};
export class EnterpriseSDK {
    constructor(userConfig) {
        this.loader = null;
        this.isInitialized = false;
        if (userConfig) {
            setConfig(userConfig);
        }
        this.config = loadConfig();
    }
    async initialize() {
        if (this.isInitialized) {
            return;
        }
        try {
            this.loader = new ModuleLoader(this.config);
            await this.loader.initialize();
            this.isInitialized = true;
            if (this.config.debug) {
                console.log('Enterprise SDK initialized successfully');
            }
        }
        catch (error) {
            console.error('Failed to initialize Enterprise SDK:', error);
            throw error;
        }
    }
    get ai() {
        this.ensureInitialized();
        const module = this.loader.getModule('ai');
        if (!module) {
            throw new Error('AI module not loaded');
        }
        return module;
    }
    get storage() {
        this.ensureInitialized();
        const module = this.loader.getModule('storage');
        if (!module) {
            throw new Error('Storage module not loaded');
        }
        return module;
    }
    get ui() {
        this.ensureInitialized();
        const module = this.loader.getModule('ui');
        if (!module) {
            throw new Error('UI module not loaded');
        }
        return module;
    }
    get project() {
        this.ensureInitialized();
        const module = this.loader.getModule('project');
        if (!module) {
            throw new Error('Project module not loaded');
        }
        return module;
    }
    get auth() {
        this.ensureInitialized();
        const module = this.loader.getModule('auth');
        if (!module) {
            throw new Error('Auth module not loaded');
        }
        return module;
    }
    get sdk() {
        this.ensureInitialized();
        const module = this.loader.getModule('sdk');
        if (!module) {
            throw new Error('SDK module not loaded');
        }
        return module;
    }
    get runtime() {
        this.ensureInitialized();
        return this.loader.getRuntime();
    }
    get framework() {
        this.ensureInitialized();
        return this.loader.getFramework();
    }
    get nextjs() {
        this.ensureInitialized();
        // Retourner le bridge Next.js si disponible
        return loadNextjsBridge();
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(updates) {
        this.config = { ...this.config, ...updates };
        setConfig(updates);
    }
    async destroy() {
        if (this.loader) {
            await this.loader.destroy();
            this.loader = null;
        }
        this.isInitialized = false;
    }
    ensureInitialized() {
        if (!this.isInitialized || !this.loader) {
            throw new Error('Enterprise SDK not initialized. Call initialize() first.');
        }
    }
}
// Factory function for creating SDK instances
export async function createEnterprise(config) {
    const sdk = new EnterpriseSDK(config);
    await sdk.initialize();
    return sdk;
}
// Legacy singleton instance
const Enterprise = new EnterpriseSDK();
if (typeof window !== 'undefined') {
    window.Enterprise = Enterprise;
}
if (typeof global !== 'undefined') {
    global.Enterprise = Enterprise;
}
// Core exports
export { Enterprise };
// Module class exports for direct usage
export { Ai, Storage, UIManager, AuthManager, ProjectManager, SDK };
// Utility exports
export * from './types';
export * from './hooks';
// Next.js bridge exports (lazy loading)
export const getNextjsBridge = () => loadNextjsBridge();
// Default export
export default Enterprise;
//# sourceMappingURL=index.js.map