import { describe, it, expect } from 'vitest';

describe('ESLint Config', () => {
  it('should export configuration object', () => {
    const config = require('../index.js');
    expect(config).toBeDefined();
    expect(typeof config === 'object' || typeof config === 'function').toBe(true);
  });

  it('should have valid structure', () => {
    const config = require('../index.js');
    if (typeof config === 'object' && config !== null) {
      expect(config).toHaveProperty('rules');
      if (config.extends) {
        expect(Array.isArray(config.extends)).toBe(true);
      }
    }
  });
});
