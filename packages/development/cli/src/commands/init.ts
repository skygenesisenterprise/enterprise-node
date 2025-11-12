import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

export async function initCommand(options: { force: boolean; typescript: boolean }) {
  console.log(chalk.blue.bold("🔧 Initialisation d'Enterprise SDK"));

  try {
    const cwd = process.cwd();
    const packageJsonPath = path.join(cwd, 'package.json');

    // Vérifier si package.json existe
    if (!(await fs.pathExists(packageJsonPath))) {
      throw new Error('Aucun package.json trouvé. Exécutez "npm init" d\'abord.');
    }

    // Lire package.json existant
    const packageJson = await fs.readJson(packageJsonPath);

    // Ajouter les dépendances Enterprise
    const dependencies = {
      '@skygenesisenterprise/enterprise': '^0.1.0',
      '@skygenesisenterprise/react': '^0.1.0',
      ...packageJson.dependencies,
    };

    const devDependencies = {
      '@skygenesisenterprise/cli': '^0.1.0',
      '@skygenesisenterprise/eslint-config': '^0.1.0',
      ...packageJson.devDependencies,
    };

    packageJson.dependencies = dependencies;
    packageJson.devDependencies = devDependencies;

    // Ajouter les scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      dev: 'enterprise dev',
      build: 'enterprise build',
      'enterprise:doctor': 'enterprise doctor',
    };

    // Écrire le package.json mis à jour
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    // Créer enterprise.config.ts
    const configPath = path.join(cwd, 'enterprise.config.ts');

    if (!(await fs.pathExists(configPath)) || options.force) {
      const configContent = generateConfig(options.typescript);
      await fs.writeFile(configPath, configContent);
      console.log(chalk.green('✓ enterprise.config.ts créé'));
    } else {
      console.log(
        chalk.yellow('⚠ enterprise.config.ts existe déjà (utilisez --force pour écraser)')
      );
    }

    // Créer .eslintrc.js
    const eslintPath = path.join(cwd, '.eslintrc.js');

    if (!(await fs.pathExists(eslintPath)) || options.force) {
      const eslintContent = generateEslintConfig();
      await fs.writeFile(eslintPath, eslintContent);
      console.log(chalk.green('✓ .eslintrc.js créé'));
    } else {
      console.log(chalk.yellow('⚠ .eslintrc.js existe déjà (utilisez --force pour écraser)'));
    }

    console.log(chalk.green.bold('\n✨ Enterprise SDK initialisé avec succès!'));
    console.log(chalk.cyan('\nProchaines étapes:'));
    console.log('  npm install');
    console.log('  npm run dev');
  } catch (error) {
    console.error(chalk.red('Erreur:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

function generateConfig(_typescript: boolean): string {
  return `import { EnterpriseConfig } from '@skygenesisenterprise/enterprise';

const config: EnterpriseConfig = {
  modules: {
    ai: true,
    storage: true,
    ui: true,
    project: true,
    auth: true
  },
  runtime: {
    wasmPath: '/wasm/euse_core.wasm',
    enableWasm: true,
    maxMemoryMB: 512
  },
  framework: 'auto',
  debug: process.env.NODE_ENV === 'development',
  telemetry: {
    enabled: false,
    endpoint: 'https://telemetry.skygenesisenterprise.com'
  },
  performance: {
    enableProfiling: false,
    enableMetrics: true
  }
};

export default config;
`;
}

function generateEslintConfig(): string {
  return `module.exports = {
  extends: ['@skygenesisenterprise/eslint-config'],
  rules: {
    // Ajouter vos règles personnalisées ici
  }
};
`;
}
