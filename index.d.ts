// Type declaration file for @skygenesisenterprise/enterprise-node
// This file provides TypeScript definitions for the unified SDK export

// Core SDK exports
export declare class EnterpriseSDK {
  private loader;
  private config;
  private isInitialized;
  constructor(userConfig?: Partial<EnterpriseConfig>);
  initialize(): Promise<void>;
  get ai(): any;
  get storage(): any;
  get ui(): any;
  get project(): any;
  get auth(): any;
  get sdk(): any;
  get runtime(): any;
  get framework(): any;
  getConfig(): EnterpriseConfig;
  updateConfig(updates: Partial<EnterpriseConfig>): void;
  destroy(): Promise<void>;
}

export declare const Enterprise: EnterpriseSDK;

export declare function createEnterprise(
  config?: Partial<EnterpriseConfig>
): Promise<EnterpriseSDK>;

// Module classes
export declare class Ai {
  name: string;
  version: string;
  constructor();
  init(): Promise<void>;
  destroy(): Promise<void>;
  isInitialized(): boolean;
  enhance(image: File | ArrayBuffer | string, options?: AIEnhanceOptions): Promise<AIEnhanceResult>;
  generate(prompt: string, options?: AIGenerateOptions): Promise<AIGenerateResult>;
  analyze(data: any, options?: AIAnalyzeOptions): Promise<AIAnalyzeResult>;
  getModels(): Promise<{
    models: Array<{
      id: string;
      name: string;
      type: 'text' | 'image' | 'multimodal';
      capabilities: string[];
    }>;
  }>;
}

export declare class Storage {
  name: string;
  version: string;
  constructor();
  init(): Promise<void>;
  destroy(): Promise<void>;
  isInitialized(): boolean;
  save(
    file: File | ArrayBuffer | string,
    options?: StorageSaveOptions
  ): Promise<{ path: string; size: number; hash: string }>;
  load(filePath: string, options?: StorageLoadOptions): Promise<{ data: any; metadata?: any }>;
  delete(filePath: string): Promise<{ deleted: boolean }>;
  list(directory?: string): Promise<{
    files: StorageFileInfo[];
  }>;
  exists(filePath: string): Promise<boolean>;
  getStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    cacheSize: number;
  }>;
  clearCache(): void;
}

export declare class UIManager {
  private theme;
  constructor(theme: Theme);
  createComponent(config: Omit<UIComponent, 'id'>): UIComponent;
  render(component: UIComponent): string;
}

export declare class AuthManager {
  private config;
  constructor(config: AuthConfig);
  authenticate(credentials: Record<string, any>): Promise<User | null>;
  authorize(user: User, resource: string, action: string): Promise<boolean>;
}

export declare class ProjectManager {
  private projects;
  private tasks;
  createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project;
  getProject(id: string): Project | undefined;
  createTask(projectId: string, data: Omit<Task, 'id' | 'projectId'>): Task | null;
  getProjectTasks(projectId: string): Task[];
}

export declare class SDK implements ModuleInterface {
  name: string;
  version: string;
  private parentSDK;
  private childSDKs;
  private metaInfo;
  private options;
  constructor(options?: SDKSelfReferenceOptions);
  init(): Promise<void>;
  destroy(): Promise<void>;
  isInitialized(): boolean;
  createSelfReference(): Promise<SDK>;
  getMetaInfo(): SDKMetaInfo;
  getChildSDKs(): SDK[];
  getParentSDK(): EnterpriseSDK | null;
  executeOnHierarchy<T>(fn: (sdk: SDK, depth: number) => Promise<T>): Promise<T[]>;
  getHierarchyStats(): {
    totalSDKs: number;
    maxDepth: number;
    currentDepth: number;
    isRecursive: boolean;
  };
  cleanupHierarchy(): Promise<void>;
}

// Core Types
export interface EnterpriseConfig {
  modules: {
    ai?: boolean;
    storage?: boolean;
    ui?: boolean;
    project?: boolean;
    auth?: boolean;
    sdk?: boolean;
  };
  runtime?: {
    wasmPath?: string;
    enableWasm?: boolean;
  };
  framework?: 'react' | 'svelte' | 'nextjs' | 'auto';
  debug?: boolean;
  branding?: BrandingConfig;
}

export interface BrandingConfig {
  logo?: LogoConfig;
  companyName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export interface LogoConfig {
  path: string;
  width?: number;
  height?: number;
  alt?: string;
  format?: 'png' | 'svg' | 'jpg' | 'jpeg' | 'webp';
}

export interface ModuleInterface {
  name: string;
  version: string;
  init(): Promise<void>;
  destroy(): Promise<void>;
}

export interface RuntimeCore {
  initialize(): Promise<void>;
  call(method: string, ...args: any[]): Promise<any>;
  destroy(): void;
}

export type FrameworkType = 'react' | 'svelte' | 'nextjs' | 'vanilla';

// AI Module Types
export interface AIEnhanceOptions {
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  format?: 'jpeg' | 'png' | 'webp';
  upscale?: boolean;
  denoise?: boolean;
}

export interface AIGenerateOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AIAnalyzeOptions {
  type?: 'sentiment' | 'entities' | 'keywords' | 'summary' | 'comprehensive';
  language?: string;
}

export interface AIEnhanceResult {
  enhanced: boolean;
  data: any;
  metadata: {
    originalSize: number;
    enhancedSize: number;
    processingTime: number;
    algorithm: string;
    quality: string;
  };
}

export interface AIGenerateResult {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata: {
    model: string;
    processingTime: number;
    finishReason: string;
  };
}

export interface AIAnalyzeResult {
  insights: any[];
  confidence: number;
  metadata: {
    analysisType: string;
    processingTime: number;
    model: string;
  };
}

// Storage Module Types
export interface StorageSaveOptions {
  path?: string;
  metadata?: any;
  encryption?: boolean;
  compression?: boolean;
  cache?: boolean;
}

export interface StorageLoadOptions {
  decrypt?: boolean;
  cache?: boolean;
  version?: string;
}

export interface StorageFileInfo {
  path: string;
  size: number;
  hash: string;
  mimeType?: string;
  createdAt: number;
  modifiedAt: number;
  metadata?: any;
}

// UI Module Types
export interface UIComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: UIComponent[];
}

export interface Theme {
  colors: Record<string, string>;
  typography: Record<string, any>;
  spacing: Record<string, string>;
}

// Auth Module Types
export interface AuthConfig {
  provider: 'local' | 'oauth' | 'saml';
  credentials?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

// Project Module Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignee?: string;
  dueDate?: Date;
}

// SDK Module Types
export interface SDKMetaInfo {
  version: string;
  name: string;
  description: string;
  isSelfReferencing: boolean;
  recursionDepth: number;
}

export interface SDKSelfReferenceOptions {
  enableRecursion?: boolean;
  maxRecursionDepth?: number;
  trackMetadata?: boolean;
}

// Default export
declare const _default: EnterpriseSDK;
export default _default;
