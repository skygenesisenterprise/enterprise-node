/**
 * 🧪 Test simple pour valider l'installation du SDK Enterprise
 */

import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

async function testInstallation() {
  console.log("🧪 Test d'installation du SDK Enterprise");

  try {
    // Test basique d'importation
    console.log('✅ Importation réussie');

    // Test de création du SDK
    const sdk = new EnterpriseSDK({
      modules: {
        ai: true,
        storage: true,
      },
      debug: true,
    });

    console.log('✅ Création du SDK réussie');

    // Test d'initialisation
    await sdk.initialize();
    console.log('✅ Initialisation réussie');

    // Test des modules
    console.log('📦 Modules disponibles:');
    console.log('   - AI:', !!sdk.ai);
    console.log('   - Storage:', !!sdk.storage);

    console.log('\n🎉 Installation validée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    process.exit(1);
  }
}

testInstallation();
