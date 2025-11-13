import { EnterpriseError } from './types';
export declare class EnterpriseSDKError extends Error implements EnterpriseError {
    code: string;
    module?: string | undefined;
    details?: any | undefined;
    constructor(message: string, code: string, module?: string | undefined, details?: any | undefined);
}
export declare class ModuleNotFoundError extends EnterpriseSDKError {
    constructor(moduleName: string);
}
export declare class InitializationError extends EnterpriseSDKError {
    constructor(module: string, cause: Error);
}
export declare class RuntimeError extends EnterpriseSDKError {
    constructor(method: string, cause: Error);
}
export declare class ConfigurationError extends EnterpriseSDKError {
    constructor(message: string, field?: string);
}
