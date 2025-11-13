import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import { FrameworkDetector, FrameworkInfo } from '../utils/framework-detector';

export interface BuildCommandOptions {
  output?: string;
  target?: string;
  analyze?: boolean;
  minify?: boolean;
  sourcemap?: boolean;
  mode?: 'development' | 'production';
  platform?: 'node' | 'browser' | 'neutral';
}

export class UniversalBuildCommand {
  private options: BuildCommandOptions;
  private globalOptions: any;
  private frameworkInfo: FrameworkInfo | null = null;

  constructor(options: BuildCommandOptions, globalOptions: any) {
    this.options = options;
    this.globalOptions = globalOptions;
  }

  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🏗️  Construction du projet Enterprise'));

    const spinner = ora('Détection du framework...').start();

    try {
      // Détecter le framework
      this.frameworkInfo = await FrameworkDetector.getInstance().detectFramework();
      spinner.succeed(`Framework détecté: ${chalk.cyan(this.frameworkInfo.name)}`);

      // Préparer les commandes
      const command = await this.prepareBuildCommand();

      console.log(chalk.gray(`📦 Commande: ${command.join(' ')}`));

      // Exécuter la commande de build
      await this.executeBuildCommand(command);

      // Afficher les informations de build
      this.displayBuildInfo();
    } catch (error) {
      spinner.fail('Erreur lors du build');
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async prepareBuildCommand(): Promise<string[]> {
    if (!this.frameworkInfo) {
      throw new Error('Framework non détecté');
    }

    const { name, buildCommands } = this.frameworkInfo;
    const output = this.options.output || 'dist';
    const mode = this.options.mode || 'production';

    switch (name) {
      case 'nextjs':
        const nextCmd = ['next', 'build'];
        if (this.options.analyze) nextCmd.push('--analyze');
        return nextCmd;

      case 'react':
        const reactCmd = ['vite', 'build'];
        if (output !== 'dist') reactCmd.push('--outDir', output);
        if (this.options.minify !== false) reactCmd.push('--minify');
        if (this.options.sourcemap) reactCmd.push('--sourcemap');
        return reactCmd;

      case 'svelte':
        // Vérifier si c'est SvelteKit
        const isSvelteKit = await this.isSvelteKit();
        if (isSvelteKit) {
          const svelteCmd = ['npm', 'run', 'build'];
          return svelteCmd;
        }
        return ['npm', 'run', 'build'];

      case 'vue':
        // Vérifier si c'est Nuxt
        const isNuxt = await this.isNuxt();
        if (isNuxt) {
          const nuxtCmd = ['nuxt', 'build'];
          return nuxtCmd;
        }
        return ['npm', 'run', 'build'];

      case 'nuxt':
        const nuxtCmd2 = ['nuxt', 'build'];
        return nuxtCmd2;

      case 'remix':
        const remixCmd = ['remix', 'build'];
        return remixCmd;

      case 'angular':
        const ngCmd = ['ng', 'build'];
        if (this.options.target) ngCmd.push('--configuration', this.options.target);
        if (output !== 'dist') ngCmd.push('--outputPath', output);
        return ngCmd;

      case 'gatsby':
        const gatsbyCmd = ['gatsby', 'build'];
        if (output !== 'public') gatsbyCmd.push('--prefix-paths', output);
        return gatsbyCmd;

      default:
        // Commande générique
        return buildCommands.length > 0 ? buildCommands[0].split(' ') : ['npm', 'run', 'build'];
    }
  }

  private async executeBuildCommand(command: string[]): Promise<void> {
    const spinner = ora('Construction en cours...').start();

    return new Promise((resolve, reject) => {
      const child = spawn(command[0], command.slice(1), {
        stdio: 'pipe',
        cwd: process.cwd(),
        env: {
          ...process.env,
          NODE_ENV: this.options.mode || 'production',
          ...(this.options.analyze && { ANALYZE: 'true' }),
          ...(this.options.minify !== false && { MINIFY: 'true' }),
          ...(this.options.sourcemap && { SOURCEMAP: 'true' }),
        },
      });

      let output = '';
      let errorOutput = '';

      child.stdout?.on('data', (data) => {
        const text = data.toString();
        output += text;
        spinner.text = this.extractProgress(text);
      });

      child.stderr?.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
      });

      child.on('close', (code) => {
        if (code === 0) {
          spinner.succeed('Build terminé avec succès');
          resolve();
        } else {
          spinner.fail('Build échoué');
          reject(new Error(`Process exited with code ${code}\\n${errorOutput}`));
        }
      });

      child.on('error', (error) => {
        spinner.fail('Erreur lors du build');
        reject(error);
      });
    });
  }

  private extractProgress(output: string): string {
    // Extraire les informations de progression des différents frameworks
    if (output.includes('Building')) return 'Construction en cours...';
    if (output.includes('Compiling')) return 'Compilation en cours...';
    if (output.includes('Bundling')) return 'Bundling en cours...';
    if (output.includes('Generating')) return 'Génération des fichiers...';
    return 'Construction en cours...';
  }

  private async isSvelteKit(): Promise<boolean> {
    try {
      const fs = await import('fs-extra');
      const packageJson = await fs.readJson('package.json');
      return !!(
        packageJson.dependencies?.['@sveltejs/kit'] ||
        packageJson.devDependencies?.['@sveltejs/kit']
      );
    } catch {
      return false;
    }
  }

  private async isNuxt(): Promise<boolean> {
    try {
      const fs = await import('fs-extra');
      const packageJson = await fs.readJson('package.json');
      return !!(packageJson.dependencies?.nuxt || packageJson.devDependencies?.nuxt);
    } catch {
      return false;
    }
  }

  private displayBuildInfo(): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.blue('\\n📊 Informations de build:'));
    console.log(`  Framework: ${chalk.cyan(this.frameworkInfo.name)}`);
    if (this.frameworkInfo.version) {
      console.log(`  Version: ${chalk.gray(this.frameworkInfo.version)}`);
    }

    console.log(`  Mode: ${chalk.yellow(this.options.mode || 'production')}`);
    console.log(`  Sortie: ${chalk.gray(this.options.output || 'dist')}`);

    if (this.options.analyze) {
      console.log(`  ${chalk.green('✓')} Analyse du bundle activée`);
    }
    if (this.options.minify !== false) {
      console.log(`  ${chalk.green('✓')} Minification activée`);
    }
    if (this.options.sourcemap) {
      console.log(`  ${chalk.green('✓')} Sourcemaps générés`);
    }

    console.log(chalk.gray('\\n💡 Prochaines étapes:'));
    console.log('  • Exécutez "enterprise start" pour démarrer en production');
    console.log('  • Utilisez "enterprise preview" pour prévisualiser le build');

    if (this.frameworkInfo.name === 'nextjs') {
      console.log('  • Next.js: "next start" pour le serveur de production');
    } else if (this.frameworkInfo.name === 'react') {
      console.log('  • Vite: "vite preview" pour prévisualiser');
    }
  }
}
