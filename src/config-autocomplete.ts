/**
 * @fileoverview Configuration Auto-completion System
 * Fournit une auto-complétion intelligente pour enterprise.config.ts
 */

import type { EnterpriseConfig } from './types';
import type { EnterpriseConfigOptions, ConfigPreset } from './config-builder';

/**
 * Suggestions de configuration avec contexte
 */
export interface ConfigSuggestion {
  /** Texte de la suggestion */
  label: string;
  /** Code à insérer */
  insertText: string;
  /** Documentation */
  documentation: string;
  /** Type de suggestion */
  type: 'module' | 'runtime' | 'branding' | 'preset' | 'helper';
  /** Exemple d'utilisation */
  example?: string;
}

/**
 * Système d'auto-complétion pour la configuration
 */
export class ConfigAutoComplete {
  private static instance: ConfigAutoComplete;

  static getInstance(): ConfigAutoComplete {
    if (!ConfigAutoComplete.instance) {
      ConfigAutoComplete.instance = new ConfigAutoComplete();
    }
    return ConfigAutoComplete.instance;
  }

  /**
   * Analyse le contexte de configuration et retourne des suggestions
   * @param code - Code du fichier de configuration
   * @param position - Position du curseur
   * @returns Suggestions contextuelles
   */
  analyzeConfigContext(code: string, position: number): ConfigSuggestion[] {
    const beforeCursor = this.getTextBeforeCursor(code, position);

    // Détection du contexte
    if (beforeCursor.includes('modules:')) {
      return this.getModuleSuggestions(beforeCursor);
    }

    if (beforeCursor.includes('runtime:')) {
      return this.getRuntimeSuggestions(beforeCursor);
    }

    if (beforeCursor.includes('branding:')) {
      return this.getBrandingSuggestions(beforeCursor);
    }

    if (beforeCursor.includes('framework:')) {
      return this.getFrameworkSuggestions(beforeCursor);
    }

    if (beforeCursor.includes('import') && beforeCursor.includes('config')) {
      return this.getImportSuggestions(beforeCursor);
    }

    return this.getGeneralConfigSuggestions(beforeCursor);
  }

  /**
   * Suggestions pour les modules
   */
  private getModuleSuggestions(beforeCursor: string): ConfigSuggestion[] {
    return [
      {
        label: 'ai: true',
        insertText: 'ai: true,',
        documentation: "Active le module d'intelligence artificielle",
        type: 'module',
        example: 'modules: {\n  ai: true,\n  storage: true\n}',
      },
      {
        label: 'storage: true',
        insertText: 'storage: true,',
        documentation: 'Active le module de stockage',
        type: 'module',
        example: 'modules: {\n  storage: true,\n  encryption: true\n}',
      },
      {
        label: 'ui: true',
        insertText: 'ui: true,',
        documentation: "Active le module d'interface utilisateur",
        type: 'module',
      },
      {
        label: 'auth: true',
        insertText: 'auth: true,',
        documentation: "Active le module d'authentification",
        type: 'module',
      },
      {
        label: 'project: true',
        insertText: 'project: true,',
        documentation: 'Active le module de gestion de projet',
        type: 'module',
      },
      {
        label: 'sdk: true',
        insertText: 'sdk: true,',
        documentation: 'Active le SDK auto-référentiel',
        type: 'module',
      },
      {
        label: 'modules complets',
        insertText:
          '{\n    ai: true,\n    storage: true,\n    ui: true,\n    auth: true,\n    project: true,\n    sdk: true\n  },',
        documentation: 'Configuration complète de tous les modules',
        type: 'module',
      },
    ];
  }

  /**
   * Suggestions pour le runtime
   */
  private getRuntimeSuggestions(beforeCursor: string): ConfigSuggestion[] {
    return [
      {
        label: "wasmPath: '/wasm/euse_core.wasm'",
        insertText: "wasmPath: '/wasm/euse_core.wasm',",
        documentation: 'Chemin vers les fichiers WebAssembly',
        type: 'runtime',
      },
      {
        label: 'enableWasm: true',
        insertText: 'enableWasm: true,',
        documentation: 'Active/désactive WebAssembly',
        type: 'runtime',
      },
      {
        label: 'runtime complet',
        insertText: "{\n    wasmPath: '/wasm/euse_core.wasm',\n    enableWasm: true\n  },",
        documentation: 'Configuration complète du runtime',
        type: 'runtime',
      },
    ];
  }

  /**
   * Suggestions pour le branding
   */
  private getBrandingSuggestions(beforeCursor: string): ConfigSuggestion[] {
    return [
      {
        label: "companyName: 'Your Company'",
        insertText: "companyName: 'Your Company',",
        documentation: "Nom de l'entreprise",
        type: 'branding',
      },
      {
        label: "primaryColor: '#007acc'",
        insertText: "primaryColor: '#007acc',",
        documentation: 'Couleur primaire du thème',
        type: 'branding',
      },
      {
        label: "secondaryColor: '#004466'",
        insertText: "secondaryColor: '#004466',",
        documentation: 'Couleur secondaire du thème',
        type: 'branding',
      },
      {
        label: "theme: 'auto'",
        insertText: "theme: 'auto',",
        documentation: 'Thème visuel (light, dark, auto)',
        type: 'branding',
      },
      {
        label: 'logo configuration',
        insertText:
          "logo: {\n      path: './assets/logo.png',\n      width: 200,\n      height: 60,\n      alt: 'Company Logo'\n    },",
        documentation: 'Configuration du logo',
        type: 'branding',
      },
      {
        label: 'branding complet',
        insertText:
          "{\n    companyName: 'Your Company',\n    primaryColor: '#007acc',\n    secondaryColor: '#004466',\n    theme: 'auto',\n    logo: {\n      path: './assets/logo.png',\n      width: 200,\n      height: 60\n    }\n  },",
        documentation: 'Configuration complète du branding',
        type: 'branding',
      },
    ];
  }

  /**
   * Suggestions pour les frameworks
   */
  private getFrameworkSuggestions(beforeCursor: string): ConfigSuggestion[] {
    return [
      {
        label: "'react'",
        insertText: "'react'",
        documentation: 'Optimisé pour React',
        type: 'helper',
      },
      {
        label: "'nextjs'",
        insertText: "'nextjs'",
        documentation: 'Optimisé pour Next.js',
        type: 'helper',
      },
      {
        label: "'svelte'",
        insertText: "'svelte'",
        documentation: 'Optimisé pour Svelte',
        type: 'helper',
      },
      {
        label: "'auto'",
        insertText: "'auto'",
        documentation: 'Détection automatique du framework',
        type: 'helper',
      },
    ];
  }

  /**
   * Suggestions pour les imports
   */
  private getImportSuggestions(beforeCursor: string): ConfigSuggestion[] {
    return [
      {
        label: "import { createConfig } from '@skygenesisenterprise/enterprise-node/config'",
        insertText: "import { createConfig } from '@skygenesisenterprise/enterprise-node/config';",
        documentation: 'Import des helpers de configuration',
        type: 'helper',
      },
      {
        label:
          "import { EnterpriseConfigBuilder } from '@skygenesisenterprise/enterprise-node/config'",
        insertText:
          "import { EnterpriseConfigBuilder } from '@skygenesisenterprise/enterprise-node/config';",
        documentation: 'Import du builder de configuration',
        type: 'helper',
      },
      {
        label: "import { ConfigPresets } from '@skygenesisenterprise/enterprise-node/config'",
        insertText: "import { ConfigPresets } from '@skygenesisenterprise/enterprise-node/config';",
        documentation: 'Import des presets de configuration',
        type: 'helper',
      },
    ];
  }

  /**
   * Suggestions générales de configuration
   */
  private getGeneralConfigSuggestions(beforeCursor: string): ConfigSuggestion[] {
    return [
      {
        label: 'modules: {}',
        insertText: 'modules: {\n    \n  },',
        documentation: 'Configuration des modules',
        type: 'module',
      },
      {
        label: 'runtime: {}',
        insertText: 'runtime: {\n    \n  },',
        documentation: 'Configuration du runtime',
        type: 'runtime',
      },
      {
        label: 'branding: {}',
        insertText: 'branding: {\n    \n  },',
        documentation: 'Configuration du branding',
        type: 'branding',
      },
      {
        label: "framework: 'auto'",
        insertText: "framework: 'auto',",
        documentation: 'Framework cible',
        type: 'helper',
      },
      {
        label: 'debug: false',
        insertText: 'debug: false,',
        documentation: 'Mode debug',
        type: 'helper',
      },
      {
        label: 'configuration complète',
        insertText:
          "{\n  modules: {\n    ai: true,\n    storage: true,\n    ui: true,\n    auth: true,\n    project: true,\n    sdk: true\n  },\n  runtime: {\n    wasmPath: '/wasm/euse_core.wasm',\n    enableWasm: true\n  },\n  framework: 'auto',\n  debug: false,\n  branding: {\n    companyName: 'Your Company',\n    primaryColor: '#007acc',\n    theme: 'auto'\n  }\n}",
        documentation: 'Configuration complète du SDK',
        type: 'helper',
      },
    ];
  }

  /**
   * Suggestions pour les presets
   */
  getPresetSuggestions(): ConfigSuggestion[] {
    return [
      {
        label: 'createConfig.minimal()',
        insertText: 'createConfig.minimal().build()',
        documentation: 'Configuration minimale rapide',
        type: 'preset',
        example: 'export default createConfig.minimal().build();',
      },
      {
        label: 'createConfig.fullstack()',
        insertText: 'createConfig.fullstack().build()',
        documentation: 'Configuration full-stack complète',
        type: 'preset',
        example: 'export default createConfig.fullstack().build();',
      },
      {
        label: 'createConfig.aiFirst()',
        insertText: 'createConfig.aiFirst().build()',
        documentation: "Configuration optimisée pour l'IA",
        type: 'preset',
        example: 'export default createConfig.aiFirst().build();',
      },
      {
        label: 'createConfig.development()',
        insertText: 'createConfig.development().build()',
        documentation: 'Configuration de développement',
        type: 'preset',
        example: 'export default createConfig.development().build();',
      },
      {
        label: 'createConfig.production()',
        insertText: 'createConfig.production().build()',
        documentation: 'Configuration de production',
        type: 'preset',
        example: 'export default createConfig.production().build();',
      },
    ];
  }

  /**
   * Suggestions pour les builders
   */
  getBuilderSuggestions(): ConfigSuggestion[] {
    return [
      {
        label: 'new EnterpriseConfigBuilder()',
        insertText: 'new EnterpriseConfigBuilder()',
        documentation: 'Crée un nouveau builder de configuration',
        type: 'helper',
      },
      {
        label: ".enableModules(['ai', 'storage'])",
        insertText: ".enableModules(['ai', 'storage'])",
        documentation: 'Active les modules spécifiés',
        type: 'helper',
      },
      {
        label: ".setFramework('react')",
        insertText: ".setFramework('react')",
        documentation: 'Définit le framework cible',
        type: 'helper',
      },
      {
        label: '.enableDebug()',
        insertText: '.enableDebug()',
        documentation: 'Active le mode debug',
        type: 'helper',
      },
      {
        label: '.setBranding({...})',
        insertText:
          ".setBranding({\n    companyName: 'Your Company',\n    primaryColor: '#007acc'\n  })",
        documentation: 'Configure le branding',
        type: 'helper',
      },
      {
        label: '.build()',
        insertText: '.build()',
        documentation: 'Construit la configuration finale',
        type: 'helper',
      },
    ];
  }

  /**
   * Extrait le texte avant le curseur
   */
  private getTextBeforeCursor(code: string, position: number): string {
    return code.substring(0, position);
  }
}

/**
 * Singleton pour l'auto-complétion de configuration
 */
export const configAutoComplete = ConfigAutoComplete.getInstance();

/**
 * Templates de configuration avec auto-complétion
 */
export const ConfigTemplates = {
  /**
   * Template de configuration minimal
   */
  minimal: `import { EnterpriseConfig } from '@skygenesisenterprise/enterprise-node';

const config: EnterpriseConfig = {
  modules: {
    ai: true,
    storage: true,
    ui: false,
    auth: false,
    project: false,
    sdk: false,
  },
  framework: 'auto',
  debug: false,
};

export default config;`,

  /**
   * Template avec builder
   */
  builder: `import { createConfig } from '@skygenesisenterprise/enterprise-node/config';

export default createConfig.custom()
  .enableModules(['ai', 'storage', 'ui'])
  .setFramework('react')
  .enableDebug()
  .setBranding({
    companyName: 'Your Company',
    primaryColor: '#007acc',
    theme: 'auto'
  })
  .build();`,

  /**
   * Template avec preset
   */
  preset: `import { createConfig } from '@skygenesisenterprise/enterprise-node/config';

export default createConfig.fullstack()
  .enableDebug()
  .setBranding({
    companyName: 'Your Company',
    primaryColor: '#007acc'
  })
  .build();`,

  /**
   * Template avancé avec plugins
   */
  advanced: `import { EnterpriseConfigBuilder } from '@skygenesisenterprise/enterprise-node/config';

const config = new EnterpriseConfigBuilder({
  env: 'production',
  plugins: [
    {
      name: 'analytics-plugin',
      version: '1.0.0',
      setup: (config) => ({ ...config, analytics: true })
    }
  ]
})
  .enableModules(['ai', 'storage', 'ui', 'auth'])
  .setRuntime({
    wasmPath: '/wasm/euse_core.wasm',
    enableWasm: true
  })
  .setFramework('nextjs')
  .setHooks({
    beforeInit: async (config) => {
      console.log('Initializing SDK with config:', config);
    },
    afterInit: async (instance) => {
      console.log('SDK initialized successfully');
    }
  })
  .build();

export default config;`,
};

export default ConfigAutoComplete;
