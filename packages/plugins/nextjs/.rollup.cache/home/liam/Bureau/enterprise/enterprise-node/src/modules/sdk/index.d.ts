import { ModuleInterface } from '../../types';
export declare class SDK implements ModuleInterface {
    name: string;
    version: string;
    private isInitializedModule;
    constructor();
    init(): Promise<void>;
    destroy(): Promise<void>;
    isInitialized(): boolean;
    getSelfReference(): string;
    getMetaInfo(): {
        version: string;
        name: string;
        isSelfReferencing: boolean;
    };
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
export default SDK;
//# sourceMappingURL=index.d.ts.map