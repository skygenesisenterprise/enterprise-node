// Main entry point for @skygenesisenterprise/enterprise-node
// This file provides a unified import interface for the entire SDK

// Core SDK exports
export { EnterpriseSDK, Enterprise, createEnterprise } from './src/index';

// Module classes for direct usage
export { Ai, Storage, UIManager, AuthManager, ProjectManager, SDK } from './src/index';

// Type exports
export type {
  EnterpriseConfig,
  BrandingConfig,
  LogoConfig,
  ModuleInterface,
  RuntimeCore,
  FrameworkType,
} from './src/types';

export type {
  AIEnhanceOptions,
  AIGenerateOptions,
  AIAnalyzeOptions,
  AIEnhanceResult,
  AIGenerateResult,
  AIAnalyzeResult,
} from './packages/modules/ai/src/index';

export type {
  StorageSaveOptions,
  StorageLoadOptions,
  StorageFileInfo,
} from './packages/modules/storage/src/index';

export type { UIComponent, Theme } from './packages/modules/ui/src/index';

export type { AuthConfig, User } from './packages/modules/auth/src/index';

export type { Project, Task } from './packages/modules/project/src/index';

export type { SDKMetaInfo, SDKSelfReferenceOptions } from './packages/modules/sdk/src/index';

// Hook exports
export * from './src/hooks';

// Plugin System exports
export * from './packages/core/src/plugin-system/types';
export { PluginManager } from './packages/core/src/plugin-system/plugin-manager';

// Default export - the main SDK instance
export { default } from './src/index';
