import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EnterpriseBuildManager } from './build-system/manager.js';
import { BuildUtils } from './build-system/utils.js';
import { access, rm } from 'fs/promises';
import { join } from 'path';

describe('Enterprise Build System', () => {
  let buildManager: EnterpriseBuildManager;
  const testDir = '.enterprise-test';

  beforeEach(async () => {
    buildManager = new EnterpriseBuildManager(testDir);
  });

  afterEach(async () => {
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('EnterpriseBuildManager', () => {
    it('should initialize build directory', async () => {
      await buildManager.initialize();

      // Check if .enterprise directory was created
      await expect(access(join(testDir, '.enterprise'))).resolves.not.toThrow();

      // Check if subdirectories were created
      await expect(access(join(testDir, '.enterprise', 'static'))).resolves.not.toThrow();
      await expect(access(join(testDir, '.enterprise', 'server'))).resolves.not.toThrow();
      await expect(access(join(testDir, '.enterprise', 'client'))).resolves.not.toThrow();
      await expect(access(join(testDir, '.enterprise', 'cache'))).resolves.not.toThrow();
      await expect(access(join(testDir, '.enterprise', 'logs'))).resolves.not.toThrow();
      await expect(access(join(testDir, '.enterprise', 'metadata'))).resolves.not.toThrow();
    });

    it('should create build manifest', async () => {
      await buildManager.initialize();

      const manifestPath = join(testDir, '.enterprise', 'manifest.json');
      await expect(access(manifestPath)).resolves.not.toThrow();
    });

    it('should add and retrieve artifacts', async () => {
      await buildManager.initialize();

      const artifact = {
        id: 'test-artifact',
        type: 'build' as const,
        framework: 'nextjs',
        timestamp: new Date().toISOString(),
        files: ['test.js'],
        metadata: { mode: 'production' },
      };

      await buildManager.addArtifact(artifact);

      const retrieved = await buildManager.getArtifact('test-artifact');
      expect(retrieved).toEqual(artifact);
    });

    it('should build with config', async () => {
      const config = {
        mode: 'production' as const,
        framework: 'nextjs',
        environment: 'production',
        version: '1.0.0',
      };

      await buildManager.build(config);

      const buildInfo = await buildManager.getBuildInfo();
      expect(buildInfo.totalArtifacts).toBeGreaterThan(0);
      expect(buildInfo.lastBuild).toBeTruthy();
    });

    it('should clean build directory', async () => {
      await buildManager.initialize();
      await buildManager.build({
        mode: 'production',
        framework: 'nextjs',
        environment: 'production',
        version: '1.0.0',
      });

      await buildManager.clean();

      // Should throw error because directory doesn't exist
      await expect(access(join(testDir, '.enterprise'))).rejects.toThrow();
    });
  });

  describe('BuildUtils', () => {
    it('should validate config correctly', () => {
      const validConfig = {
        mode: 'production' as const,
        framework: 'nextjs',
        environment: 'production',
        version: '1.0.0',
      };

      const result = BuildUtils.validateConfig(validConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid config', () => {
      const invalidConfig = {
        mode: 'invalid' as any,
        framework: '',
        environment: '',
        version: '',
      };

      const result = BuildUtils.validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should get build commands for frameworks', () => {
      expect(BuildUtils.getBuildCommand('nextjs', 'production')).toBe('next build');
      expect(BuildUtils.getBuildCommand('nextjs', 'development')).toBe('next dev');
      expect(BuildUtils.getBuildCommand('react', 'production')).toBe('npm run build');
    });

    it('should get output directories for frameworks', () => {
      expect(BuildUtils.getOutputDir('nextjs')).toBe('.next');
      expect(BuildUtils.getOutputDir('react')).toBe('build');
      expect(BuildUtils.getOutputDir('vue')).toBe('dist');
    });

    it('should format build time correctly', () => {
      expect(BuildUtils.formatBuildTime(Date.now() - 500)).toMatch(/\d+ms/);
      expect(BuildUtils.formatBuildTime(Date.now() - 2000)).toMatch(/\d+\.\d+s/);
      expect(BuildUtils.formatBuildTime(Date.now() - 120000)).toMatch(/\d+\.\d+m/);
    });

    it('should get environment info', () => {
      const envInfo = BuildUtils.getEnvironmentInfo();
      expect(envInfo.nodeVersion).toBeTruthy();
      expect(envInfo.platform).toBeTruthy();
      expect(envInfo.arch).toBeTruthy();
      expect(envInfo.cwd).toBeTruthy();
    });
  });
});
