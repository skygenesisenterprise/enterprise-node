import { ModuleInterface, ModuleManifest, EnterpriseConfig, FrameworkType } from '@skygenesisenterprise/shared';
import { WasmRuntime } from '../runtime/wasm-runtime';
import { Logger } from '@skygenesisenterprise/shared';
import { detectFramework } from '@skygenesisenterprise/shared';

export class ModuleLoader {
  private config: EnterpriseConfig;
  private runtime: WasmRuntime;
  private loadedModules: Map<string, ModuleInterface> = new Map();
  private moduleManifests: Map<string, ModuleManifest> = new Map();
  private framework: FrameworkType;
  private logger = Logger.getInstance();

  constructor(config: EnterpriseConfig) {
    this.config = config;
    this.runtime = new WasmRuntime();
    this.framework = this.detectFramework();
  }

  async initialize(): Promise<void> {
    this.logger.info('loader', `Initializing Enterprise SDK for framework: ${this.framework}`);
    
    if (this.config.runtime?.enableWasm !== false) {
      await this.runtime.initialize();
    }

    const modulePromises: Promise<void>[] = [];

    // Load modules based on configuration
    if (this.config.modules.ai) {
      modulePromises.push(this.loadModule('ai', () => import('@skygenesisenterprise/module-ai')));
    }
    if (this.config.modules.storage) {
      modulePromises.push(this.loadModule('storage', () => import('@skygenesisenterprise/module-storage')));
    }
    if (this.config.modules.ui) {
      modulePromises.push(this.loadModule('ui', () => import('@skygenesisenterprise/module-ui')));
    }
    if (this.config.modules.project) {
      modulePromises.push(this.loadModule('project', () => import('@skygenesisenterprise/module-project')));
    }
    if (this.config.modules.auth) {
      modulePromises.push(this.loadModule('auth', () => import('@skygenesisenterprise/module-auth')));
    }

    await Promise.all(modulePromises);

    if (this.config.debug) {
      this.logger.info('loader', `Enterprise SDK initialized successfully`);
      this.logger.info('loader', `Loaded modules: ${Array.from(this.loadedModules.keys()).join(', ')}`);
      this.logger.info('loader', `Framework detected: ${this.framework}`);
    }
  }

  private async loadModule(name: string, importFn: () => Promise<any>): Promise<void> {
    try {
      this.logger.debug('loader', `Loading module: ${name}`);
      
      const moduleExports = await importFn();
      const manifest = moduleExports.manifest || this.getDefaultManifest(name);
      const ModuleClass = moduleExports.default || moduleExports[name.charAt(0).toUpperCase() + name.slice(1)];
      
      if (ModuleClass && typeof ModuleClass === 'function') {
        // Check dependencies
        if (manifest.dependencies) {
          for (const dep of manifest.dependencies) {
            if (!this.loadedModules.has(dep)) {
              this.logger.warn('loader', `Dependency '${dep}' not loaded for module '${name}'`);
            }
          }
        }

        const moduleInstance = new ModuleClass(this.runtime, this.config);
        await moduleInstance.init();
        
        this.loadedModules.set(name, moduleInstance);
        this.moduleManifests.set(name, manifest);
        
        this.logger.info('loader', `Module '${name}' loaded successfully (v${manifest.version})`);
      } else {
        throw new Error(`Invalid module export for '${name}'`);
      }
    } catch (error) {
      this.logger.error('loader', `Failed to load module '${name}'`, { error });
      throw error;
    }
  }

  private getDefaultManifest(name: string): ModuleManifest {
    return {
      name,
      version: '0.1.0',
      description: `${name.charAt(0).toUpperCase() + name.slice(1)} module`,
      author: 'Sky Genesis Enterprise',
      dependencies: [],
      exports: {
        '.': './index.js'
      },
      runtime: 'hybrid'
    };
  }

  private detectFramework(): FrameworkType {
    if (this.config.framework && this.config.framework !== 'auto') {
      return this.config.framework as FrameworkType;
    }

    return detectFramework();
  }

  getModule(name: string): ModuleInterface | undefined {
    return this.loadedModules.get(name);
  }

  getModuleManifest(name: string): ModuleManifest | undefined {
    return this.moduleManifests.get(name);
  }

  getLoadedModules(): string[] {
    return Array.from(this.loadedModules.keys());
  }

  getRuntime(): WasmRuntime {
    return this.runtime;
  }

  getFramework(): FrameworkType {
    return this.framework;
  }

  getConfig(): EnterpriseConfig {
    return { ...this.config };
  }

  async reloadModule(name: string): Promise<void> {
    const module = this.loadedModules.get(name);
    if (module) {
      await module.destroy();
      this.loadedModules.delete(name);
      this.moduleManifests.delete(name);
    }

    // Reload based on module name
    const importMap: Record<string, () => Promise<any>> = {
      'ai': () => import('@skygenesisenterprise/module-ai'),
      'storage': () => import('@skygenesisenterprise/module-storage'),
      'ui': () => import('@skygenesisenterprise/module-ui'),
      'project': () => import('@skygenesisenterprise/module-project'),
      'auth': () => import('@skygenesisenterprise/module-auth')
    };

    if (importMap[name] && this.config.modules[name as keyof typeof this.config.modules]) {
      await this.loadModule(name, importMap[name]);
    }
  }

  async destroy(): Promise<void> {
    this.logger.info('loader', 'Destroying Enterprise SDK...');
    
    for (const [name, module] of this.loadedModules) {
      try {
        await module.destroy();
        this.logger.debug('loader', `Module '${name}' destroyed`);
      } catch (error) {
        this.logger.error('loader', `Error destroying module '${name}'`, { error });
      }
    }
    
    this.loadedModules.clear();
    this.moduleManifests.clear();
    this.runtime.destroy();
    
    this.logger.info('loader', 'Enterprise SDK destroyed');
  }

  getDiagnostics(): {
    modules: Array<{ name: string; version: string; initialized: boolean }>;
    runtime: any;
    framework: FrameworkType;
    config: EnterpriseConfig;
  } {
    return {
      modules: Array.from(this.moduleManifests.entries()).map(([name, manifest]) => ({
        name,
        version: manifest.version,
        initialized: this.loadedModules.get(name)?.isInitialized() || false
      })),
      runtime: this.runtime.getPerformanceMetrics(),
      framework: this.framework,
      config: this.config
    };
  }
}