import { existsSync } from 'fs';
import { resolve } from 'path';

// Interface locale pour éviter les problèmes de chemin
interface EnterpriseConfig {
  modules: {
    ai?: boolean;
    storage?: boolean;
    ui?: boolean;
    project?: boolean;
    auth?: boolean;
    sdk?: boolean;
  };
  runtime?: {
    wasmPath?: string;
    enableWasm?: boolean;
  };
  framework?: 'react' | 'svelte' | 'nextjs' | 'auto';
  debug?: boolean;
  branding?: {
    logo?: {
      path?: string;
      width?: number;
      height?: number;
      alt?: string;
      format?: 'png' | 'svg' | 'jpg' | 'jpeg' | 'webp';
    };
    companyName?: string;
    primaryColor?: string;
    secondaryColor?: string;
    theme?: 'light' | 'dark' | 'auto';
  };
}

/**
 * Charge et valide la configuration Enterprise depuis enterprise.config.ts
 */
export class ConfigLoader {
  private static instance: ConfigLoader;
  private config: EnterpriseConfig | null = null;
  private configPath: string | null = null;

  private constructor() {}

  static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }

  /**
   * Charge la configuration depuis le fichier enterprise.config.ts
   */
  async loadConfig(configPath?: string): Promise<EnterpriseConfig> {
    if (this.config && !configPath) {
      return this.config;
    }

    const configFile = configPath || this.findConfigFile();

    if (!configFile || !existsSync(configFile)) {
      throw new Error(
        `Fichier de configuration Enterprise introuvable: ${configFile || 'enterprise.config.ts'}`
      );
    }

    try {
      // Import dynamique du fichier de configuration
      const configPath = resolve(configFile);
      const configModule = await import(configPath);
      this.config = configModule.default || configModule;
      this.configPath = configFile;

      // Validation basique de la configuration
      this.validateConfig(this.config);

      return this.config!;
    } catch (error) {
      throw new Error(
        `Erreur lors du chargement de la configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Recherche le fichier de configuration dans le répertoire courant et les parents
   */
  private findConfigFile(): string | null {
    const possibleNames = ['enterprise.config.js', 'enterprise.config.mjs', 'enterprise.config.ts'];

    let currentDir = process.cwd();

    while (currentDir !== '/') {
      for (const name of possibleNames) {
        const configPath = resolve(currentDir, name);
        if (existsSync(configPath)) {
          return configPath;
        }
      }
      currentDir = resolve(currentDir, '..');
    }

    return null;
  }

  /**
   * Validation basique de la configuration
   */
  private validateConfig(config: any): void {
    if (!config || typeof config !== 'object') {
      throw new Error('La configuration doit être un objet valide');
    }

    if (!config.modules || typeof config.modules !== 'object') {
      throw new Error('La configuration doit contenir un objet "modules"');
    }

    // Validation des modules
    const validModules = ['ai', 'storage', 'ui', 'project', 'auth', 'sdk'];
    for (const [module, enabled] of Object.entries(config.modules)) {
      if (!validModules.includes(module)) {
        console.warn(
          `⚠️  Module "${module}" non reconnu. Modules valides: ${validModules.join(', ')}`
        );
      }
      if (typeof enabled !== 'boolean') {
        throw new Error(`Le module "${module}" doit être un booléen (true/false)`);
      }
    }

    // Validation du framework
    if (config.framework) {
      const validFrameworks = ['react', 'svelte', 'nextjs', 'auto'];
      if (!validFrameworks.includes(config.framework)) {
        throw new Error(
          `Framework "${config.framework}" non valide. Frameworks valides: ${validFrameworks.join(', ')}`
        );
      }
    }
  }

  /**
   * Retourne la configuration chargée
   */
  getConfig(): EnterpriseConfig | null {
    return this.config;
  }

  /**
   * Retourne le chemin du fichier de configuration
   */
  getConfigPath(): string | null {
    return this.configPath;
  }

  /**
   * Recharge la configuration
   */
  async reloadConfig(configPath?: string): Promise<EnterpriseConfig> {
    this.config = null;
    this.configPath = null;
    return this.loadConfig(configPath);
  }

  /**
   * Retourne les modules activés
   */
  getEnabledModules(): string[] {
    if (!this.config || !this.config.modules) {
      return [];
    }

    return Object.entries(this.config.modules)
      .filter(([_, enabled]) => enabled)
      .map(([module, _]) => module);
  }

  /**
   * Vérifie si un module spécifique est activé
   */
  isModuleEnabled(module: string): boolean {
    if (!this.config || !this.config.modules) {
      return false;
    }

    return this.config.modules[module as keyof typeof this.config.modules] === true;
  }

  /**
   * Retourne le framework configuré
   */
  getFramework(): string {
    return this.config?.framework || 'auto';
  }

  /**
   * Vérifie si le mode debug est activé
   */
  isDebugMode(): boolean {
    return this.config?.debug || false;
  }

  /**
   * Retourne la configuration de branding
   */
  getBranding() {
    return this.config?.branding || {};
  }

  /**
   * Retourne la configuration du runtime
   */
  getRuntime() {
    return this.config?.runtime || {};
  }
}
