# 🧪 Guide de Test des Releases du SDK Enterprise

Ce guide explique comment tester les releases du SDK Enterprise pour s'assurer qu'elles fonctionnent correctement dans de vrais environnements.

## 🎯 Objectif

L'objectif est de pouvoir tester chaque release (ex: 1.1.4) directement dans des environnements réels pour valider son utilité et son bon fonctionnement.

## 📦 Installation pour les tests

### 1. Installation du package

```bash
# Installer la version spécifique à tester
npm install @skygenesisenterprise/enterprise-node@1.1.4

# Ou avec yarn
yarn add @skygenesisenterprise/enterprise-node@1.1.4

# Ou avec pnpm
pnpm add @skygenesisenterprise/enterprise-node@1.1.4
```

### 2. Test rapide d'installation

```bash
# Créer un fichier de test simple
echo "import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';
console.log('✅ SDK importé avec succès');
const sdk = new EnterpriseSDK({ modules: { ai: true }, debug: true });
sdk.initialize().then(() => console.log('🚀 SDK initialisé!'));" > test.js

# Exécuter le test
node test.js
```

## 🚀 Tests Automatisés

### 1. Tests d'intégration

```bash
# Exécuter tous les tests d'intégration
npm run test:integration

# Ou directement
node scripts/test-integration.js
```

Les tests d'intégration vérifient :

- ✅ Installation de base
- ✅ Initialisation du SDK
- ✅ Fonctionnalité des modules
- ✅ Fichiers d'exemple
- ✅ Structure du package
- ✅ Liens de documentation

### 2. Tests de release

```bash
# Tester une version spécifique
npm run test:release -- --version=1.1.4

# Ou avec le script
node scripts/test-release.js --version=1.1.4
```

### 3. Tests de performance

```bash
# Mesurer les performances
npm run test:performance

# Ou directement
node scripts/performance-test.js
```

## 📚 Exemples d'utilisation

### 1. Exemple complet

```bash
# Exécuter l'exemple complet
npm run example

# Ou directement
node examples/example.js
```

### 2. Test rapide

```bash
# Test rapide d'installation
npm run example:quick

# Ou directement
node examples/test.js
```

## 🌁 Environnements de test

### 1. Node.js

```javascript
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

const sdk = new EnterpriseSDK({
  modules: {
    ai: true,
    storage: true,
    ui: true,
    project: true,
    auth: true,
    sdk: true,
  },
  debug: true,
});

await sdk.initialize();
console.log('✅ SDK fonctionne en Node.js');
```

### 2. Navigateur

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Test SDK Enterprise</title>
  </head>
  <body>
    <script type="module">
      import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

      const sdk = new EnterpriseSDK({
        modules: { ai: true, storage: true },
        runtime: { target: 'browser' },
      });

      await sdk.initialize();
      console.log('✅ SDK fonctionne dans le navigateur');
    </script>
  </body>
</html>
```

### 3. React

```jsx
import { EnterpriseProvider, useAI } from '@skygenesisenterprise/react';

function App() {
  return (
    <EnterpriseProvider config={{ modules: { ai: true } }}>
      <MyComponent />
    </EnterpriseProvider>
  );
}

function MyComponent() {
  const { generate } = useAI();

  const handleClick = async () => {
    const response = await generate('Hello React!');
    console.log(response.text);
  };

  return <button onClick={handleClick}>Test AI</button>;
}
```

## 🔧 Scripts de test personnalisés

### Créer un projet de test

```bash
# Créer un projet de test automatique
node scripts/create-test-project.js --version=1.1.4 --environment=node --name=test-project

# Se déplacer dans le projet
cd test-project

# Installer les dépendances
npm install

# Exécuter les tests
npm run test:release
```

### Test manuel complet

```javascript
// test-manuel.js
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

async function testComplet() {
  console.log('🧪 Test manuel complet');

  // Test 1: Initialisation
  const sdk = new EnterpriseSDK({
    modules: { ai: true, storage: true, ui: true },
    debug: true,
  });

  await sdk.initialize();
  console.log('✅ Initialisation réussie');

  // Test 2: Module AI
  try {
    const response = await sdk.ai.generate('Test de génération');
    console.log('✅ AI module:', response.text?.slice(0, 50));
  } catch (error) {
    console.log('⚠️ AI module:', error.message);
  }

  // Test 3: Module Storage
  try {
    await sdk.storage.store('test', { data: 'test' });
    const data = await sdk.storage.retrieve('test');
    console.log('✅ Storage module:', data);
  } catch (error) {
    console.log('⚠️ Storage module:', error.message);
  }

  // Test 4: Module UI
  try {
    sdk.ui.setTheme('dark');
    sdk.ui.showNotification('Test réussi', 'success');
    console.log('✅ UI module');
  } catch (error) {
    console.log('⚠️ UI module:', error.message);
  }

  console.log('🎉 Test manuel terminé');
}

testComplet();
```

## 📊 Rapports de test

### Rapport d'intégration

Après avoir exécuté `npm run test:integration`, un rapport est généré :

```bash
# Voir le rapport
cat integration-test-report.json
```

Le rapport contient :

- Résumé des tests
- Détails de chaque test
- Taux de réussite
- Horodatage

### Rapport de performance

```bash
# Voir le rapport de performance
cat performance-results.json
```

## 🔄 Workflow de test de release

### 1. Avant la release

```bash
# 1. Nettoyer les builds précédents
npm run clean

# 2. Builder tous les packages
npm run build

# 3. Exécuter les tests unitaires
npm test

# 4. Exécuter les tests d'intégration
npm run test:integration

# 5. Tester les exemples
npm run example
```

### 2. Pendant la release

```bash
# 1. Publier la nouvelle version
npm version 1.1.4
npm publish

# 2. Tester la version publiée
npm install @skygenesisenterprise/enterprise-node@1.1.4
npm run test:release -- --version=1.1.4
```

### 3. Après la release

```bash
# 1. Tester dans différents environnements
node scripts/create-test-project.js --version=1.1.4 --environment=all

# 2. Vérifier la documentation
npm run test:documentation

# 3. Tests de performance
npm run test:performance
```

## 🚨 Dépannage

### Problèmes courants

1. **Module non trouvé**

   ```bash
   # Solution: Réinstaller les dépendances
   npm install
   ```

2. **Erreur d'initialisation**

   ```bash
   # Solution: Vérifier la configuration
   node -e "console.log(require('./enterprise.config.json'))"
   ```

3. **Tests timeout**
   ```bash
   # Solution: Augmenter le timeout
   export TEST_TIMEOUT=60000
   npm run test:integration
   ```

### Logs détaillés

```bash
# Activer les logs debug
DEBUG=enterprise:* npm run test:integration

# Logs verbeux
npm run test:integration -- --verbose
```

## 📞 Support

Si vous rencontrez des problèmes lors des tests :

1. **Documentation**: https://wiki.skygenesisenterprise.com
2. **Issues GitHub**: https://github.com/skygenesisenterprise/enterprise-node/issues
3. **Discussions**: https://github.com/skygenesisenterprise/enterprise-node/discussions

---

**Ce guide garantit que chaque release du SDK Enterprise est testée et validée avant d'être mise en production.** 🚀
