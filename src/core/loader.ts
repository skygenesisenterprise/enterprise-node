import { EnterpriseConfig, FrameworkType, ModuleInterface } from '../types';
import { WasmRuntime } from './runtime';

export class ModuleLoader {
  private config: EnterpriseConfig;
  private runtime: WasmRuntime;
  private loadedModules: Map<string, ModuleInterface> = new Map();
  private framework: FrameworkType;

  constructor(config: EnterpriseConfig) {
    this.config = config;
    this.runtime = new WasmRuntime();
    this.framework = this.detectFramework();
  }

  async initialize(): Promise<void> {
    if (this.config.runtime?.enableWasm !== false) {
      await this.runtime.initialize();
    }

    const modulePromises: Promise<void>[] = [];

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

    await Promise.all(modulePromises);

    if (this.config.debug) {
      console.log(`Enterprise SDK initialized with framework: ${this.framework}`);
      console.log(`Loaded modules: ${Array.from(this.loadedModules.keys()).join(', ')}`);
    }
  }

  private async loadModule(name: string, importFn: () => Promise<any>): Promise<void> {
    try {
      const moduleExports = await importFn();
      const ModuleClass = moduleExports.default || moduleExports[name.charAt(0).toUpperCase() + name.slice(1)];
      
      if (ModuleClass && typeof ModuleClass === 'function') {
        const moduleInstance = new ModuleClass(this.runtime);
        await moduleInstance.init();
        this.loadedModules.set(name, moduleInstance);
      }
    } catch (error) {
      console.error(`Failed to load module '${name}':`, error);
    }
  }

  private detectFramework(): FrameworkType {
    if (this.config.framework && this.config.framework !== 'auto') {
      return this.config.framework as FrameworkType;
    }

    if (typeof window !== 'undefined') {
      if ((window as any).__NEXT_DATA__) {
        return 'nextjs';
      }
      if ((window as any).React || (window as any).ReactDOM) {
        return 'react';
      }
      if ((window as any).SvelteComponent) {
        return 'svelte';
      }
    }

    if (typeof process !== 'undefined' && process.versions?.node) {
      return 'vanilla';
    }

    return 'vanilla';
  }

  getModule(name: string): ModuleInterface | undefined {
    return this.loadedModules.get(name);
  }

  getRuntime(): WasmRuntime {
    return this.runtime;
  }

  getFramework(): FrameworkType {
    return this.framework;
  }

  async destroy(): Promise<void> {
    for (const [name, module] of this.loadedModules) {
      try {
        await module.destroy();
      } catch (error) {
        console.error(`Error destroying module '${name}':`, error);
      }
    }
    this.loadedModules.clear();
    this.runtime.destroy();
  }
}