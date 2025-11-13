import chalk from 'chalk';
import { BaseSDKCommand, SDKCommandOptions } from './base-sdk-command';

export class SDKBuildCommand extends BaseSDKCommand {
  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🏗️  Construction du projet SDK'));

    try {
      await this.detectFramework();
      const command = await this.prepareBuildCommand();

      this.displayCommandInfo(command);
      console.log(chalk.yellow('⚡ Construction en cours...'));

      await this.executeCommand(command);
      this.displayBuildResults();
    } catch (error) {
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async prepareBuildCommand(): Promise<string[]> {
    if (!this.frameworkInfo) {
      throw new Error('Framework non détecté');
    }

    const { name } = this.frameworkInfo;

    switch (name) {
      case 'nextjs':
        return this.buildNextjsBuildCommand();

      case 'react':
        return this.buildReactBuildCommand();

      case 'svelte':
        return this.buildSvelteBuildCommand();

      case 'vue':
      case 'nuxt':
        return this.buildNuxtBuildCommand();

      case 'remix':
        return ['remix', 'build'];

      case 'angular':
        return this.buildAngularBuildCommand();

      case 'gatsby':
        return ['gatsby', 'build'];

      default:
        return this.frameworkInfo.buildCommands.length > 0
          ? this.frameworkInfo.buildCommands[0].split(' ')
          : ['npm', 'run', 'build'];
    }
  }

  private buildNextjsBuildCommand(): string[] {
    const cmd = ['next', 'build'];
    if (this.options.experimental) cmd.push('--experimental');
    return cmd;
  }

  private buildReactBuildCommand(): string[] {
    const cmd = ['vite', 'build'];
    if (this.options.mode === 'production') cmd.push('--mode', 'production');
    return cmd;
  }

  private buildSvelteBuildCommand(): string[] {
    const isSvelteKit = this.frameworkInfo?.packageJsonKeys.includes('@sveltejs/kit');

    if (isSvelteKit) {
      return ['npm', 'run', 'build'];
    }

    return ['vite', 'build'];
  }

  private buildNuxtBuildCommand(): string[] {
    const cmd = ['nuxt', 'build'];
    if (this.options.mode === 'production') cmd.push('--prerender');
    return cmd;
  }

  private buildAngularBuildCommand(): string[] {
    const cmd = ['ng', 'build'];
    if (this.options.mode === 'production') {
      cmd.push('--configuration', 'production');
    }
    return cmd;
  }

  private displayBuildResults(): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.green('\n✅ Construction terminée!'));

    const outputDir = this.getOutputDirectory();
    console.log(chalk.cyan(`📁 Sortie: ${outputDir}`));

    console.log(chalk.gray('\n💡 Prochaines étapes:'));
    console.log(`  • Lancer avec: ${chalk.cyan('enterprise sdk start')}`);
    console.log(`  • Prévisualiser avec: ${chalk.cyan('enterprise sdk preview')}`);

    if (this.frameworkInfo.name === 'nextjs') {
      console.log('  • Analyser le bundle: npx @next/bundle-analyzer');
    }
  }

  private getOutputDirectory(): string {
    if (!this.frameworkInfo) return 'dist/';

    switch (this.frameworkInfo.name) {
      case 'nextjs':
        return '.next/';
      case 'react':
      case 'svelte':
      case 'vue':
        return 'dist/';
      case 'nuxt':
        return '.output/public/';
      case 'remix':
        return 'build/';
      case 'angular':
        return 'dist/<project-name>/';
      case 'gatsby':
        return 'public/';
      default:
        return 'dist/';
    }
  }
}
