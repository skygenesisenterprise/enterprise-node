/**
 * @fileoverview Intelligent Suggestions System
 * Apprend des patterns d'utilisation pour proposer des suggestions pertinentes
 */

export interface UsagePattern {
  /** Pattern de code */
  pattern: string;
  /** Fréquence d'utilisation */
  frequency: number;
  /** Contexte d'utilisation */
  context: string;
  /** Suggestion associée */
  suggestion: string;
}

export interface SmartSuggestion {
  /** Texte de la suggestion */
  text: string;
  /** Score de pertinence (0-1) */
  relevance: number;
  /** Contexte d'utilisation */
  context: string;
  /** Exemple de code */
  example?: string;
}

/**
 * Système de suggestions intelligentes basées sur l'usage
 */
export class IntelligentSuggestions {
  private patterns: Map<string, UsagePattern[]> = new Map();
  private userHistory: string[] = [];

  constructor() {
    this.initializeCommonPatterns();
  }

  /**
   * Initialise les patterns d'utilisation courants
   */
  private initializeCommonPatterns(): void {
    // Patterns pour l'initialisation
    this.addPattern('init', {
      pattern: 'new Enterprise',
      frequency: 0.9,
      context: 'setup',
      suggestion: 'new Enterprise({ modules: { ai: true, storage: true } })',
    });

    this.addPattern('init', {
      pattern: 'await Enterprise.initialize',
      frequency: 0.95,
      context: 'setup',
      suggestion: 'await Enterprise.initialize()',
    });

    // Patterns pour le module IA
    this.addPattern('ai', {
      pattern: 'enterprise.ai.generate',
      frequency: 0.8,
      context: 'text-generation',
      suggestion:
        'await enterprise.ai.generate(prompt, { model: "euse-generate-v0.1.0", maxTokens: 1000 })',
    });

    this.addPattern('ai', {
      pattern: 'enterprise.ai.enhance',
      frequency: 0.6,
      context: 'image-processing',
      suggestion: 'await enterprise.ai.enhance(image, { quality: "high", upscale: true })',
    });

    // Patterns pour le storage
    this.addPattern('storage', {
      pattern: 'enterprise.storage.save',
      frequency: 0.7,
      context: 'file-operations',
      suggestion:
        'await enterprise.storage.save(file, { path: "/storage/custom-path", encryption: false })',
    });

    this.addPattern('storage', {
      pattern: 'enterprise.storage.load',
      frequency: 0.6,
      context: 'file-operations',
      suggestion: 'await enterprise.storage.load("/storage/file-path", { decrypt: false })',
    });

    // Patterns pour les projets
    this.addPattern('project', {
      pattern: 'enterprise.project.create',
      frequency: 0.5,
      context: 'project-management',
      suggestion:
        'await enterprise.project.createProject({ name: "Project Name", status: "active" })',
    });
  }

  /**
   * Ajoute un pattern d'utilisation
   */
  private addPattern(category: string, pattern: UsagePattern): void {
    if (!this.patterns.has(category)) {
      this.patterns.set(category, []);
    }
    this.patterns.get(category)!.push(pattern);
  }

  /**
   * Analyse le code courant et génère des suggestions intelligentes
   * @param code - Code actuel
   * @param cursorPosition - Position du curseur
   * @returns Suggestions intelligentes
   */
  generateSmartSuggestions(code: string, cursorPosition: number): SmartSuggestion[] {
    const context = this.extractContext(code, cursorPosition);
    const suggestions: SmartSuggestion[] = [];

    // Analyser le contexte pour déterminer les suggestions pertinentes
    if (context.includes('new') || context.includes('Enterprise')) {
      suggestions.push(...this.getSetupSuggestions(context));
    }

    if (context.includes('.ai.')) {
      suggestions.push(...this.getAISuggestions(context));
    }

    if (context.includes('.storage.')) {
      suggestions.push(...this.getStorageSuggestions(context));
    }

    if (context.includes('.project.')) {
      suggestions.push(...this.getProjectSuggestions(context));
    }

    // Ajouter des suggestions basées sur l'historique
    suggestions.push(...this.getHistoryBasedSuggestions(context));

    // Trier par pertinence
    return suggestions.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
  }

  /**
   * Extrait le contexte autour du curseur
   */
  private extractContext(code: string, cursorPosition: number): string {
    const start = Math.max(0, cursorPosition - 100);
    const end = Math.min(code.length, cursorPosition + 50);
    return code.substring(start, end);
  }

  /**
   * Suggestions pour l'initialisation
   */
  private getSetupSuggestions(context: string): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    if (context.includes('import')) {
      suggestions.push({
        text: "import { Enterprise, createEnterprise } from '@skygenesisenterprise/enterprise-node';",
        relevance: 0.95,
        context: 'import',
        example:
          "// Import principal\nimport { Enterprise } from '@skygenesisenterprise/enterprise-node';\n\n// Initialisation\nawait Enterprise.initialize();",
      });
    }

    if (context.includes('new Enterprise')) {
      suggestions.push({
        text: 'new Enterprise({ modules: { ai: true, storage: true, ui: true, auth: true, project: true, sdk: true }, debug: false })',
        relevance: 0.9,
        context: 'constructor',
        example:
          'const enterprise = new Enterprise({\n  modules: { ai: true, storage: true },\n  debug: true\n});',
      });
    }

    return suggestions;
  }

  /**
   * Suggestions pour le module IA
   */
  private getAISuggestions(context: string): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    if (context.includes('generate')) {
      suggestions.push({
        text: "await enterprise.ai.generate('Your prompt here', { model: 'euse-generate-v0.1.0', maxTokens: 1000, temperature: 0.7 })",
        relevance: 0.85,
        context: 'ai-generate',
        example:
          "const result = await enterprise.ai.generate('Write a story about AI', {\n  model: 'euse-generate-v0.1.0',\n  maxTokens: 500,\n  temperature: 0.8\n});\nconsole.log(result.text);",
      });
    }

    if (context.includes('enhance')) {
      suggestions.push({
        text: "await enterprise.ai.enhance(imageFile, { quality: 'high', format: 'jpeg', upscale: true, denoise: true })",
        relevance: 0.8,
        context: 'ai-enhance',
        example:
          "const enhanced = await enterprise.ai.enhance(imageFile, {\n  quality: 'ultra',\n  upscale: true,\n  denoise: true\n});",
      });
    }

    return suggestions;
  }

  /**
   * Suggestions pour le module Storage
   */
  private getStorageSuggestions(context: string): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    if (context.includes('save')) {
      suggestions.push({
        text: "await enterprise.storage.save(file, { path: '/storage/custom-path', encryption: false, compression: true })",
        relevance: 0.8,
        context: 'storage-save',
        example:
          "const result = await enterprise.storage.save(file, {\n  path: '/documents/important.pdf',\n  encryption: true,\n  metadata: { author: 'John Doe' }\n});",
      });
    }

    return suggestions;
  }

  /**
   * Suggestions pour le module Project
   */
  private getProjectSuggestions(context: string): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    if (context.includes('create')) {
      suggestions.push({
        text: "await enterprise.project.createProject({ name: 'Project Name', description: 'Description', status: 'active' })",
        relevance: 0.75,
        context: 'project-create',
        example:
          "const project = await enterprise.project.createProject({\n  name: 'My New Project',\n  description: 'Project description',\n  status: 'active'\n});",
      });
    }

    return suggestions;
  }

  /**
   * Suggestions basées sur l'historique utilisateur
   */
  private getHistoryBasedSuggestions(context: string): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    // Analyser l'historique pour trouver des patterns récurrents
    const recentPatterns = this.analyzeRecentUsage();

    recentPatterns.forEach((pattern) => {
      if (this.isPatternRelevant(pattern, context)) {
        suggestions.push({
          text: pattern.suggestion,
          relevance: pattern.frequency * 0.7, // Réduire la pertinence pour l'historique
          context: 'history',
          example: pattern.pattern,
        });
      }
    });

    return suggestions;
  }

  /**
   * Analyse l'utilisation récente
   */
  private analyzeRecentUsage(): UsagePattern[] {
    // Simuler l'analyse de l'historique
    // Dans une vraie implémentation, ceci analyserait les fichiers récents
    return [
      {
        pattern: 'enterprise.ai.generate',
        frequency: 0.8,
        context: 'recent',
        suggestion: "await enterprise.ai.generate('Continue the story', { temperature: 0.9 })",
      },
    ];
  }

  /**
   * Vérifie si un pattern est pertinent pour le contexte actuel
   */
  private isPatternRelevant(pattern: UsagePattern, context: string): boolean {
    return context.includes(pattern.pattern.split('.')[0] || '');
  }

  /**
   * Enregistre l'utilisation pour améliorer les futures suggestions
   * @param code - Code utilisé
   * @param suggestion - Suggestion sélectionnée
   */
  recordUsage(code: string, suggestion: string): void {
    this.userHistory.push(`${code}:${suggestion}`);

    // Garder seulement les 1000 utilisations récentes
    if (this.userHistory.length > 1000) {
      this.userHistory = this.userHistory.slice(-1000);
    }
  }

  /**
   * Exporte les patterns d'utilisation pour l'analyse
   */
  exportPatterns(): Record<string, UsagePattern[]> {
    const exported: Record<string, UsagePattern[]> = {};

    this.patterns.forEach((patterns, category) => {
      exported[category] = patterns.sort((a, b) => b.frequency - a.frequency);
    });

    return exported;
  }
}

/**
 * Singleton pour les suggestions intelligentes
 */
export const intelligentSuggestions = new IntelligentSuggestions();

/**
 * Hook React pour utiliser les suggestions intelligentes
 * @example
 * ```typescript
 * const { suggestions, selectSuggestion } = useIntelligentSuggestions();
 *
 * // Dans votre composant
 * <AutoComplete suggestions={suggestions} onSelect={selectSuggestion} />
 * ```
 */
export function useIntelligentSuggestions(): {
  suggestions: SmartSuggestion[];
  updateSuggestions: (code: string, cursorPosition: number) => void;
  selectSuggestion: (suggestion: SmartSuggestion, code: string) => void;
} {
  const [suggestions, setSuggestions] = useState([] as SmartSuggestion[]);

  const updateSuggestions = (code: string, cursorPosition: number) => {
    const newSuggestions = intelligentSuggestions.generateSmartSuggestions(code, cursorPosition);
    setSuggestions(newSuggestions);
  };

  const selectSuggestion = (suggestion: SmartSuggestion, code: string) => {
    intelligentSuggestions.recordUsage(code, suggestion.text);
  };

  return {
    suggestions,
    updateSuggestions,
    selectSuggestion,
  };
}

// Import React si disponible
let useState: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  useState = eval('require')('react').useState;
} catch {
  // React n'est pas disponible, utiliser un placeholder
  useState = () => [{}, () => {}];
}
