# SDK Auto-Référence - Documentation

## 🎯 Concept

Le SDK Enterprise introduit maintenant une fonctionnalité d'auto-référence unique : le SDK peut s'inclure lui-même comme module, créant une architecture méta-récursive.

## 🔄 Fonctionnalités

### 1. **Module SDK Auto-Référentiel**

- Le SDK peut s'utiliser lui-même comme module
- Crée une hiérarchie de instances SDK
- Supporte la récursion contrôlée

### 2. **Configuration**

```typescript
const config: EnterpriseConfig = {
  modules: {
    sdk: true, // Active l'auto-référence
    // ... autres modules
  },
};
```

### 3. **Utilisation**

```typescript
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

const sdk = new EnterpriseSDK({
  modules: { sdk: true },
});

await sdk.initialize();

// Accès au module SDK auto-référentiel
const metaInfo = sdk.sdk.getMetaInfo();
const selfRef = sdk.sdk.getSelfReference();
```

## 🏗️ Architecture

### Structure

```
EnterpriseSDK (racine)
├── Module SDK (auto-référence)
│   ├── getMetaInfo()
│   ├── getSelfReference()
│   └── isInitialized()
└── Autres modules (ai, storage, etc.)
```

### Flux d'Auto-Référence

1. **Initialisation** → Le SDK charge le module SDK
2. **Auto-référence** → Le module SDK peut créer des instances enfants
3. **Hiérarchie** → Structure arborescente de instances
4. **Métadonnées** → Informations sur la profondeur et état

## 📋 API Reference

### SDK Module

#### `getMetaInfo(): SDKMetaInfo`

Retourne les métadonnées du SDK :

```typescript
{
  version: string;
  name: string;
  isSelfReferencing: boolean;
}
```

#### `getSelfReference(): string`

Retourne une chaîne d'auto-référence :

```typescript
'SDK Module - Self-referential instance';
```

#### `isInitialized(): boolean`

Vérifie si le module est initialisé.

## 🧪 Tests

Les tests sont disponibles dans `src/modules/sdk.test.ts` :

- Initialisation du module SDK
- Vérification des métadonnées
- Tests d'auto-référence
- Gestion de la destruction

## 🚀 Avantages

1. **Méta-architecture** : Le SDK peut s'analyser lui-même
2. **Extensibilité** : Support pour des hiérarchies complexes
3. **Debugging** : Introspection complète de l'état
4. **Innovation** : Approche unique dans l'écosystème SDK

## 🔧 Configuration Avancée

### Options Futures

- Profondeur de récursion maximale
- Mode debug pour l'auto-référence
- Métadonnées personnalisées
- Hooks de cycle de vie

## 📦 Dépendances

Le module SDK dépend de :

- `@skygenesisenterprise/shared` - Types et utilitaires
- `@skygenesisenterprise/enterprise-node` - SDK parent

## 🎯 Use Cases

1. **Méta-analyse** : Analyser la structure du SDK
2. **Debugging avancé** : Introspection complète
3. **Extensions** : Créer des hiérarchies personnalisées
4. **R&D** : Expérimenter avec l'auto-référence

Cette fonctionnalité positionne l'Enterprise SDK comme un pionnier dans l'architecture auto-référentielle ! 🚀
