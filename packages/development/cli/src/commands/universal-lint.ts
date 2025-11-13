import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import { FrameworkDetector, FrameworkInfo } from '../utils/framework-detector';

export interface LintCommandOptions {
  fix?: boolean;
  cache?: boolean;
  maxWarnings?: string;
  quiet?: boolean;
  format?: string;
  outputFile?: string;
}

export class UniversalLintCommand {
  private options: LintCommandOptions;
  private globalOptions: any;
  private frameworkInfo: FrameworkInfo | null = null;

  constructor(options: LintCommandOptions, globalOptions: any) {
    this.options = options;
    this.globalOptions = globalOptions;
  }

  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🔍 Analyse du code Enterprise'));

    const spinner = ora('Détection du framework...').start();

    try {
      // Détecter le framework
      this.frameworkInfo = await FrameworkDetector.getInstance().detectFramework();
      spinner.succeed(`Framework détecté: ${chalk.cyan(this.frameworkInfo.name)}`);

      // Préparer les commandes
      const commands = await this.prepareLintCommands();

      // Exécuter les commandes de lint
      await this.executeLintCommands(commands);

      // Afficher les informations
      this.displayLintInfo();
    } catch (error) {
      spinner.fail('Erreur lors du lint');
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async prepareLintCommands(): Promise<string[][]> {
    if (!this.frameworkInfo) {
      throw new Error('Framework non détecté');
    }

    const { name } = this.frameworkInfo;
    const commands: string[][] = [];

    // Commandes ESLint (universelles)
    const eslintCmd = ['npx', 'eslint', '.', '--ext', '.js,.jsx,.ts,.tsx,.vue,.svelte'];
    if (this.options.fix) eslintCmd.push('--fix');
    if (this.options.cache !== false) eslintCmd.push('--cache');
    if (this.options.quiet) eslintCmd.push('--quiet');
    if (this.options.format) eslintCmd.push('--format', this.options.format);
    if (this.options.outputFile) eslintCmd.push('--output-file', this.options.outputFile);
    if (this.options.maxWarnings) eslintCmd.push('--max-warnings', this.options.maxWarnings);

    commands.push(eslintCmd);

    // Commandes spécifiques au framework
    switch (name) {
      case 'nextjs':
        // Next.js ESLint configuration
        commands.push(['npx', 'next', 'lint']);
        break;

      case 'react':
        // Vérifier si TypeScript est utilisé
        const hasTypeScript = await this.hasTypeScript();
        if (hasTypeScript) {
          commands.push(['npx', 'tsc', '--noEmit']);
        }
        break;

      case 'svelte':
        // Svelte specific linting
        commands.push(['npx', 'svelte-check']);
        break;

      case 'vue':
        // Vue specific linting
        commands.push(['npx', 'vue-tsc', '--noEmit']);
        break;

      case 'angular':
        // Angular specific linting
        commands.push(['ng', 'lint']);
        if (this.options.fix) commands[commands.length - 1].push('--fix');
        break;

      case 'nuxt':
        // Nuxt TypeScript checking
        commands.push(['npx', 'nuxi', 'typecheck']);
        break;

      case 'remix':
        // Remix TypeScript checking
        commands.push(['npx', 'tsc', '--noEmit']);
        break;

      case 'gatsby':
        // Gatsby specific checks
        commands.push(['npx', 'gatsby', 'info']);
        break;
    }

    // Prettier (formatage)
    const prettierCmd = ['npx', 'prettier', '--check', '.'];
    if (this.options.fix) {
      prettierCmd[2] = '--write';
    }
    commands.push(prettierCmd);

    return commands;
  }

  private async executeLintCommands(commands: string[][]): Promise<void> {
    let hasErrors = false;
    let hasWarnings = false;

    for (const command of commands) {
      const spinner = ora(`Exécution: ${command.join(' ')}`).start();

      try {
        await this.executeCommand(command);
        spinner.succeed();
      } catch (error) {
        spinner.fail();

        // Vérifier si c'est une erreur ou un avertissement
        const errorStr = error instanceof Error ? error.message : String(error);
        if (errorStr.includes('error') || errorStr.includes('Error')) {
          hasErrors = true;
        } else {
          hasWarnings = true;
        }

        // Afficher l'erreur si ce n'est pas en mode quiet
        if (!this.options.quiet) {
          console.error(chalk.red(`❌ Erreur dans: ${command.join(' ')}`));
          console.error(chalk.gray(errorStr));
        }
      }
    }

    // Afficher le résumé
    console.log(chalk.blue('\\n📊 Résumé du lint:'));

    if (hasErrors) {
      console.log(chalk.red('  ❌ Erreurs détectées'));
      console.log(chalk.gray('  💡 Exécutez avec --fix pour corriger automatiquement'));
    } else if (hasWarnings) {
      console.log(chalk.yellow('  ⚠️  Avertissements détectés'));
    } else {
      console.log(chalk.green('  ✅ Aucune erreur détectée'));
    }

    // Quitter avec le bon code de sortie
    if (hasErrors) {
      process.exit(1);
    } else if (hasWarnings && this.options.maxWarnings === '0') {
      process.exit(1);
    }
  }

  private async executeCommand(command: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(command[0], command.slice(1), {
        stdio: this.options.quiet ? 'pipe' : 'inherit',
        cwd: process.cwd(),
        env: {
          ...process.env,
          ...(this.options.cache !== false && { ESLINT_CACHE: 'true' }),
        },
      });

      let output = '';
      let errorOutput = '';

      if (this.options.quiet) {
        child.stdout?.on('data', (data) => {
          output += data.toString();
        });

        child.stderr?.on('data', (data) => {
          errorOutput += data.toString();
        });
      }

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(`Process exited with code ${code}${errorOutput ? '\\n' + errorOutput : ''}`)
          );
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  private async hasTypeScript(): Promise<boolean> {
    try {
      const fs = await import('fs-extra');
      const packageJson = await fs.readJson('package.json');
      return !!(packageJson.dependencies?.typescript || packageJson.devDependencies?.typescript);
    } catch {
      return false;
    }
  }

  private displayLintInfo(): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.blue('\\n📊 Informations de lint:'));
    console.log(`  Framework: ${chalk.cyan(this.frameworkInfo.name)}`);
    if (this.frameworkInfo.version) {
      console.log(`  Version: ${chalk.gray(this.frameworkInfo.version)}`);
    }

    if (this.options.fix) {
      console.log(`  ${chalk.green('✓')} Corrections automatiques activées`);
    }
    if (this.options.cache !== false) {
      console.log(`  ${chalk.green('✓')} Cache activé`);
    }
    if (this.options.quiet) {
      console.log(`  ${chalk.yellow('⚠')} Mode silencieux activé`);
    }
    if (this.options.format) {
      console.log(`  Format: ${chalk.cyan(this.options.format)}`);
    }

    console.log(chalk.gray('\\n💡 Outils utilisés:'));
    console.log('  • ESLint - Analyse du code JavaScript/TypeScript');
    console.log('  • Prettier - Formatage du code');

    switch (this.frameworkInfo.name) {
      case 'nextjs':
        console.log('  • Next.js lint - Règles spécifiques Next.js');
        break;
      case 'svelte':
        console.log('  • Svelte-check - Validation Svelte');
        break;
      case 'vue':
        console.log('  • Vue TSC - Validation TypeScript Vue');
        break;
      case 'angular':
        console.log('  • Angular lint - Règles spécifiques Angular');
        break;
      case 'nuxt':
        console.log('  • Nuxi typecheck - Validation Nuxt');
        break;
    }

    console.log(chalk.gray('\\n🔧 Configuration:'));
    console.log('  • .eslintrc.js/.eslintrc.json - Configuration ESLint');
    console.log('  • .prettierrc - Configuration Prettier');
    console.log('  • eslint.config.js - Configuration ESLint moderne');
  }
}
