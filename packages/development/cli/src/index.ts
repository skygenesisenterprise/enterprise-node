#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createCommand } from './commands/create';
import { initCommand } from './commands/init';
import { devCommand } from './commands/dev';
import { buildCommand } from './commands/build';
import { doctorCommand } from './commands/doctor';
import { infoCommand } from './commands/info';

const program = new Command();

program
  .name('enterprise')
  .description('Enterprise SDK CLI - Outils pour le développement avec Enterprise')
  .version('0.1.0');

program
  .command('create')
  .description('Créer un nouveau projet Enterprise')
  .argument('<name>', 'Nom du projet')
  .option('-t, --template <template>', 'Template à utiliser', 'default')
  .option('-d, --directory <directory>', 'Répertoire de destination')
  .option('--no-install', 'Ne pas installer les dépendances')
  .action(createCommand);

program
  .command('init')
  .description('Initialiser Enterprise dans un projet existant')
  .option('-f, --force', 'Forcer la réécriture des fichiers existants')
  .option('-t, --typescript', 'Utiliser TypeScript')
  .action(initCommand);

program
  .command('dev')
  .description('Démarrer le serveur de développement')
  .option('-p, --port <port>', 'Port du serveur', '3000')
  .option('--host <host>', 'Hôte du serveur', 'localhost')
  .action(devCommand);

program
  .command('build')
  .description('Construire le projet pour la production')
  .option('-o, --output <output>', 'Répertoire de sortie', 'dist')
  .option('--analyze', 'Analyser le bundle')
  .action(buildCommand);

program
  .command('doctor')
  .description('Vérifier la configuration et les dépendances')
  .action(doctorCommand);

program
  .command('info')
  .description('Afficher les informations sur le SDK Enterprise')
  .action(infoCommand);

// Gestion des erreurs globales
program.on('command:*', () => {
  console.error(chalk.red(`Commande invalide: ${program.args.join(' ')}`));
  console.log(chalk.yellow('Utilisez --help pour voir les commandes disponibles'));
  process.exit(1);
});

// Parse les arguments
program.parse();

// Si aucune commande n'est fournie, afficher l'aide
if (!process.argv.slice(2).length) {
  program.outputHelp();
}