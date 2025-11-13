# 🚀 Exemple d'utilisation du SDK Enterprise

Ce dossier contient un exemple complet montrant comment utiliser le package `@skygenesisenterprise/enterprise-node` dans un projet Node.js.

## 📦 Installation

```bash
# Installer le package
npm install @skygenesisenterprise/enterprise-node

# Ou avec yarn
yarn add @skygenesisenterprise/enterprise-node

# Ou avec pnpm
pnpm add @skygenesisenterprise/enterprise-node
```

## 🚀 Démarrage rapide

1. **Copiez ce dossier dans votre projet**
2. **Installez les dépendances**:
   ```bash
   npm install
   ```
3. **Exécutez l'exemple**:
   ```bash
   npm start
   ```

## 📁 Structure du projet

```
examples/
├── package.json              # Configuration du projet
├── example.js                # Exemple d'utilisation complet
├── README.md                 # Ce fichier
└── enterprise.config.json    # Configuration du SDK (optionnel)
```

## 🔧 Configuration

Le SDK peut être configuré via un objet de configuration :

```javascript
const config = {
  modules: {
    ai: true, // Intelligence artificielle
    storage: true, // Stockage de données
    ui: true, // Interface utilisateur
    project: true, // Gestion de projet
    auth: true, // Authentification
    sdk: true, // Auto-référence (unique!)
  },
  debug: true, // Activer les logs
};
```

## 📚 Modules disponibles

### 🤖 Module AI

Génération de texte, analyse de sentiment, traitement du langage naturel.

```javascript
const response = await sdk.ai.generate('Bonjour, comment ça va?');
console.log(response.text);
```

### 💾 Module Storage

Stockage et récupération de données avec support de l'encryption.

```javascript
await sdk.storage.store('user:123', userData);
const data = await sdk.storage.retrieve('user:123');
```

### 🎨 Module UI

Composants d'interface, thèmes, notifications.

```javascript
sdk.ui.setTheme('dark');
sdk.ui.showNotification('Opération réussie!', 'success');
```

### 📋 Module Project

Gestion de projet, manipulation de package.json.

```javascript
await sdk.project.addDependency('lodash', '^4.17.21');
await sdk.project.addScript('build', 'webpack');
```

### 🔐 Module Auth

Authentification, gestion des utilisateurs, tokens JWT.

```javascript
const user = await sdk.auth.register({
  name: 'Jean Dupont',
  email: 'jean@entreprise.com',
  password: 'password123',
});
```

### 🔄 Module SDK (Auto-référence)

Fonctionnalité unique d'auto-analyse du SDK.

```javascript
const metaInfo = sdk.sdk.getMetaInfo();
console.log('SDK version:', metaInfo.version);
```

## 🌟 Points forts du SDK Enterprise

- **🧩 Architecture modulaire**: Utilisez seulement les modules dont vous avez besoin
- **🤖 AI intégrée**: Génération de texte et analyse directement dans votre application
- **💾 Stockage unifié**: API simple pour stocker et récupérer des données
- **🎨 UI components**: Composants prêts à l'emploi avec theming
- **🔐 Authentification**: Système complet de gestion des utilisateurs
- **🔄 Auto-référence**: Le SDK peut s'analyser lui-même (unique!)
- **⚡ Performance**: Support WebAssembly avec fallback JavaScript
- **🎯 Framework agnostic**: Fonctionne avec Node.js, React, Next.js, etc.

## 📖 Documentation complète

- **Documentation**: https://wiki.skygenesisenterprise.com
- **Package npm**: https://www.npmjs.com/package/@skygenesisenterprise/enterprise-node
- **GitHub**: https://github.com/skygenesisenterprise/enterprise-node

## 🧪 Tests

Pour tester l'installation et le fonctionnement :

```bash
npm test
```

## 🤝 Contribuer

Les contributions sont bienvenues ! Consultez le guide de contribution sur GitHub.

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

---

**Développé avec ❤️ par Sky Genesis Enterprise**
