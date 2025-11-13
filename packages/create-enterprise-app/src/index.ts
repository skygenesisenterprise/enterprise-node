#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import * as fs from 'fs-extra';
import * as path from 'path';
import { spawn } from 'cross-spawn';

const program = new Command();

program
  .name('create-enterprise-app')
  .description('Create a new Enterprise SDK application')
  .version('1.0.0')
  .argument('[project-name]', 'Name of the project')
  .option('-t, --template <template>', 'Template to use (base, mobile, backend, plugin)', 'base')
  .option('-d, --directory <directory>', 'Target directory')
  .option('--no-install', 'Skip installing dependencies')
  .option('--no-git', 'Skip Git initialization')
  .option('--typescript', 'Use TypeScript (default: true)', true)
  .option('--verbose', 'Show verbose output')
  .action(async (projectName: string | undefined, options: any) => {
    try {
      await createProject(projectName, options);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

async function createProject(projectName?: string, options: any = {}) {
  console.log(chalk.blue.bold('🚀 Create Enterprise App'));
  console.log(chalk.gray('Creating a new Enterprise SDK application...\n'));

  // Get project name if not provided
  if (!projectName) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Project name is required';
          }
          if (!/^[a-z0-9-_]+$/.test(input)) {
            return 'Project name should only contain lowercase letters, numbers, hyphens, and underscores';
          }
          return true;
        },
      },
    ]);
    projectName = answers.projectName;
  }

  // Get template if not specified
  if (!options.template) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Which template would you like to use?',
        choices: [
          {
            name: '📱 Base - Basic Enterprise application',
            value: 'base',
          },
          {
            name: '📱 Mobile - React Native with Enterprise',
            value: 'mobile',
          },
          {
            name: '🔧 Backend - Node.js API with Enterprise',
            value: 'backend',
          },
          {
            name: '🔌 Plugin - Enterprise plugin development',
            value: 'plugin',
          },
        ],
      },
    ]);
    options.template = answers.template;
  }

  // Get additional options
  if (!process.argv.includes('--no-install') && !process.argv.includes('--install')) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'install',
        message: 'Would you like to install dependencies?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'git',
        message: 'Would you like to initialize Git?',
        default: true,
      },
    ]);
    options.install = answers.install;
    options.git = answers.git;
  }

  const targetDir = options.directory || path.join(process.cwd(), projectName!);

  // Check if directory already exists
  if (await fs.pathExists(targetDir)) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Directory ${targetDir} already exists. Do you want to overwrite it?`,
        default: false,
      },
    ]);

    if (!answers.overwrite) {
      console.log(chalk.yellow('❌ Operation cancelled.'));
      process.exit(0);
    }

    await fs.remove(targetDir);
  }

  const spinner = ora('Creating project...').start();

  try {
    // Create project directory
    await fs.ensureDir(targetDir);

    // Copy template
    await copyTemplate(options.template, targetDir, projectName!, options);

    // Update package.json
    await updatePackageJson(targetDir, projectName!, options);

    spinner.succeed('Project created successfully!');

    console.log(chalk.cyan(`\n📁 Project created at: ${targetDir}`));

    // Show next steps
    console.log(chalk.yellow('\n📋 Next steps:'));
    console.log(`  cd ${projectName}`);

    if (options.install) {
      console.log('  npm install');
    }

    console.log('  npm run dev');

    // Install dependencies
    if (options.install) {
      spinner.start('Installing dependencies...');
      await installDependencies(targetDir, options);
      spinner.succeed('Dependencies installed!');
    }

    // Initialize Git
    if (options.git) {
      spinner.start('Initializing Git...');
      await initGit(targetDir);
      spinner.succeed('Git initialized!');
    }

    console.log(chalk.green('\n✨ Happy coding! 🎉'));
    console.log(chalk.gray('\nDocumentation: https://enterprise.skygenesis.com/docs'));
    console.log(chalk.gray('GitHub: https://github.com/skygenesisenterprise/enterprise'));
  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
}

async function copyTemplate(
  template: string,
  targetDir: string,
  projectName: string,
  options: any
) {
  const templateDir = path.join(__dirname, '../templates', template);

  // Check if template exists
  if (!(await fs.pathExists(templateDir))) {
    // For now, create a basic template
    await createBasicTemplate(template, targetDir, projectName, options);
    return;
  }

  // Copy template files
  await fs.copy(templateDir, targetDir, {
    filter: (src: string) => {
      const basename = path.basename(src);
      return !basename.startsWith('.') && basename !== 'node_modules';
    },
  });
}

async function createBasicTemplate(
  template: string,
  targetDir: string,
  projectName: string,
  options: any
) {
  const isTypeScript = options.typescript !== false;

  // Create basic structure
  await fs.ensureDir(path.join(targetDir, 'src'));

  // package.json
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    description: `Enterprise SDK ${template} application`,
    type: 'module',
    scripts: {
      dev: 'enterprise dev',
      build: 'enterprise build',
      start: 'enterprise start',
      test: 'vitest',
      typecheck: 'tsc --noEmit',
    },
    dependencies: {
      '@skygenesisenterprise/enterprise-node': '^1.0.0',
    },
    devDependencies: {
      typescript: '^5.0.0',
      vitest: '^1.0.0',
      '@types/node': '^20.0.0',
    },
  };

  await fs.writeJson(path.join(targetDir, 'package.json'), packageJson, { spaces: 2 });

  // Enterprise config
  const enterpriseConfig = {
    modules: {
      ai: true,
      storage: true,
      ui: true,
      project: true,
      auth: true,
    },
    runtime: {
      enableWasm: true,
    },
    debug: true,
  };

  const configExt = isTypeScript ? 'ts' : 'js';
  await fs.writeJson(path.join(targetDir, `enterprise.config.${configExt}`), enterpriseConfig, {
    spaces: 2,
  });

  // TypeScript config
  if (isTypeScript) {
    const tsConfig = {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        lib: ['ES2020', 'DOM'],
        declaration: true,
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
        resolveJsonModule: true,
        types: ['node'],
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist'],
    };

    await fs.writeJson(path.join(targetDir, 'tsconfig.json'), tsConfig, { spaces: 2 });
  }

  // Main file
  const mainExt = isTypeScript ? 'ts' : 'js';
  const mainContent = isTypeScript
    ? `import { Enterprise } from '@skygenesisenterprise/enterprise-node';

const enterprise = new Enterprise({
  modules: {
    ai: true,
    storage: true,
    ui: true,
    project: true,
    auth: true
  }
});

async function main() {
  try {
    await enterprise.initialize();
    console.log('🚀 Enterprise SDK initialized successfully!');
    
    // Your application code here
    
  } catch (error) {
    console.error('❌ Failed to initialize Enterprise SDK:', error);
    process.exit(1);
  }
}

main();`
    : `import { Enterprise } from '@skygenesisenterprise/enterprise-node';

const enterprise = new Enterprise({
  modules: {
    ai: true,
    storage: true,
    ui: true,
    project: true,
    auth: true
  }
});

async function main() {
  try {
    await enterprise.initialize();
    console.log('🚀 Enterprise SDK initialized successfully!');
    
    // Your application code here
    
  } catch (error) {
    console.error('❌ Failed to initialize Enterprise SDK:', error);
    process.exit(1);
  }
}

main();`;

  await fs.writeFile(path.join(targetDir, 'src', `index.${mainExt}`), mainContent);

  // README
  const readme = `# ${projectName}

Enterprise SDK ${template} application.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run test\` - Run tests
- \`npm run typecheck\` - Type checking

## Learn More

- [Enterprise SDK Documentation](https://enterprise.skygenesis.com/docs)
- [GitHub Repository](https://github.com/skygenesisenterprise/enterprise)
`;

  await fs.writeFile(path.join(targetDir, 'README.md'), readme);

  // .gitignore
  const gitignore = `# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/
`;

  await fs.writeFile(path.join(targetDir, '.gitignore'), gitignore);
}

async function updatePackageJson(targetDir: string, projectName: string, _options: any) {
  const packageJsonPath = path.join(targetDir, 'package.json');

  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = projectName;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }
}

async function installDependencies(targetDir: string, options: any) {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['install'], {
      cwd: targetDir,
      stdio: options.verbose ? 'inherit' : 'pipe',
    });

    child.on('close', (code: number | null) => {
      if (code === 0) {
        resolve(void 0);
      } else {
        reject(new Error(`npm install failed with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function initGit(targetDir: string) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['init'], {
      cwd: targetDir,
      stdio: 'pipe',
    });

    child.on('close', (code: number | null) => {
      if (code === 0) {
        resolve(void 0);
      } else {
        reject(new Error(`git init failed with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error(chalk.red('❌ Uncaught Exception:'), error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Unhandled Rejection at:'), promise, 'reason:', reason);
  process.exit(1);
});

// Parse arguments
program.parse();
