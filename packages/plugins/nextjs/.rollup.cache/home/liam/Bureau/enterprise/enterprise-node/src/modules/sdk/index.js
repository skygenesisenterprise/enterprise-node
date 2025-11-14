export class SDK {
    constructor() {
        this.name = 'sdk';
        this.version = '0.1.0';
        this.isInitializedModule = false;
    }
    async init() {
        console.log('🔄 Initializing SDK module with self-reference capability...');
        try {
            this.isInitializedModule = true;
            console.log('✅ SDK module initialized');
        }
        catch (error) {
            console.error('❌ Failed to initialize SDK module:', error);
            throw error;
        }
    }
    async destroy() {
        console.log('🔄 Destroying SDK module...');
        this.isInitializedModule = false;
        console.log('✅ SDK module destroyed');
    }
    isInitialized() {
        return this.isInitializedModule;
    }
    // Auto-référence simple
    getSelfReference() {
        return 'SDK Module - Self-referential instance';
    }
    // Obtenir des informations sur le SDK
    getMetaInfo() {
        return {
            version: this.version,
            name: this.name,
            isSelfReferencing: true,
        };
    }
}
export const manifest = {
    name: 'sdk',
    version: '0.1.0',
    description: 'Enterprise SDK Module - Auto-référence et méta-sdk',
    author: 'Sky Genesis Enterprise',
    dependencies: [],
    exports: {
        '.': './index.js',
    },
    runtime: 'hybrid',
};
export default SDK;
//# sourceMappingURL=index.js.map