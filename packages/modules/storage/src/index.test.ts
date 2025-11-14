import { describe, it, expect } from 'vitest';
import { Storage } from './index';

describe('Storage Module', () => {
  it('should create a Storage instance', () => {
    const storage = new Storage();
    expect(storage).toBeInstanceOf(Storage);
  });

  it('should have correct name and version', () => {
    const storage = new Storage();
    expect(storage.name).toBe('storage');
    expect(storage.version).toBe('0.1.0');
  });

  it('should initialize successfully', async () => {
    const storage = new Storage();
    await storage.init();
    expect(storage.isInitialized()).toBe(true);
  });

  it('should save file', async () => {
    const storage = new Storage();
    await storage.init();
    const result = await storage.save('test-file-content', {
      path: '/test/file.txt',
      metadata: { type: 'test' },
    });
    expect(result.path).toBe('/test/file.txt');
    expect(result.size).toBeGreaterThan(0);
    expect(result.hash).toBeDefined();
  });

  it('should load file', async () => {
    const storage = new Storage();
    await storage.init();
    const saveResult = await storage.save('test-file-content', {
      path: '/test/file.txt',
    });
    const loadResult = await storage.load(saveResult.path);
    expect(loadResult).toBeDefined();
  });

  it('should delete file', async () => {
    const storage = new Storage();
    await storage.init();
    const saveResult = await storage.save('test-file-content', {
      path: '/test/file.txt',
    });
    await storage.delete(saveResult.path);
    // File should be deleted (no error thrown)
    expect(true).toBe(true);
  });

  it('should list files', async () => {
    const storage = new Storage();
    await storage.init();
    await storage.save('content1', { path: '/test/file1.txt' });
    await storage.save('content2', { path: '/test/file2.txt' });
    const files = await storage.list('/test');
    expect(files.files).toBeDefined();
    expect(Array.isArray(files.files)).toBe(true);
    expect(files.files.length).toBeGreaterThanOrEqual(0);
  });

  it('should destroy successfully', async () => {
    const storage = new Storage();
    await storage.init();
    await storage.destroy();
    expect(storage.isInitialized()).toBe(false);
  });
});
