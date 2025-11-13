/**
 * @fileoverview Configuration simplifiée des modules avec presets intégrés
 * Système de paramètres facilités pour EnterpriseConfig
 */

import { EnterpriseConfig } from './types';

// ========================================
// CONFIGURATION SIMPLIFIÉE PAR MODULE
// ========================================

export interface SimpleModuleConfig {
  /** Activer le module avec configuration automatique */
  enabled?: boolean;
  /** Preset de configuration rapide */
  preset?: string;
  /** Options personnalisées */
  options?: Record<string, any>;
}

export interface SimpleAIConfig extends SimpleModuleConfig {
  enabled?: boolean;
  preset?: 'fast' | 'balanced' | 'premium' | 'custom';
  options?: {
    /** Modèle par défaut */
    model?: string;
    /** Qualité de traitement */
    quality?: 'fast' | 'good' | 'best';
    /** Mode de génération */
    mode?: 'auto' | 'creative' | 'precise';
    /** Limite de tokens */
    maxTokens?: number;
  };
}

export interface SimpleStorageConfig extends SimpleModuleConfig {
  enabled?: boolean;
  preset?: 'basic' | 'optimized' | 'secure' | 'custom';
  options?: {
    /** Espace de stockage (en MB) */
    quota?: number;
    /** Niveau de sécurité */
    security?: 'public' | 'private' | 'encrypted';
    /** Compression automatique */
    compression?: boolean;
    /** Cache activé */
    cache?: boolean;
  };
}

export interface SimpleAuthConfig extends SimpleModuleConfig {
  enabled?: boolean;
  preset?: 'simple' | 'secure' | 'enterprise' | 'custom';
  options?: {
    /** Fournisseur d'auth */
    provider?: 'local' | 'oauth' | 'saml';
    /** Durée de session */
    sessionDuration?: 'hour' | 'day' | 'week' | 'month';
    /** Vérification email requise */
    emailVerification?: boolean;
    /** Authentification multi-facteurs */
    mfa?: boolean;
  };
}

export interface SimpleUIConfig extends SimpleModuleConfig {
  enabled?: boolean;
  preset?: 'minimal' | 'modern' | 'classic' | 'custom';
  options?: {
    /** Thème principal */
    theme?: 'light' | 'dark' | 'auto';
    /** Style visuel */
    style?: 'minimal' | 'modern' | 'classic';
    /** Animations */
    animations?: boolean;
    /** Personnalisation avancée */
    branding?: {
      logo?: string;
      primaryColor?: string;
      fontFamily?: string;
    };
  };
}

export interface SimpleProjectConfig extends SimpleModuleConfig {
  enabled?: boolean;
  preset?: 'starter' | 'professional' | 'enterprise' | 'custom';
  options?: {
    /** Type de projet par défaut */
    defaultType?: 'web' | 'mobile' | 'desktop' | 'api';
    /** Template par défaut */
    defaultTemplate?: string;
    /** Gestion des tâches */
    taskManagement?: boolean;
    /** Collaboration */
    collaboration?: boolean;
  };
}

// ========================================
// CONFIGURATION GLOBALE SIMPLIFIÉE
// ========================================

export interface SimpleEnterpriseConfig {
  /** Mode de fonctionnement global */
  mode?: 'development' | 'production' | 'testing';
  /** Niveau de logging */
  logLevel?: 'none' | 'error' | 'warn' | 'info' | 'debug';
  /** Framework cible */
  framework?: 'auto' | 'react' | 'vue' | 'svelte' | 'angular';
  /** Configuration des modules */
  modules?: {
    ai?: SimpleAIConfig | boolean;
    storage?: SimpleStorageConfig | boolean;
    auth?: SimpleAuthConfig | boolean;
    ui?: SimpleUIConfig | boolean;
    project?: SimpleProjectConfig | boolean;
  };
  /** Configuration du runtime */
  runtime?: {
    /** Activer WebAssembly */
    wasm?: boolean;
    /** Mode de performance */
    performance?: 'fast' | 'balanced' | 'compatible';
  };
  /** Branding global */
  branding?: {
    /** Nom de l'application */
    appName?: string;
    /** Logo */
    logo?: string;
    /** Couleurs */
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
  };
}

// ========================================
// PRESETS DE CONFIGURATION GLOBALE
// ========================================

export interface ConfigPreset {
  name: string;
  description: string;
  config: SimpleEnterpriseConfig;
}

export const CONFIG_PRESETS: Record<string, ConfigPreset> = {
  // Preset pour démarrage rapide
  quickstart: {
    name: 'Quick Start',
    description: 'Configuration minimale pour démarrer rapidement',
    config: {
      mode: 'development',
      logLevel: 'info',
      framework: 'auto',
      modules: {
        ai: { enabled: true, preset: 'fast' },
        storage: { enabled: true, preset: 'basic' },
        auth: { enabled: false },
        ui: { enabled: true, preset: 'minimal' },
        project: { enabled: false },
      },
      runtime: {
        wasm: true,
        performance: 'balanced',
      },
    },
  },

  // Preset pour application web complète
  webapp: {
    name: 'Web Application',
    description: 'Configuration complète pour application web moderne',
    config: {
      mode: 'production',
      logLevel: 'warn',
      framework: 'react',
      modules: {
        ai: { enabled: true, preset: 'balanced' },
        storage: { enabled: true, preset: 'optimized' },
        auth: { enabled: true, preset: 'secure' },
        ui: { enabled: true, preset: 'modern' },
        project: { enabled: true, preset: 'professional' },
      },
      runtime: {
        wasm: true,
        performance: 'fast',
      },
      branding: {
        appName: 'My Enterprise App',
        colors: {
          primary: '#007acc',
          secondary: '#004466',
        },
      },
    },
  },

  // Preset pour API backend
  api: {
    name: 'API Backend',
    description: 'Configuration optimisée pour serveur API',
    config: {
      mode: 'production',
      logLevel: 'error',
      framework: 'auto',
      modules: {
        ai: { enabled: true, preset: 'premium' },
        storage: { enabled: true, preset: 'secure' },
        auth: { enabled: true, preset: 'enterprise' },
        ui: { enabled: false },
        project: { enabled: false },
      },
      runtime: {
        wasm: false,
        performance: 'fast',
      },
    },
  },

  // Preset pour développement
  development: {
    name: 'Development',
    description: 'Configuration complète avec debug activé',
    config: {
      mode: 'development',
      logLevel: 'debug',
      framework: 'auto',
      modules: {
        ai: { enabled: true, preset: 'balanced' },
        storage: { enabled: true, preset: 'basic' },
        auth: { enabled: true, preset: 'simple' },
        ui: { enabled: true, preset: 'modern' },
        project: { enabled: true, preset: 'starter' },
      },
      runtime: {
        wasm: true,
        performance: 'balanced',
      },
    },
  },

  // Preset minimal
  minimal: {
    name: 'Minimal',
    description: 'Configuration ultra-légère',
    config: {
      mode: 'production',
      logLevel: 'error',
      framework: 'auto',
      modules: {
        ai: false,
        storage: { enabled: true, preset: 'basic' },
        auth: false,
        ui: false,
        project: false,
      },
      runtime: {
        wasm: false,
        performance: 'compatible',
      },
    },
  },
};

// ========================================
// FONCTIONS DE CONSTRUCTION
// ========================================

/**
 * Crée une configuration Enterprise à partir d'une configuration simplifiée
 */
export function buildEnterpriseConfig(simple: SimpleEnterpriseConfig): EnterpriseConfig {
  const config: EnterpriseConfig = {
    modules: {},
    runtime: {
      wasmPath: '/wasm',
      enableWasm: simple.runtime?.wasm ?? true,
    },
    framework: simple.framework === 'auto' ? undefined : (simple.framework as any),
    debug: simple.mode === 'development',
    branding: simple.branding
      ? {
          companyName: simple.branding.appName,
          primaryColor: simple.branding.colors?.primary,
          secondaryColor: simple.branding.colors?.secondary,
          theme: 'auto',
        }
      : undefined,
  };

  // Traitement des modules
  if (simple.modules) {
    // Module AI
    if (simple.modules.ai) {
      if (typeof simple.modules.ai === 'boolean') {
        config.modules.ai = simple.modules.ai;
      } else {
        config.modules.ai = simple.modules.ai.enabled ?? true;
      }
    }

    // Module Storage
    if (simple.modules.storage) {
      if (typeof simple.modules.storage === 'boolean') {
        config.modules.storage = simple.modules.storage;
      } else {
        config.modules.storage = simple.modules.storage.enabled ?? true;
      }
    }

    // Module Auth
    if (simple.modules.auth) {
      if (typeof simple.modules.auth === 'boolean') {
        config.modules.auth = simple.modules.auth;
      } else {
        config.modules.auth = simple.modules.auth.enabled ?? true;
      }
    }

    // Module UI
    if (simple.modules.ui) {
      if (typeof simple.modules.ui === 'boolean') {
        config.modules.ui = simple.modules.ui;
      } else {
        config.modules.ui = simple.modules.ui.enabled ?? true;
      }
    }

    // Module Project
    if (simple.modules.project) {
      if (typeof simple.modules.project === 'boolean') {
        config.modules.project = simple.modules.project;
      } else {
        config.modules.project = simple.modules.project.enabled ?? true;
      }
    }
  }

  return config;
}

/**
 * Crée une configuration à partir d'un preset
 */
export function createConfigFromPreset(presetName: string): EnterpriseConfig {
  const preset = CONFIG_PRESETS[presetName];
  if (!preset) {
    throw new Error(
      `Preset "${presetName}" not found. Available presets: ${Object.keys(CONFIG_PRESETS).join(', ')}`
    );
  }

  return buildEnterpriseConfig(preset.config);
}

/**
 * Crée une configuration avec surcharges
 */
export function createConfig(
  basePreset?: string,
  overrides?: SimpleEnterpriseConfig
): EnterpriseConfig {
  let baseConfig: SimpleEnterpriseConfig = {};

  if (basePreset) {
    const preset = CONFIG_PRESETS[basePreset];
    if (!preset) {
      throw new Error(`Preset "${basePreset}" not found`);
    }
    baseConfig = preset.config;
  }

  // Fusionner la configuration de base avec les surcharges
  const mergedConfig: SimpleEnterpriseConfig = {
    ...baseConfig,
    ...overrides,
    modules: {
      ...baseConfig.modules,
      ...overrides?.modules,
    },
  };

  return buildEnterpriseConfig(mergedConfig);
}

/**
 * Liste tous les presets disponibles
 */
export function listPresets(): Array<{ name: string; description: string }> {
  return Object.entries(CONFIG_PRESETS).map(([key, preset]) => ({
    name: key,
    description: preset.description,
  }));
}

/**
 * Valide une configuration simplifiée
 */
export function validateSimpleConfig(config: SimpleEnterpriseConfig): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation du mode
  if (config.mode && !['development', 'production', 'testing'].includes(config.mode)) {
    errors.push(`Invalid mode: ${config.mode}`);
  }

  // Validation du framework
  if (
    config.framework &&
    !['auto', 'react', 'vue', 'svelte', 'angular'].includes(config.framework)
  ) {
    errors.push(`Invalid framework: ${config.framework}`);
  }

  // Validation des modules
  if (config.modules) {
    Object.entries(config.modules).forEach(([moduleName, moduleConfig]) => {
      if (moduleConfig && typeof moduleConfig === 'object' && 'preset' in moduleConfig) {
        const presets = {
          ai: ['fast', 'balanced', 'premium', 'custom'],
          storage: ['basic', 'optimized', 'secure', 'custom'],
          auth: ['simple', 'secure', 'enterprise', 'custom'],
          ui: ['minimal', 'modern', 'classic', 'custom'],
          project: ['starter', 'professional', 'enterprise', 'custom'],
        };

        const modulePresets = presets[moduleName as keyof typeof presets];
        if (modulePresets && !modulePresets.includes((moduleConfig as any).preset)) {
          warnings.push(
            `Unknown preset "${(moduleConfig as any).preset}" for module "${moduleName}"`
          );
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
