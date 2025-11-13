import chalk from 'chalk';
import { BaseSDKCommand, SDKCommandOptions } from './base-sdk-command';

export class SDKDevCommand extends BaseSDKCommand {
  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🚀 Démarrage du serveur de développement SDK'));

    try {
      await this.detectFramework();
      const command = await this.prepareDevCommand();

      console.log(chalk.cyan(`🌐 ${this.getServerUrl()}`));
      this.displayCommandInfo(command);

      await this.executeCommand(command);
      this.displayDevTips();
    } catch (error) {
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async prepareDevCommand(): Promise<string[]> {
    if (!this.frameworkInfo) {
      throw new Error('Framework non détecté');
    }

    const { name } = this.frameworkInfo;
    const port = this.options.port || '3000';
    const host = this.options.host || 'localhost';

    switch (name) {
      case 'nextjs':
        return this.buildNextjsDevCommand(port, host);

      case 'react':
        return this.buildReactDevCommand(port, host);

      case 'svelte':
        return this.buildSvelteDevCommand(port, host);

      case 'vue':
      case 'nuxt':
        return this.buildNuxtDevCommand(port, host);

      case 'remix':
        return ['remix', 'dev'];

      case 'angular':
        return this.buildAngularDevCommand(port, host);

      case 'gatsby':
        return ['gatsby', 'develop'];

      default:
        return this.frameworkInfo.devCommands.length > 0
          ? this.frameworkInfo.devCommands[0].split(' ')
          : ['npm', 'run', 'dev'];
    }
  }

  private buildNextjsDevCommand(port: string, host: string): string[] {
    const cmd = ['next', 'dev'];
    if (port !== '3000') cmd.push('-p', port);
    if (host !== 'localhost') cmd.push('-H', host);
    if (this.options.turbo) cmd.push('--turbo');
    if (this.options.experimental) cmd.push('--experimental');
    return cmd;
  }

  private buildReactDevCommand(port: string, host: string): string[] {
    const cmd = ['vite'];
    if (port !== '3000') cmd.push('--port', port);
    if (host !== 'localhost') cmd.push('--host', host);
    if (this.options.hot) cmd.push('--force');
    return cmd;
  }

  private buildSvelteDevCommand(port: string, host: string): string[] {
    // Vérifier si c'est SvelteKit
    const isSvelteKit = this.frameworkInfo?.packageJsonKeys.includes('@sveltejs/kit');

    if (isSvelteKit) {
      const cmd = ['npm', 'run', 'dev'];
      if (port !== '3000') cmd.push('--', '--port', port);
      if (host !== 'localhost') cmd.push('--host', host);
      return cmd;
    }

    return ['npm', 'run', 'dev'];
  }

  private buildNuxtDevCommand(port: string, host: string): string[] {
    const cmd = ['nuxt', 'dev'];
    if (port !== '3000') cmd.push('--port', port);
    if (host !== 'localhost') cmd.push('--host', host);
    return cmd;
  }

  private buildAngularDevCommand(port: string, host: string): string[] {
    const cmd = ['ng', 'serve'];
    if (port !== '3000') cmd.push('--port', port);
    if (host !== 'localhost') cmd.push('--host', host);
    if (this.options.hot) cmd.push('--live-reload');
    return cmd;
  }

  private displayDevTips(): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.gray('\n💡 Astuces:'));
    console.log('  • Ctrl+C pour arrêter le serveur');
    console.log('  • Utilisez --help pour voir toutes les options');

    switch (this.frameworkInfo.name) {
      case 'nextjs':
        console.log('  • Next.js: Appuyez sur "o" pour ouvrir dans le navigateur');
        console.log('  • Next.js: Appuyez sur "r" pour redémarrer le serveur');
        break;
      case 'react':
        console.log('  • Vite: Appuyez sur "r" pour redémarrer le serveur');
        console.log('  • Vite: Appuyez sur "u" pour afficher l\'URL');
        break;
      case 'svelte':
        console.log('  • SvelteKit: Appuyez sur "o" pour ouvrir dans le navigateur');
        break;
      case 'nuxt':
        console.log('  • Nuxt: Appuyez sur "o" pour ouvrir dans le navigateur');
        break;
    }
  }
}
