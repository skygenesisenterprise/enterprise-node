/**
 * @fileoverview Plugin Manager
 * Gestionnaire central du système de plugins Enterprise
 */

import {
  EnterprisePlugin,
  PluginManifest,
  PluginContext,
  PluginLoadResult,
  PluginSystemConfig,
  PluginEvent,
  PluginLogger,
  PluginUtils,
} from './types';
import { EventEmitter } from 'events';

export class PluginManager extends EventEmitter {
  private static instance: PluginManager;
  private plugins: Map<string, EnterprisePlugin> = new Map();
  private manifests: Map<string, PluginManifest> = new Map();
  private config: PluginSystemConfig;
  private context?: PluginContext;

  private constructor(config: PluginSystemConfig = {}) {
    super();
    this.config = {
      pluginDirs: ['node_modules/@skygenesisenterprise/plugins', 'plugins'],
      autoLoad: [],
      exclude: [],
      devMode: false,
      verbose: false,
      enableCache: true,
      cacheDir: '.enterprise/plugins',
      allowUnsafePlugins: false,
      trustedAuthors: ['skygenesisenterprise'],
      ...config,
    };
  }

  static getInstance(config?: PluginSystemConfig): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager(config);
    }
    return PluginManager.instance;
  }

  /**
   * Initialise le gestionnaire de plugins avec un contexte
   */
  async initialize(context: PluginContext): Promise<void> {
    this.context = context;

    if (this.config.verbose) {
      context.logger.info('🔌 Initialisation du système de plugins...');
    }

    // Charger les plugins automatiquement
    await this.loadAutoPlugins();

    // Charger les plugins depuis la configuration
    await this.loadConfigPlugins(context.config);

    if (this.config.verbose) {
      context.logger.info(`✅ ${this.plugins.size} plugin(s) chargé(s)`);
    }
  }

  /**
   * Charge un plugin depuis son nom ou chemin
   */
  async loadPlugin(identifier: string): Promise<PluginLoadResult> {
    try {
      const manifest = await this.loadPluginManifest(identifier);

      // Validation du plugin
      const validation = this.validatePlugin(manifest);
      if (!validation.valid) {
        return {
          plugin: null as any,
          success: false,
          error: new Error(`Plugin invalide: ${validation.errors.join(', ')}`),
        };
      }

      // Chargement du module du plugin
      const PluginClass = await this.loadPluginModule(manifest);
      const plugin = new PluginClass();

      // Vérification de l'interface
      if (!this.isValidPlugin(plugin)) {
        return {
          plugin: null as any,
          success: false,
          error: new Error("Le plugin n'implémente pas l'interface EnterprisePlugin"),
        };
      }

      // Initialisation du plugin
      if (this.context) {
        await plugin.initialize(this.context);
      }

      // Enregistrement du plugin
      this.plugins.set(manifest.name, plugin);
      this.manifests.set(manifest.name, manifest);

      // Émission de l'événement
      this.emit('plugin:loaded', { name: manifest.name, plugin });

      if (this.config.verbose) {
        this.context?.logger.info(`🔌 Plugin chargé: ${manifest.name}@${manifest.version}`);
      }

      return {
        plugin,
        success: true,
      };
    } catch (error) {
      return {
        plugin: null as any,
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  /**
   * Décharge un plugin
   */
  async unloadPlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin non trouvé: ${name}`);
    }

    try {
      await plugin.destroy();
      this.plugins.delete(name);
      this.manifests.delete(name);

      this.emit('plugin:unloaded', { name });

      if (this.config.verbose) {
        this.context?.logger.info(`🔌 Plugin déchargé: ${name}`);
      }
    } catch (error) {
      this.context?.logger.error(`Erreur lors du déchargement du plugin ${name}:`, error);
      throw error;
    }
  }

  /**
   * Retourne un plugin par son nom
   */
  getPlugin(name: string): EnterprisePlugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Retourne tous les plugins chargés
   */
  getPlugins(): Map<string, EnterprisePlugin> {
    return new Map(this.plugins);
  }

  /**
   * Retourne les plugins par catégorie
   */
  getPluginsByCategory(category: string): EnterprisePlugin[] {
    return Array.from(this.plugins.values()).filter(
      (plugin) => plugin.manifest.category === category
    );
  }

  /**
   * Retourne les plugins qui supportent un framework spécifique
   */
  getPluginsForFramework(framework: string): EnterprisePlugin[] {
    return Array.from(this.plugins.values()).filter((plugin) =>
      plugin.manifest.supports.includes(framework)
    );
  }

  /**
   * Exécute un hook sur tous les plugins
   */
  async executeHook(hookName: string, data?: any): Promise<void> {
    const promises = Array.from(this.plugins.values()).map(async (plugin) => {
      const hook = plugin[hookName as keyof EnterprisePlugin];
      if (typeof hook === 'function' && this.context) {
        try {
          await (hook as Function).call(plugin, this.context, data);
        } catch (error) {
          this.context?.logger.error(
            `Erreur dans le hook ${hookName} du plugin ${plugin.manifest.name}:`,
            error
          );
        }
      }
    });

    await Promise.all(promises);
  }

  /**
   * Retourne les commandes de tous les plugins
   */
  getPluginCommands(): any[] {
    const commands: any[] = [];

    for (const plugin of this.plugins.values()) {
      if (plugin.getCommands) {
        const pluginCommands = plugin.getCommands();
        commands.push(
          ...pluginCommands.map((cmd) => ({
            ...cmd,
            plugin: plugin.manifest.name,
            category: cmd.category || 'plugin',
          }))
        );
      }
    }

    return commands;
  }

  /**
   * Charge le manifest d'un plugin
   */
  private async loadPluginManifest(identifier: string): Promise<PluginManifest> {
    // Essayer de charger depuis node_modules
    try {
      const packagePath = require.resolve(`${identifier}/package.json`);
      const packageJson = require(packagePath);

      if (packageJson.enterprise?.plugin) {
        return packageJson.enterprise.plugin;
      }
    } catch {
      // Continuer avec d'autres méthodes
    }

    // Essayer de charger depuis un chemin local
    try {
      const manifestPath = require.resolve(`${identifier}/plugin.json`);
      const manifest = require(manifestPath);
      return manifest;
    } catch {
      // Continuer avec d'autres méthodes
    }

    throw new Error(`Impossible de trouver le manifest pour le plugin: ${identifier}`);
  }

  /**
   * Charge le module d'un plugin
   */
  private async loadPluginModule(manifest: PluginManifest): Promise<any> {
    const modulePath = require.resolve(manifest.main);
    const module = await import(modulePath);

    return module.default || module;
  }

  /**
   * Valide un manifest de plugin
   */
  private validatePlugin(manifest: PluginManifest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!manifest.name) errors.push('Le nom est requis');
    if (!manifest.version) errors.push('La version est requise');
    if (!manifest.main) errors.push("Le point d'entrée est requis");
    if (!manifest.category) errors.push('La catégorie est requise');
    if (!manifest.supports || manifest.supports.length === 0) {
      errors.push('Au moins un framework supporté est requis');
    }

    // Validation de sécurité
    if (!this.config.allowUnsafePlugins && !manifest.enterprise?.certified) {
      errors.push('Plugin non certifié et mode sécurisé activé');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Vérifie qu'un objet implémente bien l'interface EnterprisePlugin
   */
  private isValidPlugin(plugin: any): plugin is EnterprisePlugin {
    return (
      typeof plugin === 'object' &&
      plugin.manifest &&
      typeof plugin.initialize === 'function' &&
      typeof plugin.destroy === 'function'
    );
  }

  /**
   * Charge les plugins automatiquement
   */
  private async loadAutoPlugins(): Promise<void> {
    for (const pluginName of this.config.autoLoad || []) {
      if (!this.config.exclude?.includes(pluginName)) {
        const result = await this.loadPlugin(pluginName);
        if (!result.success) {
          this.context?.logger.error(
            `Erreur lors du chargement automatique du plugin ${pluginName}:`,
            result.error
          );
        }
      }
    }
  }

  /**
   * Charge les plugins depuis la configuration
   */
  private async loadConfigPlugins(config: any): Promise<void> {
    const plugins = config.plugins || {};

    for (const [pluginName, pluginConfig] of Object.entries(plugins)) {
      if (!this.config.exclude?.includes(pluginName)) {
        const result = await this.loadPlugin(pluginName);
        if (result.success && this.context) {
          // Appliquer la configuration du plugin
          if (result.plugin.validateConfig && pluginConfig) {
            const isValid = result.plugin.validateConfig(pluginConfig);
            if (isValid !== true) {
              this.context.logger.warn(
                `Configuration invalide pour le plugin ${pluginName}: ${isValid}`
              );
            }
          }
        } else if (!result.success) {
          this.context?.logger.error(
            `Erreur lors du chargement du plugin ${pluginName}:`,
            result.error
          );
        }
      }
    }
  }

  /**
   * Crée un logger pour les plugins
   */
  createPluginLogger(pluginName: string): PluginLogger {
    return {
      debug: (message: string, ...args: any[]) => {
        if (this.config.verbose) {
          console.log(`[${pluginName}] ${message}`, ...args);
        }
      },
      info: (message: string, ...args: any[]) => {
        console.log(`[${pluginName}] ${message}`, ...args);
      },
      warn: (message: string, ...args: any[]) => {
        console.warn(`[${pluginName}] ${message}`, ...args);
      },
      error: (message: string, ...args: any[]) => {
        console.error(`[${pluginName}] ${message}`, ...args);
      },
      success: (message: string, ...args: any[]) => {
        console.log(`✅ [${pluginName}] ${message}`, ...args);
      },
    };
  }

  /**
   * Détruit le gestionnaire de plugins
   */
  async destroy(): Promise<void> {
    const promises = Array.from(this.plugins.values()).map((plugin) =>
      plugin
        .destroy()
        .catch((error) =>
          this.context?.logger.error(`Erreur lors de la destruction du plugin:`, error)
        )
    );

    await Promise.all(promises);

    this.plugins.clear();
    this.manifests.clear();
    this.removeAllListeners();
  }
}
