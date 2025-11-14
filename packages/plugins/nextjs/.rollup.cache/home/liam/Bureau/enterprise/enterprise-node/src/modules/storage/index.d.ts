import { ModuleInterface } from '../../types';
import { WasmRuntime } from '../../core/runtime';
export declare class Storage implements ModuleInterface {
    name: string;
    version: string;
    private runtime;
    private cache;
    constructor(runtime: WasmRuntime);
    init(): Promise<void>;
    destroy(): Promise<void>;
    save(file: File | ArrayBuffer | string, options?: {
        path?: string;
        metadata?: any;
    }): Promise<{
        path: string;
        size: number;
        hash?: string;
    }>;
    load(filePath: string): Promise<{
        data: any;
        metadata?: any;
    }>;
    delete(filePath: string): Promise<{
        deleted: boolean;
    }>;
    list(directory?: string): Promise<{
        files: Array<{
            path: string;
            size: number;
            modified: number;
        }>;
    }>;
    private getFileName;
    private getFileSize;
    private generateHash;
}
export default Storage;
//# sourceMappingURL=index.d.ts.map