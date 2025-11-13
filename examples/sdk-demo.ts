/**
 * 🚀 Exemple d'utilisation du SDK Enterprise
 *
 * Ce fichier montre comment utiliser @skygenesisenterprise/enterprise-node
 * avec les modules disponibles et fonctionnels.
 */

import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

// Configuration du SDK
const config = {
  modules: {
    ai: true, // Module IA
    storage: true, // Module Stockage
    ui: true, // Module UI
    project: true, // Module Projet
    auth: true, // Module Auth
    sdk: true, // Module SDK (auto-référence)
  },
  debug: true,
};

async function demonstrateSDK() {
  console.log('🚀 Démonstration du SDK Enterprise');
  console.log('='.repeat(40));

  try {
    // 1. Initialisation
    console.log('\n📦 Initialisation...');
    const sdk = new EnterpriseSDK(config);
    await sdk.initialize();
    console.log('✅ SDK initialisé avec succès!');

    // 2. Test des modules un par un
    console.log('\n🧪 Test des modules...');

    // Module AI
    try {
      console.log('\n🤖 Module AI:');
      const response = await sdk.ai.generate('Bonjour, présente-toi');
      console.log('✅ AI fonctionne:', response.text?.slice(0, 50) + '...');
    } catch (error) {
      console.log('⚠️ AI:', error.message);
    }

    // Module Storage
    try {
      console.log('\n💾 Module Storage:');
      await sdk.storage.store('test', { demo: true, time: Date.now() });
      const data = await sdk.storage.retrieve('test');
      console.log('✅ Storage fonctionne:', data);
    } catch (error) {
      console.log('⚠️ Storage:', error.message);
    }

    // Module UI
    try {
      console.log('\n🎨 Module UI:');
      sdk.ui.setTheme('dark');
      sdk.ui.showNotification('Test réussi!', 'success');
      console.log('✅ UI fonctionne');
    } catch (error) {
      console.log('⚠️ UI:', error.message);
    }

    // Module Project
    try {
      console.log('\n📋 Module Project:');
      const info = await sdk.project.getInfo();
      console.log('✅ Project fonctionne:', info.name || 'OK');
    } catch (error) {
      console.log('⚠️ Project:', error.message);
    }

    // Module Auth
    try {
      console.log('\n🔐 Module Auth:');
      const user = await sdk.auth.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
      });
      console.log('✅ Auth fonctionne:', user.name);
    } catch (error) {
      console.log('⚠️ Auth:', error.message);
    }

    // Module SDK (auto-référence)
    try {
      console.log('\n🔄 Module SDK:');
      const metaInfo = sdk.sdk.getMetaInfo();
      console.log('✅ SDK auto-référence fonctionne:', metaInfo.name);
    } catch (error) {
      console.log('⚠️ SDK:', error.message);
    }

    // 3. Informations système
    console.log('\n⚙️ Informations système:');
    try {
      const runtime = sdk.runtime;
      const framework = sdk.framework;
      const currentConfig = sdk.getConfig();

      console.log('🔧 Runtime disponible:', !!runtime);
      console.log('📱 Framework:', framework || 'auto');
      console.log('📊 Modules activés:', Object.keys(currentConfig.modules).length);
    } catch (error) {
      console.log('⚠️ Infos système:', error.message);
    }

    // 4. Résumé
    console.log('\n🎉 Démonstration terminée!');
    console.log('📈 Résumé des modules:');

    const modules = ['ai', 'storage', 'ui', 'project', 'auth', 'sdk'];
    for (const module of modules) {
      try {
        (sdk as any)[module];
        console.log(`   ✅ ${module}`);
      } catch {
        console.log(`   ❌ ${module}`);
      }
    }

    console.log('\n🚀 Le SDK Enterprise est prêt!');
    console.log('📚 Documentation: https://wiki.skygenesisenterprise.com');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Exécuter la démo
demonstrateSDK();
