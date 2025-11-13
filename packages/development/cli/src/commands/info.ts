import chalk from 'chalk';

export class InfoCommand {
  private options: any;

  constructor(options: any, _globalOptions: any) {
    this.options = options;
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

      console.log(chalk.gray('\nDocumentation: https://wiki.skygenesisenterprise.com'));
      console.log(chalk.gray('GitHub: https://github.com/skygenesisenterprise/enterprise-node'));
    }
  }
}

// Export function for backward compatibility
export async function infoCommand() {
  const command = new InfoCommand({}, {});
  await command.execute();
}
