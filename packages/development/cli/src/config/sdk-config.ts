import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export interface SDKConfig {
  framework?: string;
  dev?: {
    port?: number;
    host?: string;
    hot?: boolean;
    turbo?: boolean;
    experimental?: boolean;
    inspect?: boolean;
  };
  build?: {
    output?: string;
    target?: string;
    mode?: 'development' | 'production';
    platform?: string;
    minify?: boolean;
    sourcemap?: boolean;
    analyze?: boolean;
  };
  start?: {
    port?: number;
    host?: string;
    workers?: string | number;
  };
  preview?: {
    port?: number;
    host?: string;
    open?: boolean;
  };
  lint?: {
    fix?: boolean;
    cache?: boolean;
    maxWarnings?: number;
    quiet?: boolean;
    format?: string;
  };
  plugins?: string[];
  env?: Record<string, string>;
}

export class SDKConfigManager {
  private static instance: SDKConfigManager;
  private config: SDKConfig | null = null;
  private configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || join(process.cwd(), 'enterprise.sdk.config.js');
  }

  static getInstance(configPath?: string): SDKConfigManager {
    if (!SDKConfigManager.instance) {
      SDKConfigManager.instance = new SDKConfigManager(configPath);
    }
    return SDKConfigManager.instance;
  }

  async loadConfig(): Promise<SDKConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      // Importer dynamiquement la configuration
      const configModule = await import(`file://${this.configPath}`);
      this.config = (configModule.default || configModule) as SDKConfig;

      return this.config!;
    } catch (error) {
      // Config non trouvée, retourner la configuration par défaut
      this.config = this.getDefaultConfig();
      return this.config;
    }
  }

  async saveConfig(config: SDKConfig): Promise<void> {
    const configContent = `// Enterprise SDK Configuration
export default ${JSON.stringify(config, null, 2)};`;

    await writeFile(this.configPath, configContent, 'utf8');
    this.config = config;
  }

  private getDefaultConfig(): SDKConfig {
    return {
      dev: {
        port: 3000,
        host: 'localhost',
        hot: true,
        turbo: false,
        experimental: false,
        inspect: false,
      },
      build: {
        output: 'dist',
        target: 'production',
        mode: 'production',
        platform: 'browser',
        minify: true,
        sourcemap: false,
        analyze: false,
      },
      start: {
        port: 3000,
        host: '0.0.0.0',
        workers: 'auto',
      },
      preview: {
        port: 4173,
        host: 'localhost',
        open: false,
      },
      lint: {
        fix: false,
        cache: true,
        maxWarnings: 10,
        quiet: false,
        format: 'stylish',
      },
      plugins: [],
      env: {},
    };
  }

  async initConfig(): Promise<void> {
    const defaultConfig = this.getDefaultConfig();
    await this.saveConfig(defaultConfig);
  }

  mergeWithDefaults(userConfig: Partial<SDKConfig>): SDKConfig {
    const defaults = this.getDefaultConfig();

    return {
      ...defaults,
      ...userConfig,
      dev: { ...defaults.dev, ...userConfig.dev },
      build: { ...defaults.build, ...userConfig.build },
      start: { ...defaults.start, ...userConfig.start },
      preview: { ...defaults.preview, ...userConfig.preview },
      lint: { ...defaults.lint, ...userConfig.lint },
      env: { ...defaults.env, ...userConfig.env },
    };
  }

  getConfigPath(): string {
    return this.configPath;
  }

  clearCache(): void {
    this.config = null;
  }
}
