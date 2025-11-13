import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import { FrameworkDetector, FrameworkInfo } from '../utils/framework-detector';

export interface PreviewCommandOptions {
  port?: string;
  host?: string;
  open?: boolean;
  output?: string;
}

export class UniversalPreviewCommand {
  private options: PreviewCommandOptions;
  private globalOptions: any;
  private frameworkInfo: FrameworkInfo | null = null;

  constructor(options: PreviewCommandOptions, globalOptions: any) {
    this.options = options;
    this.globalOptions = globalOptions;
  }

  async execute(): Promise<void> {
    console.log(chalk.blue.bold('👁️  Prévisualisation du build Enterprise'));

    const spinner = ora('Détection du framework...').start();

    try {
      // Détecter le framework
      this.frameworkInfo = await FrameworkDetector.getInstance().detectFramework();
      spinner.succeed(`Framework détecté: ${chalk.cyan(this.frameworkInfo.name)}`);

      // Vérifier si le build existe
      await this.checkBuildExists();

      // Préparer les commandes
      const command = await this.preparePreviewCommand();

      console.log(chalk.gray(`📦 Commande: ${command.join(' ')}`));
      console.log(
        chalk.cyan(`🌐 http://${this.options.host || 'localhost'}:${this.options.port || '4173'}`)
      );

      // Démarrer le processus
      const child = spawn(command[0], command.slice(1), {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: {
          ...process.env,
          PORT: this.options.port || '4173',
          HOST: this.options.host || 'localhost',
          ...(this.options.open && { OPEN: 'true' }),
        },
      });

      child.on('error', (error) => {
        console.error(
          chalk.red('❌ Erreur lors du démarrage de la prévisualisation:'),
          error.message
        );
        process.exit(1);
      });

      // Gérer les signaux
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\\n🛑 Arrêt de la prévisualisation...'));
        child.kill('SIGINT');
        process.exit(0);
      });

      process.on('SIGTERM', () => {
        child.kill('SIGTERM');
        process.exit(0);
      });

      // Afficher les informations utiles
      this.displayPreviewInfo();
    } catch (error) {
      spinner.fail('Erreur lors du démarrage');
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async checkBuildExists(): Promise<void> {
    const fs = await import('fs-extra');
    const outputDir = this.getOutputDir();

    if (!(await fs.pathExists(outputDir))) {
      console.log(chalk.yellow(`⚠️  Le répertoire de build '${outputDir}' n'existe pas.`));
      console.log(chalk.gray('💡 Exécutez "enterprise build" pour construire le projet.'));

      const ora = await import('ora');
      const spinner = ora.default('Construction automatique...').start();

      try {
        // Importer et exécuter la commande build
        const { UniversalBuildCommand } = await import('./universal-build');
        const buildCommand = new UniversalBuildCommand({}, this.globalOptions);
        await buildCommand.execute();
        spinner.succeed('Build automatique terminé');
      } catch (error) {
        spinner.fail('Build automatique échoué');
        throw error;
      }
    }
  }

  private getOutputDir(): string {
    if (!this.frameworkInfo) return 'dist';

    switch (this.frameworkInfo.name) {
      case 'nextjs':
        return '.next';
      case 'gatsby':
        return 'public';
      default:
        return 'dist';
    }
  }

  private async preparePreviewCommand(): Promise<string[]> {
    if (!this.frameworkInfo) {
      throw new Error('Framework non détecté');
    }

    const { name } = this.frameworkInfo;
    const port = this.options.port || '4173';
    const host = this.options.host || 'localhost';

    switch (name) {
      case 'nextjs':
        const nextCmd = ['next', 'start'];
        if (port !== '3000') nextCmd.push('-p', port);
        if (host !== 'localhost') nextCmd.push('-H', host);
        return nextCmd;

      case 'react':
        const reactCmd = ['vite', 'preview'];
        if (port !== '4173') reactCmd.push('--port', port);
        if (host !== 'localhost') reactCmd.push('--host', host);
        if (this.options.open) reactCmd.push('--open');
        return reactCmd;

      case 'svelte':
        // Vérifier si c'est SvelteKit
        const isSvelteKit = await this.isSvelteKit();
        if (isSvelteKit) {
          const svelteCmd = ['npm', 'run', 'preview'];
          if (port !== '4173') svelteCmd.push('--', '--port', port);
          if (host !== 'localhost') svelteCmd.push('--host', host);
          return svelteCmd;
        }
        return ['npm', 'run', 'preview'];

      case 'vue':
        // Vérifier si c'est Nuxt
        const isNuxt = await this.isNuxt();
        if (isNuxt) {
          const nuxtCmd = ['nuxt', 'preview'];
          if (port !== '3000') nuxtCmd.push('--port', port);
          return nuxtCmd;
        }
        return ['npm', 'run', 'preview'];

      case 'nuxt':
        const nuxtCmd2 = ['nuxt', 'preview'];
        if (port !== '3000') nuxtCmd2.push('--port', port);
        return nuxtCmd2;

      case 'remix':
        const remixCmd = ['remix-serve'];
        if (port !== '3000') remixCmd.push('--port', port);
        return remixCmd;

      case 'angular':
        const ngCmd = ['ng', 'serve'];
        if (port !== '4200') ngCmd.push('--port', port);
        if (host !== 'localhost') ngCmd.push('--host', host);
        return ngCmd;

      case 'gatsby':
        const gatsbyCmd = ['gatsby', 'serve'];
        if (port !== '9000') gatsbyCmd.push('--port', port);
        if (host !== 'localhost') gatsbyCmd.push('--host', host);
        if (this.options.open) gatsbyCmd.push('--open');
        return gatsbyCmd;

      default:
        // Commande générique
        return ['npm', 'run', 'preview'];
    }
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

  private displayPreviewInfo(): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.blue('\\n📊 Informations de prévisualisation:'));
    console.log(`  Framework: ${chalk.cyan(this.frameworkInfo.name)}`);
    if (this.frameworkInfo.version) {
      console.log(`  Version: ${chalk.gray(this.frameworkInfo.version)}`);
    }

    console.log(`  Port: ${chalk.yellow(this.options.port || '4173')}`);
    console.log(`  Hôte: ${chalk.yellow(this.options.host || 'localhost')}`);

    if (this.options.open) {
      console.log(`  ${chalk.green('✓')} Ouverture automatique du navigateur`);
    }

    console.log(chalk.gray('\\n💡 Informations:'));
    console.log('  • Prévisualisation du build de production');
    console.log('  • Ctrl+C pour arrêter la prévisualisation');
    console.log('  • Utilisez --open pour ouvrir automatiquement le navigateur');

    if (this.frameworkInfo.name === 'nextjs') {
      console.log('  • Next.js: Serveur de production avec SSR');
    } else if (this.frameworkInfo.name === 'react') {
      console.log('  • Vite: Serveur statique avec prévisualisation');
    } else if (this.frameworkInfo.name === 'svelte') {
      console.log('  • SvelteKit: Adaptateur de prévisualisation');
    }
  }
}
