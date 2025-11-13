import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import { FrameworkDetector, FrameworkInfo } from '../../utils/framework-detector';
import { SDKConfigManager, SDKConfig } from '../../config/sdk-config';

export interface SDKCommandOptions {
  port?: string;
  host?: string;
  hot?: boolean;
  inspect?: boolean;
  turbo?: boolean;
  experimental?: boolean;
  env?: string;
  mode?: 'development' | 'production';
}

export abstract class BaseSDKCommand {
  protected options: SDKCommandOptions;
  protected globalOptions: any;
  protected frameworkInfo: FrameworkInfo | null = null;
  protected config: SDKConfig | null = null;
  protected configManager: SDKConfigManager;

  constructor(options: SDKCommandOptions, globalOptions: any) {
    this.options = options;
    this.globalOptions = globalOptions;
    this.configManager = SDKConfigManager.getInstance();
  }

  abstract execute(): Promise<void>;

  protected async detectFramework(): Promise<FrameworkInfo> {
    const spinner = ora('Détection du framework...').start();

    try {
      // Charger la configuration
      this.config = await this.configManager.loadConfig();

      // Détecter le framework
      this.frameworkInfo = await FrameworkDetector.getInstance().detectFramework();

      // Mettre à jour la configuration avec le framework détecté
      if (this.config && !this.config.framework) {
        this.config.framework = this.frameworkInfo.name;
      }

      spinner.succeed(`Framework détecté: ${chalk.cyan(this.frameworkInfo.name)}`);
      return this.frameworkInfo;
    } catch (error) {
      spinner.fail('Erreur lors de la détection du framework');
      throw error;
    }
  }

  protected displayCommandInfo(command: string[]): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.blue('\n📊 Informations SDK:'));
    console.log(`  Framework: ${chalk.cyan(this.frameworkInfo.name)}`);
    if (this.frameworkInfo.version) {
      console.log(`  Version: ${chalk.gray(this.frameworkInfo.version)}`);
    }
    console.log(`  Commande: ${chalk.gray(command.join(' '))}`);

    this.displayOptions();
  }

  private displayOptions(): void {
    if (this.options.hot) {
      console.log(`  ${chalk.green('✓')} Hot Reload activé`);
    }
    if (this.options.turbo) {
      console.log(`  ${chalk.green('✓')} Mode Turbo activé`);
    }
    if (this.options.experimental) {
      console.log(`  ${chalk.yellow('⚠')} Mode expérimental activé`);
    }
    if (this.options.inspect) {
      console.log(`  ${chalk.green('✓')} Debug inspector activé`);
    }
    if (this.options.env) {
      console.log(`  ${chalk.blue('🔧')} Environnement: ${this.options.env}`);
    }
  }

  protected createEnvironment(): Record<string, string> {
    const config = this.config;
    const envVars = {
      ...process.env,
      PORT: this.options.port || config?.dev?.port?.toString() || '3000',
      HOST: this.options.host || config?.dev?.host || 'localhost',
      NODE_ENV: this.options.mode || config?.build?.mode || 'development',
      ...(this.options.hot && { HOT_RELOAD: 'true' }),
      ...(this.options.inspect && { NODE_OPTIONS: '--inspect' }),
      ...(this.options.turbo && { TURBO: 'true' }),
      ...(this.options.experimental && { EXPERIMENTAL: 'true' }),
      ...(this.options.env && { ENVIRONMENT: this.options.env }),
    };

    // Ajouter les variables d'environnement personnalisées
    if (config?.env) {
      Object.assign(envVars, config.env);
    }

    return envVars;
  }

  protected async executeCommand(command: string[]): Promise<void> {
    console.log(chalk.gray(`📦 Exécution: ${command.join(' ')}`));

    const child = spawn(command[0], command.slice(1), {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: this.createEnvironment(),
    });

    child.on('error', (error) => {
      console.error(chalk.red("❌ Erreur lors de l'exécution:"), error.message);
      process.exit(1);
    });

    this.setupSignalHandlers(child);
  }

  private setupSignalHandlers(child: any): void {
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Arrêt en cours...'));
      child.kill('SIGINT');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      child.kill('SIGTERM');
      process.exit(0);
    });
  }

  protected getServerUrl(): string {
    const config = this.config;
    const host = this.options.host || config?.dev?.host || 'localhost';
    const port = this.options.port || config?.dev?.port?.toString() || '3000';
    return `http://${host}:${port}`;
  }
}
