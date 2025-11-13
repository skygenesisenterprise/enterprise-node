import { access, constants } from 'fs/promises';
import { join } from 'path';
import type { BuildConfig } from './types';

export class BuildUtils {
  static async checkFrameworkExists(
    framework: string,
    baseDir: string = process.cwd()
  ): Promise<boolean> {
    const frameworkFiles = {
      nextjs: ['next.config.js', 'next.config.ts', 'next.config.mjs'],
      react: ['package.json'],
      vue: ['vue.config.js', 'vite.config.ts'],
      angular: ['angular.json'],
      svelte: ['svelte.config.js', 'vite.config.ts'],
    };

    const files = frameworkFiles[framework as keyof typeof frameworkFiles] || [];

    for (const file of files) {
      try {
        await access(join(baseDir, file), constants.F_OK);
        return true;
      } catch {
        continue;
      }
    }

    return false;
  }

  static getBuildCommand(framework: string, mode: 'development' | 'production'): string {
    const commands = {
      nextjs: mode === 'production' ? 'next build' : 'next dev',
      react: mode === 'production' ? 'npm run build' : 'npm start',
      vue: mode === 'production' ? 'vue-cli-service build' : 'vue-cli-service serve',
      angular: mode === 'production' ? 'ng build' : 'ng serve',
      svelte: mode === 'production' ? 'npm run build' : 'npm run dev',
    };

    return commands[framework as keyof typeof commands] || 'npm run build';
  }

  static getOutputDir(framework: string): string {
    const outputs = {
      nextjs: '.next',
      react: 'build',
      vue: 'dist',
      angular: 'dist',
      svelte: 'build',
    };

    return outputs[framework as keyof typeof outputs] || 'build';
  }

  static validateConfig(config: BuildConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!['development', 'production'].includes(config.mode)) {
      errors.push('Mode must be "development" or "production"');
    }

    if (!config.framework || typeof config.framework !== 'string') {
      errors.push('Framework is required and must be a string');
    }

    if (!config.environment || typeof config.environment !== 'string') {
      errors.push('Environment is required and must be a string');
    }

    if (!config.version || typeof config.version !== 'string') {
      errors.push('Version is required and must be a string');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static formatBuildTime(startTime: number): string {
    const duration = Date.now() - startTime;
    if (duration < 1000) {
      return `${duration}ms`;
    } else if (duration < 60000) {
      return `${(duration / 1000).toFixed(2)}s`;
    } else {
      return `${(duration / 60000).toFixed(2)}m`;
    }
  }

  static getEnvironmentInfo(): Record<string, string> {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cwd: process.cwd(),
    };
  }
}
