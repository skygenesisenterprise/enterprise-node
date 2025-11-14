/**
 * @fileoverview Plugin System Architecture
 * Architecture du système de plugins pour Enterprise SDK
 */

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author?: string;
  homepage?: string;
  repository?: string;
  keywords?: string[];

  // Configuration du plugin
  main: string; // Point d'entrée principal
  exports?: Record<string, string>; // Exports spécifiques

  // Dépendances
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;

  // Compatibilité
  engines?: {
    node?: string;
    npm?: string;
  };

  // Catégories et tags
  category: 'framework' | 'module' | 'tooling' | 'integration';
  tags: string[];

  // Support des frameworks
  supports: string[]; // Frameworks supportés (react, nextjs, vue, etc.)

  // Configuration requise
  configSchema?: PluginConfigSchema;

  // Hooks et cycles de vie
  hooks?: PluginHook[];

  // Métadonnées
  enterprise?: {
    certified?: boolean; // Plugin certifié par Enterprise
    recommended?: boolean; // Plugin recommandé
    deprecated?: boolean; // Plugin déprécié
    experimental?: boolean; // Plugin expérimental
  };
}

export interface PluginConfigSchema {
  type: 'object';
  properties: Record<
    string,
    {
      type: 'string' | 'number' | 'boolean' | 'array' | 'object';
      description?: string;
      default?: any;
      required?: boolean;
      enum?: any[];
      minimum?: number;
      maximum?: number;
    }
  >;
  required?: string[];
}

export interface PluginHook {
  name: string;
  description: string;
  timing: 'before' | 'after' | 'around' | 'instead';
  event: string; // Événement cible (build, dev, test, etc.)
  priority?: number; // Priorité d'exécution (0 = plus haute)
}

export interface PluginContext {
  // Configuration du projet
  config: any;

  // Environnement
  env: 'development' | 'production' | 'test';

  // Chemins
  cwd: string;
  rootDir: string;
  srcDir: string;
  distDir: string;

  // Framework détecté
  framework?: string;

  // Modules activés
  modules: string[];

  // Outils utilitaires
  logger: PluginLogger;
  utils: PluginUtils;
}

export interface PluginLogger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  success(message: string, ...args: any[]): void;
}

export interface PluginUtils {
  // File system
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  exists(path: string): Promise<boolean>;

  // Package management
  getPackageJson(): Promise<any>;
  updatePackageJson(updates: any): Promise<void>;

  // Command execution
  exec(command: string, options?: any): Promise<{ stdout: string; stderr: string }>;

  // Framework detection
  detectFramework(): Promise<string | null>;

  // Configuration
  getConfig(): Promise<any>;
  setConfig(path: string, value: any): Promise<void>;
}

/**
 * Interface principale d'un plugin Enterprise
 */
export interface EnterprisePlugin {
  // Métadonnées du plugin
  readonly manifest: PluginManifest;

  // Initialisation
  initialize(context: PluginContext): Promise<void>;

  // Destruction
  destroy(): Promise<void>;

  // Hooks du cycle de vie
  onBeforeBuild?(context: PluginContext): Promise<void>;
  onAfterBuild?(context: PluginContext): Promise<void>;
  onBeforeDev?(context: PluginContext): Promise<void>;
  onAfterDev?(context: PluginContext): Promise<void>;
  onBeforeTest?(context: PluginContext): Promise<void>;
  onAfterTest?(context: PluginContext): Promise<void>;

  // Commandes CLI personnalisées
  getCommands?(): PluginCommand[];

  // Configuration
  getConfigSchema?(): PluginConfigSchema;
  validateConfig?(config: any): boolean | string;

  // Intégration avec les modules
  onModuleLoad?(moduleName: string, moduleInstance: any): Promise<void>;
  onModuleUnload?(moduleName: string): Promise<void>;
}

export interface PluginCommand {
  name: string;
  description: string;
  category?: 'build' | 'dev' | 'test' | 'deploy' | 'util';
  options?: PluginCommandOption[];
  handler: (args: any, context: PluginContext) => Promise<void>;
}

export interface PluginCommandOption {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
  required?: boolean;
  default?: any;
  choices?: string[];
}

/**
 * Événements du système de plugins
 */
export interface PluginEvent {
  name: string;
  data?: any;
  timestamp: number;
  source: string;
}

/**
 * Résultat du chargement d'un plugin
 */
export interface PluginLoadResult {
  plugin: EnterprisePlugin;
  success: boolean;
  error?: Error;
  warnings?: string[];
}

/**
 * Configuration du système de plugins
 */
export interface PluginSystemConfig {
  // Répertoires de recherche
  pluginDirs?: string[];

  // Plugins à charger automatiquement
  autoLoad?: string[];

  // Plugins à exclure
  exclude?: string[];

  // Options de développement
  devMode?: boolean;
  verbose?: boolean;

  // Cache
  enableCache?: boolean;
  cacheDir?: string;

  // Sécurité
  allowUnsafePlugins?: boolean;
  trustedAuthors?: string[];
}
