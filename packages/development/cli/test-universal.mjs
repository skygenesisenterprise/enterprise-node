#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { FrameworkDetector } from './utils/framework-detector.js';

const program = new Command();

program
  .name('enterprise')
  .description('Enterprise SDK CLI - Outils unifiés pour le développement Enterprise')
  .version('1.0.0');

// Test universal dev command with framework detection
program
  .command('universal-dev')
  .alias('udev')
  .description('Démarrer le serveur de développement (universel)')
  .option('-p, --port <port>', 'Port du serveur', '3000')
  .option('-h, --host <host>', 'Hôte du serveur', 'localhost')
  .option('--hot', 'Activer le rechargement à chaud')
  .option('--inspect', "Activer l'inspecteur de debug")
  .option('--turbo', 'Activer le mode Turbo (Next.js)')
  .option('--experimental', 'Activer les fonctionnalités expérimentales')
  .action(async (options) => {
    console.log(chalk.blue('🔍 Detecting framework...'));

    const detector = new FrameworkDetector();
    const framework = await detector.detectFramework();

    if (framework) {
      console.log(chalk.green(`✅ Framework detected: ${framework.name} v${framework.version}`));
      console.log(chalk.yellow(`🚀 Starting ${framework.name} dev server...`));

      // Show what command would be executed
      const command = detector.getDevCommand(framework, options);
      console.log(chalk.cyan(`📝 Command: ${command}`));
    } else {
      console.log(chalk.red('❌ No framework detected'));
      console.log(
        chalk.yellow(
          '💡 Supported frameworks: Next.js, React, Vue, Svelte, Angular, Nuxt, Remix, Gatsby'
        )
      );
    }
  });

// Test universal build command
program
  .command('universal-build')
  .alias('ubuild')
  .description('Construire le projet pour la production (universel)')
  .option('-o, --output <output>', 'Répertoire de sortie', 'dist')
  .option('--target <target>', 'Cible de build', 'production')
  .option('--analyze', 'Analyser le bundle')
  .option('--minify', 'Minifier le code')
  .option('--sourcemap', 'Générer les sourcemaps')
  .action(async (options) => {
    console.log(chalk.blue('🔍 Detecting framework for build...'));

    const detector = new FrameworkDetector();
    const framework = await detector.detectFramework();

    if (framework) {
      console.log(chalk.green(`✅ Framework detected: ${framework.name} v${framework.version}`));
      console.log(chalk.yellow(`🏗️ Building ${framework.name} project...`));

      const command = detector.getBuildCommand(framework, options);
      console.log(chalk.cyan(`📝 Command: ${command}`));
    } else {
      console.log(chalk.red('❌ No framework detected'));
    }
  });

program.parse();
