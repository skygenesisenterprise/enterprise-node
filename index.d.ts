/**
 * Type declaration file for @skygenesisenterprise/enterprise-node
 * Enhanced with comprehensive JSDoc for intelligent IDE auto-completion
 * @author Sky Genesis Enterprise
 * @version 1.0.9
 */

/**
 * Configuration principale pour le SDK Enterprise
 * @example
 * ```typescript
 * const config: EnterpriseConfig = {
 *   modules: {
 *     ai: true,
 *     storage: true,
 *     ui: true,
 *     auth: true,
 *     project: true,
 *     sdk: true
 *   },
 *   runtime: {
 *     wasmPath: './wasm/',
 *     enableWasm: true
 *   },
 *   framework: 'react',
 *   debug: false
 * };
 * ```
 */
export interface EnterpriseConfig {
  /** Configuration des modules disponibles */
  modules: {
    /** Activer le module d'intelligence artificielle */
    ai?: boolean;
    /** Activer le module de stockage */
    storage?: boolean;
    /** Activer le module d'interface utilisateur */
    ui?: boolean;
    /** Activer le module d'authentification */
    auth?: boolean;
    /** Activer le module de gestion de projet */
    project?: boolean;
    /** Activer le SDK auto-référentiel */
    sdk?: boolean;
  };
  /** Configuration du runtime WebAssembly */
  runtime?: {
    /** Chemin vers les fichiers WASM */
    wasmPath?: string;
    /** Activer/désactiver WebAssembly */
    enableWasm?: boolean;
  };
  /** Framework cible pour l'intégration */
  framework?: 'react' | 'svelte' | 'nextjs' | 'auto';
  /** Activer le mode debug pour les logs détaillés */
  debug?: boolean;
  /** Configuration de l'identité visuelle */
  branding?: BrandingConfig;
}

/**
 * SDK Enterprise principal - Point d'entrée universel
 * @example
 * ```typescript
 * import { Enterprise } from '@skygenesisenterprise/enterprise-node';
 *
 * // Initialisation avec configuration par défaut
 * await Enterprise.initialize();
 *
 * // Utilisation des modules
 * const result = await Enterprise.ai.generate('Hello world');
 * const saved = await Enterprise.storage.save(file);
 * ```
 */
export declare class EnterpriseSDK {
  /** @internal Chargeur de modules */
  private loader;
  /** @internal Configuration interne */
  private config;
  /** @internal État d'initialisation */
  private isInitialized;

  /**
   * Crée une nouvelle instance du SDK Enterprise
   * @param userConfig - Configuration optionnelle pour personnaliser le SDK
   * @example
   * ```typescript
   * const enterprise = new EnterpriseSDK({
   *   modules: { ai: true, storage: false },
   *   debug: true
   * });
   * ```
   */
  constructor(userConfig?: Partial<EnterpriseConfig>);

  /**
   * Initialise le SDK et tous les modules activés
   * @throws {Error} Si l'initialisation échoue
   * @example
   * ```typescript
   * await enterprise.initialize();
   * console.log('SDK ready!');
   * ```
   */
  initialize(): Promise<void>;

  /**
   * Module d'intelligence artificielle
   * @returns {Ai} Instance du module IA
   * @example
   * ```typescript
   * const ai = enterprise.ai;
   * const text = await ai.generate('Write a story');
   * const enhanced = await ai.enhance(image);
   * ```
   */
  get ai(): Ai;

  /**
   * Module de stockage de fichiers
   * @returns {Storage} Instance du module de stockage
   * @example
   * ```typescript
   * const storage = enterprise.storage;
   * const saved = await storage.save(file, { encryption: true });
   * const loaded = await storage.load(path);
   * ```
   */
  get storage(): Storage;

  /**
   * Module d'interface utilisateur
   * @returns {UIManager} Instance du gestionnaire UI
   * @example
   * ```typescript
   * const ui = enterprise.ui;
   * const button = ui.createComponent({
   *   type: 'button',
   *   props: { text: 'Click me' }
   * });
   * ```
   */
  get ui(): UIManager;

  /**
   * Module de gestion de projet
   * @returns {ProjectManager} Instance du gestionnaire de projet
   * @example
   * ```typescript
   * const project = enterprise.project;
   * const newProject = await project.create({
   *   name: 'My Project',
   *   description: 'Project description'
   * });
   * ```
   */
  get project(): ProjectManager;

  /**
   * Module d'authentification
   * @returns {AuthManager} Instance du gestionnaire d'auth
   * @example
   * ```typescript
   * const auth = enterprise.auth;
   * const user = await auth.authenticate({
   *   email: 'user@example.com',
   *   password: 'password'
   * });
   * ```
   */
  get auth(): AuthManager;

  /**
   * Module SDK auto-référentiel
   * @returns {SDK} Instance du SDK
   * @example
   * ```typescript
   * const sdk = enterprise.sdk;
   * const meta = sdk.getMetaInfo();
   * const child = await sdk.createSelfReference();
   * ```
   */
  get sdk(): SDK;

  /**
   * Runtime WebAssembly sous-jacent
   * @returns {RuntimeCore} Instance du runtime
   * @internal Usage interne avancé
   */
  get runtime(): RuntimeCore;

  /**
   * Framework détecté
   * @returns {FrameworkType} Framework en cours d'utilisation
   * @example
   * ```typescript
   * console.log(`Running on: ${enterprise.framework}`);
   * // Output: "Running on: react"
   * ```
   */
  get framework(): FrameworkType;

  /**
   * Récupère la configuration actuelle
   * @returns {EnterpriseConfig} Configuration complète
   */
  getConfig(): EnterpriseConfig;

  /**
   * Met à jour la configuration à chaud
   * @param updates - Modifications à appliquer
   * @example
   * ```typescript
   * enterprise.updateConfig({
   *   debug: true,
   *   modules: { ai: false }
   * });
   * ```
   */
  updateConfig(updates: Partial<EnterpriseConfig>): void;

  /**
   * Nettoie toutes les ressources et ferme le SDK
   * @example
   * ```typescript
   * // En fin d'application
   * await enterprise.destroy();
   * ```
   */
  destroy(): Promise<void>;
}

/**
 * Instance singleton du SDK Enterprise
 * @example
 * ```typescript
 * import { Enterprise } from '@skygenesisenterprise/enterprise-node';
 *
 * await Enterprise.initialize();
 * const result = await Enterprise.ai.generate('Hello');
 * ```
 */
export declare const Enterprise: EnterpriseSDK;

/**
 * Fonction usine pour créer des instances configurées du SDK
 * @param config - Configuration optionnelle
 * @returns Promise<EnterpriseSDK> Instance initialisée prête à l'emploi
 * @example
 * ```typescript
 * import { createEnterprise } from '@skygenesisenterprise/enterprise-node';
 *
 * const enterprise = await createEnterprise({
 *   modules: { ai: true, storage: true },
 *   debug: true
 * });
 *
 * // Utilisation immédiate
 * const result = await enterprise.ai.generate('Hello world');
 * ```
 */
export declare function createEnterprise(
  config?: Partial<EnterpriseConfig>
): Promise<EnterpriseSDK>;

/**
 * Module d'intelligence artificielle
 * Offre des capacités de génération, amélioration et analyse
 */
export declare class Ai {
  /** Nom du module */
  name: string;
  /** Version du module */
  version: string;

  /**
   * Initialise le module IA
   * @example
   * ```typescript
   * const ai = new Ai();
   * await ai.init();
   * ```
   */
  init(): Promise<void>;

  /**
   * Génère du texte à partir d'un prompt
   * @param prompt - Texte d'entrée pour la génération
   * @param options - Options de génération avancées
   * @returns Promise<AIGenerateResult> Texte généré avec métadonnées
   * @example
   * ```typescript
   * const result = await ai.generate('Write a poem about AI', {
   *   model: 'euse-generate-v0.1.0',
   *   maxTokens: 500,
   *   temperature: 0.8
   * });
   * console.log(result.text);
   * ```
   */
  generate(prompt: string, options?: AIGenerateOptions): Promise<AIGenerateResult>;

  /**
   * Améliore la qualité d'une image
   * @param image - Image à améliorer (File, ArrayBuffer ou URL)
   * @param options - Options d'amélioration
   * @returns Promise<AIEnhanceResult> Image améliorée avec métadonnées
   * @example
   * ```typescript
   * const result = await ai.enhance(imageFile, {
   *   quality: 'ultra',
   *   upscale: true,
   *   denoise: true
   * });
   * ```
   */
  enhance(image: File | ArrayBuffer | string, options?: AIEnhanceOptions): Promise<AIEnhanceResult>;

  /**
   * Analyse des données et extrait des informations
   * @param data - Données à analyser (texte, JSON, etc.)
   * @param options - Type d'analyse et options
   * @returns Promise<AIAnalyzeResult> Résultats d'analyse avec confiance
   * @example
   * ```typescript
   * const result = await ai.analyze(text, {
   *   type: 'sentiment',
   *   language: 'fr'
   * });
   * console.log('Sentiment:', result.insights);
   * ```
   */
  analyze(data: any, options?: AIAnalyzeOptions): Promise<AIAnalyzeResult>;

  /**
   * Liste tous les modèles IA disponibles
   * @returns Liste des modèles avec leurs capacités
   * @example
   * ```typescript
   * const { models } = await ai.getModels();
   * models.forEach(model => {
   *   console.log(`${model.name}: ${model.capabilities.join(', ')}`);
   * });
   * ```
   */
  getModels(): Promise<{
    models: Array<{
      id: string;
      name: string;
      type: 'text' | 'image' | 'multimodal';
      capabilities: string[];
    }>;
  }>;

  /** @internal Vérifie si le module est initialisé */
  private ensureInitialized(): void;
}

/**
 * Module de stockage persistant
 * Gère les fichiers avec chiffrement et compression
 */
export declare class Storage {
  /** Nom du module */
  name: string;
  /** Version du module */
  version: string;

  /**
   * Sauvegarde un fichier dans le stockage
   * @param file - Fichier à sauvegarder
   * @param options - Options de sauvegarde
   * @returns Promise<{path: string, size: number, hash: string}> Métadonnées du fichier
   * @example
   * ```typescript
   * const result = await storage.save(file, {
   *   path: '/documents/important.pdf',
   *   encryption: true,
   *   compression: true,
   *   metadata: { author: 'John Doe' }
   * });
   * console.log('Saved to:', result.path);
   * ```
   */
  save(
    file: File | ArrayBuffer | string,
    options?: StorageSaveOptions
  ): Promise<{ path: string; size: number; hash: string }>;

  /**
   * Charge un fichier depuis le stockage
   * @param filePath - Chemin du fichier à charger
   * @param options - Options de chargement
   * @returns Promise<{data: any, metadata?: any}> Données du fichier
   * @example
   * ```typescript
   * const { data, metadata } = await storage.load('/documents/important.pdf', {
   *   decrypt: true,
   *   cache: true
   * });
   * ```
   */
  load(filePath: string, options?: StorageLoadOptions): Promise<{ data: any; metadata?: any }>;

  /**
   * Supprime un fichier du stockage
   * @param filePath - Chemin du fichier à supprimer
   * @returns Promise<{deleted: boolean}> Résultat de la suppression
   * @example
   * ```typescript
   * const { deleted } = await storage.delete('/documents/old-file.pdf');
   * if (deleted) console.log('File deleted successfully');
   * ```
   */
  delete(filePath: string): Promise<{ deleted: boolean }>;

  /**
   * Liste les fichiers dans un répertoire
   * @param directory - Répertoire à lister (optionnel)
   * @returns Promise<{files: StorageFileInfo[]}> Liste des fichiers
   * @example
   * ```typescript
   * const { files } = await storage.list('/documents');
   * files.forEach(file => {
   *   console.log(`${file.path} (${file.size} bytes)`);
   * });
   * ```
   */
  list(directory?: string): Promise<{
    files: StorageFileInfo[];
  }>;

  /**
   * Vérifie si un fichier existe
   * @param filePath - Chemin du fichier à vérifier
   * @returns Promise<boolean> True si le fichier existe
   * @example
   * ```typescript
   * if (await storage.exists('/documents/file.pdf')) {
   *   console.log('File exists');
   * }
   * ```
   */
  exists(filePath: string): Promise<boolean>;

  /**
   * Statistiques du stockage
   * @returns Statistiques d'utilisation
   * @example
   * ```typescript
   * const stats = await storage.getStats();
   * console.log(`Total files: ${stats.totalFiles}`);
   * console.log(`Total size: ${stats.totalSize} bytes`);
   * ```
   */
  getStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    cacheSize: number;
  }>;

  /**
   * Vide le cache des fichiers récemment accédés
   * @example
   * ```typescript
   * storage.clearCache();
   * console.log('Cache cleared');
   * ```
   */
  clearCache(): void;
}

// [Continuer avec les autres modules de la même manière...]

// Types pour les options et résultats
export interface AIGenerateOptions {
  /** Modèle IA à utiliser */
  model?: string;
  /** Nombre maximum de tokens à générer */
  maxTokens?: number;
  /** Créativité de la génération (0.0-1.0) */
  temperature?: number;
  /** Diversité du vocabulaire */
  topP?: number;
  /** Pénalité pour les répétitions */
  frequencyPenalty?: number;
  /** Pénalité pour les sujets récurrents */
  presencePenalty?: number;
}

export interface AIGenerateResult {
  /** Texte généré */
  text: string;
  /** Statistiques d'utilisation des tokens */
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  /** Métadonnées de génération */
  metadata: {
    model: string;
    processingTime: number;
    finishReason: string;
  };
}

export interface StorageSaveOptions {
  /** Chemin personnalisé pour le fichier */
  path?: string;
  /** Métadonnées personnalisées */
  metadata?: any;
  /** Chiffrer le fichier */
  encryption?: boolean;
  /** Compresser le fichier */
  compression?: boolean;
  /** Mettre en cache */
  cache?: boolean;
}

export interface StorageFileInfo {
  /** Chemin du fichier */
  path: string;
  /** Taille en octets */
  size: number;
  /** Hash du contenu */
  hash: string;
  /** Type MIME */
  mimeType?: string;
  /** Date de création */
  createdAt: number;
  /** Date de modification */
  modifiedAt: number;
  /** Métadonnées personnalisées */
  metadata?: any;
}

// Types de configuration et interfaces supplémentaires

/**
 * Configuration de l'identité visuelle de l'entreprise
 */
export interface BrandingConfig {
  /** Configuration du logo */
  logo?: LogoConfig;
  /** Nom de l'entreprise */
  companyName?: string;
  /** Couleur primaire */
  primaryColor?: string;
  /** Couleur secondaire */
  secondaryColor?: string;
  /** Thème visuel */
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Configuration du logo
 */
export interface LogoConfig {
  /** Chemin vers l'image du logo */
  path: string;
  /** Largeur du logo */
  width?: number;
  /** Hauteur du logo */
  height?: number;
  /** Texte alternatif */
  alt?: string;
  /** Format de l'image */
  format?: 'png' | 'svg' | 'jpg' | 'jpeg' | 'webp';
}

/**
 * Interface de base pour tous les modules
 */
export interface ModuleInterface {
  /** Nom du module */
  name: string;
  /** Version du module */
  version: string;
  /** Initialise le module */
  init(): Promise<void>;
  /** Détruit le module et libère les ressources */
  destroy(): Promise<void>;
}

/**
 * Runtime WebAssembly
 */
export interface RuntimeCore {
  /** Initialise le runtime */
  initialize(): Promise<void>;
  /** Appelle une méthode dans le runtime */
  call(method: string, ...args: any[]): Promise<any>;
  /** Détruit le runtime */
  destroy(): void;
}

/**
 * Types de frameworks supportés
 */
export type FrameworkType = 'react' | 'svelte' | 'nextjs' | 'vanilla';

/**
 * Module de gestion d'interface utilisateur
 */
export declare class UIManager {
  /**
   * Crée un nouveau composant UI
   * @param config - Configuration du composant (sans l'ID)
   * @returns Composant UI créé
   * @example
   * ```typescript
   * const button = ui.createComponent({
   *   type: 'button',
   *   props: { text: 'Click me', onClick: handleClick }
   * });
   * ```
   */
  createComponent(config: Omit<UIComponent, 'id'>): UIComponent;

  /**
   * Rend un composant en HTML
   * @param component - Composant à rendre
   * @returns Chaîne HTML
   * @example
   * ```typescript
   * const html = ui.render(button);
   * console.log(html);
   * ```
   */
  render(component: UIComponent): string;
}

/**
 * Module de gestion de projet
 */
export declare class ProjectManager {
  /**
   * Crée un nouveau projet
   * @param data - Données du projet (sans ID et dates)
   * @returns Projet créé
   * @example
   * ```typescript
   * const project = project.create({
   *   name: 'My Project',
   *   description: 'Project description',
   *   status: 'active'
   * });
   * ```
   */
  createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project;

  /**
   * Récupère un projet par son ID
   * @param id - ID du projet
   * @returns Projet ou undefined
   */
  getProject(id: string): Project | undefined;

  /**
   * Crée une nouvelle tâche dans un projet
   * @param projectId - ID du projet
   * @param data - Données de la tâche
   * @returns Tâche créée ou null
   * @example
   * ```typescript
   * const task = project.createTask('project-123', {
   *   title: 'New task',
   *   description: 'Task description',
   *   status: 'todo'
   * });
   * ```
   */
  createTask(projectId: string, data: Omit<Task, 'id' | 'projectId'>): Task | null;

  /**
   * Récupère toutes les tâches d'un projet
   * @param projectId - ID du projet
   * @returns Liste des tâches
   */
  getProjectTasks(projectId: string): Task[];
}

/**
 * Module d'authentification
 */
export declare class AuthManager {
  /**
   * Authentifie un utilisateur
   * @param credentials - Identifiants de l'utilisateur
   * @returns Utilisateur authentifié ou null
   * @example
   * ```typescript
   * const user = await auth.authenticate({
   *   email: 'user@example.com',
   *   password: 'password123'
   * });
   * ```
   */
  authenticate(credentials: Record<string, any>): Promise<User | null>;

  /**
   * Vérifie les autorisations d'un utilisateur
   * @param user - Utilisateur à vérifier
   * @param resource - Ressource à accéder
   * @param action - Action à effectuer
   * @returns True si autorisé
   * @example
   * ```typescript
   * const canEdit = await auth.authorize(user, 'project-123', 'edit');
   * ```
   */
  authorize(user: User, resource: string, action: string): Promise<boolean>;
}

/**
 * Module SDK auto-référentiel
 */
export declare class SDK implements ModuleInterface {
  /** Nom du SDK */
  name: string;
  /** Version du SDK */
  version: string;

  /**
   * Initialise le module SDK
   */
  init(): Promise<void>;

  /**
   * Détruit le module SDK
   */
  destroy(): Promise<void>;

  /**
   * Crée une référence auto-référentielle
   * @returns Instance du SDK auto-référentiel
   * @example
   * ```typescript
   * const selfRef = await sdk.createSelfReference();
   * console.log('Self-reference created:', selfRef.getMetaInfo());
   * ```
   */
  createSelfReference(): Promise<SDK>;

  /**
   * Récupère les métadonnées du SDK
   * @returns Métadonnées complètes
   */
  getMetaInfo(): SDKMetaInfo;

  /**
   * Récupère les SDK enfants
   * @returns Liste des SDK enfants
   */
  getChildSDKs(): SDK[];

  /**
   * Récupère le SDK parent
   * @returns SDK parent ou null
   */
  getParentSDK(): EnterpriseSDK | null;

  /**
   * Exécute une fonction sur toute la hiérarchie
   * @param fn - Fonction à exécuter
   * @returns Résultats de chaque exécution
   */
  executeOnHierarchy<T>(fn: (sdk: SDK, depth: number) => Promise<T>): Promise<T[]>;

  /**
   * Statistiques de la hiérarchie
   * @returns Statistiques détaillées
   */
  getHierarchyStats(): {
    totalSDKs: number;
    maxDepth: number;
    currentDepth: number;
    isRecursive: boolean;
  };

  /**
   * Nettoie toute la hiérarchie
   */
  cleanupHierarchy(): Promise<void>;
}

// Types pour les options et résultats (suite)

export interface AIEnhanceOptions {
  /** Qualité de l'amélioration */
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  /** Format de sortie */
  format?: 'jpeg' | 'png' | 'webp';
  /** Activer l'upscaling */
  upscale?: boolean;
  /** Activer le débruitage */
  denoise?: boolean;
}

export interface AIEnhanceResult {
  /** True si l'amélioration a réussi */
  enhanced: boolean;
  /** Données de l'image améliorée */
  data: any;
  /** Métadonnées du traitement */
  metadata: {
    originalSize: number;
    enhancedSize: number;
    processingTime: number;
    algorithm: string;
    quality: string;
  };
}

export interface AIAnalyzeOptions {
  /** Type d'analyse */
  type?: 'sentiment' | 'entities' | 'keywords' | 'summary' | 'comprehensive';
  /** Langue des données */
  language?: string;
}

export interface AIAnalyzeResult {
  /** Résultats de l'analyse */
  insights: any[];
  /** Score de confiance */
  confidence: number;
  /** Métadonnées de l'analyse */
  metadata: {
    analysisType: string;
    processingTime: number;
    model: string;
  };
}

export interface StorageLoadOptions {
  /** Déchiffrer le fichier */
  decrypt?: boolean;
  /** Utiliser le cache */
  cache?: boolean;
  /** Version spécifique */
  version?: string;
}

export interface UIComponent {
  /** ID unique du composant */
  id: string;
  /** Type de composant */
  type: string;
  /** Propriétés du composant */
  props: Record<string, any>;
  /** Composants enfants */
  children?: UIComponent[];
}

export interface Theme {
  /** Palette de couleurs */
  colors: Record<string, string>;
  /** Configuration typographique */
  typography: Record<string, any>;
  /** Espacement */
  spacing: Record<string, string>;
}

export interface AuthConfig {
  /** Fournisseur d'authentification */
  provider: 'local' | 'oauth' | 'saml';
  /** Configuration spécifique au fournisseur */
  credentials?: Record<string, any>;
}

export interface User {
  /** ID unique */
  id: string;
  /** Email */
  email: string;
  /** Nom complet */
  name: string;
  /** Rôles de l'utilisateur */
  roles: string[];
}

export interface Project {
  /** ID unique */
  id: string;
  /** Nom du projet */
  name: string;
  /** Description */
  description: string;
  /** Statut */
  status: 'active' | 'completed' | 'archived';
  /** Date de création */
  createdAt: Date;
  /** Date de modification */
  updatedAt: Date;
}

export interface Task {
  /** ID unique */
  id: string;
  /** ID du projet parent */
  projectId: string;
  /** Titre de la tâche */
  title: string;
  /** Description */
  description: string;
  /** Statut */
  status: 'todo' | 'in-progress' | 'completed';
  /** Assigné à */
  assignee?: string;
  /** Date d'échéance */
  dueDate?: Date;
}

export interface SDKMetaInfo {
  /** Version du SDK */
  version: string;
  /** Nom du SDK */
  name: string;
  /** Description */
  description: string;
  /** Est auto-référentiel */
  isSelfReferencing: boolean;
  /** Profondeur de récursion */
  recursionDepth: number;
}

export interface SDKSelfReferenceOptions {
  /** Activer la récursion */
  enableRecursion?: boolean;
  /** Profondeur maximale */
  maxRecursionDepth?: number;
  /** Suivre les métadonnées */
  trackMetadata?: boolean;
}
