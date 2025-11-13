import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import { BaseSDKCommand, SDKCommandOptions } from './base-sdk-command';
import { ConfigLoader } from '../../utils/config-loader';

export interface UpgradeCommandOptions extends SDKCommandOptions {
  check?: boolean;
  'dry-run'?: boolean;
  force?: boolean;
  latest?: boolean;
  version?: string;
}

export class SDKUpgradeCommand extends BaseSDKCommand {
  protected options: UpgradeCommandOptions;

  constructor(options: UpgradeCommandOptions, globalOptions: any) {
    super(options, globalOptions);
    this.options = options;
  }

  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🔄 Mise à jour du SDK Enterprise'));

    try {
      // Charger la configuration depuis enterprise.config.ts
      const configLoader = ConfigLoader.getInstance();
      const config = await configLoader.loadConfig(this.globalOptions.config);

      console.log(chalk.gray(`📁 Configuration chargée depuis: ${configLoader.getConfigPath()}`));

      // Afficher les informations de configuration pertinentes
      if (configLoader.isDebugMode()) {
        console.log(chalk.yellow('🐛 Mode debug activé - Affichage des détails de mise à jour'));
      }

      const enabledModules = configLoader.getEnabledModules();
      if (enabledModules.length > 0) {
        console.log(chalk.gray(`📦 Modules concernés: ${enabledModules.join(', ')}`));
      }

      const checkOnly = this.options.check;
      const dryRun = this.options['dry-run'];
      const force = this.options.force;
      const latest = this.options.latest;
      const targetVersion = this.options.version;

      if (checkOnly) {
        await this.checkForUpdates(enabledModules);
        return;
      }

      if (dryRun) {
        await this.simulateUpgrade(targetVersion, enabledModules);
        return;
      }

      await this.performUpgrade(targetVersion, force, latest, enabledModules);
    } catch (error) {
      console.error(chalk.red('❌ Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async checkForUpdates(enabledModules: string[]): Promise<void> {
    const spinner = ora('Vérification des mises à jour...').start();

    try {
      const currentVersion = await this.getCurrentVersion();
      const latestVersion = await this.getLatestVersion();

      spinner.succeed('Vérification terminée');

      console.log(chalk.blue('\n📋 Informations de version:'));
      console.log(`  Version actuelle: ${chalk.cyan(currentVersion)}`);
      console.log(`  Dernière version: ${chalk.cyan(latestVersion)}`);

      if (currentVersion === latestVersion) {
        console.log(chalk.green('\n✅ Vous utilisez déjà la dernière version!'));
      } else {
        console.log(chalk.yellow('\n⚠️  Une mise à jour est disponible!'));
        console.log(`  Pour mettre à jour: ${chalk.cyan('enterprise upgrade')}`);
      }

      // Vérifier les modules spécifiques
      if (enabledModules.length > 0) {
        console.log(chalk.blue('\n📦 État des modules:'));
        for (const module of enabledModules) {
          const moduleCurrent = await this.getModuleCurrentVersion(module);
          const moduleLatest = await this.getModuleLatestVersion(module);

          const status = moduleCurrent === moduleLatest ? '✅' : '⚠️';
          console.log(`  ${status} ${module}: ${moduleCurrent} → ${moduleLatest}`);
        }
      }
    } catch (error) {
      spinner.fail('Erreur lors de la vérification');
      throw error;
    }
  }

  private async simulateUpgrade(
    targetVersion?: string,
    enabledModules: string[] = []
  ): Promise<void> {
    const spinner = ora('Simulation de la mise à jour...').start();

    try {
      const currentVersion = await this.getCurrentVersion();
      const latestVersion = targetVersion || (await this.getLatestVersion());
      const packagesToUpdate = await this.getPackagesToUpdate(enabledModules);

      spinner.succeed('Simulation terminée');

      console.log(chalk.blue('\n📋 Détails de la mise à jour:'));
      console.log(`  Version actuelle: ${chalk.cyan(currentVersion)}`);
      console.log(`  Version cible: ${chalk.cyan(latestVersion)}`);

      console.log(chalk.blue('\n📦 Packages à mettre à jour:'));
      packagesToUpdate.forEach((pkg: any) => {
        console.log(`  - ${chalk.cyan(pkg.name)}: ${pkg.currentVersion} → ${pkg.latestVersion}`);
      });

      console.log(chalk.yellow('\n🔍 Mode simulation - Aucune modification appliquée'));
      console.log(`  Pour appliquer: ${chalk.cyan('enterprise upgrade')}`);
    } catch (error) {
      spinner.fail('Erreur lors de la simulation');
      throw error;
    }
  }

  private async performUpgrade(
    targetVersion?: string,
    force: boolean = false,
    latest: boolean = false,
    enabledModules: string[] = []
  ): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    const latestVersion = targetVersion || (await this.getLatestVersion());
    const packagesToUpdate = await this.getPackagesToUpdate(enabledModules);

    if (packagesToUpdate.length === 0) {
      console.log(chalk.green('✅ Tous les packages sont à jour!'));
      return;
    }

    console.log(chalk.blue('\n📋 Mise à jour prévue:'));
    console.log(`  Version actuelle: ${chalk.cyan(currentVersion)}`);
    console.log(`  Version cible: ${chalk.cyan(latestVersion)}`);

    console.log(chalk.blue('\n📦 Packages à mettre à jour:'));
    packagesToUpdate.forEach((pkg: any) => {
      console.log(`  - ${chalk.cyan(pkg.name)}: ${pkg.currentVersion} → ${pkg.latestVersion}`);
    });

    if (!force) {
      console.log(chalk.yellow('\n⚠️  Cette action va modifier vos dépendances.'));
      console.log(chalk.yellow('   Assurez-vous d avoir commité vos changements.'));

      // Demander confirmation
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise<string>((resolve) => {
        rl.question('\nContinuer avec la mise à jour? (y/N): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log(chalk.gray('❌ Mise à jour annulée'));
        return;
      }
    }

    const spinner = ora('Mise à jour en cours...').start();

    try {
      for (const pkg of packagesToUpdate) {
        await this.updatePackage(pkg.name, pkg.latestVersion);
      }

      spinner.succeed('Mise à jour terminée');

      console.log(chalk.green('\n✅ SDK Enterprise mis à jour avec succès!'));
      console.log(chalk.gray('   Exécutez "pnpm install" pour appliquer les changements.'));

      this.displayUpgradeSummary(currentVersion, latestVersion);
    } catch (error) {
      spinner.fail('Erreur lors de la mise à jour');
      throw error;
    }
  }

  private async getCurrentVersion(): Promise<string> {
    try {
      const packageJson = require('../../../../../package.json');
      return packageJson.version || '0.0.0';
    } catch {
      return '0.0.0';
    }
  }

  private async getLatestVersion(): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['view', '@skygenesisenterprise/enterprise-node', 'version'], {
        stdio: 'pipe',
        shell: true,
      });

      let output = '';
      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error('Impossible de récupérer la dernière version'));
        }
      });

      child.on('error', reject);
    });
  }

  private async getPackagesToUpdate(enabledModules: string[]): Promise<any[]> {
    const packagesToUpdate: any[] = [];

    try {
      const packageJson = require('../../../../../package.json');
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      const enterprisePackages = Object.entries(dependencies)
        .filter(([name, version]) => name.startsWith('@skygenesisenterprise/'))
        .filter(([name]) => {
          // Filtrer par modules activés
          if (enabledModules.length === 0) return true;

          const moduleName = name.replace('@skygenesisenterprise/', '');
          return enabledModules.includes(moduleName) || moduleName === 'enterprise-node';
        });

      for (const [name, currentVersion] of enterprisePackages) {
        try {
          const latestVersion = await this.getPackageLatestVersion(name);
          if (currentVersion !== latestVersion) {
            packagesToUpdate.push({
              name,
              currentVersion,
              latestVersion,
            });
          }
        } catch {
          // Ignorer les erreurs pour les packages qui n'existent pas
        }
      }
    } catch {
      // Ignorer les erreurs de lecture du package.json
    }

    return packagesToUpdate;
  }

  private async getPackageLatestVersion(packageName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['view', packageName, 'version'], {
        stdio: 'pipe',
        shell: true,
      });

      let output = '';
      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`Impossible de récupérer la version de ${packageName}`));
        }
      });

      child.on('error', reject);
    });
  }

  private async getModuleCurrentVersion(module: string): Promise<string> {
    try {
      const packageJson = require('../../../../../package.json');
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      const packageName = `@skygenesisenterprise/${module}`;
      return dependencies[packageName] || 'non installé';
    } catch {
      return 'inconnu';
    }
  }

  private async getModuleLatestVersion(module: string): Promise<string> {
    try {
      const packageName = `@skygenesisenterprise/${module}`;
      return await this.getPackageLatestVersion(packageName);
    } catch {
      return 'inconnu';
    }
  }

  private async updatePackage(packageName: string, version: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['install', `${packageName}@${version}`, '--save-dev'], {
        stdio: 'inherit',
        cwd: process.cwd(),
        shell: true,
      });

      child.on('error', reject);
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Échec de l'installation de ${packageName}@${version}`));
        }
      });
    });
  }

  private displayUpgradeSummary(currentVersion: string, latestVersion: string): void {
    console.log(chalk.blue('\n📊 Résumé de la mise à jour:'));
    console.log(`  De: ${chalk.red(currentVersion)}`);
    console.log(`  À: ${chalk.green(latestVersion)}`);

    if (currentVersion !== latestVersion) {
      console.log(chalk.green('\n🎉 Mise à niveau réussie!'));
      console.log(chalk.gray('   Nouvelles fonctionnalités et améliorations disponibles.'));
    }
  }

  protected displayCommandInfo(command: string[]): void {
    console.log(chalk.blue('\n📊 Informations de mise à jour:'));
    console.log(`  Commande: ${chalk.gray(command.join(' '))}`);

    if (this.options.check) {
      console.log(`  ${chalk.yellow('🔍')} Mode vérification uniquement`);
    }

    if (this.options['dry-run']) {
      console.log(`  ${chalk.yellow('🔍')} Mode simulation`);
    }

    if (this.options.force) {
      console.log(`  ${chalk.yellow('⚡')} Mode forcé`);
    }
  }
}
