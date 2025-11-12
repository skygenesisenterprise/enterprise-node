import { ModuleLoader } from './core/loader';
import { loadConfig, setConfig } from './core/config';
import { EnterpriseConfig } from './types';

// Import module classes for direct export
import { Ai } from '../packages/modules/ai/src/index';
import { Storage } from '../packages/modules/storage/src/index';
import { UIManager } from '../packages/modules/ui/src/index';
import { AuthManager } from '../packages/modules/auth/src/index';
import { ProjectManager } from '../packages/modules/project/src/index';
import { SDK } from '../packages/modules/sdk/src/index';

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

  get sdk() {
    this.ensureInitialized();
    const module = this.loader!.getModule('sdk');
    if (!module) {
      throw new Error('SDK module not loaded');
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

// Factory function for creating SDK instances
export async function createEnterprise(config?: Partial<EnterpriseConfig>): Promise<EnterpriseSDK> {
  const sdk = new EnterpriseSDK(config);
  await sdk.initialize();
  return sdk;
}

// Legacy singleton instance
const Enterprise = new EnterpriseSDK();

if (typeof window !== 'undefined') {
  (window as any).Enterprise = Enterprise;
}

if (typeof global !== 'undefined') {
  (global as any).Enterprise = Enterprise;
}

// Core exports
export { Enterprise };

// Module class exports for direct usage
export { Ai, Storage, UIManager, AuthManager, ProjectManager, SDK };

// Module type exports
export type {
  AIEnhanceOptions,
  AIGenerateOptions,
  AIAnalyzeOptions,
  AIEnhanceResult,
  AIGenerateResult,
  AIAnalyzeResult,
} from '../packages/modules/ai/src/index';

export type {
  StorageSaveOptions,
  StorageLoadOptions,
  StorageFileInfo,
} from '../packages/modules/storage/src/index';

export type { UIComponent, Theme } from '../packages/modules/ui/src/index';

export type { AuthConfig, User } from '../packages/modules/auth/src/index';

export type { Project, Task } from '../packages/modules/project/src/index';

export type { SDKMetaInfo, SDKSelfReferenceOptions } from '../packages/modules/sdk/src/index';

// Utility exports
export * from './types';
export * from './hooks';

// Default export
export default Enterprise;
