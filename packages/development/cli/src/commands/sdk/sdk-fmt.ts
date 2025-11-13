import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import { BaseSDKCommand, SDKCommandOptions } from './base-sdk-command';
import { FrameworkDetector } from '../../utils/framework-detector';
import { ConfigLoader } from '../../utils/config-loader';

export interface FmtCommandOptions extends SDKCommandOptions {
  check?: boolean;
  'rust-only'?: boolean;
  'ts-only'?: boolean;
  files?: string;
}

export class SDKFmtCommand extends BaseSDKCommand {
  protected options: FmtCommandOptions;

  constructor(options: FmtCommandOptions, globalOptions: any) {
    super(options, globalOptions);
    this.options = options;
  }

  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🎨 Formattage du code Enterprise'));

    try {
      // Charger la configuration depuis enterprise.config.ts
      const configLoader = ConfigLoader.getInstance();
      const config = await configLoader.loadConfig(this.globalOptions.config);

      console.log(chalk.gray(`📁 Configuration chargée depuis: ${configLoader.getConfigPath()}`));

      // Afficher les informations de configuration pertinentes
      if (configLoader.isDebugMode()) {
        console.log(chalk.yellow('🐛 Mode debug activé'));
      }

      const enabledModules = configLoader.getEnabledModules();
      if (enabledModules.length > 0) {
        console.log(chalk.gray(`📦 Modules activés: ${enabledModules.join(', ')}`));
      }

      await this.detectFramework();

      const rustOnly = this.options['rust-only'];
      const tsOnly = this.options['ts-only'];
      const checkOnly = this.options.check;

      // Utiliser la configuration pour déterminer les actions
      const shouldFormatRust = config.runtime?.enableWasm || !tsOnly;

      if (rustOnly) {
        await this.formatRust(checkOnly);
      } else if (tsOnly) {
        await this.formatTypeScript(checkOnly);
      } else {
        await this.formatTypeScript(checkOnly);
        if (shouldFormatRust) {
          await this.formatRust(checkOnly);
        } else {
          console.log(
            chalk.gray('🦀 Formattage Rust désactivé (WASM non activé dans la configuration)')
          );
        }
      }

      if (!checkOnly) {
        console.log(chalk.green('\n✅ Formattage terminé avec succès!'));
      } else {
        console.log(chalk.green('\n✅ Vérification de format terminée!'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async formatTypeScript(checkOnly: boolean = false): Promise<void> {
    const spinner = ora('Formattage TypeScript...').start();

    try {
      // Formatter avec Prettier
      const prettierCmd = ['npx', 'prettier'];

      if (checkOnly) {
        prettierCmd.push('--check');
      } else {
        prettierCmd.push('--write');
      }

      prettierCmd.push(
        '**/*.{ts,tsx,js,jsx,json,md,yml,yaml}',
        '--ignore-path=.gitignore',
        '--no-error-on-unmatched-pattern'
      );

      if (this.options.files) {
        prettierCmd.push(this.options.files);
      }

      await this.executeCommand(prettierCmd);
      spinner.succeed('TypeScript formaté');
    } catch (error) {
      spinner.fail('Erreur lors du formattage TypeScript');
      throw error;
    }
  }

  private async formatRust(checkOnly: boolean = false): Promise<void> {
    const spinner = ora('Formattage Rust...').start();

    try {
      // Vérifier si rustfmt est disponible
      const hasRust = await this.checkRustInstallation();

      if (!hasRust) {
        spinner.warn('Rust non installé, formattage Rust ignoré');
        return;
      }

      // Formatter avec rustfmt
      const rustfmtCmd = ['cargo', 'fmt'];

      if (checkOnly) {
        rustfmtCmd.push('--', '--check');
      }

      await this.executeCommand(rustfmtCmd);
      spinner.succeed('Rust formaté');
    } catch (error) {
      spinner.fail('Erreur lors du formattage Rust');
      throw error;
    }
  }

  private async checkRustInstallation(): Promise<boolean> {
    return new Promise((resolve) => {
      const child = spawn('rustfmt', ['--version'], {
        stdio: 'pipe',
        shell: true,
      });

      child.on('close', (code) => {
        resolve(code === 0);
      });

      child.on('error', () => {
        resolve(false);
      });
    });
  }

  protected async executeCommand(command: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(command[0], command.slice(1), {
        stdio: 'inherit',
        cwd: process.cwd(),
        shell: true,
      });

      child.on('error', (error) => {
        reject(error);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Commande ${command.join(' ')} a échoué avec le code ${code}`));
        }
      });
    });
  }

  protected displayCommandInfo(command: string[]): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.blue('\n📊 Informations de formattage:'));
    console.log(`  Framework: ${chalk.cyan(this.frameworkInfo.name)}`);
    console.log(`  Commande: ${chalk.gray(command.join(' '))}`);

    if (this.options.check) {
      console.log(`  ${chalk.yellow('⚠')} Mode vérification uniquement`);
    }

    if (this.options['rust-only']) {
      console.log(`  ${chalk.yellow('🦀')} Formattage Rust uniquement`);
    }

    if (this.options['ts-only']) {
      console.log(`  ${chalk.blue('📘')} Formattage TypeScript uniquement`);
    }
  }
}
