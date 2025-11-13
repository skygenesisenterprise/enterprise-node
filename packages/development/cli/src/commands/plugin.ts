import chalk from 'chalk';
import ora from 'ora';
import { PluginManager } from '@skygenesisenterprise/enterprise-node';

export class PluginCommand {
  private action: string;
  private options: any;
  private pluginManager: PluginManager;

  constructor(action: string, options: any, _globalOptions: any) {
    this.action = action;
    this.options = options;
    this.pluginManager = PluginManager.getInstance();
  }

  async execute(): Promise<void> {
    await this.pluginManager.initialize();

    switch (this.action) {
      case 'list':
        await this.listPlugins();
        break;
      case 'install':
        await this.installPlugin();
        break;
      case 'uninstall':
        await this.uninstallPlugin();
        break;
      case 'enable':
        await this.enablePlugin();
        break;
      case 'disable':
        await this.disablePlugin();
        break;
      default:
        console.error(chalk.red(`❌ Action inconnue: ${this.action}`));
        process.exit(1);
    }
  }

  private async listPlugins(): Promise<void> {
    console.log(chalk.blue.bold('📦 Plugins Enterprise'));

    const plugins = this.pluginManager.getPlugins();

    if (plugins.length === 0) {
      console.log(chalk.gray('Aucun plugin installé'));
      return;
    }

    console.log(chalk.yellow('\nPlugins installés:'));
    plugins.forEach((plugin: any) => {
      const status = this.getStatusIcon(plugin.status);
      const version = plugin.manifest.version;
      const description = plugin.manifest.description;

      console.log(`${status} ${plugin.manifest.name}@${version}`);
      if (description) {
        console.log(chalk.gray(`   ${description}`));
      }
    });
  }

  private async installPlugin(): Promise<void> {
    const pluginName = this.options.name;
    const version = this.options.version;

    console.log(chalk.blue.bold("📦 Installation d'un plugin Enterprise"));

    const spinner = ora(`Installation de ${pluginName}${version ? `@${version}` : ''}...`).start();

    try {
      const source = version ? `${pluginName}@${version}` : pluginName;
      await this.pluginManager.installPlugin(source);

      spinner.succeed(`Plugin ${pluginName} installé avec succès!`);

      // Activer le plugin après installation
      await this.pluginManager.activatePlugin(pluginName);
      console.log(chalk.green(`✅ Plugin ${pluginName} activé`));
    } catch (error) {
      spinner.fail("Erreur lors de l'installation");
      console.error(chalk.red('Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async uninstallPlugin(): Promise<void> {
    const pluginName = this.options.name;

    console.log(chalk.blue.bold("🗑️  Désinstallation d'un plugin Enterprise"));

    const spinner = ora(`Désinstallation de ${pluginName}...`).start();

    try {
      await this.pluginManager.uninstallPlugin(pluginName);
      spinner.succeed(`Plugin ${pluginName} désinstallé avec succès!`);
    } catch (error) {
      spinner.fail('Erreur lors de la désinstallation');
      console.error(chalk.red('Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async enablePlugin(): Promise<void> {
    const pluginName = this.options.name;

    console.log(chalk.blue.bold("✅ Activation d'un plugin Enterprise"));

    const spinner = ora(`Activation de ${pluginName}...`).start();

    try {
      await this.pluginManager.activatePlugin(pluginName);
      spinner.succeed(`Plugin ${pluginName} activé avec succès!`);
    } catch (error) {
      spinner.fail("Erreur lors de l'activation");
      console.error(chalk.red('Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async disablePlugin(): Promise<void> {
    const pluginName = this.options.name;

    console.log(chalk.blue.bold("⏸️  Désactivation d'un plugin Enterprise"));

    const spinner = ora(`Désactivation de ${pluginName}...`).start();

    try {
      await this.pluginManager.deactivatePlugin(pluginName);
      spinner.succeed(`Plugin ${pluginName} désactivé avec succès!`);
    } catch (error) {
      spinner.fail('Erreur lors de la désactivation');
      console.error(chalk.red('Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case 'active':
        return chalk.green('●');
      case 'inactive':
        return chalk.yellow('○');
      case 'error':
        return chalk.red('✗');
      default:
        return chalk.gray('○');
    }
  }
}
