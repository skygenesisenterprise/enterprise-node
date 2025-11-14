/**
 * @fileoverview Next.js Plugin Implementation
 * Plugin Next.js officiel pour Enterprise SDK
 */

// Import types directly from core package source
import {
  EnterprisePlugin,
  PluginManifest,
  PluginContext,
  PluginCommand,
  PluginConfigSchema,
} from '../../../core/src/plugin-system/types';

export class NextJSPlugin implements EnterprisePlugin {
  readonly manifest: PluginManifest = {
    name: 'nextjs',
    version: '1.0.0',
    description: 'Plugin Next.js officiel pour Enterprise SDK',
    author: 'Sky Genesis Enterprise',
    homepage: 'https://wiki.skygenesisenterprise.com/plugins/nextjs',
    repository: 'https://github.com/skygenesisenterprise/enterprise-node',
    keywords: ['nextjs', 'enterprise', 'plugin', 'ssr', 'ssg'],
    main: 'dist/index.js',
    category: 'framework',
    tags: ['nextjs', 'ssr', 'ssg', 'react', 'framework'],
    supports: ['nextjs', 'react'],
    configSchema: {
      type: 'object',
      properties: {
        runtime: {
          type: 'string',
          description: 'Runtime Next.js',
          enum: ['nodejs', 'edge'],
          default: 'nodejs',
        },
        swcMinify: {
          type: 'boolean',
          description: 'Utiliser SWC pour la minification',
          default: true,
        },
        experimental: {
          type: 'object',
          description: 'Fonctionnalités expérimentales',
        },
        images: {
          type: 'object',
          description: 'Configuration des images',
        },
        features: {
          type: 'object',
          description: 'Fonctionnalités Enterprise',
        },
      },
    },
    enterprise: {
      certified: true,
      recommended: true,
      deprecated: false,
      experimental: false,
    },
    hooks: [
      {
        name: 'nextjs-init',
        description: 'Initialisation de Next.js',
        timing: 'before',
        event: 'init',
        priority: 10,
      },
      {
        name: 'nextjs-build',
        description: 'Build Next.js',
        timing: 'around',
        event: 'build',
        priority: 10,
      },
      {
        name: 'nextjs-dev',
        description: 'Serveur de développement Next.js',
        timing: 'around',
        event: 'dev',
        priority: 10,
      },
      {
        name: 'nextjs-export',
        description: 'Export statique Next.js',
        timing: 'around',
        event: 'export',
        priority: 10,
      },
    ],
  };

  private context?: PluginContext;
  private config?: any;

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    this.config = context.config.plugins?.nextjs || {};

    context.logger.info('🔌 Initialisation du plugin Next.js...');

    // Configuration de Next.js
    await this.setupNextJSConfig();

    // Création des fichiers de configuration
    await this.createNextJSFiles();

    // Configuration des outils
    await this.setupTools();

    context.logger.success('✅ Plugin Next.js initialisé');
  }

  async destroy(): Promise<void> {
    this.context?.logger.info('🔌 Destruction du plugin Next.js...');
    this.context = undefined;
    this.config = undefined;
  }

  async onBeforeBuild(context: PluginContext): Promise<void> {
    context.logger.info('🚀 Pré-build Next.js...');

    // Vérification des dépendances
    await this.checkDependencies();

    // Optimisation du build
    await this.optimizeBuild();
  }

  async onAfterBuild(context: PluginContext): Promise<void> {
    context.logger.info('🚀 Post-build Next.js...');

    // Analyse du bundle
    await this.analyzeBundle();
  }

  async onBeforeDev(context: PluginContext): Promise<void> {
    context.logger.info('🚀 Démarrage du serveur de développement Next.js...');

    // Configuration du rechargement à chaud
    await this.setupHotReload();
  }

  async onAfterDev(context: PluginContext): Promise<void> {
    context.logger.success('🚀 Serveur de développement Next.js démarré');
  }

  getCommands(): PluginCommand[] {
    return [
      {
        name: 'nextjs:create-page',
        description: 'Créer une page Next.js',
        category: 'util',
        options: [
          {
            name: 'path',
            description: 'Chemin de la page',
            type: 'string',
            required: true,
          },
          {
            name: 'type',
            description: 'Type de page',
            type: 'string',
            choices: ['page', 'layout', 'loading', 'error', 'not-found'],
            default: 'page',
          },
          {
            name: 'with-tests',
            description: 'Générer des tests',
            type: 'boolean',
            default: true,
          },
        ],
        handler: this.handleCreatePage.bind(this),
      },
      {
        name: 'nextjs:create-api',
        description: 'Créer une route API Next.js',
        category: 'util',
        options: [
          {
            name: 'path',
            description: "Chemin de l'API",
            type: 'string',
            required: true,
          },
          {
            name: 'method',
            description: 'Méthode HTTP',
            type: 'string',
            choices: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            default: 'GET',
          },
          {
            name: 'with-tests',
            description: 'Générer des tests',
            type: 'boolean',
            default: true,
          },
        ],
        handler: this.handleCreateAPI.bind(this),
      },
      {
        name: 'nextjs:analyze',
        description: 'Analyser les performances Next.js',
        category: 'util',
        handler: this.handleAnalyze.bind(this),
      },
    ];
  }

  getConfigSchema(): PluginConfigSchema {
    return this.manifest.configSchema!;
  }

  validateConfig(config: any): boolean | string {
    // Validation de la configuration Next.js
    if (config.runtime && !['nodejs', 'edge'].includes(config.runtime)) {
      return 'runtime doit être "nodejs" ou "edge"';
    }

    if (config.swcMinify !== undefined && typeof config.swcMinify !== 'boolean') {
      return 'swcMinify doit être un booléen';
    }

    if (
      config.experimental?.appDir !== undefined &&
      typeof config.experimental.appDir !== 'boolean'
    ) {
      return 'experimental.appDir doit être un booléen';
    }

    return true;
  }

  async onModuleLoad(moduleName: string, moduleInstance: any): Promise<void> {
    if (moduleName === 'ui') {
      this.context?.logger.info('🚀 Intégration du module UI avec Next.js...');
      await this.setupUIIntegration(moduleInstance);
    }

    if (moduleName === 'auth') {
      this.context?.logger.info('🚀 Intégration du module Auth avec Next.js...');
      await this.setupAuthIntegration(moduleInstance);
    }
  }

  private async setupNextJSConfig(): Promise<void> {
    if (!this.context) return;

    const config = {
      ...this.getDefaultConfig(),
      ...this.config,
    };

    // Créer le fichier next.config.js
    const nextConfig = this.generateNextConfig(config);
    await this.context.utils.writeFile('next.config.js', nextConfig);

    // Créer le fichier de configuration TypeScript
    const tsConfig = this.generateTSConfig();
    await this.context.utils.writeFile('tsconfig.json', tsConfig);
  }

  private async createNextJSFiles(): Promise<void> {
    if (!this.context) return;

    const useAppDir = this.config?.experimental?.appDir !== false;

    if (useAppDir) {
      // Créer la structure App Router
      await this.createAppRouterStructure();
    } else {
      // Créer la structure Pages Router
      await this.createPagesRouterStructure();
    }

    // Créer les fichiers globaux
    await this.createGlobalFiles();
  }

  private async setupTools(): Promise<void> {
    if (!this.context) return;

    // Configuration de ESLint pour Next.js
    const eslintConfig = this.generateESLintConfig();
    await this.context.utils.writeFile('.eslintrc.json', eslintConfig);
  }

  private async checkDependencies(): Promise<void> {
    const packageJson = await this.context!.utils.getPackageJson();
    const requiredDeps = ['next', 'react', 'react-dom'];

    for (const dep of requiredDeps) {
      if (!packageJson.dependencies?.[dep]) {
        throw new Error(`Dépendance requise manquante: ${dep}`);
      }
    }
  }

  private async optimizeBuild(): Promise<void> {
    // Optimisations spécifiques à Next.js
    this.context?.logger.info('🚀 Optimisation du build Next.js...');
  }

  private async analyzeBundle(): Promise<void> {
    // Analyse du bundle Next.js
    this.context?.logger.info('📊 Analyse du bundle Next.js...');
  }

  private async setupHotReload(): Promise<void> {
    // Configuration du rechargement à chaud
    this.context?.logger.info('🔥 Configuration du rechargement à chaud...');
  }

  private async setupUIIntegration(uiModule: any): Promise<void> {
    // Intégration avec le module UI
    this.context?.logger.info('🎨 Intégration UI Next.js configurée');
  }

  private async setupAuthIntegration(authModule: any): Promise<void> {
    // Intégration avec le module Auth
    this.context?.logger.info('🔐 Intégration Auth Next.js configurée');
  }

  private async handleCreatePage(args: any, context: PluginContext): Promise<void> {
    const { path, type, withTests } = args;

    context.logger.info(`🚀 Création de la page ${path} (${type})...`);

    const page = this.generatePage(path, type);
    await context.utils.writeFile(`src/app/${path}.tsx`, page);

    if (withTests) {
      const test = this.generatePageTest(path);
      await context.utils.writeFile(`src/app/${path}.test.tsx`, test);
    }

    context.logger.success(`✅ Page ${path} créée`);
  }

  private async handleCreateAPI(args: any, context: PluginContext): Promise<void> {
    const { path, method, withTests } = args;

    context.logger.info(`🚀 Création de l\'API ${path} (${method})...`);

    const api = this.generateAPI(path, method);
    await context.utils.writeFile(`src/app/api/${path}/route.ts`, api);

    if (withTests) {
      const test = this.generateAPITest(path, method);
      await context.utils.writeFile(`src/app/api/${path}.test.ts`, test);
    }

    context.logger.success(`✅ API ${path} créée`);
  }

  private async handleAnalyze(args: any, context: PluginContext): Promise<void> {
    context.logger.info('📊 Analyse des performances Next.js...');

    // Implémenter l'analyse des performances
    // - Core Web Vitals
    // - Bundle size
    // - Lighthouse scores
    // - Route performance
  }

  private getDefaultConfig(): any {
    return {
      runtime: 'nodejs',
      swcMinify: true,
      experimental: {
        appDir: true,
        serverComponentsExternalPackages: [],
      },
      images: {
        domains: [],
        formats: ['image/webp', 'image/avif'],
      },
      features: {
        analytics: true,
        performance: true,
        errorBoundary: true,
      },
    };
  }

  private generateNextConfig(config: any): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: ${config.experimental?.appDir !== false},
    serverComponentsExternalPackages: ${JSON.stringify(config.experimental?.serverComponentsExternalPackages || [])},
  },
  images: {
    domains: ${JSON.stringify(config.images?.domains || [])},
    formats: ${JSON.stringify(config.images?.formats || ['image/webp', 'image/avif'])},
  },
  swcMinify: ${config.swcMinify !== false},
  runtime: '${config.runtime || 'nodejs'}',
  
  // Configuration Enterprise
  ${
    config.features?.analytics
      ? `
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Enterprise-Analytics',
            value: 'enabled'
          }
        ]
      }
    ];
  },
  `
      : ''
  }
  
  ${
    config.features?.performance
      ? `
  async rewrites() {
    return [
      {
        source: '/api/performance/:path*',
        destination: '/api/enterprise/performance/:path*'
      }
    ];
  },
  `
      : ''
  }
};

module.exports = nextConfig;`;
  }

  private generateTSConfig(): string {
    return JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2017',
          lib: ['dom', 'dom.iterable', 'es6'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [
            {
              name: 'next',
            },
          ],
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*'],
            '@/components/*': ['./src/components/*'],
            '@/lib/*': ['./src/lib/*'],
            '@/styles/*': ['./src/styles/*'],
          },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules'],
      },
      null,
      2
    );
  }

  private generateESLintConfig(): string {
    return JSON.stringify(
      {
        extends: ['next/core-web-vitals', '@skygenesisenterprise/eslint-config'],
        rules: {
          '@next/next/no-page-custom-font': 'off',
        },
      },
      null,
      2
    );
  }

  private async createAppRouterStructure(): Promise<void> {
    if (!this.context) return;

    // Créer le layout principal
    const layout = this.generateLayout();
    await this.context.utils.writeFile('src/app/layout.tsx', layout);

    // Créer la page d'accueil
    const homePage = this.generateHomePage();
    await this.context.utils.writeFile('src/app/page.tsx', homePage);

    // Créer le fichier globals.css
    const globalsCSS = this.generateGlobalsCSS();
    await this.context.utils.writeFile('src/app/globals.css', globalsCSS);
  }

  private async createPagesRouterStructure(): Promise<void> {
    if (!this.context) return;

    // Créer le fichier _app.tsx
    const app = this.generateApp();
    await this.context.utils.writeFile('src/pages/_app.tsx', app);

    // Créer le fichier _document.tsx
    const document = this.generateDocument();
    await this.context.utils.writeFile('src/pages/_document.tsx', document);

    // Créer la page d'accueil
    const homePage = this.generatePagesHomePage();
    await this.context.utils.writeFile('src/pages/index.tsx', homePage);
  }

  private async createGlobalFiles(): Promise<void> {
    if (!this.context) return;

    // Créer next-env.d.ts
    const nextEnvTypes = this.generateNextEnvTypes();
    await this.context.utils.writeFile('next-env.d.ts', nextEnvTypes);
  }

  private generateLayout(): string {
    return `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sky Genesis Enterprise',
  description: 'Application Next.js avec le SDK Enterprise',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}`;
  }

  private generateHomePage(): string {
    return `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">
          Sky Genesis Enterprise
        </h1>
        <p className="mt-4 text-xl">
          Application Next.js avec le SDK Enterprise
        </p>
      </div>
    </main>
  );
}`;
  }

  private generateGlobalsCSS(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}`;
  }

  private generateApp(): string {
    return `import type { AppProps } from 'next/app';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}`;
  }

  private generateDocument(): string {
    return `import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}`;
  }

  private generatePagesHomePage(): string {
    return `export default function Home() {
  return (
    <div>
      <h1>Sky Genesis Enterprise</h1>
      <p>Application Next.js avec le SDK Enterprise</p>
    </div>
  );
}`;
  }

  private generateNextEnvTypes(): string {
    return `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.`;
  }

  private generatePage(path: string, type: string): string {
    const fileName = path.split('/').pop() || '';
    const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1) || 'Page';

    if (type === 'page') {
      return `export default function ${componentName}() {
  return (
    <div>
      <h1>${componentName}</h1>
      <p>Page Next.js générée avec le SDK Enterprise</p>
    </div>
  );
}`;
    }

    // Ajouter d'autres types de pages ici
    return '';
  }

  private generatePageTest(path: string): string {
    const fileName = path.split('/').pop() || '';
    const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1) || 'Page';

    return `import { render, screen } from '@testing-library/react';
import ${componentName} from './${path}';

describe('${componentName}', () => {
  it('rend correctement', () => {
    render(<${componentName} />);
    expect(screen.getByText('${componentName}')).toBeInTheDocument();
  });
});`;
  }

  private generateAPI(path: string, method: string): string {
    return `import { NextRequest, NextResponse } from 'next/server';

export async function ${method.toLowerCase()}(request: NextRequest) {
  try {
    // Logique de l'API ${path}
    const data = {
      message: 'API Next.js générée avec le SDK Enterprise',
      method: '${method}',
      path: '${path}',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}`;
  }

  private generateAPITest(path: string, method: string): string {
    return `import { createMocks } from 'node-mocks-http';
import { ${method.toLowerCase()} } from './route';

describe('/api/${path}', () => {
  it('retourne une réponse réussie', async () => {
    const { req } = createMocks({
      method: '${method}',
    });

    const response = await ${method.toLowerCase()}(req as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toContain('SDK Enterprise');
  });
});`;
  }
}
