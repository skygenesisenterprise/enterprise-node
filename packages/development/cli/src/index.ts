#!/usr/bin/env node

/**
 * @fileoverview CLI unifiée pour Enterprise SDK
 * Commandes: dev, build, start, new, plugin, doctor
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { DevCommand } from './commands/dev';
import { BuildCommand } from './commands/build';
import { StartCommand } from './commands/start';
import { NewCommand } from './commands/new';
import { PluginCommand } from './commands/plugin';
import { DoctorCommand } from './commands/doctor';
import { InfoCommand } from './commands/info';

const program = new Command();

program
  .name('enterprise')
  .description('Enterprise SDK CLI - Outils unifiés pour le développement Enterprise')
  .version('1.0.0')
  .option('-v, --verbose', 'Mode verbeux')
  .option('--config <path>', 'Chemin vers le fichier de configuration', './enterprise.config.js');

// Commande de développement
program
  .command('dev')
  .description('Démarrer le serveur de développement')
  .option('-p, --port <port>', 'Port du serveur', '3000')
  .option('-h, --host <host>', 'Hôte du serveur', 'localhost')
  .option('--hot', 'Activer le rechargement à chaud')
  .option('--inspect', "Activer l'inspecteur de debug")
  .action(async (options) => {
    const devCommand = new DevCommand(options, program.opts());
    await devCommand.execute();
  });

// Commande de build
program
  .command('build')
  .description('Construire le projet pour la production')
  .option('-o, --output <output>', 'Répertoire de sortie', 'dist')
  .option('--target <target>', 'Cible de build', 'production')
  .option('--analyze', 'Analyser le bundle')
  .option('--minify', 'Minifier le code')
  .option('--sourcemap', 'Générer les sourcemaps')
  .action(async (options) => {
    const buildCommand = new BuildCommand(options, program.opts());
    await buildCommand.execute();
  });

// Commande de démarrage
program
  .command('start')
  .description("Démarrer l'application en mode production")
  .option('-p, --port <port>', 'Port du serveur', '3000')
  .option('-h, --host <host>', 'Hôte du serveur', '0.0.0.0')
  .option('--workers <count>', 'Nombre de workers', 'auto')
  .action(async (options) => {
    const startCommand = new StartCommand(options, program.opts());
    await startCommand.execute();
  });

// Commande de création de projet
program
  .command('new')
  .description('Créer un nouveau projet Enterprise')
  .argument('<name>', 'Nom du projet')
  .option('-t, --template <template>', 'Template à utiliser', 'base')
  .option('-d, --directory <directory>', 'Répertoire de destination')
  .option('--no-install', 'Ne pas installer les dépendances')
  .option('--git', 'Initialiser Git', true)
  .option('--typescript', 'Forcer TypeScript', true)
  .option('--plugin <plugins...>', 'Plugins à installer')
  .action(async (name, options) => {
    const newCommand = new NewCommand(name, options, program.opts());
    await newCommand.execute();
  });

// Commande de gestion des plugins
program
  .command('plugin')
  .description('Gérer les plugins Enterprise')
  .addCommand(
    new Command('list').description('Lister les plugins disponibles').action(async () => {
      const pluginCommand = new PluginCommand('list', {}, program.opts());
      await pluginCommand.execute();
    })
  )
  .addCommand(
    new Command('install')
      .description('Installer un plugin')
      .argument('<name>', 'Nom du plugin')
      .option('-v, --version <version>', 'Version spécifique')
      .action(async (name, options) => {
        const pluginCommand = new PluginCommand('install', { name, ...options }, program.opts());
        await pluginCommand.execute();
      })
  )
  .addCommand(
    new Command('uninstall')
      .description('Désinstaller un plugin')
      .argument('<name>', 'Nom du plugin')
      .action(async (name) => {
        const pluginCommand = new PluginCommand('uninstall', { name }, program.opts());
        await pluginCommand.execute();
      })
  )
  .addCommand(
    new Command('enable')
      .description('Activer un plugin')
      .argument('<name>', 'Nom du plugin')
      .action(async (name) => {
        const pluginCommand = new PluginCommand('enable', { name }, program.opts());
        await pluginCommand.execute();
      })
  )
  .addCommand(
    new Command('disable')
      .description('Désactiver un plugin')
      .argument('<name>', 'Nom du plugin')
      .action(async (name) => {
        const pluginCommand = new PluginCommand('disable', { name }, program.opts());
        await pluginCommand.execute();
      })
  );

// Commande de diagnostic
program
  .command('doctor')
  .description('Vérifier la configuration et les dépendances')
  .option('--fix', 'Tenter de corriger les problèmes automatiquement')
  .action(async (options) => {
    const doctorCommand = new DoctorCommand(options, program.opts());
    await doctorCommand.execute();
  });

// Commande d'information
program
  .command('info')
  .description('Afficher les informations sur le SDK Enterprise')
  .option('--json', 'Afficher en format JSON')
  .action(async (options) => {
    const infoCommand = new InfoCommand(options, program.opts());
    await infoCommand.execute();
  });

// Gestion des erreurs globales
program.on('command:*', () => {
  console.error(chalk.red(`❌ Commande invalide: ${program.args.join(' ')}`));
  console.log(chalk.yellow('💡 Utilisez --help pour voir les commandes disponibles'));
  process.exit(1);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error(chalk.red('❌ Erreur non capturée:'), error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Rejet non géré à:'), promise, 'raison:', reason);
  process.exit(1);
});

// Parse les arguments
program.parse();

// Si aucune commande n'est fournie, afficher l'aide
if (!process.argv.slice(2).length) {
  console.log(chalk.cyan.bold('🚀 Enterprise SDK CLI'));
  console.log(chalk.gray('Outils unifiés pour le développement Enterprise\n'));

  console.log(chalk.yellow('Commandes principales:'));
  console.log('  enterprise new <name>     Créer un nouveau projet');
  console.log('  enterprise dev              Démarrer le serveur de développement');
  console.log('  enterprise build            Construire pour la production');
  console.log('  enterprise start            Démarrer en mode production');
  console.log('  enterprise plugin          Gérer les plugins');
  console.log('  enterprise doctor           Vérifier la configuration');
  console.log('  enterprise info             Afficher les informations\n');

  console.log(chalk.yellow('Exemples:'));
  console.log('  enterprise new my-app --template mobile');
  console.log('  enterprise dev --port 8080 --hot');
  console.log('  enterprise build --analyze --minify');
  console.log('  enterprise plugin install @enterprise/auth');

  program.outputHelp();
}
