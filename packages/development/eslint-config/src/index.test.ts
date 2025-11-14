import { describe, it, expect } from 'vitest';
import config from '../index.js';

describe('ESLint Config', () => {
  it('should export configuration object', () => {
    expect(config).toBeDefined();
    expect(typeof config === 'object' || typeof config === 'function').toBe(true);
  });

  it('should have valid structure', () => {
    if (typeof config === 'object' && config !== null) {
      expect(config).toHaveProperty('rules');
      if (config.extends) {
        expect(Array.isArray(config.extends)).toBe(true);
      }
    }
  });
});
