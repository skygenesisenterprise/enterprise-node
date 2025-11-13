/**
 * 🚀 Exemple d'utilisation du SDK Enterprise
 * 
 * Installation:
 * npm install @skygenesisenterprise/enterprise-node
 * 
 * Exécution:
 * npm start
 */

// Import du SDK Enterprise comme n'importe quel package npm
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

// Configuration du SDK
const config = {
  modules: {
    ai: true,        // Activer l'intelligence artificielle
    storage: true,    // Activer le stockage
    ui: true,         // Activer l'interface utilisateur
    project: true,   // Activer la gestion de projet
    auth: true,       // Activer l'authentification
    sdk: true         // Activer l'auto-référence (unique!)
  },
  debug: true         // Activer les logs de debug
};

async function main() {
  console.log('🚀 Exemple d\'utilisation du SDK Enterprise v1.1.4');
  console.log('=' .repeat(50));

  try {
    // 1. Initialisation du SDK
    console.log('\n📦 Initialisation du SDK...');
    const sdk = new EnterpriseSDK(config);
    await sdk.initialize();
    console.log('✅ SDK initialisé avec succès!');

    // 2. Utilisation du module AI
    console.log('\n🤖 Test du module AI...');
    try {
      const response = await sdk.ai.generate('Bonjour, présente-toi en une phrase');
      console.log('📝 Réponse AI:', response.text);
    } catch (error) {
      console.log('⚠️ AI nécessite une configuration (clé API requise)');
    }

    // 3. Utilisation du module Storage
    console.log('\n💾 Test du module Storage...');
    try {
      // Stocker des données
      const userData = {
        id: 'user-123',
        name: 'Jean Dupont',
        email: 'jean@entreprise.com',
        timestamp: new Date().toISOString()
      };

      await sdk.storage.store('user:123', userData);
      console.log('💿 Données stockées avec succès');

      // Récupérer les données
      const retrievedData = await sdk.storage.retrieve('user:123');
      console.log('📥 Données récupérées:', retrievedData.name);

    } catch (error) {
      console.log('⚠️ Storage:', error.message);
    }

    // 4. Utilisation du module UI
    console.log('\n🎨 Test du module UI...');
    try {
      // Appliquer un thème
      sdk.ui.setTheme('dark');
      console.log('🌙 Thème sombre appliqué');

      // Afficher une notification
      sdk.ui.showNotification('SDK Enterprise fonctionne parfaitement!', 'success');
      console.log('🔔 Notification affichée');

    } catch (error) {
      console.log('⚠️ UI:', error.message);
    }

    // 5. Utilisation du module Project
    console.log('\n📋 Test du module Project...');
    try {
      // Obtenir les informations du projet
      const projectInfo = await sdk.project.getInfo();
      console.log('📁 Projet:', projectInfo.name || 'Exemple SDK');

      // Ajouter un script
      await sdk.project.addScript('demo:enterprise', 'node example.js');
      console.log('📜 Script demo:enterprise ajouté');

    } catch (error) {
      console.log('⚠️ Project:', error.message);
    }

    // 6. Utilisation du module Auth
    console.log('\n🔐 Test du module Auth...');
    try {
      // Enregistrement d'un utilisateur
      const user = await sdk.auth.register({
        name: 'Alice Martin',
        email: 'alice@entreprise.com',
        password: 'MotDePasse123!'
      });
      console.log('👤 Utilisateur enregistré:', user.name);

      // Connexion
      const login = await sdk.auth.login({
        email: 'alice@entreprise.com',
        password: 'MotDePasse123!'
      });
      console.log('🔑 Connexion réussie');

    } catch (error) {
      console.log('⚠️ Auth:', error.message);
    }

    // 7. Informations du SDK
    console.log('\n⚙️ Informations du SDK...');
    try {
      const runtime = sdk.runtime;
      const framework = sdk.framework;
      const currentConfig = sdk.getConfig();

      console.log('🔧 Runtime disponible:', !!runtime);
      console.log('📱 Framework:', framework || 'auto');
      console.log('📊 Modules activés:', Object.keys(currentConfig.modules).length);

    } catch (error) {
      console.log('⚠️ Informations:', error.message);
    }

    // 8. Résumé
    console.log('\n🎉 Exemple terminé avec succès!');
    console.log('📈 Modules testés:');
    
    const modules = ['ai', 'storage', 'ui', 'project', 'auth'];
    modules.forEach(module => {
      try {
        (sdk as any)[module];
        console.log(`   ✅ ${module}`);
      } catch {
        console.log(`   ❌ ${module}`);
      }
    });

    console.log('\n🚀 Le SDK Enterprise est prêt pour votre projet!');
    console.log('📚 Documentation complète: https://wiki.skygenesisenterprise.com');
    console.log('📦 Package npm: https://www.npmjs.com/package/@skygenesisenterprise/enterprise-node');

  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution:', error.message);
    console.error('💡 Solution: Vérifiez que tous les modules sont correctement configurés');
    process.exit(1);
  }
}

// Exécuter l'exemple
main();