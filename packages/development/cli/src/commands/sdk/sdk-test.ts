import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import { BaseSDKCommand, SDKCommandOptions } from './base-sdk-command';
import { FrameworkDetector } from '../../utils/framework-detector';
import { ConfigLoader } from '../../utils/config-loader';

export interface TestCommandOptions extends SDKCommandOptions {
  watch?: boolean;
  coverage?: boolean;
  ui?: boolean;
  'run-in-band'?: boolean;
  'test-name-pattern'?: string;
  'test-path-pattern'?: string;
  verbose?: boolean;
  'continue-on-error'?: boolean;
}

export class SDKTestCommand extends BaseSDKCommand {
  protected options: TestCommandOptions;

  constructor(options: TestCommandOptions, globalOptions: any) {
    super(options, globalOptions);
    this.options = options;
  }

  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🧪 Tests unifiés Enterprise'));

    try {
      // Charger la configuration depuis enterprise.config.ts
      const configLoader = ConfigLoader.getInstance();
      const config = await configLoader.loadConfig(this.globalOptions.config);

      console.log(chalk.gray(`📁 Configuration chargée depuis: ${configLoader.getConfigPath()}`));

      // Afficher les informations de configuration pertinentes
      if (configLoader.isDebugMode()) {
        console.log(chalk.yellow('🐛 Mode debug activé - Tests en mode verbeux'));
        this.options.verbose = true;
      }

      const enabledModules = configLoader.getEnabledModules();
      if (enabledModules.length > 0) {
        console.log(chalk.gray(`📦 Modules à tester: ${enabledModules.join(', ')}`));
      }

      await this.detectFramework();

      // Déterminer les types de tests en fonction des modules activés
      const testTypes = this.determineTestTypes(enabledModules);
      const testResults: any[] = [];

      for (const testType of testTypes) {
        console.log(chalk.blue(`\n📋 Exécution des tests ${testType}...`));

        const spinner = ora(`Tests ${testType} en cours...`).start();

        try {
          await this.runTests(testType);
          spinner.succeed(`Tests ${testType} terminés`);
          testResults.push({ type: testType, status: 'success' });
        } catch (error) {
          spinner.fail(`Tests ${testType} échoués`);
          testResults.push({ type: testType, status: 'failed', error });

          if (!this.options['continue-on-error']) {
            throw error;
          }
        }
      }

      this.displayTestSummary(testResults);
    } catch (error) {
      console.error(
        chalk.red('\n❌ Tests unifiés échoués'),
        error instanceof Error ? error.message : error
      );
      process.exit(1);
    }
  }

  private determineTestTypes(enabledModules: string[]): string[] {
    const testTypes: string[] = ['unitaires'];

    // Ajouter les tests d'intégration si les modules pertinents sont activés
    const integrationModules = ['auth', 'storage', 'project'];
    if (enabledModules.some((module) => integrationModules.includes(module))) {
      testTypes.push('intégration');
    }

    // Ajouter les tests E2E si le module UI est activé
    if (enabledModules.includes('ui')) {
      testTypes.push('e2e');
    }

    return testTypes;
  }

  private async runTests(testType: string): Promise<void> {
    if (!this.frameworkInfo) {
      throw new Error('Framework non détecté');
    }

    const { name: framework } = this.frameworkInfo;
    let command: string[] = [];

    switch (testType) {
      case 'unitaires':
        command = this.buildUnitTestCommand(framework);
        break;
      case 'intégration':
        command = this.buildIntegrationTestCommand(framework);
        break;
      case 'e2e':
        command = this.buildE2ETestCommand(framework);
        break;
      default:
        throw new Error(`Type de test non supporté: ${testType}`);
    }

    await this.executeCommand(command);
  }

  private buildUnitTestCommand(framework: string): string[] {
    const baseCommand = ['npx', 'vitest', 'run'];

    // Options globales
    if (this.options.coverage) {
      baseCommand.push('--coverage');
    }

    if (this.options.verbose) {
      baseCommand.push('--verbose');
    }

    if (this.options['run-in-band']) {
      baseCommand.push('--run-in-band');
    }

    if (this.options['test-name-pattern']) {
      baseCommand.push('--testNamePattern', this.options['test-name-pattern']);
    }

    if (this.options['test-path-pattern']) {
      baseCommand.push('--testPathPattern', this.options['test-path-pattern']);
    }

    // Spécifique au framework
    switch (framework) {
      case 'nextjs':
        baseCommand.push('**/*.test.{ts,tsx,js,jsx}', '--config=vitest.config.ts');
        break;
      case 'react':
        baseCommand.push('src/**/*.{test,spec}.{ts,tsx}', '--config=src/setupTests.ts');
        break;
      case 'svelte':
        baseCommand.push('src/**/*.{test,spec}.{ts,js}', '--config=vite.config.ts');
        break;
      default:
        baseCommand.push('**/*.{test,spec}.{ts,js,tsx,jsx}');
    }

    return baseCommand;
  }

  private buildIntegrationTestCommand(framework: string): string[] {
    const baseCommand = ['npx', 'vitest', 'run'];

    // Options globales
    if (this.options.coverage) {
      baseCommand.push('--coverage');
    }

    if (this.options.verbose) {
      baseCommand.push('--verbose');
    }

    // Spécifique au framework
    switch (framework) {
      case 'nextjs':
        baseCommand.push('**/*.integration.{test,spec}.{ts,tsx}', '--config=vitest.config.ts');
        break;
      case 'react':
        baseCommand.push('src/**/*.integration.{test,spec}.{ts,tsx}', '--config=src/setupTests.ts');
        break;
      default:
        baseCommand.push('**/*.integration.{test,spec}.{ts,js,tsx,jsx}');
    }

    return baseCommand;
  }

  private buildE2ETestCommand(framework: string): string[] {
    const baseCommand: string[] = [];

    switch (framework) {
      case 'nextjs':
        baseCommand.push('npx', 'playwright', 'test');
        if (this.options.verbose) {
          baseCommand.push('--reporter=list');
        }
        break;
      case 'react':
        baseCommand.push('npx', 'cypress', 'run');
        if (this.options.verbose) {
          baseCommand.push('--reporter', 'spec');
        }
        break;
      default:
        baseCommand.push('npx', 'playwright', 'test');
    }

    return baseCommand;
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

  private displayTestSummary(results: any[]): void {
    console.log(chalk.blue('\n📊 Résumé des tests:'));

    const successful = results.filter((r) => r.status === 'success').length;
    const failed = results.filter((r) => r.status === 'failed').length;
    const total = results.length;

    console.log(`  Total: ${chalk.cyan(total.toString())}`);
    console.log(`  Réussis: ${chalk.green(successful.toString())}`);
    console.log(`  Échoués: ${chalk.red(failed.toString())}`);

    if (failed > 0) {
      console.log(chalk.red('\n❌ Tests échoués:'));
      results
        .filter((r) => r.status === 'failed')
        .forEach((result) => {
          console.log(
            `  - ${result.type}: ${result.error instanceof Error ? result.error.message : result.error}`
          );
        });
    }

    if (failed === 0) {
      console.log(chalk.green('\n✅ Tous les tests ont réussi!'));
    }
  }

  protected displayCommandInfo(command: string[]): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.blue('\n📊 Informations de test:'));
    console.log(`  Framework: ${chalk.cyan(this.frameworkInfo.name)}`);
    console.log(`  Commande: ${chalk.gray(command.join(' '))}`);

    if (this.options.coverage) {
      console.log(`  ${chalk.yellow('📊')} Couverture de code activée`);
    }

    if (this.options.watch) {
      console.log(`  ${chalk.yellow('👀')} Mode watch activé`);
    }

    if (this.options.verbose) {
      console.log(`  ${chalk.yellow('🐛')} Mode verbeux activé`);
    }
  }
}
