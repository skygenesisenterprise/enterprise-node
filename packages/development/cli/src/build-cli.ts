#!/usr/bin/env node

import { Command } from 'commander';
import { readFile } from 'fs/promises';

const program = new Command();

program.name('enterprise-build').description('Enterprise SDK Build CLI').version('1.0.0');

program
  .command('build')
  .description('Build project with .enterprise system')
  .option('-m, --mode <mode>', 'Build mode (development|production)', 'development')
  .option('-f, --framework <framework>', 'Framework (nextjs|react|vue|angular|svelte)')
  .option('-e, --environment <environment>', 'Environment', 'development')
  .option('-v, --version <version>', 'Version', '1.0.0')
  .option('-c, --clean', 'Clean build directory before building', false)
  .option('--config <path>', 'Path to config file')
  .action(async (options) => {
    try {
      // Dynamic import to avoid build issues
      const enterpriseModule = await import('@skygenesisenterprise/enterprise-node');
      const EnterpriseBuilder = (enterpriseModule as any).EnterpriseBuilder;

      let config = {
        mode: options.mode,
        framework: options.framework,
        environment: options.environment,
        version: options.version,
        clean: options.clean,
      };

      // Load config file if specified
      if (options.config) {
        try {
          const configFile = await readFile(options.config, 'utf-8');
          const fileConfig = JSON.parse(configFile);
          config = { ...config, ...fileConfig };
        } catch (error) {
          console.error(`Failed to load config file: ${error}`);
          process.exit(1);
        }
      }

      const builder = await EnterpriseBuilder.create(config);
      await builder.build();

      console.log('✅ Build completed successfully!');
    } catch (error) {
      console.error('❌ Build failed:', error);
      process.exit(1);
    }
  });

program
  .command('clean')
  .description('Clean .enterprise build directory')
  .action(async () => {
    try {
      const enterpriseModule = await import('@skygenesisenterprise/enterprise-node');
      const EnterpriseBuilder = (enterpriseModule as any).EnterpriseBuilder;

      const builder = await EnterpriseBuilder.create();
      await builder.clean();
      console.log('✅ Build directory cleaned!');
    } catch (error) {
      console.error('❌ Clean failed:', error);
      process.exit(1);
    }
  });

program
  .command('info')
  .description('Show build information')
  .action(async () => {
    try {
      const enterpriseModule = await import('@skygenesisenterprise/enterprise-node');
      const EnterpriseBuilder = (enterpriseModule as any).EnterpriseBuilder;

      const builder = await EnterpriseBuilder.create();
      const info = await builder.getInfo();

      console.log('📊 Build Information:');
      console.log(`Total artifacts: ${info.totalArtifacts}`);
      console.log(`Last build: ${info.lastBuild || 'Never'}`);
    } catch (error) {
      console.error('❌ Failed to get info:', error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize .enterprise build system')
  .option('-f, --framework <framework>', 'Framework to use')
  .action(async (options) => {
    try {
      const enterpriseModule = await import('@skygenesisenterprise/enterprise-node');
      const EnterpriseBuilder = (enterpriseModule as any).EnterpriseBuilder;

      const config = {
        mode: 'development',
        framework: options.framework,
        environment: 'development',
        version: '1.0.0',
      };

      const builder = await EnterpriseBuilder.create(config);
      await builder.build();

      console.log('✅ .enterprise build system initialized!');
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      process.exit(1);
    }
  });

program.parse();
