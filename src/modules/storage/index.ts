import { ModuleInterface } from '../../types';
import { WasmRuntime } from '../../core/runtime';

export class Storage implements ModuleInterface {
  name = 'storage';
  version = '0.1.0';
  private runtime: WasmRuntime;
  private cache: Map<string, any> = new Map();

  constructor(runtime: WasmRuntime) {
    this.runtime = runtime;
  }

  async init(): Promise<void> {
    console.log('Storage Module initialized');
  }

  async destroy(): Promise<void> {
    this.cache.clear();
    console.log('Storage Module destroyed');
  }

  async save(file: File | ArrayBuffer | string, options?: {
    path?: string;
    metadata?: any;
  }): Promise<{
    path: string;
    size: number;
    hash?: string;
  }> {
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
    } catch (error) {
      console.error('Storage save failed:', error);
      throw new Error('Failed to save file');
    }
  }

  async load(filePath: string): Promise<{
    data: any;
    metadata?: any;
  }> {
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
    } catch (error) {
      console.error('Storage load failed:', error);
      throw new Error(`Failed to load file: ${filePath}`);
    }
  }

  async delete(filePath: string): Promise<{
    deleted: boolean;
  }> {
    this.cache.delete(filePath);
    try {
      await this.runtime.call('storage_delete', filePath);
      return { deleted: true };
    } catch (error) {
      console.error('Storage delete failed:', error);
      return { deleted: false };
    }
  }

  async list(directory?: string): Promise<{
    files: Array<{
      path: string;
      size: number;
      modified: number;
    }>;
  }> {
    return {
      files: Array.from(this.cache.keys()).map(path => ({
        path,
        size: this.getFileSize(this.cache.get(path)?.data),
        modified: this.cache.get(path)?.timestamp || Date.now()
      }))
    };
  }

  private getFileName(file: any): string {
    if (file instanceof File) return file.name;
    if (typeof file === 'string') return file.split('/').pop() || 'unknown';
    return `file_${Date.now()}`;
  }

  private getFileSize(file: any): number {
    if (file instanceof File) return file.size;
    if (file instanceof ArrayBuffer) return file.byteLength;
    if (typeof file === 'string') return file.length;
    return 0;
  }

  private generateHash(file: any): string {
    return btoa(JSON.stringify(file)).slice(0, 16);
  }
}

export default Storage;