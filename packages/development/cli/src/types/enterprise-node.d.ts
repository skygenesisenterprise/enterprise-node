declare module '@skygenesisenterprise/enterprise-node' {
  export class PluginManager {
    static getInstance(): PluginManager;
    initialize(): Promise<void>;
    getPlugins(): any[];
    installPlugin(source: string): Promise<void>;
    uninstallPlugin(name: string): Promise<void>;
    activatePlugin(name: string): Promise<void>;
    deactivatePlugin(name: string): Promise<void>;
  }
}
