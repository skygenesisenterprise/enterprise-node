import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SDKConfigManager } from '../config/sdk-config';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

// Mock des dépendances
vi.mock('fs/promises', () => ({
  writeFile: vi.fn(),
  readFile: vi.fn(),
}));

describe('SDKConfigManager', () => {
  let configManager: SDKConfigManager;
  let mockWriteFile: any;
  let mockReadFile: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWriteFile = vi.mocked(writeFile);
    mockReadFile = vi.mocked(readFile);
    configManager = SDKConfigManager.getInstance('/test/config.js');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('devrait retourner la même instance (singleton)', () => {
    const instance1 = SDKConfigManager.getInstance();
    const instance2 = SDKConfigManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  it("devrait charger la configuration par défaut si aucun fichier n'existe", async () => {
    mockReadFile.mockRejectedValue(new Error('File not found'));

    const config = await configManager.loadConfig();

    expect(config).toBeDefined();
    expect(config.dev?.port).toBe(3000);
    expect(config.build?.mode).toBe('production');
    expect(config.start?.host).toBe('0.0.0.0');
  });

  it('devrait charger la configuration depuis un fichier existant', async () => {
    const mockConfig = {
      framework: 'nextjs',
      dev: {
        port: 8080,
        host: '0.0.0.0',
        turbo: true,
      },
      build: {
        output: 'build',
        minify: false,
      },
    };

    mockReadFile.mockResolvedValue('export default ' + JSON.stringify(mockConfig));

    // Mock du module import
    vi.doMock('file:///test/config.js', () => ({
      default: mockConfig,
    }));

    const config = await configManager.loadConfig();

    expect(config.framework).toBe('nextjs');
    expect(config.dev?.port).toBe(8080);
    expect(config.dev?.turbo).toBe(true);
    expect(config.build?.output).toBe('build');
    expect(config.build?.minify).toBe(false);
  });

  it('devrait sauvegarder la configuration', async () => {
    const config = {
      framework: 'react',
      dev: {
        port: 3001,
        hot: false,
      },
    };

    mockWriteFile.mockResolvedValue(undefined);

    await configManager.saveConfig(config);

    expect(mockWriteFile).toHaveBeenCalledWith(
      '/test/config.js',
      expect.stringContaining('"framework": "react"'),
      'utf8'
    );
  });

  it('devrait initialiser la configuration par défaut', async () => {
    mockWriteFile.mockResolvedValue(undefined);

    await configManager.initConfig();

    expect(mockWriteFile).toHaveBeenCalledWith(
      '/test/config.js',
      expect.stringContaining('"port": 3000'),
      'utf8'
    );
  });

  it('devrait fusionner avec les valeurs par défaut', () => {
    const userConfig = {
      dev: {
        port: 8080,
        turbo: true,
      },
      build: {
        minify: false,
      },
    };

    const merged = configManager.mergeWithDefaults(userConfig);

    expect(merged.dev?.port).toBe(8080);
    expect(merged.dev?.turbo).toBe(true);
    expect(merged.dev?.host).toBe('localhost'); // Valeur par défaut
    expect(merged.build?.minify).toBe(false);
    expect(merged.build?.mode).toBe('production'); // Valeur par défaut
  });

  it('devrait retourner le chemin de configuration', () => {
    const path = configManager.getConfigPath();
    expect(path).toBe('/test/config.js');
  });

  it('devrait effacer le cache', () => {
    configManager.clearCache();
    // Le test vérifie simplement que la méthode s'exécute sans erreur
    expect(true).toBe(true);
  });
});
