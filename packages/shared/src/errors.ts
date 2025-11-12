import { EnterpriseError } from './types';

export class EnterpriseSDKError extends Error implements EnterpriseError {
  constructor(
    message: string,
    public code: string,
    public module?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'EnterpriseSDKError';
  }
}

export class ModuleNotFoundError extends EnterpriseSDKError {
  constructor(moduleName: string) {
    super(
      `Module '${moduleName}' not found or not loaded`,
      'MODULE_NOT_FOUND',
      moduleName
    );
  }
}

export class InitializationError extends EnterpriseSDKError {
  constructor(module: string, cause: Error) {
    super(
      `Failed to initialize module '${module}': ${cause.message}`,
      'INITIALIZATION_ERROR',
      module,
      { cause }
    );
  }
}

export class RuntimeError extends EnterpriseSDKError {
  constructor(method: string, cause: Error) {
    super(
      `Runtime error calling method '${method}': ${cause.message}`,
      'RUNTIME_ERROR',
      'runtime',
      { method, cause }
    );
  }
}

export class ConfigurationError extends EnterpriseSDKError {
  constructor(message: string, field?: string) {
    super(
      `Configuration error: ${message}`,
      'CONFIGURATION_ERROR',
      'config',
      { field }
    );
  }
}