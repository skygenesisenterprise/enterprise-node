import { describe, it, expect } from 'vitest';
import { SDK } from './index';

describe('SDK Module', () => {
  it('should create an SDK instance', () => {
    const sdk = new SDK();
    expect(sdk).toBeInstanceOf(SDK);
  });

  it('should have correct name and version', () => {
    const sdk = new SDK();
    expect(sdk.name).toBe('sdk');
    expect(sdk.version).toBe('0.1.0');
  });

  it('should initialize successfully', async () => {
    const sdk = new SDK();
    await sdk.init();
    expect(sdk.isInitialized()).toBe(true);
  });

  it('should accept custom options', () => {
    const options = {
      enableRecursion: false,
      maxRecursionDepth: 5,
      trackMetadata: false,
    };
    const sdk = new SDK(options);
    expect(sdk).toBeInstanceOf(SDK);
  });

  it('should create self reference', async () => {
    const sdk = new SDK({ enableRecursion: true, maxRecursionDepth: 1 });
    await sdk.init();
    expect(sdk.isInitialized()).toBe(true);
  });

  it('should destroy successfully', async () => {
    const sdk = new SDK();
    await sdk.init();
    await sdk.destroy();
    expect(sdk.isInitialized()).toBe(false);
  });
});
