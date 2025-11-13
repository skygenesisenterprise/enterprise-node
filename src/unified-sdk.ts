/**
 * @fileoverview SDK Unifié Enterprise avec Bridge TypeScript-Rust
 * Interface principale pour l'initialisation et l'utilisation du SDK
 */

import { RustBridge, BridgeConfig } from './core/rust-bridge';
import { UnifiedRuntime } from '../packages/core/src/runtime/unified-runtime';
import { ModuleLoader } from './core/loader';
import { EnterpriseConfig } from './types';

export interface UnifiedSDKConfig {
  modules: {
    ai?: boolean;
    storage?: boolean;
    ui?: boolean;
    project?: boolean;
    auth?: boolean;
    sdk?: boolean;
  };
  runtime?: {
    wasmPath?: string;
    enableWasm?: boolean;
  };
  framework?: 'react' | 'svelte' | 'nextjs' | 'auto';
  debug?: boolean;
  branding?: any;
  /** Configuration du bridge Rust */
  bridge?: BridgeConfig;
  /** Mode de fonctionnement */
  mode?: 'development' | 'production' | 'testing';
  /** Plugins à charger */
  plugins?: string[];
  /** Middlewares globaux */
  middlewares?: Array<{
    name: string;
    execute: (context: any, next: () => Promise<any>) => Promise<any>;
  }>;
}

export interface InvokeContext {
  /** Nom de la fonction appelée */
  function: string;
  /** Paramètres */
  params: Record<string, any>;
  /** Timestamp */
  timestamp: number;
  /** Session ID */
  sessionId: string;
  /** Métadonnées */
  metadata?: Record<string, any>;
}

/**
 * SDK Unifié Enterprise - Point d'entrée principal
 */
export class UnifiedEnterpriseSDK {
  private static instance: UnifiedEnterpriseSDK;
  private rustBridge: RustBridge;
  private unifiedRuntime: UnifiedRuntime;
  private loader: ModuleLoader | null = null;
  private config: UnifiedSDKConfig;
  private isInitialized = false;
  private sessionId: string;
  private initTime: number = 0;

  constructor(config: Partial<UnifiedSDKConfig> = {}) {
    this.sessionId = this.generateSessionId();
    this.config = {
      modules: {
        ai: true,
        storage: true,
        ui: true,
        auth: true,
        project: true,
        sdk: true,
      },
      runtime: {
        wasmPath: '/wasm',
        enableWasm: true,
      },
      framework: 'auto',
      debug: false,
      bridge: {
        enableWasm: true,
        wasmPath: '/wasm',
        rustModules: ['core', 'ai', 'storage', 'auth'],
        enableJsFallback: true,
      },
      mode: 'development',
      ...config,
    };

    // Initialiser les composants
    this.rustBridge = RustBridge.getInstance(this.config.bridge);
    this.unifiedRuntime = UnifiedRuntime.getInstance(this.config.runtime);
  }

  static getInstance(config?: UnifiedSDKConfig): UnifiedEnterpriseSDK {
    if (!UnifiedEnterpriseSDK.instance) {
      UnifiedEnterpriseSDK.instance = new UnifiedEnterpriseSDK(config);
    }
    return UnifiedEnterpriseSDK.instance;
  }

  /**
   * Initialise l'environnement SDK complet
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      if (this.config.debug) {
        console.log('🔄 SDK already initialized');
      }
      return;
    }

    this.initTime = Date.now();

    try {
      // 1. Initialiser le bridge Rust
      await this.rustBridge.initialize();

      // 2. Initialiser le runtime unifié
      await this.unifiedRuntime.initialize();

      // 3. Charger les modules configurés
      await this.loadModules();

      // 4. Exécuter les hooks d'initialisation
      await this.runInitHooks();

      this.isInitialized = true;
      const initTime = Date.now() - this.initTime;

      if (this.config.debug) {
        console.log(`✅ UnifiedEnterpriseSDK initialized in ${initTime}ms`);
        console.log(`📊 Performance:`, this.getPerformanceStats());
      }

      // Exposer l'instance globalement
      this.exposeGlobally();
    } catch (error) {
      console.error('❌ Failed to initialize UnifiedEnterpriseSDK:', error);
      throw error;
    }
  }

  /**
   * Point d'entrée principal pour appeler des fonctions Rust
   */
  async invoke(
    functionName: string,
    params: Record<string, any> = {},
    options?: { timeout?: number; context?: Record<string, any> }
  ): Promise<any> {
    this.ensureInitialized();

    const context: InvokeContext = {
      function: functionName,
      params,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      metadata: options?.context,
    };

    try {
      // Exécuter les middlewares avant l'appel
      await this.executeMiddlewares('before', context);

      // Invoquer la fonction via le bridge
      const result = await this.rustBridge.invoke(functionName, params, {
        timeout: options?.timeout,
        sync: false,
        context: options?.context,
      });

      // Exécuter les middlewares après l'appel
      await this.executeMiddlewares('after', { ...context, result });

      return result;
    } catch (error) {
      // Exécuter les middlewares d'erreur
      await this.executeMiddlewares('error', { ...context, error });
      throw error;
    }
  }

  /**
   * Interface simplifiée pour les modules
   */
  get ai() {
    return {
      enhance: (image: any, options?: any) => this.invoke('ai::enhance', { image, ...options }),
      generate: (prompt: string, options?: any) =>
        this.invoke('ai::generate', { prompt, ...options }),
      analyze: (data: any, options?: any) => this.invoke('ai::analyze', { data, ...options }),
    };
  }

  get storage() {
    return {
      save: (file: any, options?: any) => this.invoke('storage::save', { file, ...options }),
      load: (path: string, options?: any) => this.invoke('storage::load', { path, ...options }),
      delete: (path: string) => this.invoke('storage::delete', { path }),
      list: (directory?: string) => this.invoke('storage::list', { directory }),
    };
  }

  get auth() {
    return {
      login: (credentials: any) => this.invoke('auth::login', { credentials }),
      logout: () => this.invoke('auth::logout', {}),
      verify: (token: string) => this.invoke('auth::verify', { token }),
      register: (userData: any) => this.invoke('auth::register', { userData }),
    };
  }

  get project() {
    return {
      create: (name: string, options?: any) => this.invoke('project::create', { name, ...options }),
      open: (projectId: string) => this.invoke('project::open', { projectId }),
      save: (project: any) => this.invoke('project::save', { project }),
      list: () => this.invoke('project::list', {}),
    };
  }

  get ui() {
    return {
      notify: (message: string, type?: string) => this.invoke('ui::notify', { message, type }),
      modal: (options: any) => this.invoke('ui::modal', { options }),
      theme: (theme: string) => this.invoke('ui::theme', { theme }),
    };
  }

  /**
   * Runtime direct access
   */
  get runtime() {
    this.ensureInitialized();
    return this.unifiedRuntime;
  }

  /**
   * Bridge direct access
   */
  get bridge() {
    return this.rustBridge;
  }

  /**
   * Liste toutes les fonctions disponibles
   */
  getAvailableFunctions(): string[] {
    return this.bridge.getAvailableFunctions().map((f) => f.name);
  }

  /**
   * Vérifie si une fonction est disponible
   */
  isFunctionAvailable(functionName: string): boolean {
    return this.bridge.isFunctionAvailable(functionName);
  }

  /**
   * Récupère les statistiques de performance
   */
  getPerformanceStats() {
    return {
      bridge: this.rustBridge.getPerformance(),
      runtime: this.unifiedRuntime.getPerformance(),
      session: {
        id: this.sessionId,
        initialized: this.isInitialized,
        uptime: Date.now() - this.initTime,
      },
    };
  }

  /**
   * Met à jour la configuration
   */
  updateConfig(updates: Partial<UnifiedSDKConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Détruit le SDK et nettoie les ressources
   */
  async destroy(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      // Exécuter les hooks de destruction
      await this.runDestroyHooks();

      // Détruire les composants
      await this.rustBridge.destroy();
      await this.unifiedRuntime.destroy();

      if (this.loader) {
        await this.loader.destroy();
        this.loader = null;
      }

      this.isInitialized = false;

      if (this.config.debug) {
        console.log('✅ UnifiedEnterpriseSDK destroyed');
      }
    } catch (error) {
      console.error('❌ Error during SDK destruction:', error);
      throw error;
    }
  }

  /**
   * Charge les modules configurés
   */
  private async loadModules(): Promise<void> {
    const enabledModules = Object.entries(this.config.modules)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name);

    if (this.config.debug) {
      console.log(`📦 Loading modules: ${enabledModules.join(', ')}`);
    }

    // Charger chaque module dans le runtime
    for (const moduleName of enabledModules) {
      try {
        await this.runtime.loadModule(moduleName, `./modules/${moduleName}`, 'js');
      } catch (error) {
        console.warn(`⚠️ Failed to load module "${moduleName}":`, error);
      }
    }
  }

  /**
   * Exécute les middlewares
   */
  private async executeMiddlewares(
    phase: 'before' | 'after' | 'error',
    context: any
  ): Promise<void> {
    if (!this.config.middlewares) return;

    for (const middleware of this.config.middlewares) {
      try {
        await middleware.execute(context, async () => Promise.resolve());
      } catch (error) {
        console.warn(`⚠️ Middleware "${middleware.name}" failed in ${phase} phase:`, error);
      }
    }
  }

  /**
   * Exécute les hooks d'initialisation
   */
  private async runInitHooks(): Promise<void> {
    // Hooks personnalisés peuvent être ajoutés ici
    if (this.config.debug) {
      console.log('🔧 Running initialization hooks...');
    }
  }

  /**
   * Exécute les hooks de destruction
   */
  private async runDestroyHooks(): Promise<void> {
    // Hooks personnalisés peuvent être ajoutés ici
    if (this.config.debug) {
      console.log('🔧 Running destruction hooks...');
    }
  }

  /**
   * Expose l'instance globalement
   */
  private exposeGlobally(): void {
    if (typeof window !== 'undefined') {
      (window as any).enterprise = this;
    }

    if (typeof globalThis !== 'undefined') {
      (globalThis as any).enterprise = this;
    }
  }

  /**
   * Génère un ID de session unique
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Vérifie que le SDK est initialisé
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized. Call enterprise.init() first.');
    }
  }
}

// Factory function pour créer une instance
export async function createEnterprise(config?: UnifiedSDKConfig): Promise<UnifiedEnterpriseSDK> {
  const sdk = new UnifiedEnterpriseSDK(config);
  await sdk.init();
  return sdk;
}

// Instance singleton par défaut
const enterprise = UnifiedEnterpriseSDK.getInstance();

export { enterprise };
export default enterprise;
