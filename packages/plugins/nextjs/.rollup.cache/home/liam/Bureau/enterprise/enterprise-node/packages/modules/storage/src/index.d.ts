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
export declare class Storage {
    name: string;
    version: string;
    private cache;
    private isInitializedModule;
    constructor();
    init(): Promise<void>;
    destroy(): Promise<void>;
    isInitialized(): boolean;
    save(file: File | ArrayBuffer | string, options?: StorageSaveOptions): Promise<{
        path: string;
        size: number;
        hash: string;
    }>;
    load(filePath: string, options?: StorageLoadOptions): Promise<{
        data: any;
        metadata?: any;
    }>;
    delete(filePath: string): Promise<{
        deleted: boolean;
    }>;
    list(_directory?: string): Promise<{
        files: StorageFileInfo[];
    }>;
    exists(filePath: string): Promise<boolean>;
    getStats(): Promise<{
        totalFiles: number;
        totalSize: number;
        cacheSize: number;
    }>;
    clearCache(): void;
    private getFileName;
    private getFileSize;
    private generateHash;
    private ensureInitialized;
}
export declare const manifest: {
    name: string;
    version: string;
    description: string;
    author: string;
    dependencies: any[];
    exports: {
        '.': string;
    };
    runtime: "hybrid";
};
export default Storage;
//# sourceMappingURL=index.d.ts.map