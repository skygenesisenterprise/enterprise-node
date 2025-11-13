/**
 * 🚀 Exemple simple d'utilisation du SDK Enterprise
 *
 * Ce fichier montre comment démarrer rapidement avec @skygenesisenterprise/enterprise-node
 */

import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

// Configuration simple pour démarrer
const config = {
  modules: {
    ai: true, // Activer l'IA
    storage: true, // Activer le stockage
    sdk: true, // Activer l'auto-référence (unique!)
  },
  debug: true, // Mode debug pour voir ce qui se passe
};

async function quickStart() {
  console.log('🚀 Quick Start - SDK Enterprise');

  try {
    // 1. Créer et initialiser le SDK
    const sdk = new EnterpriseSDK(config);
    await sdk.initialize();
    console.log('✅ SDK prêt!');

    // 2. Utiliser le module AI
    if (sdk.ai) {
      console.log('\n🤖 Test AI...');
      const response = await sdk.ai.generate('Bonjour, comment ça va?');
      console.log('Réponse:', response.text);
    }

    // 3. Utiliser le module Storage
    if (sdk.storage) {
      console.log('\n💾 Test Storage...');
      await sdk.storage.store('demo', { message: 'Hello Enterprise!' });
      const data = await sdk.storage.retrieve('demo');
      console.log('Données:', data);
    }

    // 4. Utiliser le module SDK (auto-référence)
    if (sdk.sdk) {
      console.log('\n🔄 Test Auto-référence...');
      const info = sdk.sdk.getMetaInfo();
      console.log('SDK Info:', info);
    }

    console.log('\n🎉 Quick Start terminé!');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Exécuter si ce fichier est lancé directement
quickStart();
