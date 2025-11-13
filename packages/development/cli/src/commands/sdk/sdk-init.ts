import chalk from 'chalk';
import { writeFileSync, existsSync } from 'fs';
import { BaseSDKCommand, SDKCommandOptions } from './base-sdk-command';
import { ConfigLoader } from '../../utils/config-loader';

export interface InitCommandOptions extends SDKCommandOptions {
  force?: boolean;
}

export class SDKInitCommand extends BaseSDKCommand {
  protected options: InitCommandOptions;

  constructor(options: InitCommandOptions, globalOptions: any) {
    super(options, globalOptions);
    this.options = options;
  }

  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🔧 Initialisation de la configuration SDK'));

    try {
      const force = this.options.force;
      const configPath = this.globalOptions.config || './enterprise.config.js';

      if (existsSync(configPath) && !force) {
        console.log(chalk.yellow(`⚠️  Le fichier ${configPath} existe déjà.`));
        console.log(chalk.gray('Utilisez --force pour l écraser.'));

        // Afficher la configuration actuelle si elle existe
        try {
          const configLoader = ConfigLoader.getInstance();
          const config = await configLoader.loadConfig(configPath);
          console.log(chalk.blue('\n📋 Configuration actuelle:'));
          console.log(`  Framework: ${chalk.cyan(config.framework || 'auto')}`);
          console.log(
            `  Modules: ${chalk.cyan(
              Object.keys(config.modules || {})
                .filter((m) => config.modules![m as keyof typeof config.modules])
                .join(', ') || 'aucun'
            )}`
          );
          console.log(`  Debug: ${chalk.cyan(config.debug ? 'activé' : 'désactivé')}`);
        } catch {
          console.log(chalk.gray('   (Impossible de lire la configuration existante)'));
        }

        return;
      }

      await this.createConfigFile(configPath);

      console.log(chalk.green(`✅ Configuration initialisée: ${configPath}`));
      console.log(chalk.gray('   Vous pouvez maintenant personnaliser votre configuration.'));

      // Afficher un résumé de la configuration créée
      console.log(chalk.blue('\n📋 Configuration créée avec:'));
      console.log(`  Framework: ${chalk.cyan('auto')}`);
      console.log(`  Modules: ${chalk.cyan('ai, storage, ui, auth, project, sdk')}`);
      console.log(`  Runtime WASM: ${chalk.cyan('activé')}`);
      console.log(`  Mode debug: ${chalk.cyan('désactivé')}`);

      console.log(chalk.gray('\n💡 Prochaines étapes:'));
      console.log(chalk.gray('   1. Personnalisez enterprise.config.js selon vos besoins'));
      console.log(chalk.gray('   2. Exécutez "enterprise fmt" pour formater votre code'));
      console.log(chalk.gray('   3. Exécutez "enterprise test" pour lancer les tests'));
    } catch (error) {
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async createConfigFile(configPath: string): Promise<void> {
    const isTypeScript = configPath.endsWith('.ts');
    const defaultConfig = isTypeScript
      ? this.generateTypeScriptConfig()
      : this.generateJavaScriptConfig();
    writeFileSync(configPath, defaultConfig, 'utf-8');
  }

  private generateTypeScriptConfig(): string {
    return `/**
 * @fileoverview Enterprise Configuration
 * Configuration principale pour le SDK Enterprise
 */

import { EnterpriseConfig } from './src/types';

const config: EnterpriseConfig = {
  modules: {
    ai: true,
    storage: true,
    ui: true,
    auth: true,
    project: true,
    sdk: true,
  },

  runtime: {
    wasmPath: '/wasm/euse_core.wasm',
    enableWasm: true,
  },

  framework: 'auto',
  debug: false,

  branding: {
    logo: {
      path: './assets/enterprise.png',
      width: 200,
      height: 60,
      alt: 'Sky Genesis Enterprise',
      format: 'png',
    },

    companyName: 'Sky Genesis Enterprise',
    primaryColor: '#007acc',
    secondaryColor: '#004466',
    theme: 'auto',
  },
};

export default config;
`;
  }

  private generateJavaScriptConfig(): string {
    return `/**
 * @fileoverview Enterprise Configuration
 * Configuration principale pour le SDK Enterprise
 */

const config = {
  modules: {
    ai: true,
    storage: true,
    ui: true,
    auth: true,
    project: true,
    sdk: true,
  },

  runtime: {
    wasmPath: '/wasm/euse_core.wasm',
    enableWasm: true,
  },

  framework: 'auto',
  debug: false,

  branding: {
    logo: {
      path: './assets/enterprise.png',
      width: 200,
      height: 60,
      alt: 'Sky Genesis Enterprise',
      format: 'png',
    },

    companyName: 'Sky Genesis Enterprise',
    primaryColor: '#007acc',
    secondaryColor: '#004466',
    theme: 'auto',
  },
};

// Pour compatibilité avec ES modules et CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
} else {
  export default config;
}
`;
  }

  protected displayCommandInfo(command: string[]): void {
    console.log(chalk.blue('\n📊 Informations d initialisation:'));
    console.log(`  Configuration: ${chalk.gray(command.join(' '))}`);

    if (this.options.force) {
      console.log(`  ${chalk.yellow('⚡')} Mode forcé - Écrasement de la configuration existante`);
    }
  }
}
