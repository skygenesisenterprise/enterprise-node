import { EnterpriseConfig } from '@skygenesisenterprise/shared';
import { Logger } from '@skygenesisenterprise/shared';

let config: EnterpriseConfig | null = null;
const logger = Logger.getInstance();

export function loadConfig(): EnterpriseConfig {
  if (config) {
    return config;
  }

  const defaultConfig: EnterpriseConfig = {
    modules: {
      ai: true,
      storage: true,
      ui: true,
      project: true,
      auth: true
    },
    runtime: {
      wasmPath: '/wasm/euse_core.wasm',
      enableWasm: true,
      maxMemoryMB: 512
    },
    framework: 'auto',
    debug: false,
    telemetry: {
      enabled: false,
      endpoint: 'https://telemetry.skygenesisenterprise.com'
    },
    performance: {
      enableProfiling: false,
      enableMetrics: true
    }
  };

  try {
    // Try to load from global window (browser)
    if (typeof window !== 'undefined' && (window as any).enterpriseConfig) {
      config = { ...defaultConfig, ...(window as any).enterpriseConfig };
      logger.debug('config', 'Loaded configuration from window.enterpriseConfig');
    }
    // Try to load from file system (Node.js)
    else if (typeof require !== 'undefined') {
      try {
        // Try multiple possible config file locations
        const possiblePaths = [
          '../../../enterprise.config',
          '../../enterprise.config',
          '../enterprise.config',
          './enterprise.config'
        ];
        
        let userConfig = null;
        for (const path of possiblePaths) {
          try {
            userConfig = require(path);
            break;
          } catch (e) {
            // Continue to next path
          }
        }
        
        if (userConfig) {
          config = { ...defaultConfig, ...userConfig.default || userConfig };
          logger.debug('config', `Loaded configuration from ${possiblePaths.find(p => {
            try {
              require.resolve(p);
              return true;
            } catch {
              return false;
            }
          })}`);
        } else {
          config = defaultConfig;
          logger.debug('config', 'No user config found, using defaults');
        }
      } catch (e) {
        config = defaultConfig;
        logger.debug('config', 'Failed to load user config, using defaults', { error: e });
      }
    }
    // Fallback to defaults
    else {
      config = defaultConfig;
      logger.debug('config', 'Using default configuration');
    }
  } catch (error) {
    logger.warn('config', 'Failed to load configuration, using defaults', { error });
    config = defaultConfig;
  }

  // Validate configuration
  validateConfig(config);
  
  return config;
}

export function setConfig(userConfig: Partial<EnterpriseConfig>): void {
  const currentConfig = loadConfig();
  config = { ...currentConfig, ...userConfig };
  validateConfig(config);
  logger.debug('config', 'Configuration updated', { config });
}

export function resetConfig(): void {
  config = null;
  logger.debug('config', 'Configuration reset');
}

function validateConfig(config: EnterpriseConfig): void {
  // Validate modules
  if (!config.modules || typeof config.modules !== 'object') {
    throw new Error('Invalid configuration: modules must be an object');
  }

  // Validate runtime
  if (config.runtime) {
    if (config.runtime.maxMemoryMB && (config.runtime.maxMemoryMB < 64 || config.runtime.maxMemoryMB > 4096)) {
      throw new Error('Invalid configuration: maxMemoryMB must be between 64 and 4096');
    }
  }

  // Validate framework
  const validFrameworks = ['react', 'svelte', 'nextjs', 'vue', 'auto'];
  if (config.framework && !validFrameworks.includes(config.framework)) {
    throw new Error(`Invalid configuration: framework must be one of ${validFrameworks.join(', ')}`);
  }

  // Validate telemetry
  if (config.telemetry?.enabled && config.telemetry.endpoint) {
    try {
      new URL(config.telemetry.endpoint);
    } catch {
      throw new Error('Invalid configuration: telemetry.endpoint must be a valid URL');
    }
  }

  logger.debug('config', 'Configuration validation passed');
}

export function getConfigSchema(): any {
  return {
    type: 'object',
    properties: {
      modules: {
        type: 'object',
        properties: {
          ai: { type: 'boolean' },
          storage: { type: 'boolean' },
          ui: { type: 'boolean' },
          project: { type: 'boolean' },
          auth: { type: 'boolean' }
        }
      },
      runtime: {
        type: 'object',
        properties: {
          wasmPath: { type: 'string' },
          enableWasm: { type: 'boolean' },
          maxMemoryMB: { type: 'number', minimum: 64, maximum: 4096 }
        }
      },
      framework: {
        type: 'string',
        enum: ['react', 'svelte', 'nextjs', 'vue', 'auto']
      },
      debug: { type: 'boolean' },
      telemetry: {
        type: 'object',
        properties: {
          enabled: { type: 'boolean' },
          endpoint: { type: 'string', format: 'uri' }
        }
      },
      performance: {
        type: 'object',
        properties: {
          enableProfiling: { type: 'boolean' },
          enableMetrics: { type: 'boolean' }
        }
      }
    }
  };
}