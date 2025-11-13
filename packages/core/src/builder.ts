import { EnterpriseBuildManager } from './build-system/manager.js';
import { BuildUtils } from './build-system/utils.js';
import type { BuildConfig } from './build-system/types.js';

export class EnterpriseBuilder {
  private manager: EnterpriseBuildManager;
  private config: BuildConfig;

  constructor(config: BuildConfig, baseDir?: string) {
    this.manager = new EnterpriseBuildManager(baseDir);
    this.config = config;
  }

  async build(): Promise<void> {
    const validation = BuildUtils.validateConfig(this.config);
    if (!validation.valid) {
      throw new Error(`Invalid build config: ${validation.errors.join(', ')}`);
    }

    const startTime = Date.now();

    await this.manager.build(this.config);

    const duration = BuildUtils.formatBuildTime(startTime);
    console.log(`🎯 Enterprise build completed in ${duration}`);
  }

  async clean(): Promise<void> {
    await this.manager.clean();
  }

  async getInfo(): Promise<any> {
    return await this.manager.getBuildInfo();
  }

  static async create(
    config: Partial<BuildConfig> = {},
    baseDir?: string
  ): Promise<EnterpriseBuilder> {
    const defaultConfig: BuildConfig = {
      mode: 'development',
      framework: 'react',
      environment: 'development',
      version: '1.0.0',
      ...config,
    };

    const builder = new EnterpriseBuilder(defaultConfig, baseDir);

    // Auto-detect framework if not specified
    if (!config.framework) {
      const detectedFramework = await (async () => {
        if (await BuildUtils.checkFrameworkExists('nextjs')) return 'nextjs';
        if (await BuildUtils.checkFrameworkExists('vue')) return 'vue';
        if (await BuildUtils.checkFrameworkExists('angular')) return 'angular';
        if (await BuildUtils.checkFrameworkExists('svelte')) return 'svelte';
        return 'react';
      })();

      builder.config.framework = detectedFramework;
    }

    return builder;
  }
}
