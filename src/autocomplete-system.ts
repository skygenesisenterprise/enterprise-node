/**
 * @fileoverview Enhanced Auto-completion System for Enterprise SDK
 * Fournit une auto-complétion contextuelle intelligente
 */

// Types importés depuis les définitions principales

/**
 * Système d'auto-complétion contextuelle
 * Analyse le contexte et propose des suggestions pertinentes
 */
export class EnterpriseAutoComplete {
  private static instance: EnterpriseAutoComplete;
  private contextCache = new Map<string, any[]>();

  static getInstance(): EnterpriseAutoComplete {
    if (!EnterpriseAutoComplete.instance) {
      EnterpriseAutoComplete.instance = new EnterpriseAutoComplete();
    }
    return EnterpriseAutoComplete.instance;
  }

  /**
   * Analyse le contexte de code et retourne des suggestions
   * @param code - Code actuel de l'utilisateur
   * @param position - Position du curseur
   * @returns Suggestions contextuelles
   */
  analyzeContext(code: string, position: number): AutoCompleteSuggestion[] {
    const lines = code.split('\n');
    const currentLine = this.getCurrentLine(lines, position);
    const beforeCursor = currentLine.substring(0, this.getColumnInLine(lines, position));

    // Détection du contexte - utiliser des patterns plus précis
    if (beforeCursor.match(/\bimport\b/)) {
      return this.getImportSuggestions(beforeCursor);
    }

    if (beforeCursor.match(/new\s+Enterprise/)) {
      return this.getConstructorSuggestions(beforeCursor);
    }

    if (beforeCursor.match(/\.ai\.$/)) {
      return this.getAISuggestions(beforeCursor);
    }

    if (beforeCursor.match(/\.storage\.$/)) {
      return this.getStorageSuggestions(beforeCursor);
    }

    if (beforeCursor.match(/\.ui\.$/)) {
      return this.getUISuggestions(beforeCursor);
    }

    if (beforeCursor.match(/\.auth\.$/)) {
      return this.getAuthSuggestions(beforeCursor);
    }

    if (beforeCursor.match(/\.project\.$/)) {
      return this.getProjectSuggestions(beforeCursor);
    }

    return this.getGeneralSuggestions(beforeCursor);
  }

  /**
   * Suggestions pour les imports
   */
  private getImportSuggestions(beforeCursor: string): AutoCompleteSuggestion[] {
    return [
      {
        label: "import { Enterprise } from '@skygenesisenterprise/enterprise-node'",
        insertText: "import { Enterprise } from '@skygenesisenterprise/enterprise-node';",
        documentation: 'Import principal du SDK Enterprise',
        type: 'import',
      },
      {
        label: "import { createEnterprise } from '@skygenesisenterprise/enterprise-node'",
        insertText: "import { createEnterprise } from '@skygenesisenterprise/enterprise-node';",
        documentation: 'Import de la fonction usine pour créer des instances configurées',
        type: 'import',
      },
      {
        label: "import { Ai, Storage, UIManager } from '@skygenesisenterprise/enterprise-node'",
        insertText:
          "import { Ai, Storage, UIManager } from '@skygenesisenterprise/enterprise-node';",
        documentation: 'Import des classes de modules individuels',
        type: 'import',
      },
      {
        label:
          "import type { EnterpriseConfig, AIGenerateOptions } from '@skygenesisenterprise/enterprise-node'",
        insertText:
          "import type { EnterpriseConfig, AIGenerateOptions } from '@skygenesisenterprise/enterprise-node';",
        documentation: 'Import des types TypeScript',
        type: 'import',
      },
    ];
  }

  /**
   * Suggestions pour le constructeur Enterprise
   */
  private getConstructorSuggestions(beforeCursor: string): AutoCompleteSuggestion[] {
    return [
      {
        label: 'new Enterprise()',
        insertText: 'new Enterprise()',
        documentation: 'Crée une instance avec configuration par défaut',
        type: 'constructor',
      },
      {
        label: 'new Enterprise({ modules: { ai: true, storage: true } })',
        insertText:
          'new Enterprise({\n  modules: {\n    ai: true,\n    storage: true,\n    ui: true,\n    auth: true,\n    project: true,\n    sdk: true\n  },\n  debug: false\n})',
        documentation: 'Crée une instance avec configuration personnalisée',
        type: 'constructor',
      },
    ];
  }

  /**
   * Suggestions pour le module IA
   */
  private getAISuggestions(beforeCursor: string): AutoCompleteSuggestion[] {
    const suggestions: AutoCompleteSuggestion[] = [
      {
        label: 'generate(prompt, options)',
        insertText:
          "generate('${1:Your prompt here}', {\n  model: '${2:euse-generate-v0.1.0}',\n  maxTokens: ${3:1000},\n  temperature: ${4:0.7}\n})",
        documentation: "Génère du texte à partir d'un prompt",
        type: 'method',
        parameters: [
          { name: 'prompt', type: 'string', description: "Texte d'entrée pour la génération" },
          {
            name: 'options',
            type: 'AIGenerateOptions',
            description: 'Options de génération avancées',
          },
        ],
      },
      {
        label: 'enhance(image, options)',
        insertText:
          "enhance(${1:imageFile}, {\n  quality: '${2:high}',\n  format: '${3:jpeg}',\n  upscale: ${4:true}\n})",
        documentation: "Améliore la qualité d'une image",
        type: 'method',
        parameters: [
          { name: 'image', type: 'File | ArrayBuffer | string', description: 'Image à améliorer' },
          { name: 'options', type: 'AIEnhanceOptions', description: "Options d'amélioration" },
        ],
      },
      {
        label: 'analyze(data, options)',
        insertText:
          "analyze(${1:data}, {\n  type: '${2:comprehensive}',\n  language: '${3:fr}'\n})",
        documentation: 'Analyse des données et extrait des informations',
        type: 'method',
        parameters: [
          { name: 'data', type: 'any', description: 'Données à analyser' },
          { name: 'options', type: 'AIAnalyzeOptions', description: "Type d'analyse et options" },
        ],
      },
      {
        label: 'getModels()',
        insertText: 'getModels()',
        documentation: 'Liste tous les modèles IA disponibles',
        type: 'method',
      },
    ];

    // Ajouter des suggestions basées sur les options courantes
    if (beforeCursor.includes('generate')) {
      suggestions.push({
        label: "options: { model: 'euse-generate-v0.1.0' }",
        insertText:
          "{\n  model: 'euse-generate-v0.1.0',\n  maxTokens: 1000,\n  temperature: 0.7,\n  topP: 1.0\n}",
        documentation: 'Options de génération recommandées',
        type: 'options',
      });
    }

    return suggestions;
  }

  /**
   * Suggestions pour le module Storage
   */
  private getStorageSuggestions(beforeCursor: string): AutoCompleteSuggestion[] {
    return [
      {
        label: 'save(file, options)',
        insertText:
          "save(${1:file}, {\n  path: '${2:/storage/custom-path}',\n  encryption: ${3:false},\n  compression: ${4:true}\n})",
        documentation: 'Sauvegarde un fichier dans le stockage',
        type: 'method',
        parameters: [
          {
            name: 'file',
            type: 'File | ArrayBuffer | string',
            description: 'Fichier à sauvegarder',
          },
          { name: 'options', type: 'StorageSaveOptions', description: 'Options de sauvegarde' },
        ],
      },
      {
        label: 'load(path, options)',
        insertText:
          "load('${1:/storage/file-path}', {\n  decrypt: ${2:false},\n  cache: ${3:true}\n})",
        documentation: 'Charge un fichier depuis le stockage',
        type: 'method',
      },
      {
        label: 'list(directory)',
        insertText: "list('${1:/storage}')",
        documentation: 'Liste les fichiers dans un répertoire',
        type: 'method',
      },
      {
        label: 'delete(path)',
        insertText: "delete('${1:/storage/file-path}')",
        documentation: 'Supprime un fichier du stockage',
        type: 'method',
      },
      {
        label: 'exists(path)',
        insertText: "exists('${1:/storage/file-path}')",
        documentation: 'Vérifie si un fichier existe',
        type: 'method',
      },
    ];
  }

  /**
   * Suggestions pour le module UI
   */
  private getUISuggestions(beforeCursor: string): AutoCompleteSuggestion[] {
    return [
      {
        label: 'createComponent(config)',
        insertText:
          "createComponent({\n  type: '${1:button}',\n  props: {\n    ${2:text}: '${3:Click me}',\n    ${4:onClick}: ${5:handleClick}\n  }\n})",
        documentation: 'Crée un nouveau composant UI',
        type: 'method',
      },
      {
        label: 'render(component)',
        insertText: 'render(${1:component})',
        documentation: 'Rend un composant en HTML',
        type: 'method',
      },
    ];
  }

  /**
   * Suggestions pour le module Auth
   */
  private getAuthSuggestions(beforeCursor: string): AutoCompleteSuggestion[] {
    return [
      {
        label: 'authenticate(credentials)',
        insertText:
          "authenticate({\n  email: '${1:user@example.com}',\n  password: '${2:password}'\n})",
        documentation: 'Authentifie un utilisateur',
        type: 'method',
      },
      {
        label: 'authorize(user, resource, action)',
        insertText: "authorize(${1:user}, '${2:resource}', '${3:action}')",
        documentation: "Vérifie les autorisations d'un utilisateur",
        type: 'method',
      },
    ];
  }

  /**
   * Suggestions pour le module Project
   */
  private getProjectSuggestions(beforeCursor: string): AutoCompleteSuggestion[] {
    return [
      {
        label: 'createProject(data)',
        insertText:
          "createProject({\n  name: '${1:Project Name}',\n  description: '${2:Project description}',\n  status: '${3:active}'\n})",
        documentation: 'Crée un nouveau projet',
        type: 'method',
      },
      {
        label: 'createTask(projectId, data)',
        insertText:
          "createTask('${1:project-id}', {\n  title: '${2:Task title}',\n  description: '${3:Task description}',\n  status: '${4:todo}'\n})",
        documentation: 'Crée une nouvelle tâche dans un projet',
        type: 'method',
      },
      {
        label: 'getProjectTasks(projectId)',
        insertText: "getProjectTasks('${1:project-id}')",
        documentation: "Récupère toutes les tâches d'un projet",
        type: 'method',
      },
    ];
  }

  /**
   * Suggestions générales
   */
  private getGeneralSuggestions(beforeCursor: string): AutoCompleteSuggestion[] {
    return [
      {
        label: 'await Enterprise.initialize()',
        insertText: 'await Enterprise.initialize()',
        documentation: 'Initialise le SDK Enterprise',
        type: 'method',
      },
      {
        label: 'Enterprise.ai',
        insertText: 'Enterprise.ai',
        documentation: "Accès au module d'intelligence artificielle",
        type: 'property',
      },
      {
        label: 'Enterprise.storage',
        insertText: 'Enterprise.storage',
        documentation: 'Accès au module de stockage',
        type: 'property',
      },
      {
        label: 'Enterprise.ui',
        insertText: 'Enterprise.ui',
        documentation: "Accès au module d'interface utilisateur",
        type: 'property',
      },
      {
        label: 'Enterprise.auth',
        insertText: 'Enterprise.auth',
        documentation: "Accès au module d'authentification",
        type: 'property',
      },
      {
        label: 'Enterprise.project',
        insertText: 'Enterprise.project',
        documentation: 'Accès au module de gestion de projet',
        type: 'property',
      },
    ];
  }

  /**
   * Utilitaires pour l'analyse de code
   */
  private getCurrentLine(lines: string[], position: number): string {
    let currentPos = 0;
    for (const line of lines) {
      if (currentPos + line.length >= position) {
        return line;
      }
      currentPos += line.length + 1; // +1 pour le newline
    }
    return lines[lines.length - 1] || '';
  }

  private getColumnInLine(lines: string[], position: number): number {
    let currentPos = 0;
    for (const line of lines) {
      if (currentPos + line.length >= position) {
        return position - currentPos;
      }
      currentPos += line.length + 1;
    }
    return 0;
  }
}

/**
 * Interface pour les suggestions d'auto-complétion
 */
export interface AutoCompleteSuggestion {
  /** Texte affiché dans la liste de suggestions */
  label: string;
  /** Texte inséré lors de la sélection */
  insertText: string;
  /** Documentation détaillée */
  documentation: string;
  /** Type de suggestion */
  type: 'import' | 'constructor' | 'method' | 'property' | 'options';
  /** Paramètres de la méthode (optionnel) */
  parameters?: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  /** Priorité de la suggestion */
  priority?: number;
}

/**
 * Configuration du système d'auto-complétion
 */
export interface AutoCompleteConfig {
  /** Activer l'auto-complétion contextuelle */
  enabled?: boolean;
  /** Nombre maximum de suggestions */
  maxSuggestions?: number;
  /** Activer les suggestions basées sur l'IA */
  aiSuggestions?: boolean;
  /** Personnaliser les priorités */
  customPriorities?: Record<string, number>;
}

/**
 * Export par défaut pour une utilisation facile
 */
export default EnterpriseAutoComplete;
