import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EnterpriseBuilder } from '../src/builder.js';
import { access, rm } from 'fs/promises';
import { join } from 'path';

describe('EnterpriseBuilder', () => {
  const testDir = '.enterprise-builder-test';

  beforeEach(async () => {
    // Clean up any existing test directory
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  afterEach(async () => {
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should create builder with default config', async () => {
    const builder = await EnterpriseBuilder.create({}, testDir);
    expect(builder).toBeDefined();
  });

  it('should create builder with custom config', async () => {
    const config = {
      mode: 'production' as const,
      framework: 'nextjs',
      environment: 'production',
      version: '2.0.0',
    };

    const builder = await EnterpriseBuilder.create(config, testDir);
    expect(builder).toBeDefined();
  });

  it('should build successfully', async () => {
    const builder = await EnterpriseBuilder.create(
      {
        mode: 'production',
        framework: 'react',
        environment: 'production',
        version: '1.0.0',
      },
      testDir
    );

    await builder.build();

    // Check if .enterprise directory was created
    await expect(access(join(testDir, '.enterprise'))).resolves.not.toThrow();
  });

  it('should clean build directory', async () => {
    const builder = await EnterpriseBuilder.create(
      {
        mode: 'production',
        framework: 'react',
        environment: 'production',
        version: '1.0.0',
      },
      testDir
    );

    await builder.build();
    await builder.clean();

    // Should throw error because directory doesn't exist
    await expect(access(join(testDir, '.enterprise'))).rejects.toThrow();
  });

  it('should get build info', async () => {
    const builder = await EnterpriseBuilder.create(
      {
        mode: 'production',
        framework: 'react',
        environment: 'production',
        version: '1.0.0',
      },
      testDir
    );

    await builder.build();
    const info = await builder.getInfo();

    expect(info).toHaveProperty('totalArtifacts');
    expect(info).toHaveProperty('lastBuild');
    expect(info.totalArtifacts).toBeGreaterThan(0);
  });

  it('should throw error for invalid config', async () => {
    const builder = new EnterpriseBuilder(
      {
        mode: 'invalid' as any,
        framework: '',
        environment: '',
        version: '',
      },
      testDir
    );

    await expect(builder.build()).rejects.toThrow('Invalid build config');
  });
});
