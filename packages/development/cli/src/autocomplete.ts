#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

const program = new Command();

program
  .name('enterprise-autocomplete')
  .description('Enterprise SDK Auto-completion Tools')
  .version('1.0.0');

// Commande pour générer des snippets
program
  .command('snippets')
  .description('Generate code snippets for IDE auto-completion')
  .option('-o, --output <path>', 'Output directory for snippets', '.vscode')
  .option('-f, --format <format>', 'Snippet format (vscode, sublime, atom)', 'vscode')
  .action(async (options) => {
    console.log(chalk.blue('🚀 Generating Enterprise SDK snippets...'));

    const snippets = generateSnippets(options.format);
    const outputDir = path.resolve(options.output);

    await fs.ensureDir(outputDir);
    await fs.writeJSON(path.join(outputDir, 'enterprise-snippets.json'), snippets, { spaces: 2 });

    console.log(chalk.green(`✅ Snippets generated in ${outputDir}`));
  });

// Commande interactive pour créer du code
program
  .command('generate')
  .description('Interactive code generation')
  .action(async () => {
    console.log(chalk.blue('🎯 Enterprise SDK Code Generator'));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'module',
        message: 'Which module do you want to use?',
        choices: [
          { name: '🤖 AI - Generate text, enhance images', value: 'ai' },
          { name: '💾 Storage - Save/load files', value: 'storage' },
          { name: '🎨 UI - Create components', value: 'ui' },
          { name: '🔐 Auth - Authentication', value: 'auth' },
          { name: '📋 Project - Project management', value: 'project' },
          { name: '⚙️ SDK - SDK utilities', value: 'sdk' },
        ],
      },
      {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: (answers: any) => getActionsForModule(answers.module),
      },
    ]);

    const code = generateCode(answers.module, answers.action);
    console.log(chalk.green('\n📝 Generated code:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(code);
    console.log(chalk.gray('─'.repeat(50)));
  });

// Commande pour configurer l'auto-complétion
program
  .command('setup')
  .description('Setup auto-completion for your IDE')
  .action(async () => {
    console.log(chalk.blue('⚙️ Setting up Enterprise SDK auto-completion...'));

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'features',
        message: 'Which features do you want to enable?',
        choices: [
          { name: 'TypeScript definitions', value: 'typescript', checked: true },
          { name: 'VS Code snippets', value: 'vscode', checked: true },
          { name: 'CLI auto-completion', value: 'cli', checked: true },
          { name: 'JSDoc documentation', value: 'jsdoc', checked: true },
        ],
      },
    ]);

    for (const feature of answers.features) {
      await setupFeature(feature);
    }

    console.log(chalk.green('✅ Auto-completion setup complete!'));
  });

function generateSnippets(format: string) {
  const baseSnippets = {
    'Enterprise Initialize': {
      prefix: 'enterprise-init',
      body: [
        "import { Enterprise } from '@skygenesisenterprise/enterprise-node';",
        '',
        'const enterprise = new Enterprise();',
        'await enterprise.initialize();',
      ],
      description: 'Initialize Enterprise SDK',
    },
    'AI Generate': {
      prefix: 'ai-generate',
      body: [
        "const result = await enterprise.ai.generate('${1:prompt}', {",
        "  model: '${2:euse-generate-v0.1.0}',",
        '  maxTokens: ${3:1000},',
        '  temperature: ${4:0.7}',
        '});',
      ],
      description: 'Generate text using AI',
    },
    'Storage Save': {
      prefix: 'storage-save',
      body: [
        'const result = await enterprise.storage.save(${1:file}, {',
        "  path: '${2:/storage/path}',",
        '  encryption: ${3:false}',
        '});',
      ],
      description: 'Save file to storage',
    },
  };

  if (format === 'vscode') {
    return baseSnippets;
  }

  // Convertir pour d'autres formats si nécessaire
  return baseSnippets;
}

function getActionsForModule(module: string) {
  const actions: Record<string, any[]> = {
    ai: [
      { name: 'Generate text', value: 'generate' },
      { name: 'Enhance image', value: 'enhance' },
      { name: 'Analyze data', value: 'analyze' },
      { name: 'Get available models', value: 'models' },
    ],
    storage: [
      { name: 'Save file', value: 'save' },
      { name: 'Load file', value: 'load' },
      { name: 'List files', value: 'list' },
      { name: 'Delete file', value: 'delete' },
    ],
    ui: [
      { name: 'Create component', value: 'create-component' },
      { name: 'Render component', value: 'render' },
    ],
    auth: [
      { name: 'Authenticate user', value: 'authenticate' },
      { name: 'Authorize action', value: 'authorize' },
    ],
    project: [
      { name: 'Create project', value: 'create-project' },
      { name: 'Create task', value: 'create-task' },
      { name: 'Get project tasks', value: 'get-tasks' },
    ],
    sdk: [
      { name: 'Get meta info', value: 'meta' },
      { name: 'Create self reference', value: 'self-ref' },
    ],
  };

  return actions[module] || [];
}

function generateCode(module: string, action: string): string {
  const templates: Record<string, Record<string, string>> = {
    ai: {
      generate: `import { Enterprise } from '@skygenesisenterprise/enterprise-node';

const enterprise = new Enterprise();
await enterprise.initialize();

const result = await enterprise.ai.generate('Your prompt here', {
  model: 'euse-generate-v0.1.0',
  maxTokens: 1000,
  temperature: 0.7
});

console.log('Generated text:', result.text);`,

      enhance: `import { Enterprise } from '@skygenesisenterprise/enterprise-node';

const enterprise = new Enterprise();
await enterprise.initialize();

const result = await enterprise.ai.enhance(imageFile, {
  quality: 'high',
  format: 'jpeg',
  upscale: true
});

console.log('Enhanced:', result.enhanced);`,
    },
    storage: {
      save: `import { Enterprise } from '@skygenesisenterprise/enterprise-node';

const enterprise = new Enterprise();
await enterprise.initialize();

const result = await enterprise.storage.save(file, {
  path: '/storage/my-file.jpg',
  encryption: false,
  compression: true
});

console.log('File saved to:', result.path);`,
    },
  };

  return templates[module]?.[action] || '// Code template not found';
}

async function setupFeature(feature: string) {
  switch (feature) {
    case 'typescript':
      console.log(chalk.yellow('📝 TypeScript definitions are already included in the SDK'));
      break;

    case 'vscode':
      const vscodeDir = '.vscode';
      await fs.ensureDir(vscodeDir);
      await fs.writeJSON(
        path.join(vscodeDir, 'settings.json'),
        {
          'typescript.preferences.includePackageJsonAutoImports': 'on',
          'typescript.suggest.autoImports': true,
          'editor.tabCompletion': 'on',
          'editor.snippetSuggestions': 'top',
        },
        { spaces: 2 }
      );
      console.log(chalk.green('✅ VS Code settings configured'));
      break;

    case 'cli':
      console.log(chalk.yellow('🔧 Add this to your shell profile for CLI auto-completion:'));
      console.log(chalk.gray('eval "$(enterprise completion)"'));
      break;

    case 'jsdoc':
      console.log(
        chalk.green('📚 JSDoc documentation is already included in TypeScript definitions')
      );
      break;
  }
}

program.parse();
