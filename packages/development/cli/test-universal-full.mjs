#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { FrameworkDetector } from './dist/framework-detector.js';
import { spawn } from 'child_process';
import { promisify } from 'util';

const program = new Command();

program
  .name('enterprise')
  .description('Enterprise SDK CLI - Universal Commands Test')
  .version('1.0.0');

// Universal dev command with actual execution
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
  .option('--dry-run', 'Montrer la commande sans lexécuter')
  .action(async (options) => {
    console.log(chalk.blue('🔍 Detecting framework...'));

    const detector = new FrameworkDetector();
    const framework = await detector.detectFramework();

    if (framework && framework.name !== 'generic') {
      const displayName = framework.name.charAt(0).toUpperCase() + framework.name.slice(1);
      console.log(
        chalk.green(`✅ Framework detected: ${displayName} v${framework.version || 'unknown'}`)
      );

      const command = getDevCommand(framework, options);
      console.log(chalk.cyan(`📝 Command: ${command}`));

      if (!options.dryRun) {
        console.log(chalk.yellow(`🚀 Starting ${framework.name} dev server...`));
        executeCommand(command);
      }
    } else {
      console.log(chalk.red('❌ No supported framework detected'));
      console.log(
        chalk.yellow(
          '💡 Supported frameworks: Next.js, React, Vue, Svelte, Angular, Nuxt, Remix, Gatsby'
        )
      );
      console.log(chalk.gray('📋 Creating a generic development server...'));

      const command = `npx serve -l ${options.port} .`;
      console.log(chalk.cyan(`📝 Command: ${command}`));

      if (!options.dryRun) {
        console.log(chalk.yellow('🚀 Starting generic dev server...'));
        executeCommand(command);
      }
    }
  });

// Universal build command with actual execution
program
  .command('universal-build')
  .alias('ubuild')
  .description('Construire le projet pour la production (universel)')
  .option('-o, --output <output>', 'Répertoire de sortie', 'dist')
  .option('--target <target>', 'Cible de build', 'production')
  .option('--analyze', 'Analyser le bundle')
  .option('--minify', 'Minifier le code')
  .option('--sourcemap', 'Générer les sourcemaps')
  .option('--dry-run', 'Montrer la commande sans lexécuter')
  .action(async (options) => {
    console.log(chalk.blue('🔍 Detecting framework for build...'));

    const detector = new FrameworkDetector();
    const framework = await detector.detectFramework();

    if (framework && framework.name !== 'generic') {
      console.log(
        chalk.green(`✅ Framework detected: ${framework.name} v${framework.version || 'unknown'}`)
      );

      const command = getBuildCommand(framework, options);
      console.log(chalk.cyan(`📝 Command: ${command}`));

      if (!options.dryRun) {
        console.log(chalk.yellow(`🏗️ Building ${framework.name} project...`));
        executeCommand(command);
      }
    } else {
      console.log(chalk.red('❌ No supported framework detected'));
      console.log(chalk.yellow('💡 Using generic build process...'));

      const command = 'npm run build || echo "No build script found"';
      console.log(chalk.cyan(`📝 Command: ${command}`));

      if (!options.dryRun) {
        console.log(chalk.yellow('🏗️ Running generic build...'));
        executeCommand(command);
      }
    }
  });

// Helper functions
function getDevCommand(framework, options) {
  const { port, host, hot, inspect, turbo, experimental } = options;

  switch (framework.name) {
    case 'nextjs':
      let cmd = 'next dev';
      if (port !== '3000') cmd += ` -p ${port}`;
      if (host !== 'localhost') cmd += ` -H ${host}`;
      if (turbo) cmd += ' --turbo';
      return cmd;

    case 'react':
      cmd = 'vite';
      if (port !== '3000') cmd += ` --port ${port}`;
      if (host !== 'localhost') cmd += ` --host ${host}`;
      return cmd;

    case 'svelte':
      return 'npm run dev';

    case 'vue':
      return 'npm run dev';

    case 'nuxt':
      cmd = 'nuxt dev';
      if (port !== '3000') cmd += ` --port ${port}`;
      return cmd;

    case 'angular':
      cmd = 'ng serve';
      if (port !== '3000') cmd += ` --port ${port}`;
      return cmd;

    case 'remix':
      cmd = 'remix dev';
      if (port !== '3000') cmd += ` --port ${port}`;
      return cmd;

    case 'gatsby':
      return 'gatsby develop';

    default:
      return `npx serve -l ${port} .`;
  }
}

function getBuildCommand(framework, options) {
  const { output, target, analyze, minify, sourcemap } = options;

  switch (framework.name) {
    case 'nextjs':
      let cmd = 'next build';
      if (analyze) cmd += ' --analyze';
      return cmd;

    case 'react':
      cmd = 'vite build';
      if (output !== 'dist') cmd += ` --outDir ${output}`;
      return cmd;

    case 'svelte':
      return 'npm run build';

    case 'vue':
      return 'npm run build';

    case 'nuxt':
      return 'nuxt build';

    case 'angular':
      cmd = 'ng build';
      if (target !== 'production') cmd += ` --configuration ${target}`;
      return cmd;

    case 'remix':
      return 'remix build';

    case 'gatsby':
      return 'gatsby build';

    default:
      return 'npm run build';
  }
}

function executeCommand(command) {
  const [cmd, ...args] = command.split(' ');
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(chalk.red(`❌ Command failed with exit code ${code}`));
      process.exit(code);
    }
  });

  child.on('error', (error) => {
    console.error(chalk.red('❌ Failed to execute command:'), error.message);
    process.exit(1);
  });
}

program.parse();
