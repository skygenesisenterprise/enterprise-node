import chalk from 'chalk';
import { BaseSDKCommand, SDKCommandOptions } from './base-sdk-command';

export class SDKPreviewCommand extends BaseSDKCommand {
  async execute(): Promise<void> {
    console.log(chalk.blue.bold('👀 Prévisualisation du build SDK'));

    try {
      await this.detectFramework();
      const command = await this.preparePreviewCommand();

      console.log(chalk.cyan(`🌐 ${this.getServerUrl()}`));
      this.displayCommandInfo(command);

      await this.executeCommand(command);
      this.displayPreviewTips();
    } catch (error) {
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
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
        return this.buildNextjsPreviewCommand(port, host);

      case 'react':
        return this.buildReactPreviewCommand(port, host);

      case 'svelte':
        return this.buildSveltePreviewCommand(port, host);

      case 'vue':
      case 'nuxt':
        return this.buildNuxtPreviewCommand(port, host);

      case 'remix':
        return ['remix-serve', 'build'];

      case 'angular':
        return this.buildAngularPreviewCommand(port, host);

      case 'gatsby':
        return this.buildGatsbyPreviewCommand(port, host);

      default:
        return ['npm', 'run', 'preview'];
    }
  }

  private buildNextjsPreviewCommand(port: string, host: string): string[] {
    const cmd = ['next', 'start'];
    if (port !== '4173') cmd.push('-p', port);
    if (host !== 'localhost') cmd.push('-H', host);
    return cmd;
  }

  private buildReactPreviewCommand(port: string, host: string): string[] {
    const cmd = ['vite', 'preview'];
    if (port !== '4173') cmd.push('--port', port);
    if (host !== 'localhost') cmd.push('--host', host);
    return cmd;
  }

  private buildSveltePreviewCommand(port: string, host: string): string[] {
    const isSvelteKit = this.frameworkInfo?.packageJsonKeys.includes('@sveltejs/kit');

    if (isSvelteKit) {
      const cmd = ['npm', 'run', 'preview'];
      if (port !== '4173') cmd.push('--', '--port', port);
      if (host !== 'localhost') cmd.push('--host', host);
      return cmd;
    }

    return ['vite', 'preview'];
  }

  private buildNuxtPreviewCommand(port: string, host: string): string[] {
    const cmd = ['nuxt', 'preview'];
    if (port !== '4173') cmd.push('--port', port);
    if (host !== 'localhost') cmd.push('--host', host);
    return cmd;
  }

  private buildAngularPreviewCommand(port: string, host: string): string[] {
    const cmd = ['ng', 'serve'];
    if (port !== '4173') cmd.push('--port', port);
    if (host !== 'localhost') cmd.push('--host', host);
    return cmd;
  }

  private buildGatsbyPreviewCommand(port: string, host: string): string[] {
    const cmd = ['gatsby', 'serve'];
    if (port !== '4173') cmd.push('-p', port);
    if (host !== 'localhost') cmd.push('-H', host);
    return cmd;
  }

  private displayPreviewTips(): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.gray('\n💡 Prévisualisation:'));
    console.log('  • Build de production en prévisualisation');
    console.log('  • Ctrl+C pour arrêter le serveur');
    console.log(`  • Pour déployer: ${chalk.cyan('enterprise sdk deploy')}`);

    switch (this.frameworkInfo.name) {
      case 'nextjs':
        console.log('  • Next.js: Build statique optimisé');
        break;
      case 'react':
        console.log('  • Vite: Fichiers statiques prévisualisés');
        break;
      case 'svelte':
        console.log('  • SvelteKit: Site statique prévisualisé');
        break;
    }
  }
}
