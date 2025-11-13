import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

/**
 * Exemple 1: Utilisation simple du SDK avec Next.js
 *
 * Dans votre application Next.js, vous pouvez maintenant utiliser:
 * import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';
 *
 * Sans avoir besoin d'importer explicitement Next.js ou ses hooks
 */

// Exemple de page Next.js avec App Router
export default function HomePage() {
  // Le SDK est maintenant disponible comme un bridge transparent
  const enterprise = new EnterpriseSDK({
    debug: true,
    // Configuration automatique pour Next.js
    framework: 'nextjs',
    autoRouting: {
      protected: true,
      publicRoutes: ['/login', '/register'],
      loginRedirect: '/login',
    },
  });

  // Utilisation directe sans imports Next.js supplémentaires
  const handleLogin = async () => {
    try {
      await enterprise.initialize();
      const user = await enterprise.auth?.login({
        email: 'user@example.com',
        password: 'password',
      });

      // Navigation automatique gérée par le bridge
      console.log('Connecté:', user);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  const handleGenerateAI = async () => {
    try {
      await enterprise.initialize();
      const response = await enterprise.ai?.generate("Génère un contenu pour ma page d'accueil", {
        streaming: true, // Support streaming Next.js intégré
        onChunk: (chunk: string) => {
          console.log('Chunk reçu:', chunk);
        },
      });

      console.log('Réponse IA:', response);
    } catch (error) {
      console.error('Erreur IA:', error);
    }
  };

  return (
    <div>
      <h1>Bienvenue sur Enterprise Next.js</h1>
      <p>Cette page utilise le bridge Enterprise SDK pour Next.js</p>

      <button onClick={handleLogin}>Se connecter</button>

      <button onClick={handleGenerateAI}>Générer avec l'IA</button>
    </div>
  );
}

/**
 * Exemple 2: API Route Next.js avec le SDK
 *
 * Créez ce fichier dans: app/api/enterprise/route.ts
 */
export async function POST(request: Request) {
  const enterprise = new EnterpriseSDK({
    framework: 'nextjs',
    serverSide: true,
  });

  try {
    await enterprise.initialize();

    const { action, data } = await request.json();

    switch (action) {
      case 'ai-generate':
        const result = await enterprise.ai?.generate(data.prompt, data.options);
        return Response.json({ result });

      case 'storage-save':
        const fileResult = await enterprise.storage?.save(data.file, data.options);
        return Response.json({ result });

      default:
        return Response.json({ error: 'Action non supportée' }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ error: 'Erreur serveur', details: error }, { status: 500 });
  }
}

/**
 * Exemple 3: Middleware Next.js pour l'authentification
 *
 * Créez ce fichier dans: middleware.ts
 */
export async function middleware(request: Request) {
  const enterprise = new EnterpriseSDK({
    framework: 'nextjs',
    serverSide: true,
  });

  await enterprise.initialize();

  // Vérification d'authentification automatique
  const isAuthenticated = await enterprise.auth?.isAuthenticated?.();
  const isPublicRoute = ['/login', '/register'].includes(request.url);

  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL('/login', request.url));
  }

  return Response.next();
}

/**
 * Exemple 4: Layout Next.js avec le SDK
 *
 * Créez ce fichier dans: app/layout.tsx
 */
export const metadata = {
  title: 'Enterprise Application',
  description: 'Application Enterprise avec Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {/* Le SDK Enterprise est automatiquement disponible */}
        {children}
      </body>
    </html>
  );
}
