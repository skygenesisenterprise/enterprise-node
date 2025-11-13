import chalk from 'chalk';
import { BaseSDKCommand, SDKCommandOptions } from './base-sdk-command';

export class SDKStartCommand extends BaseSDKCommand {
  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🚀 Démarrage du serveur de production SDK'));

    try {
      await this.detectFramework();
      const command = await this.prepareStartCommand();

      console.log(chalk.cyan(`🌐 ${this.getServerUrl()}`));
      this.displayCommandInfo(command);

      await this.executeCommand(command);
      this.displayStartTips();
    } catch (error) {
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async prepareStartCommand(): Promise<string[]> {
    if (!this.frameworkInfo) {
      throw new Error('Framework non détecté');
    }

    const { name } = this.frameworkInfo;
    const port = this.options.port || '3000';
    const host = this.options.host || '0.0.0.0';

    switch (name) {
      case 'nextjs':
        return this.buildNextjsStartCommand(port, host);

      case 'react':
        return this.buildReactStartCommand(port, host);

      case 'svelte':
        return this.buildSvelteStartCommand(port, host);

      case 'vue':
      case 'nuxt':
        return this.buildNuxtStartCommand(port, host);

      case 'remix':
        return ['remix-serve', 'build'];

      case 'angular':
        return this.buildAngularStartCommand(port, host);

      case 'gatsby':
        return this.buildGatsbyStartCommand(port, host);

      default:
        return this.frameworkInfo.startCommands.length > 0
          ? this.frameworkInfo.startCommands[0].split(' ')
          : ['npm', 'run', 'start'];
    }
  }

  private buildNextjsStartCommand(port: string, host: string): string[] {
    const cmd = ['next', 'start'];
    if (port !== '3000') cmd.push('-p', port);
    if (host !== '0.0.0.0') cmd.push('-H', host);
    return cmd;
  }

  private buildReactStartCommand(port: string, host: string): string[] {
    const cmd = ['vite', 'preview'];
    if (port !== '3000') cmd.push('--port', port);
    if (host !== '0.0.0.0') cmd.push('--host', host);
    return cmd;
  }

  private buildSvelteStartCommand(port: string, host: string): string[] {
    const isSvelteKit = this.frameworkInfo?.packageJsonKeys.includes('@sveltejs/kit');

    if (isSvelteKit) {
      const cmd = ['npm', 'run', 'preview'];
      if (port !== '3000') cmd.push('--', '--port', port);
      if (host !== '0.0.0.0') cmd.push('--host', host);
      return cmd;
    }

    return ['vite', 'preview'];
  }

  private buildNuxtStartCommand(port: string, host: string): string[] {
    const cmd = ['nuxt', 'start'];
    if (port !== '3000') cmd.push('--port', port);
    if (host !== '0.0.0.0') cmd.push('--host', host);
    return cmd;
  }

  private buildAngularStartCommand(port: string, host: string): string[] {
    const cmd = ['ng', 'serve'];
    if (port !== '3000') cmd.push('--port', port);
    if (host !== '0.0.0.0') cmd.push('--host', host);
    return cmd;
  }

  private buildGatsbyStartCommand(port: string, host: string): string[] {
    const cmd = ['gatsby', 'serve'];
    if (port !== '3000') cmd.push('-p', port);
    if (host !== '0.0.0.0') cmd.push('-H', host);
    return cmd;
  }

  private displayStartTips(): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.gray('\n💡 Informations:'));
    console.log('  • Serveur de production démarré');
    console.log('  • Ctrl+C pour arrêter le serveur');

    if (this.options.host === '0.0.0.0') {
      console.log(chalk.yellow('  ⚠️  Serveur accessible depuis le réseau'));
    }

    switch (this.frameworkInfo.name) {
      case 'nextjs':
        console.log('  • Next.js: Mode production activé');
        break;
      case 'react':
        console.log('  • Vite: Prévisualisation du build');
        break;
      case 'svelte':
        console.log('  • SvelteKit: Prévisualisation statique');
        break;
    }
  }
}
