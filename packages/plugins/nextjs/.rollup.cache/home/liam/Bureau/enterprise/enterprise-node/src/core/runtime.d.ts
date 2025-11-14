import { RuntimeCore } from '../types';
export declare class WasmRuntime implements RuntimeCore {
    private wasmModule;
    private wasmInstance;
    private isInitialized;
    initialize(): Promise<void>;
    call(method: string, ...args: any[]): Promise<any>;
    destroy(): void;
    private createImportObject;
    private simulateCall;
}
//# sourceMappingURL=runtime.d.ts.map