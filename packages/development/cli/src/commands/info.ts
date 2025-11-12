import chalk from 'chalk';

export const infoCommand = async () => {
  console.log(chalk.blue('📦 Enterprise SDK'));
  console.log(chalk.gray('Informations sur le SDK Enterprise\n'));

  console.log(`Version: ${chalk.cyan('0.1.0')}`);
  console.log(`Author: ${chalk.cyan('Sky Genesis Enterprise')}`);
  console.log(`License: ${chalk.cyan('MIT')}`);
  
  console.log(chalk.yellow('\n📚 Documentation: https://enterprise.skygenesis.com/docs'));
  console.log(chalk.yellow('🐛 Issues: https://github.com/skygenesisenterprise/enterprise/issues'));
  console.log(chalk.yellow('💬 Support: https://discord.gg/skygenesis'));
};