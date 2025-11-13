import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';

export class StartCommand {
  private options: any;

  constructor(options: any, _globalOptions: any) {
    this.options = options;
  }

  async execute(): Promise<void> {
    console.log(chalk.blue.bold("🚀 Démarrage de l'application Enterprise en mode production"));

    const spinner = ora('Démarrage du serveur de production...').start();

    try {
      // Détecter le framework et démarrer le serveur approprié
      const framework = await this.detectFramework();

      let command: string[];
      switch (framework) {
        case 'nextjs':
          command = ['next', 'start', '-p', this.options.port, '-H', this.options.host];
          break;
        case 'react':
          command = ['serve', '-s', 'dist', '-l', this.options.port];
          break;
        case 'svelte':
          command = [
            'npm',
            'run',
            'start',
            '--',
            '--host',
            this.options.host,
            '--port',
            this.options.port,
          ];
          break;
        default:
          command = ['npm', 'run', 'start'];
      }

      spinner.succeed(`Serveur de production démarré (${framework})`);
      console.log(chalk.cyan(`🌐 http://${this.options.host}:${this.options.port}`));

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

  private async detectFramework(): Promise<string> {
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
}
