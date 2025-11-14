export class Storage {
    constructor(runtime) {
        this.name = 'storage';
        this.version = '0.1.0';
        this.cache = new Map();
        this.runtime = runtime;
    }
    async init() {
        console.log('Storage Module initialized');
    }
    async destroy() {
        this.cache.clear();
        console.log('Storage Module destroyed');
    }
    async save(file, options) {
        try {
            const path = options?.path || `/storage/${Date.now()}_${this.getFileName(file)}`;
            const size = this.getFileSize(file);
            const result = await this.runtime.call('storage_save', file, { path, ...options });
            this.cache.set(path, {
                data: file,
                metadata: options?.metadata,
                timestamp: Date.now()
            });
            return {
                path: result.path || path,
                size,
                hash: result.hash || this.generateHash(file)
            };
        }
        catch (error) {
            console.error('Storage save failed:', error);
            throw new Error('Failed to save file');
        }
    }
    async load(filePath) {
        try {
            const cached = this.cache.get(filePath);
            if (cached) {
                return {
                    data: cached.data,
                    metadata: cached.metadata
                };
            }
            const result = await this.runtime.call('storage_load', filePath);
            return {
                data: result.data || result,
                metadata: result.metadata
            };
        }
        catch (error) {
            console.error('Storage load failed:', error);
            throw new Error(`Failed to load file: ${filePath}`);
        }
    }
    async delete(filePath) {
        this.cache.delete(filePath);
        try {
            await this.runtime.call('storage_delete', filePath);
            return { deleted: true };
        }
        catch (error) {
            console.error('Storage delete failed:', error);
            return { deleted: false };
        }
    }
    async list(directory) {
        return {
            files: Array.from(this.cache.keys()).map(path => ({
                path,
                size: this.getFileSize(this.cache.get(path)?.data),
                modified: this.cache.get(path)?.timestamp || Date.now()
            }))
        };
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
        return btoa(JSON.stringify(file)).slice(0, 16);
    }
}
export default Storage;
//# sourceMappingURL=index.js.map