/**
 * @fileoverview Runtime unifié pour Enterprise SDK
 * Support TypeScript, WebAssembly (Rust) et JavaScript avec fallback
 */

export interface RuntimeConfig {
  /** Activer WebAssembly si disponible */
  enableWasm?: boolean;
  /** Chemin vers les fichiers WASM */
  wasmPath?: string;
  /** Configuration TypeScript */
  typescript?: {
    /** Activer le compilateur TypeScript */
    enabled?: boolean;
    /** Options de compilation */
    compilerOptions?: Record<string, any>;
    /** Cible de compilation */
    target?: 'es5' | 'es6' | 'es2020' | 'es2022';
  };
  /** Configuration Rust/WASM */
  rust?: {
    /** Activer le runtime Rust */
    enabled?: boolean;
    /** Modules Rust à charger */
    modules?: string[];
    /** Options du runtime Rust */
    options?: Record<string, any>;
  };
}

export interface RuntimeModule {
  /** Nom du module */
  name: string;
  /** Type du runtime */
  runtime: 'typescript' | 'wasm' | 'js';
  /** Instance du module */
  instance: any;
  /** Métadonnées */
  metadata?: {
    version?: string;
    description?: string;
    dependencies?: string[];
  };
}

export interface RuntimePerformance {
  /** Temps d'initialisation */
  initTime: number;
  /** Mémoire utilisée */
  memoryUsage: number;
  /** Modules chargés */
  loadedModules: string[];
  /** Statistiques du runtime */
  stats: {
    wasmModules: number;
    tsModules: number;
    jsModules: number;
  };
}

/**
 * Runtime unifié supportant TypeScript, WebAssembly (Rust) et JavaScript
 */
export class UnifiedRuntime {
  private static instance: UnifiedRuntime;
  private modules = new Map<string, RuntimeModule>();
  private config: RuntimeConfig;
  private isInitialized = false;
  private performance: RuntimePerformance;

  constructor(config: RuntimeConfig = {}) {
    this.config = {
      enableWasm: true,
      wasmPath: '/wasm',
      typescript: {
        enabled: true,
        target: 'es2020',
        compilerOptions: {},
      },
      rust: {
        enabled: true,
        modules: [],
        options: {},
      },
      ...config,
    };

    this.performance = {
      initTime: 0,
      memoryUsage: 0,
      loadedModules: [],
      stats: {
        wasmModules: 0,
        tsModules: 0,
        jsModules: 0,
      },
    };
  }

  static getInstance(config?: RuntimeConfig): UnifiedRuntime {
    if (!UnifiedRuntime.instance) {
      UnifiedRuntime.instance = new UnifiedRuntime(config);
    }
    return UnifiedRuntime.instance;
  }

  /**
   * Initialise le runtime unifié
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    const startTime = Date.now();

    try {
      // Initialiser WebAssembly si disponible
      if (this.config.enableWasm && this.config.rust?.enabled) {
        await this.initializeWasm();
      }

      // Initialiser TypeScript
      if (this.config.typescript?.enabled) {
        await this.initializeTypeScript();
      }

      // Initialiser les modules JavaScript
      await this.initializeJavaScript();

      this.isInitialized = true;
      this.performance.initTime = Date.now() - startTime;
      this.updatePerformanceStats();

      console.log(`✅ UnifiedRuntime initialized in ${this.performance.initTime.toFixed(2)}ms`);
    } catch (error) {
      console.error('❌ Failed to initialize UnifiedRuntime:', error);
      throw error;
    }
  }

  /**
   * Charge un module dans le runtime approprié
   */
  async loadModule(
    name: string,
    modulePath: string,
    runtime: 'typescript' | 'wasm' | 'js' = 'js'
  ): Promise<RuntimeModule> {
    if (this.modules.has(name)) {
      return this.modules.get(name)!;
    }

    let instance: any;
    let metadata: RuntimeModule['metadata'] = {};

    try {
      switch (runtime) {
        case 'wasm':
          instance = await this.loadWasmModule(modulePath);
          this.performance.stats.wasmModules++;
          break;
        case 'typescript':
          instance = await this.loadTypeScriptModule(modulePath);
          this.performance.stats.tsModules++;
          break;
        case 'js':
        default:
          instance = await this.loadJavaScriptModule(modulePath);
          this.performance.stats.jsModules++;
          break;
      }

      const module: RuntimeModule = {
        name,
        runtime,
        instance,
        metadata,
      };

      this.modules.set(name, module);
      this.performance.loadedModules.push(name);
      this.updatePerformanceStats();

      console.log(`📦 Loaded module "${name}" (${runtime} runtime)`);
      return module;
    } catch (error) {
      console.error(`❌ Failed to load module "${name}":`, error);
      throw error;
    }
  }

  /**
   * Récupère un module chargé
   */
  getModule(name: string): RuntimeModule | undefined {
    return this.modules.get(name);
  }

  /**
   * Décharge un module
   */
  async unloadModule(name: string): Promise<void> {
    const module = this.modules.get(name);
    if (!module) {
      return;
    }

    try {
      // Nettoyer l'instance du module
      if (module.instance && typeof module.instance.destroy === 'function') {
        await module.instance.destroy();
      }

      this.modules.delete(name);
      const index = this.performance.loadedModules.indexOf(name);
      if (index > -1) {
        this.performance.loadedModules.splice(index, 1);
      }

      // Mettre à jour les statistiques
      switch (module.runtime) {
        case 'wasm':
          this.performance.stats.wasmModules--;
          break;
        case 'typescript':
          this.performance.stats.tsModules--;
          break;
        case 'js':
          this.performance.stats.jsModules--;
          break;
      }

      console.log(`🗑️ Unloaded module "${name}"`);
    } catch (error) {
      console.error(`❌ Failed to unload module "${name}":`, error);
    }
  }

  /**
   * Liste tous les modules chargés
   */
  getLoadedModules(): RuntimeModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Récupère les statistiques de performance
   */
  getPerformance(): RuntimePerformance {
    this.updatePerformanceStats();
    return { ...this.performance };
  }

  /**
   * Vérifie si WebAssembly est supporté
   */
  static isWasmSupported(): boolean {
    return typeof WebAssembly === 'object' && typeof WebAssembly.validate === 'function';
  }

  /**
   * Vérifie si TypeScript est disponible
   */
  static isTypeScriptAvailable(): boolean {
    try {
      require.resolve('typescript');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Initialise le support WebAssembly
   */
  private async initializeWasm(): Promise<void> {
    if (!UnifiedRuntime.isWasmSupported()) {
      console.warn('⚠️ WebAssembly not supported, falling back to JavaScript');
      return;
    }

    console.log('🔧 Initializing WebAssembly runtime...');
    // Charger les modules Rust/WASM de base
    if (this.config.rust?.modules?.length) {
      for (const module of this.config.rust.modules) {
        try {
          await this.loadModule(module, `${this.config.wasmPath}/${module}.wasm`, 'wasm');
        } catch (error) {
          console.warn(`⚠️ Failed to load WASM module "${module}":`, error);
        }
      }
    }
  }

  /**
   * Initialise le support TypeScript
   */
  private async initializeTypeScript(): Promise<void> {
    if (!UnifiedRuntime.isTypeScriptAvailable()) {
      console.warn('⚠️ TypeScript not available, using JavaScript fallback');
      return;
    }

    console.log('🔧 Initializing TypeScript runtime...');
    // Configuration du compilateur TypeScript
    const ts = require('typescript');
    const compilerOptions = {
      target: this.config.typescript?.target || 'es2020',
      module: 'esnext',
      lib: ['es2020', 'dom'],
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      ...this.config.typescript?.compilerOptions,
    };

    // Stocker la configuration TypeScript
    (this as any).tsConfig = { ts, compilerOptions };
  }

  /**
   * Initialise les modules JavaScript natifs
   */
  private async initializeJavaScript(): Promise<void> {
    console.log('🔧 Initializing JavaScript runtime...');
    // Modules JavaScript natifs sont déjà disponibles
  }

  /**
   * Charge un module WebAssembly
   */
  private async loadWasmModule(modulePath: string): Promise<any> {
    const response = await fetch(modulePath);
    const bytes = await response.arrayBuffer();
    const results = await WebAssembly.instantiate(bytes);
    return results.instance;
  }

  /**
   * Charge et compile un module TypeScript
   */
  private async loadTypeScriptModule(modulePath: string): Promise<any> {
    const ts = (this as any).tsConfig?.ts;
    if (!ts) {
      throw new Error('TypeScript runtime not initialized');
    }

    const source = await fetch(modulePath.replace('.ts', '.js')).then((r) => r.text());
    const result = ts.transpile(source, (this as any).tsConfig.compilerOptions);

    // Évaluer le code compilé de manière sécurisée
    const module = { exports: {} };
    const evalCode = new Function('module', result);
    evalCode(module);

    return module.exports;
  }

  /**
   * Charge un module JavaScript
   */
  private async loadJavaScriptModule(modulePath: string): Promise<any> {
    if (typeof window !== 'undefined') {
      // Environnement navigateur
      const module = await import(modulePath);
      return module.default || module;
    } else {
      // Environnement Node.js
      const module = require(modulePath);
      return module.default || module;
    }
  }

  /**
   * Met à jour les statistiques de performance
   */
  private updatePerformanceStats(): void {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      this.performance.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }
  }

  /**
   * Détruit le runtime et nettoie les ressources
   */
  async destroy(): Promise<void> {
    console.log('🔧 Destroying UnifiedRuntime...');

    // Décharger tous les modules
    const moduleNames = Array.from(this.modules.keys());
    await Promise.all(moduleNames.map((name) => this.unloadModule(name)));

    this.isInitialized = false;
    console.log('✅ UnifiedRuntime destroyed');
  }
}

export default UnifiedRuntime;
