# Next.js Bridge pour Enterprise SDK

## Vue d'ensemble

Le bridge Next.js pour Enterprise SDK permet aux développeurs d'utiliser Next.js de manière transparente avec un seul import :

```typescript
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';
```

Plus besoin d'importer Next.js, React, ou d'autres bibliothèques. Le SDK gère tout !

## Installation

```bash
npm install @skygenesisenterprise/enterprise-node
# ou
pnpm add @skygenesisenterprise/enterprise-node
```

## Configuration automatique

Le SDK détecte automatiquement Next.js et configure le bridge :

```typescript
const enterprise = new EnterpriseSDK({
  framework: 'nextjs', // Optionnel, détecté automatiquement
  autoRouting: {
    protected: true,
    publicRoutes: ['/login', '/register'],
    loginRedirect: '/login',
  },
});
```

## Exemples d'utilisation

### 1. Page Next.js (App Router)

```typescript
// app/page.tsx
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

export default function HomePage() {
  const enterprise = new EnterpriseSDK();

  const handleLogin = async () => {
    await enterprise.initialize();
    const user = await enterprise.auth?.login({
      email: 'user@example.com',
      password: 'password'
    });
    // Navigation automatique gérée !
  };

  return (
    <div>
      <h1>Enterprise + Next.js</h1>
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
}
```

### 2. API Route

```typescript
// app/api/enterprise/route.ts
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

export async function POST(request: Request) {
  const enterprise = new EnterpriseSDK({ serverSide: true });
  await enterprise.initialize();

  const { action, data } = await request.json();

  switch (action) {
    case 'ai-generate':
      const result = await enterprise.ai?.generate(data.prompt);
      return Response.json({ result });
  }
}
```

### 3. Middleware d'authentification

```typescript
// middleware.ts
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

export async function middleware(request: Request) {
  const enterprise = new EnterpriseSDK({ serverSide: true });
  await enterprise.initialize();

  const isAuthenticated = await enterprise.auth?.isAuthenticated?.();

  if (!isAuthenticated && !request.url.includes('/login')) {
    return Response.redirect(new URL('/login', request.url));
  }

  return Response.next();
}
```

## Fonctionnalités du bridge

### 🔄 Router transparent

Le SDK gère automatiquement la navigation entre App Router et Pages Router :

```typescript
// Fonctionne avec les deux types de router
await enterprise.nextjs?.utils.navigate('/dashboard');
await enterprise.nextjs?.utils.reload();
await enterprise.nextjs?.utils.back();
```

### 🤖 IA avec streaming

Support natif du streaming Next.js :

```typescript
const response = await enterprise.ai?.generate(prompt, {
  streaming: true,
  onChunk: (chunk) => console.log(chunk),
});
```

### 🔐 Authentification automatique

Gestion transparente des routes protégées :

```typescript
const enterprise = new EnterpriseSDK({
  autoRouting: {
    protected: true,
    publicRoutes: ['/login', '/register'],
    loginRedirect: '/login',
  },
});
```

### 📁 Stockage optimisé

Intégration avec le cache Next.js :

```typescript
const file = await enterprise.storage?.save(file, {
  cache: 'nextjs', // Utilise le cache Next.js
  revalidate: 3600, // 1 heure
});
```

## Hooks spécialisés

Pour une expérience encore plus simple :

```typescript
import {
  useNextjsAuth,
  useNextjsAI,
  useNextjsStorage,
} from '@skygenesisenterprise/enterprise-node';

function MyComponent() {
  const { user, login, logout } = useNextjsAuth();
  const { generate, generateStream } = useNextjsAI();
  const { save, load } = useNextjsStorage();

  // Utilisation simple !
}
```

## Configuration avancée

### Options du bridge Next.js

```typescript
const enterprise = new EnterpriseSDK({
  framework: 'nextjs',
  appRouter: true, // ou false pour Pages Router
  cache: {
    enabled: true,
    ttl: 3600,
  },
  autoRouting: {
    protected: true,
    publicRoutes: ['/login', '/register', '/api/webhook'],
    loginRedirect: '/login',
  },
});
```

### Métadonnées automatiques

```typescript
// Le SDK peut générer les métadonnées SEO
export const metadata = enterprise.nextjs?.createMetadata({
  title: 'Ma Page',
  description: 'Description optimisée SEO',
  image: '/images/og-image.jpg',
});
```

## Avantages

✅ **Un seul import** - Plus besoin de multiples imports  
✅ **Détection automatique** - Le SDK s'adapte à votre environnement  
✅ **TypeScript complet** - Support total des types  
✅ **Performance** - Lazy loading et optimisations  
✅ **Compatible** - Fonctionne avec App Router et Pages Router

## Prochaines fonctionnalités

- [ ] Support ISR (Incremental Static Regeneration)
- [ ] Optimisations images automatiques
- [ ] Internationalisation intégrée
- [ ] Analytics et monitoring
- [ ] Déploiement optimisé Vercel/Netlify
