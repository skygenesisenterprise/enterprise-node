/**
 * 🚀 Quick Start - Exemple simple du SDK Enterprise
 *
 * Montre comment utiliser rapidement @skygenesisenterprise/enterprise-node
 */

import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

// Configuration simple
const config = {
  modules: {
    ai: true,
    storage: true,
    sdk: true,
  },
  debug: true,
};

async function quickStart() {
  console.log('🚀 Quick Start - SDK Enterprise');

  try {
    // 1. Initialiser le SDK
    const sdk = new EnterpriseSDK(config);
    await sdk.initialize();
    console.log('✅ SDK initialisé!');

    // 2. Tester le module AI
    try {
      console.log('\n🤖 Test AI...');
      const response = await sdk.ai.generate('Bonjour!');
      console.log('Réponse:', response.text);
    } catch (error) {
      console.log('AI:', error.message);
    }

    // 3. Tester le module Storage
    try {
      console.log('\n💾 Test Storage...');
      await sdk.storage.store('demo', { message: 'Hello!' });
      const data = await sdk.storage.retrieve('demo');
      console.log('Données:', data);
    } catch (error) {
      console.log('Storage:', error.message);
    }

    // 4. Tester l'auto-référence
    try {
      console.log('\n🔄 Test Auto-référence...');
      const info = sdk.sdk.getMetaInfo();
      console.log('SDK Info:', info);
    } catch (error) {
      console.log('SDK:', error.message);
    }

    console.log('\n🎉 Quick Start terminé!');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

quickStart();
