// import { ModuleInterface, EnterpriseConfig } from '@skygenesisenterprise/shared';
// import { WasmRuntime } from '@skygenesisenterprise/core';
// import { Logger } from '@skygenesisenterprise/shared';
export class Storage {
    constructor() {
        this.name = 'storage';
        this.version = '0.1.0';
        // private runtime: WasmRuntime;
        // private config: EnterpriseConfig;
        // private logger = Logger.getInstance();
        this.cache = new Map();
        this.isInitializedModule = false;
        // this.runtime = runtime;
        // this.config = config;
    }
    async init() {
        // this.logger.info('storage', 'Initializing Storage module...');
        try {
            // await this.runtime.call('storage_init', this.config.modules.storage);
            this.isInitializedModule = true;
            // this.logger.info('storage', 'Storage module initialized successfully');
        }
        catch (error) {
            // this.logger.error('storage', 'Failed to initialize Storage module', { error });
            throw error;
        }
    }
    async destroy() {
        // this.logger.info('storage', 'Destroying Storage module...');
        try {
            // await this.runtime.call('storage_destroy');
            this.cache.clear();
            this.isInitializedModule = false;
            // this.logger.info('storage', 'Storage module destroyed');
        }
        catch (error) {
            // this.logger.error('storage', 'Error destroying Storage module', { error });
        }
    }
    isInitialized() {
        return this.isInitializedModule;
    }
    async save(file, options = {}) {
        this.ensureInitialized();
        // const startTime = performance.now();
        // this.logger.debug('storage', 'Saving file', { options });
        try {
            const path = options.path || `/storage/${Date.now()}_${this.getFileName(file)}`;
            const size = this.getFileSize(file);
            // const result = await this.runtime.call('storage_save', file, {
            //   path,
            //   metadata: options.metadata,
            //   encryption: options.encryption || false,
            //   compression: options.compression || false,
            //   cache: options.cache !== false,
            //   ...options
            // });
            if (options.cache !== false) {
                this.cache.set(path, {
                    data: file,
                    metadata: options.metadata,
                    timestamp: Date.now(),
                });
            }
            // const processingTime = performance.now() - startTime;
            // this.logger.info('storage', 'File saved successfully', {
            //   path,
            //   size,
            //   processingTime
            // });
            return {
                path: path,
                size,
                hash: this.generateHash(file),
            };
        }
        catch (error) {
            // this.logger.error('storage', 'Failed to save file', { error });
            throw new Error(`Storage save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async load(filePath, options = {}) {
        this.ensureInitialized();
        // this.logger.debug('storage', 'Loading file', { filePath, options });
        try {
            // Check cache first
            if (options.cache !== false) {
                const cached = this.cache.get(filePath);
                if (cached) {
                    // this.logger.debug('storage', 'File loaded from cache', { filePath });
                    return {
                        data: cached.data,
                        metadata: cached.metadata,
                    };
                }
            }
            // const result = await this.runtime.call('storage_load', filePath, {
            //   decrypt: options.decrypt || false,
            //   cache: options.cache !== false,
            //   version: options.version,
            //   ...options
            // });
            // this.logger.info('storage', 'File loaded successfully', { filePath });
            throw new Error('File not found');
        }
        catch (error) {
            // this.logger.error('storage', 'Failed to load file', { error, filePath });
            throw new Error(`Storage load failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async delete(filePath) {
        this.ensureInitialized();
        // this.logger.debug('storage', 'Deleting file', { filePath });
        try {
            this.cache.delete(filePath);
            // await this.runtime.call('storage_delete', filePath);
            // this.logger.info('storage', 'File deleted successfully', { filePath });
            return { deleted: true };
        }
        catch (error) {
            // this.logger.error('storage', 'Failed to delete file', { error, filePath });
            return { deleted: false };
        }
    }
    async list(_directory) {
        this.ensureInitialized();
        try {
            // const result = await this.runtime.call('storage_list', directory);
            // Combine with cached files
            const cachedFiles = Array.from(this.cache.entries()).map(([path, cached]) => ({
                path,
                size: this.getFileSize(cached.data),
                hash: this.generateHash(cached.data),
                createdAt: cached.timestamp,
                modifiedAt: cached.timestamp,
                metadata: cached.metadata,
            }));
            const allFiles = [...cachedFiles];
            return {
                files: allFiles.sort((a, b) => b.modifiedAt - a.modifiedAt),
            };
        }
        catch (error) {
            // this.logger.error('storage', 'Failed to list files', { error, directory });
            return { files: [] };
        }
    }
    async exists(filePath) {
        this.ensureInitialized();
        try {
            if (this.cache.has(filePath)) {
                return true;
            }
            // const result = await this.runtime.call('storage_exists', filePath);
            return false;
        }
        catch (error) {
            // this.logger.error('storage', 'Failed to check file existence', { error, filePath });
            return false;
        }
    }
    async getStats() {
        this.ensureInitialized();
        try {
            // const result = await this.runtime.call('storage_stats');
            const cacheSize = Array.from(this.cache.values()).reduce((total, cached) => {
                return total + this.getFileSize(cached.data);
            }, 0);
            return {
                totalFiles: 0,
                totalSize: 0,
                cacheSize,
            };
        }
        catch (error) {
            // this.logger.error('storage', 'Failed to get storage stats', { error });
            return {
                totalFiles: 0,
                totalSize: 0,
                cacheSize: 0,
            };
        }
    }
    clearCache() {
        this.cache.clear();
        // this.logger.debug('storage', 'Cache cleared');
    }
    getFileName(file) {
        if (file instanceof File)
            return file.name;
        if (typeof file === 'string')
            return file.split('/').pop() || 'unknown';
        return `file_${Date.now()}`;
    }
    getFileSize(file) {
        if (file instanceof File)
            return file.size;
        if (file instanceof ArrayBuffer)
            return file.byteLength;
        if (typeof file === 'string')
            return file.length;
        return 0;
    }
    generateHash(file) {
        const content = typeof file === 'string' ? file : JSON.stringify(file);
        return btoa(content).slice(0, 16);
    }
    ensureInitialized() {
        if (!this.isInitializedModule) {
            throw new Error('Storage module not initialized. Call init() first.');
        }
    }
}
export const manifest = {
    name: 'storage',
    version: '0.1.0',
    description: 'Enterprise Storage Module - Gestion de fichiers et stockage',
    author: 'Sky Genesis Enterprise',
    dependencies: [],
    exports: {
        '.': './index.js',
    },
    runtime: 'hybrid',
};
export default Storage;
//# sourceMappingURL=index.js.map