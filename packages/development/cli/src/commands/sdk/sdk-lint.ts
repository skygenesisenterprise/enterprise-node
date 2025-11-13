import chalk from 'chalk';
import { BaseSDKCommand, SDKCommandOptions } from './base-sdk-command';

export class SDKLintCommand extends BaseSDKCommand {
  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🔍 Analyse du code SDK'));

    try {
      await this.detectFramework();
      const command = await this.prepareLintCommand();

      this.displayCommandInfo(command);

      await this.executeCommand(command);
      this.displayLintResults();
    } catch (error) {
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async prepareLintCommand(): Promise<string[]> {
    if (!this.frameworkInfo) {
      throw new Error('Framework non détecté');
    }

    const { name } = this.frameworkInfo;

    switch (name) {
      case 'nextjs':
        return this.buildNextjsLintCommand();

      case 'react':
        return this.buildReactLintCommand();

      case 'svelte':
        return this.buildSvelteLintCommand();

      case 'vue':
      case 'nuxt':
        return this.buildNuxtLintCommand();

      case 'remix':
        return this.buildRemixLintCommand();

      case 'angular':
        return this.buildAngularLintCommand();

      case 'gatsby':
        return this.buildGatsbyLintCommand();

      default:
        return ['npm', 'run', 'lint'];
    }
  }

  private buildNextjsLintCommand(): string[] {
    const cmd = ['next', 'lint'];
    if (this.options.hot) cmd.push('--fix');
    return cmd;
  }

  private buildReactLintCommand(): string[] {
    const cmd = ['npm', 'run', 'lint'];
    if (this.options.hot) cmd.push('--', '--fix');
    return cmd;
  }

  private buildSvelteLintCommand(): string[] {
    const isSvelteKit = this.frameworkInfo?.packageJsonKeys.includes('@sveltejs/kit');

    if (isSvelteKit) {
      const cmd = ['npm', 'run', 'check'];
      if (this.options.hot) cmd.push('--', '--fix');
      return cmd;
    }

    return ['npm', 'run', 'lint'];
  }

  private buildNuxtLintCommand(): string[] {
    const cmd = ['npm', 'run', 'lint'];
    if (this.options.hot) cmd.push('--', '--fix');
    return cmd;
  }

  private buildRemixLintCommand(): string[] {
    const cmd = ['npm', 'run', 'lint'];
    if (this.options.hot) cmd.push('--', '--fix');
    return cmd;
  }

  private buildAngularLintCommand(): string[] {
    const cmd = ['ng', 'lint'];
    if (this.options.hot) cmd.push('--fix');
    return cmd;
  }

  private buildGatsbyLintCommand(): string[] {
    const cmd = ['npm', 'run', 'lint'];
    if (this.options.hot) cmd.push('--', '--fix');
    return cmd;
  }

  private displayLintResults(): void {
    if (!this.frameworkInfo) return;

    console.log(chalk.green('\n✅ Analyse terminée!'));

    console.log(chalk.gray('\n💡 Améliorations:'));
    if (this.options.hot) {
      console.log('  • Corrections automatiques appliquées');
    }
    console.log('  • Vérifiez les warnings restants');
    console.log(`  • Pour formater: ${chalk.cyan('enterprise sdk format')}`);

    switch (this.frameworkInfo.name) {
      case 'nextjs':
        console.log('  • Next.js: ESLint + TypeScript configurés');
        break;
      case 'react':
        console.log('  • React: ESLint + Prettier recommandés');
        break;
      case 'svelte':
        console.log('  • Svelte: SvelteCheck + ESLint configurés');
        break;
    }
  }
}
