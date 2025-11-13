/**
 * @fileoverview Exports principaux pour configuration simplifiée
 * Point d'entrée unique pour EnterpriseConfig avec paramètres facilités
 */

// Export des types de configuration
export type {
  EnterpriseConfig,
  ModuleInterface,
  RuntimeCore,
  FrameworkType,
  BrandingConfig,
  LogoConfig,
} from './src/types';

// Export des configurations simplifiées
export type {
  SimpleEnterpriseConfig,
  SimpleModuleConfig,
  SimpleAIConfig,
  SimpleStorageConfig,
  SimpleAuthConfig,
  SimpleUIConfig,
  SimpleProjectConfig,
} from './src/config-simple';

// Export des fonctions de construction
export {
  buildEnterpriseConfig,
  createConfigFromPreset,
  createConfig,
  listPresets,
  validateSimpleConfig,
  CONFIG_PRESETS,
} from './src/config-simple';

// Export du SDK unifié
export { UnifiedEnterpriseSDK, createEnterprise, enterprise } from './src/unified-sdk';

// Export des modules avec interfaces simplifiées
export {
  RustBridge,
  type BridgeConfig,
  type RustFunction,
  type InvokeOptions,
} from './src/core/rust-bridge';

// Export des utilitaires de configuration
export {
  expandOptions,
  createModuleConfig,
  getPreset,
  listPresets as listModulePresets,
  type ModulePresets,
  type SimpleAIOptions,
  type SimpleImageOptions,
  type SimpleAnalysisOptions,
  type SimpleStorageOptions,
  type SimpleUploadOptions,
  type SimpleAuthOptions,
  type SimpleUserOptions,
  type SimpleProjectOptions,
  type SimpleTaskOptions,
  type SimpleUIOptions,
  type SimpleNotificationOptions,
  PRESETS,
} from './src/types/simple-params';

// ========================================
// EXEMPLES D'UTILISATION
// ========================================

/**
 * Exemple 1: Configuration avec preset rapide
 *
 * ```typescript
 * import { createConfigFromPreset } from '@skygenesisenterprise/enterprise-node';
 *
 * const config = createConfigFromPreset('quickstart');
 * ```
 */

/**
 * Exemple 2: Configuration personnalisée
 *
 * ```typescript
 * import { createConfig } from '@skygenesisenterprise/enterprise-node';
 *
 * const config = createConfig('webapp', {
 *   branding: {
 *     appName: 'My App',
 *     colors: { primary: '#ff6b6b' }
 *   },
 *   modules: {
 *     ai: { preset: 'premium', options: { maxTokens: 2000 } },
 *     storage: { preset: 'secure' }
 *   }
 * });
 * ```
 */

/**
 * Exemple 3: Configuration complète manuelle
 *
 * ```typescript
 * import { buildEnterpriseConfig } from '@skygenesisenterprise/enterprise-node';
 *
 * const config = buildEnterpriseConfig({
 *   mode: 'production',
 *   framework: 'react',
 *   modules: {
 *     ai: { enabled: true, preset: 'balanced' },
 *     storage: { enabled: true, preset: 'optimized' },
 *     auth: { enabled: true, preset: 'secure' },
 *     ui: { enabled: true, preset: 'modern' }
 *   },
 *   runtime: { wasm: true, performance: 'fast' }
 * });
 * ```
 */

/**
 * Exemple 4: Initialisation du SDK
 *
 * ```typescript
 * import { createEnterprise, createConfigFromPreset } from '@skygenesisenterprise/enterprise-node';
 *
 * // Configuration rapide
 * const config = createConfigFromPreset('quickstart');
 *
 * // Initialisation
 * const enterprise = await createEnterprise(config);
 *
 * // Utilisation avec paramètres simplifiés
 * const result = await enterprise.ai.enhance(image, {
 *   quality: 'best',
 *   format: 'auto',
 *   optimize: true
 * });
 * ```
 */

// Export par défaut - fonction de création de configuration
import { createConfigFromPreset } from './src/config-simple';
export default createConfigFromPreset;
