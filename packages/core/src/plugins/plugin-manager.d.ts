/**
 * @fileoverview Système de plugins modulaire pour Enterprise SDK
 * Support pour TypeScript, Rust, Go et JavaScript
 */
export interface PluginManifest {
    /** Nom unique du plugin */
    name: string;
    /** Version du plugin */
    version: string;
    /** Description du plugin */
    description: string;
    /** Auteur du plugin */
    author: string;
    /** Langage du plugin */
    language: 'typescript' | 'rust' | 'go' | 'javascript';
    /** Point d'entrée principal */
    main: string;
    /** Dépendances du plugin */
    dependencies?: string[];
    /** Plugins requis */
    peerDependencies?: string[];
    /** Permissions requises */
    permissions?: string[];
    /** Configuration du plugin */
    config?: PluginConfig;
    /** Hooks du cycle de vie */
    hooks?: PluginHooks;
    /** Métadonnées additionnelles */
    metadata?: Record<string, any>;
}
export interface PluginConfig {
    /** Configuration par défaut */
    defaults?: Record<string, any>;
    /** Schéma de validation JSON */
    schema?: Record<string, any>;
    /** Variables d'environnement requises */
    env?: string[];
}
export interface PluginHooks {
    /** Avant l'initialisation du SDK */
    beforeInit?: (config: any) => Promise<void>;
    /** Après l'initialisation du SDK */
    afterInit?: (sdk: any) => Promise<void>;
    /** Avant le chargement d'un module */
    beforeModuleLoad?: (name: string, path: string) => Promise<void>;
    /** Après le chargement d'un module */
    afterModuleLoad?: (module: any) => Promise<void>;
    /** Avant la destruction du SDK */
    beforeDestroy?: () => Promise<void>;
    /** Après la destruction du SDK */
    afterDestroy?: () => Promise<void>;
}
export interface Plugin {
    /** Manifest du plugin */
    manifest: PluginManifest;
    /** Instance du plugin chargé */
    instance: any;
    /** État du plugin */
    status: 'loaded' | 'active' | 'inactive' | 'error';
    /** Erreur éventuelle */
    error?: Error;
    /** Métadonnées d'exécution */
    runtime?: {
        loadTime: number;
        memoryUsage: number;
        executionCount: number;
    };
}
export interface PluginManagerConfig {
    /** Répertoire des plugins */
    pluginsDir?: string;
    /** Plugins activés par défaut */
    enabledPlugins?: string[];
    /** Activer le chargement automatique */
    autoLoad?: boolean;
    /** Configuration de sécurité */
    security?: {
        /** Vérifier la signature des plugins */
        verifySignature?: boolean;
        /** Autoriser uniquement les plugins signés */
        requireSigned?: boolean;
        /** Liste blanche des plugins autorisés */
        whitelist?: string[];
        /** Liste noire des plugins interdits */
        blacklist?: string[];
    };
}
/**
 * Gestionnaire de plugins pour Enterprise SDK
 */
export declare class PluginManager {
    private static instance;
    private plugins;
    private config;
    private isInitialized;
    constructor(config?: PluginManagerConfig);
    static getInstance(config?: PluginManagerConfig): PluginManager;
    /**
     * Initialise le gestionnaire de plugins
     */
    initialize(): Promise<void>;
    /**
     * Charge un plugin depuis un chemin
     */
    loadPlugin(pluginPath: string): Promise<Plugin>;
    /**
     * Décharge un plugin
     */
    unloadPlugin(name: string): Promise<void>;
    /**
     * Active un plugin
     */
    activatePlugin(name: string): Promise<void>;
    /**
     * Désactive un plugin
     */
    deactivatePlugin(name: string): Promise<void>;
    /**
     * Récupère un plugin
     */
    getPlugin(name: string): Plugin | undefined;
    /**
     * Liste tous les plugins
     */
    getPlugins(): Plugin[];
    /**
     * Liste les plugins actifs
     */
    getActivePlugins(): Plugin[];
    /**
     * Exécute un hook sur tous les plugins actifs
     */
    executeHook(hookName: keyof PluginHooks, ...args: any[]): Promise<void>;
    /**
     * Installe un plugin depuis une URL ou un chemin local
     */
    installPlugin(source: string): Promise<void>;
    /**
     * Désinstalle un plugin
     */
    uninstallPlugin(name: string): Promise<void>;
    /**
     * Charge tous les plugins dans le répertoire
     */
    private loadAllPlugins;
    /**
     * Charge un plugin selon son langage
     */
    private loadPluginByLanguage;
    /**
     * Charge un plugin TypeScript
     */
    private loadTypeScriptPlugin;
    /**
     * Charge un plugin Rust (WebAssembly)
     */
    private loadRustPlugin;
    /**
     * Charge un plugin Go (WebAssembly)
     */
    private loadGoPlugin;
    /**
     * Charge un plugin JavaScript
     */
    private loadJavaScriptPlugin;
    /**
     * Vérifie si un plugin est autorisé
     */
    private isPluginAllowed;
    /**
     * Vérifie les dépendances d'un plugin
     */
    private checkDependencies;
    /**
     * Utilitaires pour la gestion des fichiers
     */
    private ensurePluginsDirectory;
    private resolveManifestPath;
    private readManifest;
    private readFile;
    private readDirectory;
    private getPluginPath;
    private removeDirectory;
    private installFromUrl;
    private installFromPath;
    /**
     * Détruit le gestionnaire de plugins
     */
    destroy(): Promise<void>;
}
export default PluginManager;
