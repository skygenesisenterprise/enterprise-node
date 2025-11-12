import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';

export async function devCommand(options: { port: string; host: string }) {
  console.log(chalk.blue.bold('🔥 Démarrage du serveur de développement Enterprise'));

  const spinner = ora('Démarrage du serveur...').start();

  try {
    // Détecter le framework et démarrer le serveur approprié
    const framework = await detectFramework();

    let command: string[];
    switch (framework) {
      case 'nextjs':
        command = ['next', 'dev', '-p', options.port, '-H', options.host];
        break;
      case 'react':
        command = ['vite', '--port', options.port, '--host', options.host];
        break;
      case 'svelte':
        command = ['npm', 'run', 'dev', '--', '--port', options.port, '--host', options.host];
        break;
      default:
        command = ['npm', 'run', 'dev'];
    }

    spinner.succeed(`Serveur démarré (${framework})`);
    console.log(chalk.cyan(`🌐 http://${options.host}:${options.port}`));

    // Démarrer le processus
    const child = spawn(command[0], command.slice(1), {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    child.on('error', (error) => {
      console.error(chalk.red('Erreur lors du démarrage du serveur:'), error.message);
      process.exit(1);
    });

    // Gérer les signaux
    process.on('SIGINT', () => {
      child.kill('SIGINT');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      child.kill('SIGTERM');
      process.exit(0);
    });
  } catch (error) {
    spinner.fail('Erreur lors du démarrage');
    console.error(chalk.red('Erreur:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function detectFramework(): Promise<string> {
  const fs = await import('fs-extra');

  // Vérifier Next.js
  if ((await fs.pathExists('next.config.js')) || (await fs.pathExists('next.config.ts'))) {
    return 'nextjs';
  }

  // Vérifier React (Vite)
  if ((await fs.pathExists('vite.config.js')) || (await fs.pathExists('vite.config.ts'))) {
    return 'react';
  }

  // Vérifier Svelte
  if (await fs.pathExists('svelte.config.js')) {
    return 'svelte';
  }

  // Vérifier package.json pour des indices
  try {
    const packageJson = await fs.readJson('package.json');
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (deps.next) return 'nextjs';
    if (deps.vite) return 'react';
    if (deps.svelte) return 'svelte';
  } catch {
    // Ignorer les erreurs
  }

  return 'unknown';
}
