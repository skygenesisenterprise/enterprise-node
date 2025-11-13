/**
 * @fileoverview Simple validation test for auto-completion system
 */

import { describe, it, expect } from 'vitest';
import { EnterpriseAutoComplete, type AutoCompleteSuggestion } from './autocomplete-system';

describe('EnterpriseAutoComplete', () => {
  it('should be a singleton', () => {
    const instance1 = EnterpriseAutoComplete.getInstance();
    const instance2 = EnterpriseAutoComplete.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should provide import suggestions', () => {
    const autoComplete = EnterpriseAutoComplete.getInstance();
    const suggestions = autoComplete.analyzeContext('import', 6);

    expect(suggestions).toBeInstanceOf(Array);
    expect(suggestions.length).toBeGreaterThan(0);

    const hasEnterpriseImport = suggestions.some(
      (s) => s.label.includes('Enterprise') && s.type === 'import'
    );
    expect(hasEnterpriseImport).toBe(true);
  });

  it('should provide AI module suggestions', () => {
    const autoComplete = EnterpriseAutoComplete.getInstance();
    const suggestions = autoComplete.analyzeContext('Enterprise.ai.', 14);

    expect(suggestions).toBeInstanceOf(Array);
    expect(suggestions.length).toBeGreaterThan(0);

    const hasGenerate = suggestions.some(
      (s) => s.label.includes('generate') && s.type === 'method'
    );
    expect(hasGenerate).toBe(true);
  });

  it('should provide storage module suggestions', () => {
    const autoComplete = EnterpriseAutoComplete.getInstance();
    const suggestions = autoComplete.analyzeContext('Enterprise.storage.', 19);

    expect(suggestions).toBeInstanceOf(Array);
    expect(suggestions.length).toBeGreaterThan(0);

    const hasSave = suggestions.some((s) => s.label.includes('save') && s.type === 'method');
    expect(hasSave).toBe(true);
  });

  it('should provide constructor suggestions', () => {
    const autoComplete = EnterpriseAutoComplete.getInstance();
    const suggestions = autoComplete.analyzeContext('new Enterprise', 14);

    expect(suggestions).toBeInstanceOf(Array);
    expect(suggestions.length).toBeGreaterThan(0);

    const hasConstructor = suggestions.some(
      (s) => s.label.includes('new Enterprise') && s.type === 'constructor'
    );
    expect(hasConstructor).toBe(true);
  });

  it('should provide general suggestions', () => {
    const autoComplete = EnterpriseAutoComplete.getInstance();
    const suggestions = autoComplete.analyzeContext('Enterprise.', 10);

    expect(suggestions).toBeInstanceOf(Array);
    expect(suggestions.length).toBeGreaterThan(0);

    const hasAIModule = suggestions.some((s) => s.label.includes('.ai') && s.type === 'property');
    expect(hasAIModule).toBe(true);
  });
});
