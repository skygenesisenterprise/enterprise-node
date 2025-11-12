import { ModuleLoader } from './core/loader';
import { loadConfig, setConfig } from './core/config';
import { EnterpriseConfig } from './types';

export class EnterpriseSDK {
  private loader: ModuleLoader | null = null;
  private config: EnterpriseConfig;
  private isInitialized = false;

  constructor(userConfig?: Partial<EnterpriseConfig>) {
    if (userConfig) {
      setConfig(userConfig);
    }
    this.config = loadConfig();
  }

  async initialize(): Promise<void> {
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
    } catch (error) {
      console.error('Failed to initialize Enterprise SDK:', error);
      throw error;
    }
  }

  get ai() {
    this.ensureInitialized();
    const module = this.loader!.getModule('ai');
    if (!module) {
      throw new Error('AI module not loaded');
    }
    return module;
  }

  get storage() {
    this.ensureInitialized();
    const module = this.loader!.getModule('storage');
    if (!module) {
      throw new Error('Storage module not loaded');
    }
    return module;
  }

  get ui() {
    this.ensureInitialized();
    const module = this.loader!.getModule('ui');
    if (!module) {
      throw new Error('UI module not loaded');
    }
    return module;
  }

  get project() {
    this.ensureInitialized();
    const module = this.loader!.getModule('project');
    if (!module) {
      throw new Error('Project module not loaded');
    }
    return module;
  }

  get auth() {
    this.ensureInitialized();
    const module = this.loader!.getModule('auth');
    if (!module) {
      throw new Error('Auth module not loaded');
    }
    return module;
  }

  get runtime() {
    this.ensureInitialized();
    return this.loader!.getRuntime();
  }

  get framework() {
    this.ensureInitialized();
    return this.loader!.getFramework();
  }

  getConfig(): EnterpriseConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<EnterpriseConfig>): void {
    this.config = { ...this.config, ...updates };
    setConfig(updates);
  }

  async destroy(): Promise<void> {
    if (this.loader) {
      await this.loader.destroy();
      this.loader = null;
    }
    this.isInitialized = false;
  }

  private ensureInitialized(): void {
    if (!this.isInitialized || !this.loader) {
      throw new Error('Enterprise SDK not initialized. Call initialize() first.');
    }
  }
}

const Enterprise = new EnterpriseSDK();

if (typeof window !== 'undefined') {
  (window as any).Enterprise = Enterprise;
}

if (typeof global !== 'undefined') {
  (global as any).Enterprise = Enterprise;
}

export { EnterpriseSDK, Enterprise };
export * from './types';
export * from './hooks';

export default Enterprise;