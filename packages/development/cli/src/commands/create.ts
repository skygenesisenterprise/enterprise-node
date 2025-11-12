import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

interface CreateOptions {
  template: string;
  directory?: string;
  install: boolean;
}

export async function createCommand(name: string, options: CreateOptions) {
  console.log(chalk.blue.bold(`🚀 Création du projet Enterprise: ${name}`));

  try {
    // Validation du nom
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
      throw new Error('Le nom du projet ne doit contenir que des lettres, chiffres, tirets et underscores');
    }

    // Détermination du répertoire
    const targetDir = options.directory || path.join(process.cwd(), name);
    
    if (await fs.pathExists(targetDir)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Le répertoire ${targetDir} existe déjà. Voulez-vous l'écraser ?`,
          default: false
        }
      ]);

      if (!overwrite) {
        console.log(chalk.yellow('Opération annulée.'));
        return;
      }

      await fs.remove(targetDir);
    }

    // Sélection du template si non spécifié
    let template = options.template;
    if (template === 'default') {
      const { selectedTemplate } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedTemplate',
          message: 'Choisissez un template:',
          choices: [
            { name: 'React + TypeScript', value: 'react-ts' },
            { name: 'React + JavaScript', value: 'react-js' },
            { name: 'Svelte + TypeScript', value: 'svelte-ts' },
            { name: 'Next.js', value: 'nextjs' },
            { name: 'Node.js', value: 'node' },
            { name: 'Minimal', value: 'minimal' }
          ]
        }
      ]);
      template = selectedTemplate;
    }

    // Création du projet
    const spinner = ora('Création du projet...').start();

    try {
      await createProject(targetDir, name, template);
      spinner.succeed('Projet créé avec succès!');
    } catch (error) {
      spinner.fail('Erreur lors de la création du projet');
      throw error;
    }

    // Installation des dépendances
    if (options.install) {
      const installSpinner = ora('Installation des dépendances...').start();
      
      try {
        await installDependencies(targetDir);
        installSpinner.succeed('Dépendances installées!');
      } catch (error) {
        installSpinner.fail('Erreur lors de l\'installation des dépendances');
        console.log(chalk.yellow('Vous pouvez installer les dépendances manuellement avec: npm install'));
      }
    }

    // Instructions suivantes
    console.log(chalk.green.bold('\n✨ Projet créé avec succès!'));
    console.log(chalk.cyan('\nÉtapes suivantes:'));
    console.log(`  ${chalk.gray('1.')} cd ${name}`);
    
    if (!options.install) {
      console.log(`  ${chalk.gray('2.')} npm install`);
    }
    
    console.log(`  ${chalk.gray(options.install ? '2' : '3')}. npm run dev`);
    console.log(chalk.cyan('\nDocumentation: https://enterprise.skygenesis.com/docs'));

  } catch (error) {
    console.error(chalk.red('Erreur:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function createProject(targetDir: string, name: string, template: string) {
  const templateDir = path.join(__dirname, '../templates', template);
  
  // Vérifier si le template existe
  if (!(await fs.pathExists(templateDir))) {
    throw new Error(`Template "${template}" non trouvé`);
  }

  // Copier les fichiers du template
  await fs.copy(templateDir, targetDir);

  // Mettre à jour package.json avec le nom du projet
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = name;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  // Remplacer les placeholders dans les fichiers
  const files = await glob('**/*', { cwd: targetDir, nodir: true });
  
  for (const file of files) {
    const filePath = path.join(targetDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Remplacer les placeholders
    const updatedContent = content
      .replace(/{{PROJECT_NAME}}/g, name)
      .replace(/{{PROJECT_NAME_KEBAB}}/g, name.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
      .replace(/{{PROJECT_NAME_PASCAL}}/g, toPascalCase(name));

    await fs.writeFile(filePath, updatedContent);
  }
}

async function installDependencies(targetDir: string) {
  const { spawn } = await import('child_process');
  
  return new Promise<void>((resolve, reject) => {
    const process = spawn('npm', ['install'], {
      cwd: targetDir,
      stdio: 'pipe'
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`npm install a échoué avec le code ${code}`));
      }
    });

    process.on('error', reject);
  });
}

function toPascalCase(str: string): string {
  return str
    .replace(/(?:^|[-_])(\w)/g, (_, char) => char.toUpperCase())
    .replace(/[-_]/g, '');
}