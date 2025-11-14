interface ModuleInterface {
    name: string;
    version: string;
    init(): Promise<void>;
    destroy(): Promise<void>;
}
declare class EnterpriseSDK {
}
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
export declare const manifest: {
    name: string;
    version: string;
    description: string;
    author: string;
    dependencies: string[];
    exports: {
        '.': string;
    };
    runtime: "hybrid";
};
export default SDK;
//# sourceMappingURL=index.d.ts.map