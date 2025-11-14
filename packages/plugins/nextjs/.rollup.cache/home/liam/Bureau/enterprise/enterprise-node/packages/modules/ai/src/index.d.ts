export interface AIEnhanceOptions {
    quality?: 'low' | 'medium' | 'high' | 'ultra';
    format?: 'jpeg' | 'png' | 'webp';
    upscale?: boolean;
    denoise?: boolean;
}
export interface AIGenerateOptions {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
}
export interface AIAnalyzeOptions {
    type?: 'sentiment' | 'entities' | 'keywords' | 'summary' | 'comprehensive';
    language?: string;
}
export interface AIEnhanceResult {
    enhanced: boolean;
    data: any;
    metadata: {
        originalSize: number;
        enhancedSize: number;
        processingTime: number;
        algorithm: string;
        quality: string;
    };
}
export interface AIGenerateResult {
    text: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    metadata: {
        model: string;
        processingTime: number;
        finishReason: string;
    };
}
export interface AIAnalyzeResult {
    insights: any[];
    confidence: number;
    metadata: {
        analysisType: string;
        processingTime: number;
        model: string;
    };
}
export declare class Ai {
    name: string;
    version: string;
    private isInitializedModule;
    constructor();
    init(): Promise<void>;
    destroy(): Promise<void>;
    isInitialized(): boolean;
    enhance(image: File | ArrayBuffer | string, options?: AIEnhanceOptions): Promise<AIEnhanceResult>;
    generate(prompt: string, options?: AIGenerateOptions): Promise<AIGenerateResult>;
    analyze(_data: any, options?: AIAnalyzeOptions): Promise<AIAnalyzeResult>;
    getModels(): Promise<{
        models: Array<{
            id: string;
            name: string;
            type: 'text' | 'image' | 'multimodal';
            capabilities: string[];
        }>;
    }>;
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
export default Ai;
//# sourceMappingURL=index.d.ts.map