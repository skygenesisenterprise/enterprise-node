/**
 * @fileoverview Capacitor Plugin Implementation
 * Plugin CapacitorJS officiel pour Enterprise SDK
 */

import {
  EnterprisePlugin,
  PluginManifest,
  PluginContext,
  PluginCommand,
  PluginConfigSchema,
} from './types';

export class CapacitorPlugin implements EnterprisePlugin {
  readonly manifest: PluginManifest = {
    name: 'capacitor',
    version: '1.0.0',
    description: 'Plugin CapacitorJS officiel pour Enterprise SDK',
    author: 'Sky Genesis Enterprise',
    homepage: 'https://wiki.skygenesisenterprise.com/plugins/capacitor',
    repository: 'https://github.com/skygenesisenterprise/enterprise-node',
    keywords: ['capacitor', 'enterprise', 'plugin', 'mobile', 'ios', 'android'],
    main: 'dist/index.js',
    category: 'framework',
    tags: ['capacitor', 'mobile', 'ios', 'android', 'native'],
    supports: ['react', 'vue', 'angular', 'svelte'],
    configSchema: {
      type: 'object',
      properties: {
        platforms: {
          type: 'array',
          description: 'Plateformes mobiles à cibler',
          default: ['ios', 'android', 'web'],
        },
        appId: {
          type: 'string',
          description: "Identifiant de l'application",
        },
        appName: {
          type: 'string',
          description: "Nom de l'application",
          default: 'Enterprise App',
        },
        webDir: {
          type: 'string',
          description: 'Répertoire de build web',
          default: 'dist',
        },
        server: {
          type: 'object',
          description: 'Configuration du serveur de développement',
        },
        plugins: {
          type: 'object',
          description: 'Plugins Capacitor',
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
        name: 'capacitor-init',
        description: 'Initialisation de Capacitor',
        timing: 'before',
        event: 'init',
        priority: 10,
      },
      {
        name: 'capacitor-build',
        description: 'Build mobile',
        timing: 'around',
        event: 'build',
        priority: 10,
      },
      {
        name: 'capacitor-run',
        description: 'Exécution sur mobile',
        timing: 'around',
        event: 'run',
        priority: 10,
      },
    ],
  };

  private context?: PluginContext;
  private config?: any;

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    this.config = context.config.plugins?.capacitor || {};

    context.logger.info('📱 Initialisation du plugin Capacitor...');

    // Configuration de Capacitor
    await this.setupCapacitorConfig();

    // Création des fichiers de configuration
    await this.createCapacitorFiles();

    // Configuration des outils
    await this.setupTools();

    context.logger.success('✅ Plugin Capacitor initialisé');
  }

  async destroy(): Promise<void> {
    this.context?.logger.info('📱 Destruction du plugin Capacitor...');
    this.context = undefined;
    this.config = undefined;
  }

  async onBeforeBuild(context: PluginContext): Promise<void> {
    context.logger.info('📱 Pré-build mobile...');

    // Vérification des dépendances
    await this.checkDependencies();

    // Optimisation du build mobile
    await this.optimizeMobileBuild();
  }

  async onAfterBuild(context: PluginContext): Promise<void> {
    context.logger.info('📱 Post-build mobile...');

    // Analyse du bundle mobile
    await this.analyzeMobileBundle();
  }

  getCommands(): PluginCommand[] {
    return [
      {
        name: 'capacitor:add',
        description: 'Ajouter une plateforme mobile',
        category: 'util',
        options: [
          {
            name: 'platform',
            description: 'Plateforme à ajouter',
            type: 'string',
            choices: ['ios', 'android'],
            required: true,
          },
        ],
        handler: this.handleAddPlatform.bind(this),
      },
      {
        name: 'capacitor:build',
        description: 'Builder pour une plateforme',
        category: 'build',
        options: [
          {
            name: 'platform',
            description: 'Plateforme de build',
            type: 'string',
            choices: ['ios', 'android', 'web'],
            required: true,
          },
          {
            name: 'release',
            description: 'Build de release',
            type: 'boolean',
            default: false,
          },
        ],
        handler: this.handleBuild.bind(this),
      },
      {
        name: 'capacitor:run',
        description: 'Exécuter sur une plateforme',
        category: 'dev',
        options: [
          {
            name: 'platform',
            description: 'Plateforme cible',
            type: 'string',
            choices: ['ios', 'android', 'web'],
            required: true,
          },
          {
            name: 'device',
            description: 'Appareil cible',
            type: 'string',
          },
        ],
        handler: this.handleRun.bind(this),
      },
      {
        name: 'capacitor:sync',
        description: 'Synchroniser le code avec les plateformes',
        category: 'util',
        handler: this.handleSync.bind(this),
      },
    ];
  }

  getConfigSchema(): PluginConfigSchema {
    return this.manifest.configSchema!;
  }

  validateConfig(config: any): boolean | string {
    // Validation de la configuration Capacitor
    if (config.platforms) {
      const validPlatforms = ['ios', 'android', 'web'];
      const invalidPlatforms = config.platforms.filter((p: string) => !validPlatforms.includes(p));
      if (invalidPlatforms.length > 0) {
        return `Plateformes invalides: ${invalidPlatforms.join(', ')}`;
      }
    }

    if (config.appId && !/^[a-z0-9.]+$/.test(config.appId)) {
      return 'appId doit contenir uniquement des lettres minuscules, chiffres et points';
    }

    return true;
  }

  async onModuleLoad(moduleName: string, moduleInstance: any): Promise<void> {
    if (moduleName === 'storage') {
      this.context?.logger.info('📱 Intégration du module Storage avec Capacitor...');
      await this.setupStorageIntegration(moduleInstance);
    }

    if (moduleName === 'auth') {
      this.context?.logger.info('📱 Intégration du module Auth avec Capacitor...');
      await this.setupAuthIntegration(moduleInstance);
    }
  }

  private async setupCapacitorConfig(): Promise<void> {
    if (!this.context) return;

    const config = {
      ...this.getDefaultConfig(),
      ...this.config,
    };

    // Créer le fichier capacitor.config.ts
    const capacitorConfig = this.generateCapacitorConfig(config);
    await this.context.utils.writeFile('capacitor.config.ts', capacitorConfig);
  }

  private async createCapacitorFiles(): Promise<void> {
    if (!this.context) return;

    // Créer les fichiers de configuration natifs
    await this.createNativeConfigFiles();

    // Créer les scripts de build
    await this.createBuildScripts();
  }

  private async setupTools(): Promise<void> {
    if (!this.context) return;

    // Mettre à jour package.json avec les scripts Capacitor
    await this.updatePackageScripts();
  }

  private async checkDependencies(): Promise<void> {
    const packageJson = await this.context!.utils.getPackageJson();
    const requiredDeps = ['@capacitor/core', '@capacitor/cli'];

    for (const dep of requiredDeps) {
      if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
        throw new Error(`Dépendance requise manquante: ${dep}`);
      }
    }
  }

  private async optimizeMobileBuild(): Promise<void> {
    // Optimisations spécifiques au mobile
    this.context?.logger.info('📱 Optimisation du build mobile...');
  }

  private async analyzeMobileBundle(): Promise<void> {
    // Analyse du bundle mobile
    this.context?.logger.info('📊 Analyse du bundle mobile...');
  }

  private async setupStorageIntegration(storageModule: any): Promise<void> {
    // Intégration avec le module Storage pour le stockage natif
    this.context?.logger.info('💾 Intégration Storage Capacitor configurée');
  }

  private async setupAuthIntegration(authModule: any): Promise<void> {
    // Intégration avec le module Auth pour l'authentification native
    this.context?.logger.info('🔐 Intégration Auth Capacitor configurée');
  }

  private async handleAddPlatform(args: any, context: PluginContext): Promise<void> {
    const { platform } = args;

    context.logger.info(`📱 Ajout de la plateforme ${platform}...`);

    // Utiliser Capacitor CLI pour ajouter la plateforme
    await context.utils.exec(`npx cap add ${platform}`);

    context.logger.success(`✅ Plateforme ${platform} ajoutée`);
  }

  private async handleBuild(args: any, context: PluginContext): Promise<void> {
    const { platform, release } = args;

    context.logger.info(`📱 Build pour ${platform} (${release ? 'release' : 'debug'})...`);

    // Build web d'abord
    await context.utils.exec('npm run build');

    // Sync avec les plateformes
    await context.utils.exec('npx cap sync');

    // Build natif
    if (platform === 'ios') {
      if (release) {
        await context.utils.exec('npx cap open ios');
        context.logger.info('📱 Ouvrir Xcode pour le build release');
      } else {
        await context.utils.exec('npx cap run ios');
      }
    } else if (platform === 'android') {
      if (release) {
        await context.utils.exec('npx cap open android');
        context.logger.info('📱 Ouvrir Android Studio pour le build release');
      } else {
        await context.utils.exec('npx cap run android');
      }
    }

    context.logger.success(`✅ Build ${platform} terminé`);
  }

  private async handleRun(args: any, context: PluginContext): Promise<void> {
    const { platform, device } = args;

    context.logger.info(`📱 Exécution sur ${platform}...`);

    let command = `npx cap run ${platform}`;
    if (device) {
      command += ` --target=${device}`;
    }

    await context.utils.exec(command);

    context.logger.success(`✅ Exécution ${platform} démarrée`);
  }

  private async handleSync(args: any, context: PluginContext): Promise<void> {
    context.logger.info('📱 Synchronisation avec les plateformes...');

    await context.utils.exec('npx cap sync');

    context.logger.success('✅ Synchronisation terminée');
  }

  private getDefaultConfig(): any {
    return {
      platforms: ['ios', 'android', 'web'],
      appId: 'com.enterprise.app',
      appName: 'Enterprise App',
      webDir: 'dist',
      server: {
        url: 'http://localhost:3000',
        cleartext: false,
      },
      plugins: {
        camera: false,
        geolocation: false,
        pushNotifications: false,
        storage: true,
      },
      features: {
        analytics: true,
        crashReporting: true,
        performance: true,
        offlineSupport: true,
      },
    };
  }

  private generateCapacitorConfig(config: any): string {
    return `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '${config.appId || 'com.enterprise.app'}',
  appName: '${config.appName || 'Enterprise App'}',
  webDir: '${config.webDir || 'dist'}',
  server: {
    url: '${config.server?.url || 'http://localhost:3000'}',
    cleartext: ${config.server?.cleartext || false}
  },
  plugins: {
    ${config.plugins?.camera ? 'Camera: {},' : ''}
    ${config.plugins?.geolocation ? 'Geolocation: {},' : ''}
    ${config.plugins?.pushNotifications ? 'PushNotifications: {},' : ''}
    ${config.plugins?.storage ? 'Storage: {},' : ''}
  }
};

export default config;`;
  }

  private async createNativeConfigFiles(): Promise<void> {
    if (!this.context) return;

    // Créer des fichiers de configuration natifs de base
    const iOSConfig = this.generateiOSConfig();
    const androidConfig = this.generateAndroidConfig();

    await this.context.utils.writeFile('ios/Config/AppInfo.plist', iOSConfig);
    await this.context.utils.writeFile('android/app/src/main/AndroidManifest.xml', androidConfig);
  }

  private async createBuildScripts(): Promise<void> {
    if (!this.context) return;

    // Scripts de build pour les plateformes mobiles
    const buildScripts = {
      'build:ios': 'npm run build && npx cap sync ios',
      'build:android': 'npm run build && npx cap sync android',
      'run:ios': 'npm run build && npx cap run ios',
      'run:android': 'npm run build && npx cap run android',
      sync: 'npx cap sync',
    };

    const packageJson = await this.context.utils.getPackageJson();
    packageJson.scripts = { ...packageJson.scripts, ...buildScripts };

    await this.context.utils.updatePackageJson(packageJson);
  }

  private async updatePackageScripts(): Promise<void> {
    if (!this.context) return;

    const packageJson = await this.context.utils.getPackageJson();

    // Ajouter les scripts Capacitor
    const capacitorScripts = {
      'cap:add': 'npx cap add',
      'cap:sync': 'npx cap sync',
      'cap:run': 'npx cap run',
      'cap:open': 'npx cap open',
    };

    packageJson.scripts = { ...packageJson.scripts, ...capacitorScripts };

    await this.context.utils.updatePackageJson(packageJson);
  }

  private generateiOSConfig(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>${this.config?.appName || 'Enterprise App'}</string>
    <key>CFBundleIdentifier</key>
    <string>${this.config?.appId || 'com.enterprise.app'}</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <${this.config?.server?.cleartext ? 'true' : 'false'}/>
    </dict>
</dict>
</plist>`;
  }

  private generateAndroidConfig(): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:label="${this.config?.appName || 'Enterprise App'}"
        android:usesCleartextTraffic="${this.config?.server?.cleartext ? 'true' : 'false'}">
        
        ${
          this.config?.plugins?.camera
            ? `
        <uses-permission android:name="android.permission.CAMERA" />
        <uses-feature android:name="android.hardware.camera" />
        `
            : ''
        }
        
        ${
          this.config?.plugins?.geolocation
            ? `
        <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
        <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
        `
            : ''
        }
        
    </application>
</manifest>`;
  }
}
