import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SDKDevCommand } from '../commands/sdk/sdk-dev';
import { FrameworkDetector } from '../utils/framework-detector';

// Mock des dépendances
vi.mock('child_process', () => ({
  spawn: vi.fn(),
}));

vi.mock('../utils/framework-detector', () => ({
  FrameworkDetector: {
    getInstance: vi.fn(() => ({
      detectFramework: vi.fn(),
    })),
  },
}));

vi.mock('../config/sdk-config', () => ({
  SDKConfigManager: {
    getInstance: vi.fn(() => ({
      loadConfig: vi.fn(),
    })),
  },
}));

describe('SDKDevCommand', () => {
  let sdkDevCommand: SDKDevCommand;
  let mockSpawn: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSpawn = vi.fn();
    vi.doMock('child_process', () => ({
      spawn: mockSpawn,
    }));

    sdkDevCommand = new SDKDevCommand(
      {
        port: '3000',
        host: 'localhost',
        hot: true,
        turbo: false,
        experimental: false,
      },
      {}
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('devrait détecter Next.js et préparer la commande appropriée', async () => {
    const mockFrameworkInfo = {
      name: 'nextjs',
      version: '14.0.0',
      configFiles: ['next.config.js'],
      packageJsonKeys: ['next'],
      devCommands: ['next dev'],
      buildCommands: ['next build'],
      startCommands: ['next start'],
      detected: true,
    };

    const mockDetectFramework = vi.mocked(FrameworkDetector.getInstance().detectFramework);
    mockDetectFramework.mockResolvedValue(mockFrameworkInfo);

    // Mock du processus spawn
    const mockChildProcess = {
      on: vi.fn(),
    };
    mockSpawn.mockReturnValue(mockChildProcess);

    // Mock console.log pour éviter les affichages pendant les tests
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await sdkDevCommand.execute();

    expect(mockDetectFramework).toHaveBeenCalled();
    expect(mockSpawn).toHaveBeenCalledWith(
      'next',
      ['dev'],
      expect.objectContaining({
        env: expect.objectContaining({
          PORT: '3000',
          HOST: 'localhost',
          NODE_ENV: 'development',
          HOT_RELOAD: 'true',
        }),
      })
    );

    consoleSpy.mockRestore();
  });

  it('devrait détecter React/Vite et préparer la commande appropriée', async () => {
    const mockFrameworkInfo = {
      name: 'react',
      version: '18.0.0',
      configFiles: ['vite.config.js'],
      packageJsonKeys: ['react', 'vite'],
      devCommands: ['vite'],
      buildCommands: ['vite build'],
      startCommands: ['vite preview'],
      detected: true,
    };

    const mockDetectFramework = vi.mocked(FrameworkDetector.getInstance().detectFramework);
    mockDetectFramework.mockResolvedValue(mockFrameworkInfo);

    const mockChildProcess = {
      on: vi.fn(),
    };
    mockSpawn.mockReturnValue(mockChildProcess);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await sdkDevCommand.execute();

    expect(mockSpawn).toHaveBeenCalledWith(
      'vite',
      ['--port', '3000', '--host', 'localhost', '--force'],
      expect.any(Object)
    );

    consoleSpy.mockRestore();
  });

  it('devrait détecter SvelteKit et préparer la commande appropriée', async () => {
    const mockFrameworkInfo = {
      name: 'svelte',
      version: '4.0.0',
      configFiles: ['svelte.config.js'],
      packageJsonKeys: ['svelte', '@sveltejs/kit'],
      devCommands: ['npm run dev'],
      buildCommands: ['npm run build'],
      startCommands: ['npm run preview'],
      detected: true,
    };

    const mockDetectFramework = vi.mocked(FrameworkDetector.getInstance().detectFramework);
    mockDetectFramework.mockResolvedValue(mockFrameworkInfo);

    const mockChildProcess = {
      on: vi.fn(),
    };
    mockSpawn.mockReturnValue(mockChildProcess);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await sdkDevCommand.execute();

    expect(mockSpawn).toHaveBeenCalledWith(
      'npm',
      ['run', 'dev', '--', '--port', '3000', '--host', 'localhost'],
      expect.any(Object)
    );

    consoleSpy.mockRestore();
  });

  it('devrait gérer les options turbo et experimental pour Next.js', async () => {
    const mockFrameworkInfo = {
      name: 'nextjs',
      version: '14.0.0',
      configFiles: ['next.config.js'],
      packageJsonKeys: ['next'],
      devCommands: ['next dev'],
      buildCommands: ['next build'],
      startCommands: ['next start'],
      detected: true,
    };

    const mockDetectFramework = vi.mocked(FrameworkDetector.getInstance().detectFramework);
    mockDetectFramework.mockResolvedValue(mockFrameworkInfo);

    const mockChildProcess = {
      on: vi.fn(),
    };
    mockSpawn.mockReturnValue(mockChildProcess);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Créer une commande avec options turbo et experimental
    const turboDevCommand = new SDKDevCommand(
      {
        port: '3000',
        host: 'localhost',
        hot: true,
        turbo: true,
        experimental: true,
      },
      {}
    );

    await turboDevCommand.execute();

    expect(mockSpawn).toHaveBeenCalledWith(
      'next',
      ['dev', '-p', '3000', '-H', 'localhost', '--turbo', '--experimental'],
      expect.any(Object)
    );

    consoleSpy.mockRestore();
  });

  it("devrait utiliser la commande générique si aucun framework n'est détecté", async () => {
    const mockFrameworkInfo = {
      name: 'generic',
      configFiles: [],
      packageJsonKeys: [],
      devCommands: ['npm run dev'],
      buildCommands: ['npm run build'],
      startCommands: ['npm run start'],
      detected: true,
    };

    const mockDetectFramework = vi.mocked(FrameworkDetector.getInstance().detectFramework);
    mockDetectFramework.mockResolvedValue(mockFrameworkInfo);

    const mockChildProcess = {
      on: vi.fn(),
    };
    mockSpawn.mockReturnValue(mockChildProcess);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await sdkDevCommand.execute();

    expect(mockSpawn).toHaveBeenCalledWith('npm', ['run', 'dev'], expect.any(Object));

    consoleSpy.mockRestore();
  });
});
