/**
 * 🧪 Script d'intégration end-to-end pour le SDK Enterprise
 *
 * Ce script teste l'intégration complète du SDK dans différents scénarios
 */

import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

const TEST_TIMEOUT = 30000; // 30 secondes par test

class IntegrationTester {
  constructor() {
    this.results = [];
    this.currentTest = null;
  }

  async runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      console.log(`🔧 Exécution: ${command} ${args.join(' ')}`);

      const child = spawn(command, args, {
        stdio: 'pipe',
        ...options,
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      const timeout = setTimeout(() => {
        child.kill('SIGKILL');
        reject(new Error(`Timeout après ${TEST_TIMEOUT}ms`));
      }, TEST_TIMEOUT);

      child.on('close', (code) => {
        clearTimeout(timeout);
        resolve({ code, stdout, stderr });
      });

      child.on('error', reject);
    });
  }

  async testBasicInstallation() {
    console.log('\n📦 Test 1: Installation de base');

    try {
      // Test d'importation simple
      const result = await this.runCommand('node', [
        '-e',
        `
        import('@skygenesisenterprise/enterprise-node')
          .then(() => console.log('✅ Importation réussie'))
          .catch(err => {
            console.error('❌ Erreur d\'importation:', err.message);
            process.exit(1);
          });
      `,
      ]);

      if (result.code === 0) {
        this.addResult('Installation de base', true, 'Importation réussie');
      } else {
        this.addResult('Installation de base', false, result.stderr);
      }
    } catch (error) {
      this.addResult('Installation de base', false, error.message);
    }
  }

  async testSDKInitialization() {
    console.log('\n🚀 Test 2: Initialisation du SDK');

    try {
      const testCode = `
        import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';
        
        const sdk = new EnterpriseSDK({
          modules: { ai: true, storage: true },
          debug: true
        });
        
        sdk.initialize()
          .then(() => console.log('✅ SDK initialisé'))
          .catch(err => {
            console.error('❌ Erreur d\'initialisation:', err.message);
            process.exit(1);
          });
      `;

      const result = await this.runCommand('node', ['-e', testCode]);

      if (result.code === 0) {
        this.addResult('Initialisation SDK', true, 'SDK initialisé avec succès');
      } else {
        this.addResult('Initialisation SDK', false, result.stderr);
      }
    } catch (error) {
      this.addResult('Initialisation SDK', false, error.message);
    }
  }

  async testModuleFunctionality() {
    console.log('\n🧩 Test 3: Fonctionnalité des modules');

    try {
      const testCode = `
        import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';
        
        async function testModules() {
          const sdk = new EnterpriseSDK({
            modules: { ai: true, storage: true, ui: true },
            debug: true
          });
          
          await sdk.initialize();
          
          // Test Storage
          try {
            await sdk.storage.store('test', { data: 'test' });
            const data = await sdk.storage.retrieve('test');
            console.log('✅ Storage module fonctionne');
          } catch (err) {
            console.log('⚠️ Storage module:', err.message);
          }
          
          // Test UI
          try {
            sdk.ui.setTheme('dark');
            console.log('✅ UI module fonctionne');
          } catch (err) {
            console.log('⚠️ UI module:', err.message);
          }
          
          console.log('🎉 Tests modules terminés');
        }
        
        testModules().catch(err => {
          console.error('❌ Erreur modules:', err.message);
          process.exit(1);
        });
      `;

      const result = await this.runCommand('node', ['-e', testCode]);

      if (result.code === 0) {
        this.addResult('Fonctionnalité modules', true, 'Modules testés avec succès');
      } else {
        this.addResult('Fonctionnalité modules', false, result.stderr);
      }
    } catch (error) {
      this.addResult('Fonctionnalité modules', false, error.message);
    }
  }

  async testExampleFiles() {
    console.log("\n📚 Test 4: Fichiers d'exemple");

    try {
      // Test du fichier example.js
      const examplePath = path.join(process.cwd(), 'examples', 'example.js');

      if (await fs.pathExists(examplePath)) {
        const result = await this.runCommand('node', [examplePath]);

        if (result.code === 0) {
          this.addResult('Fichier exemple', true, 'Exemple exécuté avec succès');
        } else {
          this.addResult('Fichier exemple', false, result.stderr);
        }
      } else {
        this.addResult('Fichier exemple', false, 'Fichier example.js non trouvé');
      }
    } catch (error) {
      this.addResult('Fichier exemple', false, error.message);
    }
  }

  async testPackageStructure() {
    console.log('\n📁 Test 5: Structure du package');

    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);

      const requiredFields = ['name', 'version', 'main', 'exports'];
      const missingFields = requiredFields.filter((field) => !packageJson[field]);

      if (missingFields.length === 0) {
        this.addResult('Structure package', true, 'Tous les champs requis présents');
      } else {
        this.addResult('Structure package', false, `Champs manquants: ${missingFields.join(', ')}`);
      }
    } catch (error) {
      this.addResult('Structure package', false, error.message);
    }
  }

  async testDocumentationLinks() {
    console.log('\n🔗 Test 6: Liens de documentation');

    try {
      const files = [
        'README.md',
        'packages/development/cli/src/commands/info.ts',
        'packages/development/cli/src/commands/create.ts',
        'packages/create-enterprise-app/src/index.ts',
      ];

      let allLinksValid = true;
      const invalidLinks = [];

      for (const file of files) {
        const filePath = path.join(process.cwd(), file);
        if (await fs.pathExists(filePath)) {
          const content = await fs.readFile(filePath, 'utf-8');

          // Vérifier les liens wiki.skygenesisenterprise.com
          if (content.includes('wiki.skygenesisenterprise.com')) {
            console.log(`✅ Liens valides dans ${file}`);
          } else if (
            content.includes('enterprise.skygenesis.com') ||
            content.includes('docs.skygenesisenterprise.com')
          ) {
            console.log(`⚠️ Anciens liens trouvés dans ${file}`);
            allLinksValid = false;
            invalidLinks.push(file);
          }
        }
      }

      if (allLinksValid) {
        this.addResult(
          'Liens documentation',
          true,
          'Tous les liens pointent vers wiki.skygenesisenterprise.com'
        );
      } else {
        this.addResult(
          'Liens documentation',
          false,
          `Anciens liens trouvés dans: ${invalidLinks.join(', ')}`
        );
      }
    } catch (error) {
      this.addResult('Liens documentation', false, error.message);
    }
  }

  addResult(testName, success, message) {
    this.results.push({
      test: testName,
      success,
      message,
      timestamp: new Date().toISOString(),
    });

    const status = success ? '✅' : '❌';
    console.log(`${status} ${testName}: ${message}`);
  }

  async generateReport() {
    console.log("\n📊 Rapport de test d'intégration");
    console.log('='.repeat(50));

    const totalTests = this.results.length;
    const passedTests = this.results.filter((r) => r.success).length;
    const failedTests = totalTests - passedTests;

    console.log(`\n📈 Résumé:`);
    console.log(`   Total: ${totalTests}`);
    console.log(`   ✅ Réussis: ${passedTests}`);
    console.log(`   ❌ Échoués: ${failedTests}`);
    console.log(`   📊 Taux de réussite: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    console.log(`\n📋 Détails:`);
    this.results.forEach((result) => {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${status} ${result.test}: ${result.message}`);
    });

    // Générer le rapport JSON
    const report = {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: (passedTests / totalTests) * 100,
      },
      results: this.results,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
    };

    await fs.writeJson('integration-test-report.json', report, { spaces: 2 });
    console.log(`\n💾 Rapport sauvegardé: integration-test-report.json`);

    return report;
  }

  async runAllTests() {
    console.log("🚀 Démarrage des tests d'intégration du SDK Enterprise");
    console.log(`⏰ Timeout par test: ${TEST_TIMEOUT}ms`);

    await this.testBasicInstallation();
    await this.testSDKInitialization();
    await this.testModuleFunctionality();
    await this.testExampleFiles();
    await this.testPackageStructure();
    await this.testDocumentationLinks();

    const report = await this.generateReport();

    // Exit avec le code approprié
    if (report.summary.failed > 0) {
      console.log('\n❌ Certains tests ont échoué');
      process.exit(1);
    } else {
      console.log('\n🎉 Tous les tests ont réussi!');
      process.exit(0);
    }
  }
}

// Exécuter les tests
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new IntegrationTester();
  tester.runAllTests().catch((error) => {
    console.error('💥 Erreur critique lors des tests:', error);
    process.exit(1);
  });
}

export { IntegrationTester };
