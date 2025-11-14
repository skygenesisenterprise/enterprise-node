/**
 * @fileoverview Plugin Manager
 * Gestionnaire central du système de plugins Enterprise
 */
import { EnterprisePlugin, PluginContext, PluginLoadResult, PluginSystemConfig, PluginLogger } from './types';
import { EventEmitter } from 'events';
export declare class PluginManager extends EventEmitter {
    private static instance;
    private plugins;
    private manifests;
    private config;
    private context?;
    private constructor();
    static getInstance(config?: PluginSystemConfig): PluginManager;
    /**
     * Initialise le gestionnaire de plugins avec un contexte
     */
    initialize(context: PluginContext): Promise<void>;
    /**
     * Charge un plugin depuis son nom ou chemin
     */
    loadPlugin(identifier: string): Promise<PluginLoadResult>;
    /**
     * Décharge un plugin
     */
    unloadPlugin(name: string): Promise<void>;
    /**
     * Retourne un plugin par son nom
     */
    getPlugin(name: string): EnterprisePlugin | undefined;
    /**
     * Retourne tous les plugins chargés
     */
    getPlugins(): Map<string, EnterprisePlugin>;
    /**
     * Retourne les plugins par catégorie
     */
    getPluginsByCategory(category: string): EnterprisePlugin[];
    /**
     * Retourne les plugins qui supportent un framework spécifique
     */
    getPluginsForFramework(framework: string): EnterprisePlugin[];
    /**
     * Exécute un hook sur tous les plugins
     */
    executeHook(hookName: string, data?: any): Promise<void>;
    /**
     * Retourne les commandes de tous les plugins
     */
    getPluginCommands(): any[];
    /**
     * Charge le manifest d'un plugin
     */
    private loadPluginManifest;
    /**
     * Charge le module d'un plugin
     */
    private loadPluginModule;
    /**
     * Valide un manifest de plugin
     */
    private validatePlugin;
    /**
     * Vérifie qu'un objet implémente bien l'interface EnterprisePlugin
     */
    private isValidPlugin;
    /**
     * Charge les plugins automatiquement
     */
    private loadAutoPlugins;
    /**
     * Charge les plugins depuis la configuration
     */
    private loadConfigPlugins;
    /**
     * Crée un logger pour les plugins
     */
    createPluginLogger(pluginName: string): PluginLogger;
    /**
     * Détruit le gestionnaire de plugins
     */
    destroy(): Promise<void>;
}
//# sourceMappingURL=plugin-manager.d.ts.map