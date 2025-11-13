import chalk from 'chalk';

export class InfoCommand {
  private options: any;
  private globalOptions: any;

  constructor(options: any, globalOptions: any) {
    this.options = options;
    this.globalOptions = globalOptions;
  }

  async execute(): Promise<void> {
    console.log(chalk.blue.bold('📋 Enterprise SDK Information'));

    const info = {
      Version: '0.1.0',
      'Node.js': process.version,
      Plateforme: process.platform,
      Architecture: process.arch,
      Répertoire: process.cwd(),
      CLI: '@skygenesisenterprise/cli',
    };

    if (this.options.json) {
      console.log(JSON.stringify(info, null, 2));
    } else {
      Object.entries(info).forEach(([key, value]) => {
        console.log(chalk.cyan(`${key}:`) + ` ${value}`);
      });

      console.log(chalk.gray('\nDocumentation: https://enterprise.skygenesis.com/docs'));
      console.log(chalk.gray('GitHub: https://github.com/skygenesisenterprise/enterprise'));
    }
  }
}

// Export function for backward compatibility
export async function infoCommand() {
  const command = new InfoCommand({}, {});
  await command.execute();
}
