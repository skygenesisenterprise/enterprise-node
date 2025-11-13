/**
 * 📚 Exemple d'utilisation complet du SDK Enterprise
 *
 * Ce fichier démontre comment utiliser le package @skygenesisenterprise/enterprise-node
 * dans un projet Node.js avec tous les modules activés.
 */

import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

// Configuration du SDK avec tous les modules
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
    enableWasm: true, // Activer WebAssembly pour de meilleures performances
    fallback: true, // Utiliser JavaScript en fallback si WASM n'est pas disponible
  },
  debug: true, // Activer le mode debug pour voir les logs détaillés
  branding: {
    companyName: 'Ma Entreprise',
    primaryColor: '#007acc',
    theme: 'auto',
  },
};

async function demonstrateSDK() {
  console.log('🚀 Démonstration du SDK Enterprise v1.1.4');
  console.log('='.repeat(50));

  try {
    // 1. Initialisation du SDK
    console.log('\n📦 Initialisation du SDK...');
    const sdk = new EnterpriseSDK(config);
    await sdk.initialize();
    console.log('✅ SDK initialisé avec succès!');

    // 2. Test du module AI
    console.log('\n🤖 Test du module AI...');
    if (sdk.ai) {
      try {
        const response = await sdk.ai.generate('Écris une courte présentation du SDK Enterprise', {
          model: 'euse-generate-v0.1.0',
          maxTokens: 150,
          temperature: 0.7,
        });

        console.log('📝 Réponse AI:', response.text);
        console.log('📊 Tokens utilisés:', response.usage?.totalTokens || 'N/A');
      } catch (error) {
        console.log('⚠️ Module AI non configuré (clé API requise)');
      }
    }

    // 3. Test du module Storage
    console.log('\n💾 Test du module Storage...');
    if (sdk.storage) {
      try {
        // Stocker des données
        const userData = {
          id: 'user-123',
          name: 'Jean Dupont',
          email: 'jean@entreprise.com',
          preferences: {
            theme: 'dark',
            language: 'fr',
          },
        };

        await sdk.storage.store('user:123', userData, {
          encryption: true,
          metadata: {
            type: 'user-profile',
            lastModified: new Date().toISOString(),
          },
        });

        console.log('💿 Données stockées avec succès');

        // Récupérer les données
        const retrievedData = await sdk.storage.retrieve('user:123');
        console.log('📥 Données récupérées:', retrievedData.name);

        // Lister les clés disponibles
        const keys = await sdk.storage.list('user:*');
        console.log('🔑 Clés trouvées:', keys.length);
      } catch (error) {
        console.log('⚠️ Module Storage:', error.message);
      }
    }

    // 4. Test du module UI
    console.log('\n🎨 Test du module UI...');
    if (sdk.ui) {
      try {
        // Appliquer un thème
        sdk.ui.setTheme('dark');
        console.log('🌙 Thème sombre appliqué');

        // Afficher une notification
        sdk.ui.showNotification('SDK Enterprise est prêt!', 'success');
        console.log('🔔 Notification affichée');

        // Appliquer le branding
        sdk.ui.applyBranding({
          companyName: 'Ma Entreprise',
          primaryColor: '#007acc',
        });
        console.log('🎯 Branding appliqué');
      } catch (error) {
        console.log('⚠️ Module UI:', error.message);
      }
    }

    // 5. Test du module Project
    console.log('\n📋 Test du module Project...');
    if (sdk.project) {
      try {
        // Obtenir les informations du projet
        const projectInfo = await sdk.project.getInfo();
        console.log('📁 Nom du projet:', projectInfo.name || 'N/A');
        console.log('📦 Dépendances:', projectInfo.dependencies?.length || 0);

        // Ajouter une dépendance
        await sdk.project.addDependency('lodash', '^4.17.21');
        console.log('➕ Dépendance lodash ajoutée');

        // Ajouter un script
        await sdk.project.addScript('test:enterprise', 'node examples/enterprise-demo.js');
        console.log('📜 Script test:enterprise ajouté');
      } catch (error) {
        console.log('⚠️ Module Project:', error.message);
      }
    }

    // 6. Test du module Auth
    console.log('\n🔐 Test du module Auth...');
    if (sdk.auth) {
      try {
        // Enregistrement d'un utilisateur
        const user = await sdk.auth.register({
          name: 'Jean Dupont',
          email: 'jean@entreprise.com',
          password: 'MotDePasseSecurise123!',
        });
        console.log('👤 Utilisateur enregistré:', user.name);

        // Connexion
        const loginResult = await sdk.auth.login({
          email: 'jean@entreprise.com',
          password: 'MotDePasseSecurise123!',
        });
        console.log('🔑 Connexion réussie, token généré');

        // Vérification du token
        const payload = await sdk.auth.verifyToken(loginResult.token);
        console.log('✅ Token valide pour utilisateur:', payload.name);
      } catch (error) {
        console.log('⚠️ Module Auth:', error.message);
      }
    }

    // 7. Test du module SDK (auto-référence) - FONCTIONNALITÉ UNIQUE!
    console.log('\n🔄 Test du module SDK (auto-référence)...');
    if (sdk.sdk) {
      try {
        // Obtenir les métadonnées du SDK
        const metaInfo = sdk.sdk.getMetaInfo();
        console.log('📊 Informations SDK:');
        console.log('   - Version:', metaInfo.version);
        console.log('   - Nom:', metaInfo.name);
        console.log('   - Auto-référence:', metaInfo.isSelfReferencing);

        // Obtenir la chaîne d'auto-référence
        const selfRef = sdk.sdk.getSelfReference();
        console.log('🔗 Auto-référence:', selfRef);

        // Analyser le SDK lui-même
        const analysis = await sdk.sdk.analyzeSelf();
        console.log('🔍 Analyse du SDK:');
        console.log('   - Modules chargés:', analysis.modules.length);
        console.log('   - Capacités:', analysis.capabilities.join(', '));

        // Obtenir les informations d'un module spécifique
        const aiInfo = sdk.sdk.getModuleInfo('ai');
        if (aiInfo) {
          console.log('🤖 Info module AI:', aiInfo.status);
        }
      } catch (error) {
        console.log('⚠️ Module SDK:', error.message);
      }
    }

    // 8. Résumé de la démonstration
    console.log('\n🎉 Démonstration terminée avec succès!');
    console.log('📈 Résumé des modules testés:');

    const modules = Object.keys(sdk);
    modules.forEach((module) => {
      const status = sdk[module] ? '✅' : '❌';
      console.log(`   ${status} ${module}`);
    });

    console.log('\n🚀 Le SDK Enterprise est prêt pour être utilisé dans votre application!');
  } catch (error) {
    console.error('❌ Erreur lors de la démonstration:', error);
    process.exit(1);
  }
}

// Exécuter la démonstration
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateSDK();
}

export { demonstrateSDK };
