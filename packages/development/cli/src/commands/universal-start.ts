import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import { FrameworkDetector, FrameworkInfo } from '../utils/framework-detector';

export interface StartCommandOptions {
  port?: string;
  host?: string;
  workers?: string;
  production?: boolean;
  preview?: boolean;
}

export class UniversalStartCommand {
  private options: StartCommandOptions;
  private globalOptions: any;
  private frameworkInfo: FrameworkInfo | null = null;

  constructor(options: StartCommandOptions, globalOptions: any) {
    this.options = options;
    this.globalOptions = globalOptions;
  }

  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🚀 Démarrage du serveur de production Enterprise'));

    const spinner = ora('Détection du framework...').start();

    try {
      // Détecter le framework
      this.frameworkInfo = await FrameworkDetector.getInstance().detectFramework();
      spinner.succeed(`Framework détecté: ${chalk.cyan(this.frameworkInfo.name)}`);

      // Vérifier si le build existe
      await this.checkBuildExists();

      // Préparer les commandes
      const command = await this.prepareStartCommand();

      console.log(chalk.gray(`📦 Commande: ${command.join(' ')}`));
      console.log(
        chalk.cyan(`🌐 http://${this.options.host || '0.0.0.0'}:${this.options.port || '3000'}`)
      );

      // Démarrer le processus
      const child = spawn(command[0], command.slice(1), {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: {
          ...process.env,
          NODE_ENV: 'production',
          PORT: this.options.port || '3000',
          HOST: this.options.host || '0.0.0.0',
          ...(this.options.workers && { WORKERS: this.options.workers }),
        },
      });

      child.on('error', (error) => {
        console.error(chalk.red('❌ Erreur lors du démarrage du serveur:'), error.message);
        process.exit(1);
      });

      // Gérer les signaux
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\\n🛑 Arrêt du serveur de production...'));
        child.kill('SIGINT');
        process.exit(0);
      });

      process.on('SIGTERM', () => {
        child.kill('SIGTERM');
        process.exit(0);
      });

      // Afficher les informations utiles
      this.displayStartInfo();
    } catch (error) {
      spinner.fail('Erreur lors du démarrage');
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async checkBuildExists(): Promise<void> {
    const fs = await import('fs-extra');
    const outputDir = this.options.preview ? '.next' : 'dist';

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

  private async prepareStartCommand(): Promise<string[]> {
    if (!this.frameworkInfo) {
      throw new Error('Framework non détecté');
    }

    const { name, startCommands } = this.frameworkInfo;
    const port = this.options.port || '3000';
    const host = this.options.host || '0.0.0.0';

    switch (name) {
      case 'nextjs':
        const nextCmd = ['next', 'start'];
        if (port !== '3000') nextCmd.push('-p', port);
        if (host !== '0.0.0.0') nextCmd.push('-H', host);
        return nextCmd;

      case 'react':
        const reactCmd = ['vite', 'preview'];
        if (port !== '3000') reactCmd.push('--port', port);
        if (host !== '0.0.0.0') reactCmd.push('--host', host);
        return reactCmd;

      case 'svelte':
        // Vérifier si c'est SvelteKit
        const isSvelteKit = await this.isSvelteKit();
        if (isSvelteKit) {
          const svelteCmd = ['npm', 'run', 'preview'];
          if (port !== '3000') svelteCmd.push('--', '--port', port);
          if (host !== '0.0.0.0') svelteCmd.push('--host', host);
          return svelteCmd;
        }
        return ['npm', 'run', 'start'];

      case 'vue':
        // Vérifier si c'est Nuxt
        const isNuxt = await this.isNuxt();
        if (isNuxt) {
          const nuxtCmd = ['nuxt', 'start'];
          if (port !== '3000') nuxtCmd.push('--port', port);
          if (host !== '0.0.0.0') nuxtCmd.push('--host', host);
          return nuxtCmd;
        }
        return ['npm', 'run', 'preview'];

      case 'nuxt':
        const nuxtCmd2 = ['nuxt', 'start'];
        if (port !== '3000') nuxtCmd2.push('--port', port);
        if (host !== '0.0.0.0') nuxtCmd2.push('--host', host);
        return nuxtCmd2;

      case 'remix':
        const remixCmd = ['remix-serve'];
        if (port !== '3000') remixCmd.push('--port', port);
        return remixCmd;

      case 'angular':
        const ngCmd = ['ng', 'serve'];
        if (port !== '4200') ngCmd.push('--port', port);
        if (host !== '0.0.0.0') ngCmd.push('--host', host);
        if (this.options.production) ngCmd.push('--configuration', 'production');
        return ngCmd;

      case 'gatsby':
        const gatsbyCmd = ['gatsby', 'serve'];
        if (port !== '9000') gatsbyCmd.push('--port', port);
        if (host !== '0.0.0.0') gatsbyCmd.push('--host', host);
        return gatsbyCmd;

      default:
        // Commande générique
        return startCommands.length > 0 ? startCommands[0].split(' ') : ['npm', 'run', 'start'];
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

  private displayStartInfo(): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.blue('\\n📊 Informations de production:'));
    console.log(`  Framework: ${chalk.cyan(this.frameworkInfo.name)}`);
    if (this.frameworkInfo.version) {
      console.log(`  Version: ${chalk.gray(this.frameworkInfo.version)}`);
    }

    console.log(`  Mode: ${chalk.green('production')}`);
    console.log(`  Port: ${chalk.yellow(this.options.port || '3000')}`);
    console.log(`  Hôte: ${chalk.yellow(this.options.host || '0.0.0.0')}`);

    if (this.options.workers) {
      console.log(`  Workers: ${chalk.cyan(this.options.workers)}`);
    }

    console.log(chalk.gray('\\n💡 Informations:'));
    console.log('  • Le serveur est en mode production');
    console.log('  • Ctrl+C pour arrêter le serveur');
    console.log('  • Utilisez --help pour voir toutes les options');

    if (this.frameworkInfo.name === 'nextjs') {
      console.log('  • Next.js: Optimisé pour la production avec SSR');
    } else if (this.frameworkInfo.name === 'react') {
      console.log('  • Vite: Fichiers statiques servis avec prévisualisation');
    } else if (this.frameworkInfo.name === 'svelte') {
      console.log('  • SvelteKit: Adaptateur de production Node.js');
    }

    // Afficher les avertissements de sécurité
    console.log(chalk.yellow('\\n⚠️  Sécurité:'));
    console.log("  • Assurez-vous que les variables d'environnement sont configurées");
    console.log('  • Vérifiez les dépendances de production');
    console.log('  • Activez HTTPS en production');
  }
}
