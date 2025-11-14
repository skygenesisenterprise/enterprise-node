// import { ModuleInterface } from '@skygenesisenterprise/shared';
// import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';
export class SDK {
    constructor(options = {}) {
        this.name = 'sdk';
        this.version = '0.1.0';
        this.parentSDK = null;
        this.childSDKs = [];
        this.options = {
            enableRecursion: true,
            maxRecursionDepth: 3,
            trackMetadata: true,
            ...options,
        };
        this.metaInfo = {
            version: this.version,
            name: 'Enterprise SDK Module',
            description: 'Auto-référence et méta-sdk',
            isSelfReferencing: true,
            recursionDepth: 0,
        };
    }
    async init() {
        console.log('🔄 Initializing SDK module with self-reference capability...');
        try {
            // Auto-référence : créer une instance du SDK parent
            if (this.options.enableRecursion &&
                this.metaInfo.recursionDepth < (this.options.maxRecursionDepth || 3)) {
                await this.createSelfReference();
            }
            console.log(`✅ SDK module initialized (depth: ${this.metaInfo.recursionDepth})`);
        }
        catch (error) {
            console.error('❌ Failed to initialize SDK module:', error);
            throw error;
        }
    }
    async destroy() {
        console.log('🔄 Destroying SDK module...');
        // Détruire tous les SDK enfants
        for (const child of this.childSDKs) {
            await child.destroy();
        }
        this.childSDKs = [];
        // Détruire la référence parente
        this.parentSDK = null;
        console.log('✅ SDK module destroyed');
    }
    isInitialized() {
        return this.parentSDK !== null || this.childSDKs.length > 0;
    }
    // Fonctionnalité d'auto-référence
    async createSelfReference() {
        if (!this.options.enableRecursion) {
            throw new Error('Self-reference is disabled');
        }
        if (this.metaInfo.recursionDepth >= (this.options.maxRecursionDepth || 3)) {
            console.warn('⚠️ Maximum recursion depth reached');
            return this;
        }
        try {
            // Créer une nouvelle instance du SDK avec une profondeur incrémentée
            const childSDK = new SDK({
                ...this.options,
                maxRecursionDepth: (this.options.maxRecursionDepth || 3) - 1,
            });
            childSDK.metaInfo.recursionDepth = this.metaInfo.recursionDepth + 1;
            // Initialiser le SDK enfant
            await childSDK.init();
            this.childSDKs.push(childSDK);
            console.log(`🔗 Created self-reference at depth ${childSDK.metaInfo.recursionDepth}`);
            return childSDK;
        }
        catch (error) {
            console.error('❌ Failed to create self-reference:', error);
            throw error;
        }
    }
    // Obtenir des informations sur le SDK
    getMetaInfo() {
        return {
            ...this.metaInfo,
            childCount: this.childSDKs.length,
            hasParent: this.parentSDK !== null,
        };
    }
    // Obtenir tous les SDK enfants
    getChildSDKs() {
        return [...this.childSDKs];
    }
    // Obtenir le SDK parent
    getParentSDK() {
        return this.parentSDK;
    }
    // Exécuter une fonction sur tous les SDK de la hiérarchie
    async executeOnHierarchy(fn) {
        const results = [];
        // Exécuter sur le SDK actuel
        results.push(await fn(this, this.metaInfo.recursionDepth));
        // Exécuter récursivement sur les enfants
        for (const child of this.childSDKs) {
            const childResults = await child.executeOnHierarchy(fn);
            results.push(...childResults);
        }
        return results;
    }
    // Obtenir des statistiques sur la hiérarchie
    getHierarchyStats() {
        let totalSDKs = 1; // Compter le SDK actuel
        let maxDepth = this.metaInfo.recursionDepth;
        for (const child of this.childSDKs) {
            const childStats = child.getHierarchyStats();
            totalSDKs += childStats.totalSDKs;
            maxDepth = Math.max(maxDepth, childStats.maxDepth);
        }
        return {
            totalSDKs,
            maxDepth,
            currentDepth: this.metaInfo.recursionDepth,
            isRecursive: this.childSDKs.length > 0,
        };
    }
    // Nettoyer la hiérarchie
    async cleanupHierarchy() {
        // Détruire tous les enfants
        for (const child of this.childSDKs) {
            await child.destroy();
        }
        this.childSDKs = [];
        console.log('🧹 SDK hierarchy cleaned up');
    }
}
export const manifest = {
    name: 'sdk',
    version: '0.1.0',
    description: 'Enterprise SDK Module - Auto-référence et méta-sdk',
    author: 'Sky Genesis Enterprise',
    dependencies: ['@skygenesisenterprise/shared', '@skygenesisenterprise/enterprise-node'],
    exports: {
        '.': './index.js',
    },
    runtime: 'hybrid',
};
export default SDK;
//# sourceMappingURL=index.js.map