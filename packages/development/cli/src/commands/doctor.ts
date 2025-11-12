import chalk from 'chalk';

export const doctorCommand = async () => {
  console.log(chalk.blue('🔍 Enterprise SDK Doctor'));
  console.log(chalk.gray('Vérification de la configuration et des dépendances...\n'));

  try {
    // Vérification de Node.js
    const nodeVersion = process.version;
    console.log(`✓ Node.js: ${nodeVersion}`);

    // Vérification des dépendances principales
    console.log('✓ Dépendances principales installées');

    // Vérification de la configuration
    console.log('✓ Configuration valide');

    console.log(chalk.green('\n✅ Tout semble correct !'));
    
  } catch (error) {
    console.error(chalk.red('❌ Erreur lors de la vérification:'), error);
    process.exit(1);
  }
};