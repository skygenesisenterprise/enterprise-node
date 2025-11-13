// Define module interfaces inline
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
  model?: string;
  detail?: 'low' | 'medium' | 'high';
}

export interface AIEnhanceResult {
  success: boolean;
  enhanced: boolean;
  data?: any;
  error?: string;
  metadata?: {
    originalSize?: number;
    enhancedSize?: number;
    algorithm?: string;
  };
}

export interface AIGenerateResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
  };
}

export interface AIAnalyzeResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    model?: string;
    confidence?: number;
    processingTime?: number;
  };
}

export interface AiModule {
  enhance(image: any, options?: AIEnhanceOptions): Promise<AIEnhanceResult>;
  generate(prompt: string, options?: AIGenerateOptions): Promise<AIGenerateResult>;
  analyze(data: any, options?: AIAnalyzeOptions): Promise<AIAnalyzeResult>;
  getModels(): Promise<any>;
}

export interface StorageModule {
  save(file: any, options?: any): Promise<any>;
  load(path: string, options?: any): Promise<any>;
  delete(path: string): Promise<any>;
  list(directory?: string): Promise<any>;
}

export interface UiModule {
  notify(message: string, options?: any): Promise<any>;
  modal(options?: any): Promise<any>;
  toast(message: string, type?: any): Promise<any>;
}

export interface ProjectModule {
  create(name: string, options?: any): Promise<any>;
  open(projectIdOrName: string): Promise<any>;
  save(projectId?: string): Promise<any>;
  delete(projectId: string): Promise<any>;
  getCurrentProject?(): any;
}

export interface AuthModule {
  login(credentials: any): Promise<any>;
  logout(): Promise<any>;
  register(userData: any): Promise<any>;
  getCurrentUser?(): any;
  isAuthenticated?(): boolean;
}

export declare class EnterpriseSDK {
  _isInitialized: boolean;
  _initializationPromise: Promise<void> | null;
  constructor(_userConfig?: any);
  initialize(): Promise<void>;
  private _initialize;
  get ai(): AiModule | null;
  get storage(): StorageModule | null;
  get ui(): UiModule | null;
  get project(): ProjectModule | null;
  get auth(): AuthModule | null;
  get runtime(): any;
  get framework(): any;
  getConfig(): any;
  updateConfig(_updates: any): void;
  getDiagnostics(): any;
  exportDiagnosticReport(): string;
  reloadModule(_name: string): Promise<void>;
  destroy(): Promise<void>;
  private ensureInitialized;
  static create(userConfig?: any): Promise<EnterpriseSDK>;
  static getInstance(): EnterpriseSDK;
}
declare const Enterprise: EnterpriseSDK;
export { Enterprise };
export { PluginManager } from './plugins/plugin-manager';
export * from '@skygenesisenterprise/shared';
