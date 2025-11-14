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
    main: string;
    exports?: Record<string, string>;
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    engines?: {
        node?: string;
        npm?: string;
    };
    category: 'framework' | 'module' | 'tooling' | 'integration';
    tags: string[];
    supports: string[];
    configSchema?: PluginConfigSchema;
    hooks?: PluginHook[];
    enterprise?: {
        certified?: boolean;
        recommended?: boolean;
        deprecated?: boolean;
        experimental?: boolean;
    };
}
export interface PluginConfigSchema {
    type: 'object';
    properties: Record<string, {
        type: 'string' | 'number' | 'boolean' | 'array' | 'object';
        description?: string;
        default?: any;
        required?: boolean;
        enum?: any[];
        minimum?: number;
        maximum?: number;
    }>;
    required?: string[];
}
export interface PluginHook {
    name: string;
    description: string;
    timing: 'before' | 'after' | 'around' | 'instead';
    event: string;
    priority?: number;
}
export interface PluginContext {
    config: any;
    env: 'development' | 'production' | 'test';
    cwd: string;
    rootDir: string;
    srcDir: string;
    distDir: string;
    framework?: string;
    modules: string[];
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
    readFile(path: string): Promise<string>;
    writeFile(path: string, content: string): Promise<void>;
    exists(path: string): Promise<boolean>;
    getPackageJson(): Promise<any>;
    updatePackageJson(updates: any): Promise<void>;
    exec(command: string, options?: any): Promise<{
        stdout: string;
        stderr: string;
    }>;
    detectFramework(): Promise<string | null>;
    getConfig(): Promise<any>;
    setConfig(path: string, value: any): Promise<void>;
}
/**
 * Interface principale d'un plugin Enterprise
 */
export interface EnterprisePlugin {
    readonly manifest: PluginManifest;
    initialize(context: PluginContext): Promise<void>;
    destroy(): Promise<void>;
    onBeforeBuild?(context: PluginContext): Promise<void>;
    onAfterBuild?(context: PluginContext): Promise<void>;
    onBeforeDev?(context: PluginContext): Promise<void>;
    onAfterDev?(context: PluginContext): Promise<void>;
    onBeforeTest?(context: PluginContext): Promise<void>;
    onAfterTest?(context: PluginContext): Promise<void>;
    getCommands?(): PluginCommand[];
    getConfigSchema?(): PluginConfigSchema;
    validateConfig?(config: any): boolean | string;
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
    pluginDirs?: string[];
    autoLoad?: string[];
    exclude?: string[];
    devMode?: boolean;
    verbose?: boolean;
    enableCache?: boolean;
    cacheDir?: string;
    allowUnsafePlugins?: boolean;
    trustedAuthors?: string[];
}
