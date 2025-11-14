import { WasmRuntime } from './runtime';
export class ModuleLoader {
    constructor(config) {
        this.loadedModules = new Map();
        this.config = config;
        this.runtime = new WasmRuntime();
        this.framework = this.detectFramework();
    }
    async initialize() {
        if (this.config.runtime?.enableWasm !== false) {
            await this.runtime.initialize();
        }
        const modulePromises = [];
        if (this.config.modules.ai) {
            modulePromises.push(this.loadModule('ai', () => import('../modules/ai')));
        }
        if (this.config.modules.storage) {
            modulePromises.push(this.loadModule('storage', () => import('../modules/storage')));
        }
        if (this.config.modules.ui) {
            modulePromises.push(this.loadModule('ui', () => import('../modules/ui')));
        }
        if (this.config.modules.project) {
            modulePromises.push(this.loadModule('project', () => import('../modules/project')));
        }
        if (this.config.modules.auth) {
            modulePromises.push(this.loadModule('auth', () => import('../modules/auth')));
        }
        if (this.config.modules.sdk) {
            modulePromises.push(this.loadModule('sdk', () => import('../modules/sdk')));
        }
        await Promise.all(modulePromises);
        if (this.config.debug) {
            console.log(`Enterprise SDK initialized with framework: ${this.framework}`);
            console.log(`Loaded modules: ${Array.from(this.loadedModules.keys()).join(', ')}`);
        }
    }
    async loadModule(name, importFn) {
        try {
            const moduleExports = await importFn();
            const ModuleClass = moduleExports.default || moduleExports[name.charAt(0).toUpperCase() + name.slice(1)];
            if (ModuleClass && typeof ModuleClass === 'function') {
                const moduleInstance = new ModuleClass(this.runtime);
                await moduleInstance.init();
                this.loadedModules.set(name, moduleInstance);
            }
        }
        catch (error) {
            console.error(`Failed to load module '${name}':`, error);
        }
    }
    detectFramework() {
        if (this.config.framework && this.config.framework !== 'auto') {
            return this.config.framework;
        }
        if (typeof window !== 'undefined') {
            if (window.__NEXT_DATA__) {
                return 'nextjs';
            }
            if (window.React || window.ReactDOM) {
                return 'react';
            }
            if (window.SvelteComponent) {
                return 'svelte';
            }
        }
        if (typeof process !== 'undefined' && process.versions?.node) {
            return 'vanilla';
        }
        return 'vanilla';
    }
    getModule(name) {
        return this.loadedModules.get(name);
    }
    getRuntime() {
        return this.runtime;
    }
    getFramework() {
        return this.framework;
    }
    async destroy() {
        for (const [name, module] of this.loadedModules) {
            try {
                await module.destroy();
            }
            catch (error) {
                console.error(`Error destroying module '${name}':`, error);
            }
        }
        this.loadedModules.clear();
        this.runtime.destroy();
    }
}
//# sourceMappingURL=loader.js.map