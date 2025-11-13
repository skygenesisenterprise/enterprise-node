import chalk from 'chalk';

export class DoctorCommand {
  constructor(_options: any, _globalOptions: any) {}

  async execute(): Promise<void> {
    console.log(chalk.blue.bold('🩺 Diagnostic du projet Enterprise'));

    const checks = [
      { name: 'Node.js version', check: this.checkNodeVersion },
      { name: 'Package.json', check: this.checkPackageJson },
      { name: 'Configuration Enterprise', check: this.checkEnterpriseConfig },
      { name: 'Dépendances', check: this.checkDependencies },
      { name: 'TypeScript', check: this.checkTypeScript },
    ];

    let allPassed = true;

    for (const { name, check } of checks) {
      try {
        const result = await check.call(this);
        if (result.passed) {
          console.log(chalk.green(`✓ ${name}: ${result.message}`));
        } else {
          console.log(chalk.red(`✗ ${name}: ${result.message}`));
          allPassed = false;
        }
      } catch (error) {
        console.log(chalk.red(`✗ ${name}: Erreur de diagnostic`));
        allPassed = false;
      }
    }

    if (allPassed) {
      console.log(chalk.green.bold('\n✨ Tous les tests sont passés!'));
    } else {
      console.log(
        chalk.yellow.bold('\n⚠️  Certains tests ont échoué. Veuillez corriger les problèmes.')
      );
    }
  }

  private async checkNodeVersion() {
    const version = process.version;
    const major = parseInt(version.slice(1).split('.')[0]);

    if (major >= 18) {
      return { passed: true, message: version };
    } else {
      return { passed: false, message: `${version} (Node.js 18+ requis)` };
    }
  }

  private async checkPackageJson() {
    const fs = await import('fs-extra');

    if (await fs.pathExists('package.json')) {
      return { passed: true, message: 'Trouvé' };
    } else {
      return { passed: false, message: 'Non trouvé' };
    }
  }

  private async checkEnterpriseConfig() {
    const fs = await import('fs-extra');

    if (
      (await fs.pathExists('enterprise.config.ts')) ||
      (await fs.pathExists('enterprise.config.js'))
    ) {
      return { passed: true, message: 'Trouvé' };
    } else {
      return { passed: false, message: 'Non trouvé (exécutez "enterprise init")' };
    }
  }

  private async checkDependencies() {
    const fs = await import('fs-extra');

    try {
      const packageJson = await fs.readJson('package.json');
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      const enterpriseDeps = Object.keys(deps).filter((dep) =>
        dep.startsWith('@skygenesisenterprise/')
      );

      if (enterpriseDeps.length > 0) {
        return {
          passed: true,
          message: `${enterpriseDeps.length} dépendance(s) Enterprise trouvée(s)`,
        };
      } else {
        return { passed: false, message: 'Aucune dépendance Enterprise trouvée' };
      }
    } catch {
      return { passed: false, message: 'Impossible de lire package.json' };
    }
  }

  private async checkTypeScript() {
    const fs = await import('fs-extra');

    if (await fs.pathExists('tsconfig.json')) {
      return { passed: true, message: 'TypeScript configuré' };
    } else {
      return { passed: true, message: 'TypeScript non configuré (optionnel)' };
    }
  }
}

// Export function for backward compatibility
export async function doctorCommand() {
  const command = new DoctorCommand({}, {});
  await command.execute();
}
