import { describe, it, expect, beforeEach } from 'vitest';

// Mock implementation for testing
class MockSDK {
  name = 'sdk';
  version = '0.1.0';
  private isInitializedModule = false;

  async init(): Promise<void> {
    this.isInitializedModule = true;
  }

  async destroy(): Promise<void> {
    this.isInitializedModule = false;
  }

  isInitialized(): boolean {
    return this.isInitializedModule;
  }

  getSelfReference(): string {
    return 'SDK Module - Self-referential instance';
  }

  getMetaInfo(): { version: string; name: string; isSelfReferencing: boolean } {
    return {
      version: this.version,
      name: this.name,
      isSelfReferencing: true,
    };
  }
}

class MockEnterpriseSDK {
  private modules: Map<string, any> = new Map();

  constructor(private config: any) {}

  async initialize(): Promise<void> {
    if (this.config.modules?.sdk) {
      const sdk = new MockSDK();
      await sdk.init();
      this.modules.set('sdk', sdk);
    }
  }

  get sdk() {
    const module = this.modules.get('sdk');
    if (!module) {
      throw new Error('SDK module not loaded');
    }
    return module;
  }

  async destroy(): Promise<void> {
    for (const [name, module] of this.modules) {
      await module.destroy();
    }
    this.modules.clear();
  }
}

describe('SDK Self-Reference', () => {
  let sdk: MockEnterpriseSDK;

  beforeEach(async () => {
    sdk = new MockEnterpriseSDK({
      modules: {
        sdk: true,
        ai: false,
        storage: false,
        ui: false,
        project: false,
        auth: false,
      },
      debug: true,
    });
    await sdk.initialize();
  });

  it('should initialize SDK module', async () => {
    expect(sdk.sdk).toBeDefined();
    expect(sdk.sdk.isInitialized()).toBe(true);
  });

  it('should provide self-reference information', () => {
    const metaInfo = sdk.sdk.getMetaInfo();

    expect(metaInfo).toEqual({
      version: '0.1.0',
      name: 'sdk',
      isSelfReferencing: true,
    });
  });

  it('should return self-reference string', () => {
    const selfRef = sdk.sdk.getSelfReference();

    expect(selfRef).toBe('SDK Module - Self-referential instance');
  });

  it('should be accessible through SDK instance', () => {
    expect(typeof sdk.sdk.getMetaInfo).toBe('function');
    expect(typeof sdk.sdk.getSelfReference).toBe('function');
    expect(typeof sdk.sdk.isInitialized).toBe('function');
  });

  it('should handle module destruction', async () => {
    await sdk.sdk.destroy();
    expect(sdk.sdk.isInitialized()).toBe(false);
  });

  it('should work with full SDK initialization', async () => {
    const fullSDK = new MockEnterpriseSDK({
      modules: {
        sdk: true,
        ai: true,
        storage: true,
        ui: true,
        project: true,
        auth: true,
      },
      debug: true,
    });

    await fullSDK.initialize();

    expect(fullSDK.sdk).toBeDefined();

    await fullSDK.destroy();
  });
});
