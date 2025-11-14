import { ModuleInterface } from '../../types';
import { WasmRuntime } from '../../core/runtime';
export declare class Ai implements ModuleInterface {
    name: string;
    version: string;
    private runtime;
    constructor(runtime: WasmRuntime);
    init(): Promise<void>;
    destroy(): Promise<void>;
    enhance(image: File | ArrayBuffer | string): Promise<{
        enhanced: boolean;
        data: any;
        metadata?: any;
    }>;
    generate(prompt: string, options?: {
        maxTokens?: number;
        temperature?: number;
        model?: string;
    }): Promise<{
        text: string;
        usage?: any;
        metadata?: any;
    }>;
    analyze(data: any): Promise<{
        insights: any[];
        confidence: number;
    }>;
}
export default Ai;
//# sourceMappingURL=index.d.ts.map