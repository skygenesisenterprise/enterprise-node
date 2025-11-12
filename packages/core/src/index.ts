import { ModuleLoader } from './loader/module-loader';
import { loadConfig, setConfig } from './config/config';
import { DiagnosticsCollector } from './diagnostics/diagnostics';
import { EnterpriseConfig, EnterpriseError } from '@skygenesisenterprise/shared';
import { Logger } from '@skygenesisenterprise/shared';

export class EnterpriseSDK {
  private loader: ModuleLoader | null = null;
  private config: EnterpriseConfig;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private logger = Logger.getInstance();
  private diagnostics = DiagnosticsCollector.getInstance();

  constructor(userConfig?: Partial<EnterpriseConfig>) {
    if (userConfig) {
      setConfig(userConfig);
    }
    this.config = loadConfig();
    
    // Configure logger based on config
    this.logger.setDebugMode(this.config.debug || false);
    
    this.logger.info('enterprise', 'Enterprise SDK instance created');
    this.diagnostics.recordEvent('sdk.instance.created', { config: this.config });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('enterprise', 'SDK already initialized');
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._initialize();
    return this.initializationPromise;
  }

  private async _initialize(): Promise<void> {
    try {
      this.logger.info('enterprise', 'Initializing Enterprise SDK...');
      this.diagnostics.recordEvent('sdk.initialize.started');

      this.loader = new ModuleLoader(this.config);
      await this.loader.initialize();

      this.isInitialized = true;
      this.logger.info('enterprise', 'Enterprise SDK initialized successfully');
      this.diagnostics.recordEvent('sdk.initialize.completed', {
        modules: this.loader.getLoadedModules(),
        framework: this.loader.getFramework()
      });
    } catch (error) {
      this.logger.error('enterprise', 'Failed to initialize Enterprise SDK', { error });
      this.diagnostics.recordEvent('sdk.initialize.failed', { error });
      throw new EnterpriseError(
        `Failed to initialize Enterprise SDK: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'INITIALIZATION_ERROR',
        'enterprise',
        { cause: error }
      );
    } finally {
      this.initializationPromise = null;
    }
  }

  get ai() {
    this.ensureInitialized();
    const module = this.loader!.getModule('ai');
    if (!module) {
      throw new EnterpriseError(
        'AI module not loaded. Check your configuration.',
        'MODULE_NOT_LOADED',
        'ai'
      );
    }
    return module;
  }

  get storage() {
    this.ensureInitialized();
    const module = this.loader!.getModule('storage');
    if (!module) {
      throw new EnterpriseError(
        'Storage module not loaded. Check your configuration.',
        'MODULE_NOT_LOADED',
        'storage'
      );
    }
    return module;
  }

  get ui() {
    this.ensureInitialized();
    const module = this.loader!.getModule('ui');
    if (!module) {
      throw new EnterpriseError(
        'UI module not loaded. Check your configuration.',
        'MODULE_NOT_LOADED',
        'ui'
      );
    }
    return module;
  }

  get project() {
    this.ensureInitialized();
    const module = this.loader!.getModule('project');
    if (!module) {
      throw new EnterpriseError(
        'Project module not loaded. Check your configuration.',
        'MODULE_NOT_LOADED',
        'project'
      );
    }
    return module;
  }

  get auth() {
    this.ensureInitialized();
    const module = this.loader!.getModule('auth');
    if (!module) {
      throw new EnterpriseError(
        'Auth module not loaded. Check your configuration.',
        'MODULE_NOT_LOADED',
        'auth'
      );
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
    this.logger.setDebugMode(this.config.debug || false);
    this.diagnostics.recordEvent('sdk.config.updated', { updates });
  }

  getDiagnostics(): any {
    if (!this.loader) {
      return {
        initialized: false,
        error: 'SDK not initialized'
      };
    }

    return {
      ...this.loader.getDiagnostics(),
      sessionId: this.diagnostics.getSessionId(),
      logs: this.logger.getLogs(),
      telemetry: this.diagnostics.getEvents()
    };
  }

  exportDiagnosticReport(): string {
    const report = this.diagnostics.generateDiagnosticReport();
    return JSON.stringify(report, null, 2);
  }

  async reloadModule(name: string): Promise<void> {
    this.ensureInitialized();
    await this.loader!.reloadModule(name);
    this.diagnostics.recordEvent('sdk.module.reloaded', { module: name });
  }

  async destroy(): Promise<void> {
    if (this.loader) {
      await this.loader.destroy();
      this.loader = null;
    }
    this.isInitialized = false;
    this.logger.info('enterprise', 'Enterprise SDK destroyed');
    this.diagnostics.recordEvent('sdk.destroyed');
  }

  private ensureInitialized(): void {
    if (!this.isInitialized || !this.loader) {
      throw new EnterpriseError(
        'Enterprise SDK not initialized. Call initialize() first.',
        'SDK_NOT_INITIALIZED',
        'enterprise'
      );
    }
  }

  // Static methods for global access
  static async create(userConfig?: Partial<EnterpriseConfig>): Promise<EnterpriseSDK> {
    const sdk = new EnterpriseSDK(userConfig);
    await sdk.initialize();
    return sdk;
  }

  static getInstance(): EnterpriseSDK {
    const sdk = new EnterpriseSDK();
    return sdk;
  }
}

// Create global instance for backward compatibility
const Enterprise = new EnterpriseSDK();

if (typeof window !== 'undefined') {
  (window as any).Enterprise = Enterprise;
}

if (typeof global !== 'undefined') {
  (global as any).Enterprise = Enterprise;
}

export { EnterpriseSDK, Enterprise };
export * from '@skygenesisenterprise/shared';
export * from './runtime/wasm-runtime';
export * from './loader/module-loader';
export * from './config/config';
export * from './diagnostics/diagnostics';