import { describe, it, expect, vi } from 'vitest';
import { Ai } from './index';

describe('AI Module', () => {
  it('should create an Ai instance', () => {
    const ai = new Ai();
    expect(ai).toBeInstanceOf(Ai);
  });

  it('should have correct name and version', () => {
    const ai = new Ai();
    expect(ai.name).toBe('ai');
    expect(ai.version).toBe('0.1.0');
  });

  it('should initialize successfully', async () => {
    const ai = new Ai();
    await ai.init();
    expect(ai.isInitialized()).toBe(true);
  });

  it('should enhance image', async () => {
    const ai = new Ai();
    await ai.init();
    const result = await ai.enhance('test-image', { quality: 'high' });
    expect(result.enhanced).toBe(true);
    expect(result.metadata).toBeDefined();
  });

  it('should generate text', async () => {
    const ai = new Ai();
    await ai.init();
    const result = await ai.generate('Test prompt');
    expect(result.text).toBeDefined();
    expect(result.usage).toBeDefined();
  });

  it('should analyze text', async () => {
    const ai = new Ai();
    await ai.init();
    const result = await ai.analyze('Test text', { type: 'sentiment' });
    expect(result.insights).toBeDefined();
    expect(result.confidence).toBeGreaterThanOrEqual(0);
  });

  it('should throw error when not initialized', async () => {
    const ai = new Ai();
    await expect(ai.generate('test')).rejects.toThrow();
  });
});
