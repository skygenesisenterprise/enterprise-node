/**
 * @fileoverview Enhanced Enterprise Configuration
 * Configuration avancée avec auto-complétion, validation et presets
 *
 * Ce fichier utilise le système de configuration avancé du SDK Enterprise.
 * L'auto-complétion est disponible dans les IDE compatibles TypeScript.
 */

// Option 1: Configuration simple avec auto-complétion
import { EnterpriseConfig } from './src/types';

const config: EnterpriseConfig = {
  // En tapant "modules: {" l'IDE suggère automatiquement tous les modules disponibles
  modules: {
    ai: true, // Module d'intelligence artificielle
    storage: true, // Module de stockage
    ui: true, // Module d'interface utilisateur
    auth: true, // Module d'authentification
    project: true, // Module de gestion de projet
    sdk: true, // Module SDK auto-référentiel
  },

  // Configuration du runtime WebAssembly
  runtime: {
    wasmPath: '/wasm/euse_core.wasm', // Chemin vers les fichiers WASM
    enableWasm: true, // Activer WebAssembly
  },

  // Framework cible (auto-complétion suggère: 'react', 'nextjs', 'svelte', 'auto')
  framework: 'auto',

  // Mode debug pour le développement
  debug: false, // Configurez selon vos besoins

  // Configuration de l'identité visuelle
  branding: {
    // Configuration du logo avec auto-complétion des propriétés
    logo: {
      path: './assets/enterprise.png', // Chemin vers l'image du logo
      width: 200, // Largeur du logo
      height: 60, // Hauteur du logo
      alt: 'Sky Genesis Enterprise', // Texte alternatif
      format: 'png', // Format de l'image
    },

    // Informations sur l'entreprise
    companyName: 'Sky Genesis Enterprise',

    // Palette de couleurs (l'IDE suggère des couleurs valides)
    primaryColor: '#007acc',
    secondaryColor: '#004466',

    // Thème visuel (auto-complétion: 'light', 'dark', 'auto')
    theme: 'auto',
  },
};

export default config;

/*
 * ========================================
 * ALTERNATIVES DE CONFIGURATION AVANCÉES
 * ========================================
 *
 * Décommentez l'une des options ci-dessous pour utiliser
 * différentes approches de configuration.
 */

// Option 2: Configuration avec Builder Pattern (recommandé pour les projets complexes)
/*
import { createConfig } from './src/config-builder';

export default createConfig.custom()
  .enableModules(['ai', 'storage', 'ui', 'auth'])
  .setFramework('nextjs')
  .enableDebug(process.env.NODE_ENV === 'development')
  .setRuntime({
    wasmPath: '/wasm/euse_core.wasm',
    enableWasm: true
  })
  .setBranding({
    companyName: 'Your Company',
    primaryColor: '#007acc',
    secondaryColor: '#004466',
    theme: 'auto',
    logo: {
      path: './assets/logo.png',
      width: 200,
      height: 60
    }
  })
  .setHooks({
    beforeInit: async (config) => {
      console.log('🚀 Initializing Enterprise SDK...', config);
    },
    afterInit: async (instance) => {
      console.log('✅ Enterprise SDK initialized successfully!');
    }
  })
  .build();
*/

// Option 3: Configuration avec Preset (idéal pour démarrer rapidement)
/*
import { createConfig } from './src/config-builder';

export default createConfig.fullstack()
  .enableDebug(process.env.NODE_ENV === 'development')
  .setBranding({
    companyName: 'Your Company',
    primaryColor: '#007acc'
  })
  .build();
*/

// Option 4: Configuration orientée IA
/*
import { createConfig } from './src/config-builder';

export default createConfig.aiFirst()
  .enableDebug(true)
  .configureModule('ai', {
    defaultModel: 'euse-generate-v0.1.0',
    maxTokens: 2000,
    temperature: 0.7
  })
  .setBranding({
    companyName: 'AI Company',
    primaryColor: '#6366f1'
  })
  .build();
*/

// Option 5: Configuration minimale pour les petits projets
/*
import { createConfig } from './src/config-builder';

export default createConfig.minimal()
  .enableDebug(true)
  .build();
*/

// Option 6: Configuration avec plugins et middlewares
/*
import { EnterpriseConfigBuilder } from './src/config-builder';

const config = new EnterpriseConfigBuilder({
  env: 'production',
  plugins: [
    {
      name: 'analytics-plugin',
      version: '1.0.0',
      setup: (config) => ({
        ...config,
        analytics: {
          enabled: true,
          trackingId: 'GA-XXXXXXXX'
        }
      })
    },
    {
      name: 'cache-plugin',
      version: '1.0.0',
      setup: (config) => ({
        ...config,
        cache: {
          ttl: 3600,
          maxSize: '100MB'
        }
      })
    }
  ]
})
  .enableModules(['ai', 'storage', 'auth'])
  .setFramework('nextjs')
  .addMiddleware({
    name: 'logging',
    config: { level: 'info' },
    order: 1
  })
  .addMiddleware({
    name: 'error-handling',
    config: { retryAttempts: 3 },
    order: 2
  })
  .build();

export default config;
*/

// Option 7: Configuration conditionnelle selon l'environnement
/*
import { createConfig, mergeConfigs } from './src/config-builder';

const baseConfig = {
  modules: {
    ai: true,
    storage: true,
    ui: true,
    auth: true,
    project: true,
    sdk: true
  },
  branding: {
    companyName: 'Your Company',
    primaryColor: '#007acc',
    theme: 'auto'
  }
};

const developmentConfig = {
  debug: true,
  framework: 'auto' as const,
  runtime: {
    wasmPath: '/wasm/euse_core.wasm',
    enableWasm: true
  }
};

const productionConfig = {
  debug: false,
  framework: 'nextjs' as const,
  runtime: {
    wasmPath: '/wasm/euse_core.wasm',
    enableWasm: true
  }
};

const config = mergeConfigs(
  baseConfig,
  process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig
);

export default config;
*/

/*
 * ========================================
 * UTILISATION DE L'AUTO-COMPLÉTION
 * ========================================
 *
 * Dans votre IDE (VS Code, WebStorm, etc.) :
 *
 * 1. Tapez "modules: {" et l'IDE suggérera tous les modules disponibles
 * 2. Tapez "framework: '" et l'IDE listera les frameworks supportés
 * 3. Tapez "branding: {" et l'IDE proposera toutes les options de branding
 * 4. Tapez "createConfig." et l'IDE montrera tous les presets disponibles
 * 5. Tapez ".enableModules([" et l'IDE listera les modules disponibles
 *
 * L'auto-complétion fonctionne également pour :
 * - Les chemins de fichiers
 * - Les valeurs hexadécimales pour les couleurs
 * - Les noms de méthodes et propriétés
 * - Les types de données attendus
 *
 * ========================================
 * VALIDATION DE CONFIGURATION
 * ========================================
 *
 * Pour valider votre configuration :
 *
 * ```typescript
 * import { validateConfig } from './src/config-builder';
 *
 * const validation = validateConfig(config);
 *
 * if (!validation.valid) {
 *   console.error('Configuration errors:', validation.errors);
 * }
 *
 * if (validation.warnings.length > 0) {
 *   console.warn('Configuration warnings:', validation.warnings);
 * }
 * ```
 */
