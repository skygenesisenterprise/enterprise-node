/**
 * @fileoverview Advanced Configuration System for Enterprise SDK
 * Similaire à next.config.js ou vite.config.ts avec helpers et validation
 */

import type { EnterpriseConfig, BrandingConfig, LogoConfig } from './types';

/**
 * Options de configuration avancées
 */
export interface EnterpriseConfigOptions {
  /** Environnement cible */
  env?: 'development' | 'production' | 'test';
  /** Répertoire de base */
  baseDir?: string;
  /** Configuration personnalisée des modules */
  moduleConfig?: Record<string, any>;
  /** Plugins à charger */
  plugins?: EnterprisePlugin[];
  /** Hooks de cycle de vie */
  hooks?: EnterpriseHooks;
  /** Configuration des middlewares */
  middlewares?: MiddlewareConfig[];
}

/**
 * Interface pour les plugins Enterprise
 */
export interface EnterprisePlugin {
  /** Nom du plugin */
  name: string;
  /** Version du plugin */
  version: string;
  /** Fonction d'initialisation du plugin */
  setup: (config: EnterpriseConfig) => EnterpriseConfig;
  /** Dépendances du plugin */
  dependencies?: string[];
}

/**
 * Hooks de cycle de vie
 */
export interface EnterpriseHooks {
  /** Avant l'initialisation */
  beforeInit?: (config: EnterpriseConfig) => Promise<void>;
  /** Après l'initialisation */
  afterInit?: (instance: any) => Promise<void>;
  /** Avant la destruction */
  beforeDestroy?: () => Promise<void>;
  /** Après la destruction */
  afterDestroy?: () => Promise<void>;
}

/**
 * Configuration des middlewares
 */
export interface MiddlewareConfig {
  /** Nom du middleware */
  name: string;
  /** Configuration du middleware */
  config?: Record<string, any>;
  /** Ordre d'exécution */
  order?: number;
}

/**
 * Presets de configuration
 */
export interface ConfigPreset {
  /** Nom du preset */
  name: string;
  /** Description du preset */
  description: string;
  /** Configuration du preset */
  config: Partial<EnterpriseConfig>;
  /** Tags pour la recherche */
  tags?: string[];
}

/**
 * Classe de configuration avec helpers
 */
export class EnterpriseConfigBuilder {
  private config: Partial<EnterpriseConfig> = {};
  private options: EnterpriseConfigOptions = {};

  constructor(options?: EnterpriseConfigOptions) {
    this.options = options || {};
  }

  /**
   * Configure les modules avec auto-complétion
   * @example
   * ```typescript
   * builder
   *   .enableModules(['ai', 'storage'])
   *   .configureModule('ai', { model: 'gpt-4' })
   * ```
   */
  enableModules(modules: Array<'ai' | 'storage' | 'ui' | 'auth' | 'project' | 'sdk'>): this {
    this.config.modules = {};
    modules.forEach((module) => {
      this.config.modules![module] = true;
    });
    return this;
  }

  /**
   * Désactive des modules spécifiques
   */
  disableModules(modules: Array<'ai' | 'storage' | 'ui' | 'auth' | 'project' | 'sdk'>): this {
    if (!this.config.modules) this.config.modules = {};
    modules.forEach((module) => {
      this.config.modules![module] = false;
    });
    return this;
  }

  /**
   * Configure un module spécifique
   */
  configureModule(module: string, config: any): this {
    if (!this.options.moduleConfig) this.options.moduleConfig = {};
    this.options.moduleConfig[module] = config;
    return this;
  }

  /**
   * Configure le runtime WebAssembly
   */
  setRuntime(options: {
    wasmPath?: string;
    enableWasm?: boolean;
    customSettings?: Record<string, any>;
  }): this {
    this.config.runtime = {
      wasmPath: options.wasmPath || '/wasm/euse_core.wasm',
      enableWasm: options.enableWasm ?? true,
      ...options.customSettings,
    };
    return this;
  }

  /**
   * Définit le framework cible
   */
  setFramework(framework: 'react' | 'svelte' | 'nextjs' | 'auto'): this {
    this.config.framework = framework;
    return this;
  }

  /**
   * Active le mode debug
   */
  enableDebug(enabled: boolean = true): this {
    this.config.debug = enabled;
    return this;
  }

  /**
   * Configure l'identité visuelle (branding)
   */
  setBranding(branding: Partial<BrandingConfig>): this {
    this.config.branding = {
      ...this.config.branding,
      ...branding,
    };
    return this;
  }

  /**
   * Configure le logo avec helper
   */
  setLogo(options: {
    path: string;
    width?: number;
    height?: number;
    alt?: string;
    format?: 'png' | 'svg' | 'jpg' | 'jpeg' | 'webp';
  }): this {
    if (!this.config.branding) this.config.branding = {};
    this.config.branding.logo = options;
    return this;
  }

  /**
   * Configure les couleurs du thème
   */
  setColors(options: {
    primary?: string;
    secondary?: string;
    theme?: 'light' | 'dark' | 'auto';
  }): this {
    if (!this.config.branding) this.config.branding = {};
    Object.assign(this.config.branding, options);
    return this;
  }

  /**
   * Ajoute un plugin
   */
  addPlugin(plugin: EnterprisePlugin): this {
    if (!this.options.plugins) this.options.plugins = [];
    this.options.plugins.push(plugin);
    return this;
  }

  /**
   * Configure les hooks de cycle de vie
   */
  setHooks(hooks: EnterpriseHooks): this {
    this.options.hooks = hooks;
    return this;
  }

  /**
   * Ajoute un middleware
   */
  addMiddleware(middleware: MiddlewareConfig): this {
    if (!this.options.middlewares) this.options.middlewares = [];
    this.options.middlewares.push(middleware);
    return this;
  }

  /**
   * Applique un preset de configuration
   */
  applyPreset(preset: ConfigPreset): this {
    this.config = { ...this.config, ...preset.config };
    return this;
  }

  /**
   * Construit la configuration finale
   */
  build(): EnterpriseConfig & { _options?: EnterpriseConfigOptions } {
    const finalConfig: EnterpriseConfig = {
      modules: {
        ai: true,
        storage: true,
        ui: true,
        auth: true,
        project: true,
        sdk: true,
        ...this.config.modules,
      },
      runtime: {
        wasmPath: '/wasm/euse_core.wasm',
        enableWasm: true,
        ...this.config.runtime,
      },
      framework: this.config.framework || 'auto',
      debug: this.config.debug || false,
      branding: this.config.branding,
    };

    // Ajouter les options en interne
    if (Object.keys(this.options).length > 0) {
      (finalConfig as any)._options = this.options;
    }

    return finalConfig;
  }

  /**
   * Clone le builder pour créer des variations
   */
  clone(): EnterpriseConfigBuilder {
    const newBuilder = new EnterpriseConfigBuilder(this.options);
    newBuilder.config = { ...this.config };
    return newBuilder;
  }
}

/**
 * Presets de configuration prédéfinis
 */
export const ConfigPresets: Record<string, ConfigPreset> = {
  /**
   * Configuration minimale pour démarrer rapidement
   */
  minimal: {
    name: 'minimal',
    description: 'Configuration minimale avec seulement les modules essentiels',
    tags: ['minimal', 'starter', 'basic'],
    config: {
      modules: {
        ai: true,
        storage: true,
        ui: false,
        auth: false,
        project: false,
        sdk: false,
      },
      debug: false,
      framework: 'auto',
    },
  },

  /**
   * Configuration complète pour les projets d'entreprise
   */
  fullstack: {
    name: 'fullstack',
    description: 'Configuration complète pour applications full-stack',
    tags: ['fullstack', 'enterprise', 'complete'],
    config: {
      modules: {
        ai: true,
        storage: true,
        ui: true,
        auth: true,
        project: true,
        sdk: true,
      },
      runtime: {
        wasmPath: '/wasm/euse_core.wasm',
        enableWasm: true,
      },
      framework: 'nextjs',
      debug: false,
      branding: {
        theme: 'auto',
      },
    },
  },

  /**
   * Configuration optimisée pour l'IA et le Machine Learning
   */
  aiFirst: {
    name: 'ai-first',
    description: 'Configuration optimisée pour les applications IA',
    tags: ['ai', 'machine-learning', 'ml'],
    config: {
      modules: {
        ai: true,
        storage: true,
        ui: true,
        auth: false,
        project: false,
        sdk: true,
      },
      runtime: {
        wasmPath: '/wasm/euse_core.wasm',
        enableWasm: true,
      },
      framework: 'react',
      debug: true,
    },
  },

  /**
   * Configuration pour le développement
   */
  development: {
    name: 'development',
    description: 'Configuration optimisée pour le développement',
    tags: ['development', 'dev', 'debug'],
    config: {
      modules: {
        ai: true,
        storage: true,
        ui: true,
        auth: true,
        project: true,
        sdk: true,
      },
      runtime: {
        wasmPath: '/wasm/euse_core.wasm',
        enableWasm: true,
      },
      framework: 'auto',
      debug: true,
    },
  },

  /**
   * Configuration pour la production
   */
  production: {
    name: 'production',
    description: 'Configuration optimisée pour la production',
    tags: ['production', 'prod', 'optimized'],
    config: {
      modules: {
        ai: true,
        storage: true,
        ui: true,
        auth: true,
        project: true,
        sdk: false,
      },
      runtime: {
        wasmPath: '/wasm/euse_core.wasm',
        enableWasm: true,
      },
      framework: 'nextjs',
      debug: false,
    },
  },
};

/**
 * Fonctions helpers pour créer rapidement des configurations
 */
export const createConfig = {
  /**
   * Crée une configuration minimale
   */
  minimal: () => new EnterpriseConfigBuilder().applyPreset(ConfigPresets.minimal),

  /**
   * Crée une configuration complète
   */
  fullstack: () => new EnterpriseConfigBuilder().applyPreset(ConfigPresets.fullstack),

  /**
   * Crée une configuration orientée IA
   */
  aiFirst: () => new EnterpriseConfigBuilder().applyPreset(ConfigPresets.aiFirst),

  /**
   * Crée une configuration de développement
   */
  development: () => new EnterpriseConfigBuilder().applyPreset(ConfigPresets.development),

  /**
   * Crée une configuration de production
   */
  production: () => new EnterpriseConfigBuilder().applyPreset(ConfigPresets.production),

  /**
   * Crée une configuration personnalisée
   */
  custom: (options?: EnterpriseConfigOptions) => new EnterpriseConfigBuilder(options),
};

/**
 * Valide une configuration
 */
export function validateConfig(config: EnterpriseConfig): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation des modules
  if (!config.modules || Object.keys(config.modules).length === 0) {
    errors.push('Au moins un module doit être activé');
  }

  // Validation du runtime
  if (config.runtime?.enableWasm && !config.runtime?.wasmPath) {
    warnings.push("WebAssembly est activé mais aucun chemin WASM n'est spécifié");
  }

  // Validation du branding
  if (config.branding?.logo && !config.branding.logo.path) {
    errors.push('Le chemin du logo est requis si un logo est configuré');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Fusionne plusieurs configurations
 */
export function mergeConfigs(...configs: Partial<EnterpriseConfig>[]): Partial<EnterpriseConfig> {
  return configs.reduce(
    (merged, config) => ({
      ...merged,
      ...config,
      modules: { ...merged.modules, ...config.modules },
      runtime: { ...merged.runtime, ...config.runtime },
      branding: { ...merged.branding, ...config.branding },
    }),
    {} as Partial<EnterpriseConfig>
  );
}

export default EnterpriseConfigBuilder;
