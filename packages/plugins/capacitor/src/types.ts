/**
 * @fileoverview Plugin Types
 * Types importés depuis le core pour éviter les problèmes d'export
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
  category?: string;
  tags?: string[];
  supports?: string[];
  configSchema?: PluginConfigSchema;
  enterprise?: {
    certified?: boolean;
    recommended?: boolean;
    deprecated?: boolean;
    experimental?: boolean;
  };
  hooks?: Array<{
    name: string;
    description: string;
    timing: 'before' | 'after' | 'around';
    event: string;
    priority?: number;
  }>;
}

export interface PluginConfigSchema {
  type: 'object';
  properties?: Record<string, any>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface PluginContext {
  config: any;
  logger: {
    info: (message: string, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    error: (message: string, ...args: any[]) => void;
    success: (message: string, ...args: any[]) => void;
    debug: (message: string, ...args: any[]) => void;
  };
  utils: {
    readFile: (path: string) => Promise<string>;
    writeFile: (path: string, content: string) => Promise<void>;
    existsFile: (path: string) => Promise<boolean>;
    getPackageJson: () => Promise<any>;
    updatePackageJson: (updates: any) => Promise<void>;
    exec: (command: string) => Promise<{ stdout: string; stderr: string }>;
  };
  events: {
    emit: (event: string, data?: any) => void;
    on: (event: string, handler: (data?: any) => void) => void;
    off: (event: string, handler: (data?: any) => void) => void;
  };
}

export interface PluginCommandOption {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
  required?: boolean;
  default?: any;
  choices?: string[];
}

export interface PluginCommand {
  name: string;
  description: string;
  category: string;
  options?: PluginCommandOption[];
  handler: (args: any, context: PluginContext) => Promise<void>;
}

export interface EnterprisePlugin {
  readonly manifest: PluginManifest;
  initialize(context: PluginContext): Promise<void>;
  destroy(): Promise<void>;
  onBeforeBuild?(context: PluginContext): Promise<void>;
  onAfterBuild?(context: PluginContext): Promise<void>;
  onBeforeDev?(context: PluginContext): Promise<void>;
  onAfterDev?(context: PluginContext): Promise<void>;
  onModuleLoad?(moduleName: string, moduleInstance: any): Promise<void>;
  getCommands?(): PluginCommand[];
  getConfigSchema?(): PluginConfigSchema;
  validateConfig?(config: any): boolean | string;
}
