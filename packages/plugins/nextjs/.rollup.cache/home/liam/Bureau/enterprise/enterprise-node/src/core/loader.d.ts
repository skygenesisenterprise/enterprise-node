import { EnterpriseConfig, FrameworkType, ModuleInterface } from '../types';
import { WasmRuntime } from './runtime';
export declare class ModuleLoader {
    private config;
    private runtime;
    private loadedModules;
    private framework;
    constructor(config: EnterpriseConfig);
    initialize(): Promise<void>;
    private loadModule;
    private detectFramework;
    getModule(name: string): ModuleInterface | undefined;
    getRuntime(): WasmRuntime;
    getFramework(): FrameworkType;
    destroy(): Promise<void>;
}
