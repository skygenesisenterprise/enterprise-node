/**
 * 🚀 Exemple d'utilisation complet du SDK Enterprise
 *
 * Ce fichier démontre comment utiliser le package @skygenesisenterprise/enterprise-node
 * avec tous ses modules dans un projet Node.js.
 */

import { EnterpriseSDK, createEnterprise } from '@skygenesisenterprise/enterprise-node';

// Configuration complète du SDK
const config = {
  modules: {
    ai: true, // Module d'intelligence artificielle
    storage: true, // Module de stockage
    ui: true, // Module d'interface utilisateur
    project: true, // Module de gestion de projet
    auth: true, // Module d'authentification
    sdk: true, // Module d'auto-référence (unique!)
  },
  runtime: {
    enableWasm: true,
    fallback: true,
  },
  debug: true,
  branding: {
    companyName: 'Ma Entreprise',
    primaryColor: '#007acc',
  },
};

async function demonstrateSDK() {
  console.log('🚀 Démonstration complète du SDK Enterprise');
  console.log('='.repeat(50));

  try {
    // Méthode 1: Utilisation du constructeur
    console.log('\n📦 Méthode 1: Constructeur EnterpriseSDK');
    const sdk1 = new EnterpriseSDK(config);
    await sdk1.initialize();
    console.log('✅ SDK initialisé avec le constructeur');

    // Méthode 2: Utilisation de la factory function
    console.log('\n🏭 Méthode 2: Factory function createEnterprise');
    const sdk2 = await createEnterprise(config);
    console.log('✅ SDK créé avec la factory function');

    // Utilisons le premier SDK pour la démo
    const sdk = sdk1;

    // Test du module AI
    console.log('\n🤖 Test du module AI...');
    try {
      const aiResponse = await sdk.ai.generate('Bonjour, présente-toi en une phrase');
      console.log('📝 Réponse AI:', aiResponse.text);

      // Test d'analyse de sentiment
      const sentiment = await sdk.ai.analyzeSentiment("Je suis très heureux d'utiliser ce SDK!");
      console.log('😊 Analyse de sentiment:', sentiment);
    } catch (error) {
      console.log('⚠️ Module AI nécessite une configuration (clé API)');
    }

    // Test du module Storage
    console.log('\n💾 Test du module Storage...');
    try {
      // Stocker des données utilisateur
      const userData = {
        id: 'user-123',
        name: 'Alice Martin',
        email: 'alice@entreprise.com',
        preferences: { theme: 'dark', lang: 'fr' },
      };

      await sdk.storage.store('user:123', userData, {
        encryption: true,
        metadata: { type: 'profile', version: '1.0' },
      });
      console.log('💿 Données utilisateur stockées');

      // Récupérer les données
      const retrievedUser = await sdk.storage.retrieve('user:123');
      console.log('📥 Utilisateur récupéré:', retrievedUser.name);

      // Lister les clés
      const keys = await sdk.storage.list('user:*');
      console.log('🔑 Clés trouvées:', keys.length);
    } catch (error) {
      console.log('⚠️ Module Storage:', error.message);
    }

    // Test du module UI
    console.log('\n🎨 Test du module UI...');
    try {
      // Appliquer un thème
      sdk.ui.setTheme('dark');
      console.log('🌙 Thème sombre appliqué');

      // Afficher une notification
      sdk.ui.showNotification('SDK Enterprise prêt!', 'success');
      console.log('🔔 Notification affichée');

      // Appliquer le branding
      sdk.ui.applyBranding({
        companyName: 'Ma Entreprise',
        primaryColor: '#007acc',
        theme: 'dark',
      });
      console.log('🎯 Branding personnalisé appliqué');
    } catch (error) {
      console.log('⚠️ Module UI:', error.message);
    }

    // Test du module Project
    console.log('\n📋 Test du module Project...');
    try {
      // Obtenir les infos du projet
      const projectInfo = await sdk.project.getInfo();
      console.log('📁 Projet:', projectInfo.name || 'Enterprise SDK Demo');

      // Ajouter une dépendance
      await sdk.project.addDependency('lodash', '^4.17.21');
      console.log('➕ Dépendance lodash ajoutée');

      // Ajouter un script
      await sdk.project.addScript('demo', 'node examples/complete-demo.ts');
      console.log('📜 Script demo ajouté');
    } catch (error) {
      console.log('⚠️ Module Project:', error.message);
    }

    // Test du module Auth
    console.log('\n🔐 Test du module Auth...');
    try {
      // Enregistrement
      const user = await sdk.auth.register({
        name: 'Bob Dupont',
        email: 'bob@entreprise.com',
        password: 'Password123!',
      });
      console.log('👤 Utilisateur enregistré:', user.name);

      // Connexion
      const login = await sdk.auth.login({
        email: 'bob@entreprise.com',
        password: 'Password123!',
      });
      console.log('🔑 Connexion réussie');

      // Vérification du token
      const payload = await sdk.auth.verifyToken(login.token);
      console.log('✅ Token valide pour:', payload.name);
    } catch (error) {
      console.log('⚠️ Module Auth:', error.message);
    }

    // Test du module SDK (auto-référence) - FONCTIONNALITÉ UNIQUE!
    console.log('\n🔄 Test du module SDK (auto-référence)...');
    try {
      // Métadonnées du SDK
      const metaInfo = sdk.sdk.getMetaInfo();
      console.log('📊 Informations SDK:');
      console.log('   - Version:', metaInfo.version);
      console.log('   - Nom:', metaInfo.name);
      console.log('   - Auto-référence:', metaInfo.isSelfReferencing);

      // Chaîne d'auto-référence
      const selfRef = sdk.sdk.getSelfReference();
      console.log('🔗 Auto-référence:', selfRef);

      // Analyse du SDK
      const analysis = await sdk.sdk.analyzeSelf();
      console.log('🔍 Analyse:');
      console.log('   - Modules:', analysis.modules.length);
      console.log('   - Capacités:', analysis.capabilities.join(', '));

      // Info d'un module spécifique
      const aiInfo = sdk.sdk.getModuleInfo('ai');
      console.log('🤖 Module AI status:', aiInfo?.status);
    } catch (error) {
      console.log('⚠️ Module SDK:', error.message);
    }

    // Accès au runtime et framework
    console.log('\n⚙️ Runtime et Framework...');
    try {
      const runtime = sdk.runtime;
      console.log('🔧 Runtime disponible:', !!runtime);

      const framework = sdk.framework;
      console.log('📱 Framework détecté:', framework || 'auto');
    } catch (error) {
      console.log('⚠️ Runtime/Framework:', error.message);
    }

    // Résumé final
    console.log('\n🎉 Démonstration terminée!');
    console.log('📈 Modules disponibles:');

    const modules = ['ai', 'storage', 'ui', 'project', 'auth', 'sdk'];
    modules.forEach((module) => {
      try {
        const mod = (sdk as any)[module];
        console.log(`   ✅ ${module}: disponible`);
      } catch {
        console.log(`   ❌ ${module}: non disponible`);
      }
    });

    console.log('\n🚀 Le SDK Enterprise est prêt pour votre application!');
    console.log('📚 Documentation: https://wiki.skygenesisenterprise.com');
  } catch (error) {
    console.error('❌ Erreur lors de la démonstration:', error);
    process.exit(1);
  }
}

// Exécuter la démo
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateSDK();
}

export { demonstrateSDK };
