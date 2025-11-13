import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';

export class NewCommand {
  private name: string;
  private options: any;

  constructor(name: string, options: any, _globalOptions: any) {
    this.name = name;
    this.options = options;
  }

  async execute(): Promise<void> {
    console.log(chalk.blue.bold("🚀 Création d'un nouveau projet Enterprise"));

    const targetDir = this.options.directory || path.join(process.cwd(), this.name);

    // Vérifier si le répertoire existe déjà
    if (await fs.pathExists(targetDir)) {
      console.error(chalk.red(`❌ Le répertoire "${targetDir}" existe déjà`));
      process.exit(1);
    }

    const spinner = ora('Création du projet...').start();

    try {
      // Créer le répertoire du projet
      await fs.ensureDir(targetDir);

      // Copier le template
      await this.copyTemplate(this.options.template, targetDir);

      // Mettre à jour package.json avec le nom du projet
      await this.updatePackageJson(targetDir);

      spinner.succeed('Projet créé avec succès!');

      console.log(chalk.cyan(`\n📁 Projet créé dans: ${targetDir}`));

      // Instructions suivantes
      console.log(chalk.yellow('\n📋 Prochaines étapes:'));
      console.log(`  cd ${this.name}`);
      console.log('  npm install');
      console.log('  enterprise dev');

      // Installer les dépendances si demandé
      if (this.options.install !== false) {
        spinner.start('Installation des dépendances...');
        await this.installDependencies(targetDir);
        spinner.succeed('Dépendances installées!');
      }

      // Initialiser Git si demandé
      if (this.options.git) {
        spinner.start('Initialisation de Git...');
        await this.initGit(targetDir);
        spinner.succeed('Git initialisé!');
      }
    } catch (error) {
      spinner.fail('Erreur lors de la création du projet');
      console.error(chalk.red('Erreur:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async copyTemplate(template: string, targetDir: string): Promise<void> {
    const templateDir = path.join(__dirname, '../../templates', template);

    // Vérifier si le template existe
    if (!(await fs.pathExists(templateDir))) {
      throw new Error(`Template "${template}" non trouvé`);
    }

    // Copier les fichiers du template
    await fs.copy(templateDir, targetDir, {
      filter: (src) => {
        // Ignorer les fichiers de configuration du template
        const basename = path.basename(src);
        return !basename.startsWith('.') && basename !== 'node_modules';
      },
    });
  }

  private async updatePackageJson(targetDir: string): Promise<void> {
    const packageJsonPath = path.join(targetDir, 'package.json');

    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = this.name;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  }

  private async installDependencies(targetDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['install'], {
        cwd: targetDir,
        stdio: 'pipe',
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(void 0);
        } else {
          reject(new Error(`npm install failed with code ${code}`));
        }
      });

      child.on('error', reject);
    });
  }

  private async initGit(targetDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('git', ['init'], {
        cwd: targetDir,
        stdio: 'pipe',
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(void 0);
        } else {
          reject(new Error(`git init failed with code ${code}`));
        }
      });

      child.on('error', reject);
    });
  }
}
