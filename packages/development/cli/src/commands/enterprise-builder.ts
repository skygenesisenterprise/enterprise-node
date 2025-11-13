import { Command } from 'commander';
import chalk from 'chalk';
import { readFile } from 'fs/promises';

export class EnterpriseBuilderCommand {
  private options: any;
  private globalOptions: any;

  constructor(options: any, globalOptions: any) {
    this.options = options;
    this.globalOptions = globalOptions;
  }

  async execute(): Promise<void> {
    const program = new Command();

    program.name('enterprise-builder').description('.enterprise Build System CLI').version('1.0.0');

    program
      .command('build')
      .description('Build with .enterprise system')
      .option('-m, --mode <mode>', 'Build mode (development|production)', 'development')
      .option('-f, --framework <framework>', 'Framework (nextjs|react|vue|angular|svelte)')
      .option('-e, --environment <environment>', 'Environment', 'development')
      .option('-v, --version <version>', 'Version', '1.0.0')
      .option('-c, --clean', 'Clean build directory before building', false)
      .option('--config <path>', 'Path to config file')
      .action(async (options) => {
        try {
          await this.handleBuild(options);
        } catch (error) {
          console.error(chalk.red('❌ Build failed:'), error);
          process.exit(1);
        }
      });

    program
      .command('clean')
      .description('Clean .enterprise build directory')
      .action(async () => {
        try {
          await this.handleClean();
        } catch (error) {
          console.error(chalk.red('❌ Clean failed:'), error);
          process.exit(1);
        }
      });

    program
      .command('info')
      .description('Show build information')
      .action(async () => {
        try {
          await this.handleInfo();
        } catch (error) {
          console.error(chalk.red('❌ Failed to get info:'), error);
          process.exit(1);
        }
      });

    program
      .command('init')
      .description('Initialize .enterprise build system')
      .option('-f, --framework <framework>', 'Framework to use')
      .action(async (options) => {
        try {
          await this.handleInit(options);
        } catch (error) {
          console.error(chalk.red('❌ Initialization failed:'), error);
          process.exit(1);
        }
      });

    await program.parseAsync(['enterprise-builder', ...process.argv.slice(2)]);
  }

  private async handleBuild(options: any): Promise<void> {
    const enterpriseModule = await import('@skygenesisenterprise/enterprise-node');
    const EnterpriseBuilder = (enterpriseModule as any).EnterpriseBuilder;

    let config = {
      mode: options.mode,
      framework: options.framework,
      environment: options.environment,
      version: options.version,
      clean: options.clean,
    };

    if (options.config) {
      try {
        const configFile = await readFile(options.config, 'utf-8');
        const fileConfig = JSON.parse(configFile);
        config = { ...config, ...fileConfig };
      } catch (error) {
        throw new Error(`Failed to load config file: ${error}`);
      }
    }

    const builder = await EnterpriseBuilder.create(config);
    await builder.build();

    console.log(chalk.green('✅ Build completed successfully!'));
  }

  private async handleClean(): Promise<void> {
    const enterpriseModule = await import('@skygenesisenterprise/enterprise-node');
    const EnterpriseBuilder = (enterpriseModule as any).EnterpriseBuilder;

    const builder = await EnterpriseBuilder.create();
    await builder.clean();

    console.log(chalk.green('✅ Build directory cleaned!'));
  }

  private async handleInfo(): Promise<void> {
    const enterpriseModule = await import('@skygenesisenterprise/enterprise-node');
    const EnterpriseBuilder = (enterpriseModule as any).EnterpriseBuilder;

    const builder = await EnterpriseBuilder.create();
    const info = await builder.getInfo();

    console.log(chalk.cyan('📊 Build Information:'));
    console.log(`Total artifacts: ${info.totalArtifacts}`);
    console.log(`Last build: ${info.lastBuild || 'Never'}`);
  }

  private async handleInit(options: any): Promise<void> {
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

    console.log(chalk.green('✅ .enterprise build system initialized!'));
  }
}
