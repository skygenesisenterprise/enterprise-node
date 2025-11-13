/**
 * @fileoverview Exemples d'utilisation et documentation des paramètres simplifiés
 */

import {
  createConfigFromPreset,
  createConfig,
  buildEnterpriseConfig,
  listPresets,
  type SimpleEnterpriseConfig,
} from '../src/config-simple';

// ========================================
// EXEMPLES D'UTILISATION
// ========================================

/**
 * EXEMPLE 1: Démarrage ultra-rapide avec preset
 *
 * Le plus simple pour commencer :
 */
export function quickStartExample() {
  // Import unique
  // import { createConfigFromPreset } from '@skygenesisenterprise/enterprise-node';

  // Configuration instantanée
  const config = createConfigFromPreset('quickstart');

  // Utilisation
  console.log('Configuration rapide:', config);
  return config;
}

/**
 * EXEMPLE 2: Application web complète
 *
 * Configuration riche avec branding personnalisé :
 */
export function webAppExample() {
  // import { createConfig } from '@skygenesisenterprise/enterprise-node';

  const config = createConfig('webapp', {
    branding: {
      appName: 'Mon Application',
      colors: {
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#f59e0b',
      },
    },
    modules: {
      ai: {
        preset: 'premium',
        options: {
          model: 'gpt-4',
          maxTokens: 2000,
          quality: 'best',
        },
      },
      storage: { 
        preset: 'secure',
        options: { 
          quota: 1000, // 1GB
          security: 'encrypted'
        }
      },
      },
      auth: { 
        preset: 'enterprise',
        options: { 
          mfa: true,
          sessionDuration: 'week'
        }
      }
    }
  });
  
  return config;
}

/**
 * EXEMPLE 3: Configuration minimale pour API
 * 
 * Optimisée pour backend sans UI :
 */
export function apiExample() {
  // import { createConfigFromPreset } from '@skygenesisenterprise/enterprise-node';

  const config = createConfigFromPreset('api');

  // Personnalisation légère
  const customConfig = createConfig('api', {
    modules: {
      ai: {
        preset: 'premium',
        options: {
          model: 'claude-3',
          maxTokens: 4000,
        },
      },
    },
    runtime: {
      wasm: false, // Désactiver WASM pour serveur
      performance: 'fast',
    },
  });

  return customConfig;
}

/**
 * EXEMPLE 4: Configuration manuelle complète
 *
 * Contrôle total sur chaque paramètre :
 */
export function manualConfigExample() {
  import { buildEnterpriseConfig } from '@skygenesisenterprise/enterprise-node';

  const simpleConfig: SimpleEnterpriseConfig = {
    mode: 'production',
    logLevel: 'warn',
    framework: 'react',
    modules: {
      ai: {
        enabled: true,
        preset: 'custom',
        options: {
          model: 'custom-model',
          quality: 'best',
          mode: 'precise',
          maxTokens: 3000,
        },
      },
      storage: {
        enabled: true,
        preset: 'custom',
        options: {
          quota: 5000,
          security: 'encrypted',
          compression: true,
          cache: true,
        },
      },
      auth: {
        enabled: true,
        preset: 'custom',
        options: {
          provider: 'saml',
          sessionDuration: 'month',
          emailVerification: true,
          mfa: true,
        },
      },
      ui: {
        enabled: true,
        preset: 'custom',
        options: {
          theme: 'dark',
          style: 'modern',
          animations: true,
          branding: {
            logo: '/assets/logo.svg',
            primaryColor: '#8b5cf6',
            fontFamily: 'Inter',
          },
        },
      },
      project: false, // Désactivé
    },
    runtime: {
      wasm: true,
      performance: 'fast',
    },
    branding: {
      appName: 'Enterprise Platform',
      logo: '/assets/enterprise-logo.png',
      colors: {
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        accent: '#ec4899',
      },
    },
  };

  return buildEnterpriseConfig(simpleConfig);
}

/**
 * EXEMPLE 5: Configuration dynamique
 *
 * Adaptation selon l'environnement :
 */
export function dynamicConfigExample() {
  import { createConfig } from '@skygenesisenterprise/enterprise-node';

  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  const basePreset = isDevelopment ? 'development' : 'production';

  const config = createConfig(basePreset, {
    mode: isDevelopment ? 'development' : 'production',
    logLevel: isDevelopment ? 'debug' : 'error',

    modules: {
      ai: {
        preset: isDevelopment ? 'fast' : 'premium',
        options: {
          maxTokens: isDevelopment ? 500 : 2000,
        },
      },
      storage: {
        preset: isDevelopment ? 'basic' : 'secure',
      },
      auth: {
        preset: isDevelopment ? 'simple' : 'enterprise',
      },
      ui: {
        preset: 'modern',
        options: {
          theme: isDevelopment ? 'light' : 'auto',
          animations: isDevelopment,
        },
      },
    },

    runtime: {
      wasm: !isProduction, // WASM en dev uniquement
      performance: isDevelopment ? 'balanced' : 'fast',
    },
  });

  return config;
}

/**
 * EXEMPLE 6: Validation de configuration
 *
 * Vérification avant utilisation :
 */
export function validationExample() {
  import {
    validateSimpleConfig,
    buildEnterpriseConfig,
  } from '@skygenesisenterprise/enterprise-node';

  const config: SimpleEnterpriseConfig = {
    mode: 'production',
    framework: 'react',
    modules: {
      ai: { preset: 'premium' },
      storage: { preset: 'secure' },
    },
  };

  const validation = validateSimpleConfig(config);

  if (!validation.valid) {
    console.error('Configuration errors:', validation.errors);
    throw new Error('Invalid configuration');
  }

  if (validation.warnings.length > 0) {
    console.warn('Configuration warnings:', validation.warnings);
  }

  return buildEnterpriseConfig(config);
}

/**
 * EXEMPLE 7: Liste des presets disponibles
 *
 * Découverte des options :
 */
export function discoverPresetsExample() {
  import { listPresets } from '@skygenesisenterprise/enterprise-node';

  const presets = listPresets();

  console.log('Presets disponibles:');
  presets.forEach((preset) => {
    console.log(`- ${preset.name}: ${preset.description}`);
  });

  return presets;
}

// ========================================
// GUIDE D'UTILISATION RAPIDE
// ========================================

/**
 * GUIDE 1: Pour les débutants
 *
 * Import unique et configuration instantanée :
 *
 * ```typescript
 * import { createConfigFromPreset } from '@skygenesisenterprise/enterprise-node';
 *
 * const config = createConfigFromPreset('quickstart');
 * ```
 */

/**
 * GUIDE 2: Pour les applications web
 *
 * Configuration riche avec branding :
 *
 * ```typescript
 * import { createConfig } from '@skygenesisenterprise/enterprise-node';
 *
 * const config = createConfig('webapp', {
 *   branding: { appName: 'Mon App' },
 *   modules: {
 *     ai: { preset: 'premium' },
 *     auth: { preset: 'secure' }
 *   }
 * });
 * ```
 */

/**
 * GUIDE 3: Pour les API backend
 *
 * Optimisée pour serveur :
 *
 * ```typescript
 * import { createConfigFromPreset } from '@skygenesisenterprise/enterprise-node';
 *
 * const config = createConfigFromPreset('api');
 * ```
 */

/**
 * GUIDE 4: Pour le contrôle total
 *
 * Configuration manuelle :
 *
 * ```typescript
 * import { buildEnterpriseConfig } from '@skygenesisenterprise/enterprise-node';
 *
 * const config = buildEnterpriseConfig({
 *   mode: 'production',
 *   modules: {
 *     ai: { enabled: true, preset: 'premium' }
 *   }
 * });
 * ```
 */

/**
 * GUIDE 5: Pour la validation
 *
 * Vérification automatique :
 *
 * ```typescript
 * import { validateSimpleConfig } from '@skygenesisenterprise/enterprise-node';
 *
 * const validation = validateSimpleConfig(config);
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 * ```
 */

// ========================================
// RÉFÉRENCE DES PRESETS
// ========================================

export const PRESET_REFERENCE = {
  quickstart: {
    usage: 'Développement rapide et prototypage',
    modules: ['AI (fast)', 'Storage (basic)', 'UI (minimal)'],
    runtime: 'WASM activé',
    ideal: 'POC, MVP, développement initial',
  },

  webapp: {
    usage: 'Application web complète',
    modules: ['AI (balanced)', 'Storage (optimized)', 'Auth (secure)', 'UI (modern)', 'Project'],
    runtime: 'WASM optimisé',
    ideal: 'Applications web modernes, SaaS',
  },

  api: {
    usage: 'Backend API serveur',
    modules: ['AI (premium)', 'Storage (secure)', 'Auth (enterprise)'],
    runtime: 'Sans WASM, performance maximale',
    ideal: 'API REST, GraphQL, microservices',
  },

  development: {
    usage: 'Environnement de développement',
    modules: ['Tous les modules activés'],
    runtime: 'WASM + debug complet',
    ideal: 'Développement local, testing',
  },

  minimal: {
    usage: 'Configuration ultra-légère',
    modules: ['Storage (basic) uniquement'],
    runtime: 'Compatible, sans WASM',
    ideal: 'Applications simples, edge computing',
  },
} as const;
