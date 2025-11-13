import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import { FrameworkDetector, FrameworkInfo } from '../utils/framework-detector';

export interface DevCommandOptions {
  port?: string;
  host?: string;
  hot?: boolean;
  inspect?: boolean;
  turbo?: boolean;
  experimental?: boolean;
  liveReload?: boolean;
}

export class UniversalDevCommand {
  private options: DevCommandOptions;
  private globalOptions: any;
  private frameworkInfo: FrameworkInfo | null = null;

  constructor(options: DevCommandOptions, globalOptions: any) {
    this.options = options;
    this.globalOptions = globalOptions;
  }

  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🚀 Démarrage du serveur de développement Enterprise'));

    const spinner = ora('Détection du framework...').start();

    try {
      // Détecter le framework
      this.frameworkInfo = await FrameworkDetector.getInstance().detectFramework();
      spinner.succeed(`Framework détecté: ${chalk.cyan(this.frameworkInfo.name)}`);

      // Préparer les commandes
      const command = await this.prepareDevCommand();

      console.log(chalk.gray(`📦 Commande: ${command.join(' ')}`));
      console.log(
        chalk.cyan(`🌐 http://${this.options.host || 'localhost'}:${this.options.port || '3000'}`)
      );

      // Démarrer le processus
      const child = spawn(command[0], command.slice(1), {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: {
          ...process.env,
          PORT: this.options.port || '3000',
          HOST: this.options.host || 'localhost',
          ...(this.options.hot && { HOT_RELOAD: 'true' }),
          ...(this.options.inspect && { NODE_OPTIONS: '--inspect' }),
          ...(this.options.turbo && { TURBO: 'true' }),
          ...(this.options.experimental && { EXPERIMENTAL: 'true' }),
        },
      });

      child.on('error', (error) => {
        console.error(chalk.red('❌ Erreur lors du démarrage du serveur:'), error.message);
        process.exit(1);
      });

      // Gérer les signaux
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\\n🛑 Arrêt du serveur de développement...'));
        child.kill('SIGINT');
        process.exit(0);
      });

      process.on('SIGTERM', () => {
        child.kill('SIGTERM');
        process.exit(0);
      });

      // Afficher les informations utiles
      this.displayDevInfo();
    } catch (error) {
      spinner.fail('Erreur lors du démarrage');
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async prepareDevCommand(): Promise<string[]> {
    if (!this.frameworkInfo) {
      throw new Error('Framework non détecté');
    }

    const { name, devCommands } = this.frameworkInfo;
    const port = this.options.port || '3000';
    const host = this.options.host || 'localhost';

    switch (name) {
      case 'nextjs':
        const nextCmd = ['next', 'dev'];
        if (port !== '3000') nextCmd.push('-p', port);
        if (host !== 'localhost') nextCmd.push('-H', host);
        if (this.options.turbo) nextCmd.push('--turbo');
        if (this.options.experimental) nextCmd.push('--experimental');
        return nextCmd;

      case 'react':
        const reactCmd = ['vite'];
        if (port !== '3000') reactCmd.push('--port', port);
        if (host !== 'localhost') reactCmd.push('--host', host);
        if (this.options.hot) reactCmd.push('--force');
        return reactCmd;

      case 'svelte':
        // Vérifier si c'est SvelteKit
        const isSvelteKit = await this.isSvelteKit();
        if (isSvelteKit) {
          const svelteCmd = ['npm', 'run', 'dev'];
          if (port !== '3000') svelteCmd.push('--', '--port', port);
          if (host !== 'localhost') svelteCmd.push('--host', host);
          return svelteCmd;
        }
        return ['npm', 'run', 'dev'];

      case 'vue':
        // Vérifier si c'est Nuxt
        const isNuxt = await this.isNuxt();
        if (isNuxt) {
          const nuxtCmd = ['nuxt', 'dev'];
          if (port !== '3000') nuxtCmd.push('--port', port);
          if (host !== 'localhost') nuxtCmd.push('--host', host);
          return nuxtCmd;
        }
        return ['npm', 'run', 'serve'];

      case 'nuxt':
        const nuxtCmd2 = ['nuxt', 'dev'];
        if (port !== '3000') nuxtCmd2.push('--port', port);
        if (host !== 'localhost') nuxtCmd2.push('--host', host);
        return nuxtCmd2;

      case 'remix':
        return ['npm', 'run', 'dev'];

      case 'angular':
        const ngCmd = ['ng', 'serve'];
        if (port !== '3000') ngCmd.push('--port', port);
        if (host !== 'localhost') ngCmd.push('--host', host);
        if (this.options.liveReload) ngCmd.push('--live-reload');
        return ngCmd;

      case 'gatsby':
        return ['gatsby', 'develop'];

      default:
        // Commande générique
        return devCommands.length > 0 ? devCommands[0].split(' ') : ['npm', 'run', 'dev'];
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

  private displayDevInfo(): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.blue('\\n📊 Informations de développement:'));
    console.log(`  Framework: ${chalk.cyan(this.frameworkInfo.name)}`);
    if (this.frameworkInfo.version) {
      console.log(`  Version: ${chalk.gray(this.frameworkInfo.version)}`);
    }

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

    console.log(chalk.gray('\\n💡 Astuces:'));
    console.log('  • Ctrl+C pour arrêter le serveur');
    console.log('  • Utilisez --help pour voir toutes les options');

    if (this.frameworkInfo.name === 'nextjs') {
      console.log('  • Next.js: Appuyez sur "o" pour ouvrir dans le navigateur');
    } else if (this.frameworkInfo.name === 'react') {
      console.log('  • Vite: Appuyez sur "r" pour redémarrer le serveur');
    }
  }
}
