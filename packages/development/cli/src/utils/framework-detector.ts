import { access, readFile } from 'fs/promises';
import { join } from 'path';

export interface FrameworkInfo {
  name: string;
  version?: string;
  configFiles: string[];
  packageJsonKeys: string[];
  devCommands: string[];
  buildCommands: string[];
  startCommands: string[];
  detected: boolean;
}

export class FrameworkDetector {
  private static instance: FrameworkDetector;
  private cache: Map<string, FrameworkInfo> = new Map();

  static getInstance(): FrameworkDetector {
    if (!FrameworkDetector.instance) {
      FrameworkDetector.instance = new FrameworkDetector();
    }
    return FrameworkDetector.instance;
  }

  async detectFramework(cwd: string = process.cwd()): Promise<FrameworkInfo> {
    const cacheKey = cwd;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const frameworks = [
      this.detectNextjs(cwd),
      this.detectReact(cwd),
      this.detectSvelte(cwd),
      this.detectVue(cwd),
      this.detectAngular(cwd),
      this.detectNuxt(cwd),
      this.detectRemix(cwd),
      this.detectGatsby(cwd),
    ];

    for (const framework of frameworks) {
      const info = await framework;
      if (info.detected) {
        this.cache.set(cacheKey, info);
        return info;
      }
    }

    // Fallback to generic
    const genericInfo: FrameworkInfo = {
      name: 'generic',
      configFiles: [],
      packageJsonKeys: [],
      devCommands: ['npm run dev'],
      buildCommands: ['npm run build'],
      startCommands: ['npm run start'],
      detected: true,
    };

    this.cache.set(cacheKey, genericInfo);
    return genericInfo;
  }

  private async detectNextjs(cwd: string): Promise<FrameworkInfo> {
    const configFiles = ['next.config.js', 'next.config.mjs', 'next.config.ts'];
    const hasConfig = await this.hasAnyFile(cwd, configFiles);

    let version: string | undefined;
    try {
      const packageJson = await this.readPackageJson(cwd);
      version = packageJson.dependencies?.next || packageJson.devDependencies?.next;
    } catch {}

    return {
      name: 'nextjs',
      version,
      configFiles,
      packageJsonKeys: ['next'],
      devCommands: ['next dev'],
      buildCommands: ['next build'],
      startCommands: ['next start'],
      detected: hasConfig || !!version,
    };
  }

  private async detectReact(cwd: string): Promise<FrameworkInfo> {
    const configFiles = ['vite.config.js', 'vite.config.ts', 'vite.config.mjs'];
    const hasConfig = await this.hasAnyFile(cwd, configFiles);

    let version: string | undefined;
    try {
      const packageJson = await this.readPackageJson(cwd);
      version = packageJson.dependencies?.react || packageJson.devDependencies?.react;
    } catch {}

    return {
      name: 'react',
      version,
      configFiles,
      packageJsonKeys: ['react', 'vite'],
      devCommands: ['vite', 'npm run dev'],
      buildCommands: ['vite build', 'npm run build'],
      startCommands: ['vite preview', 'npm run preview'],
      detected: hasConfig || !!version,
    };
  }

  private async detectSvelte(cwd: string): Promise<FrameworkInfo> {
    const configFiles = [
      'svelte.config.js',
      'svelte.config.ts',
      'vite.config.js',
      'vite.config.ts',
    ];
    const hasConfig = await this.hasAnyFile(cwd, configFiles);

    let version: string | undefined;
    try {
      const packageJson = await this.readPackageJson(cwd);
      version = packageJson.dependencies?.svelte || packageJson.devDependencies?.svelte;
    } catch {}

    return {
      name: 'svelte',
      version,
      configFiles,
      packageJsonKeys: ['svelte', '@sveltejs/kit'],
      devCommands: ['npm run dev', 'vite dev'],
      buildCommands: ['npm run build', 'vite build'],
      startCommands: ['npm run preview', 'vite preview'],
      detected: hasConfig || !!version,
    };
  }

  private async detectVue(cwd: string): Promise<FrameworkInfo> {
    const configFiles = [
      'vue.config.js',
      'vite.config.js',
      'vite.config.ts',
      'nuxt.config.js',
      'nuxt.config.ts',
    ];
    const hasConfig = await this.hasAnyFile(cwd, configFiles);

    let version: string | undefined;
    try {
      const packageJson = await this.readPackageJson(cwd);
      version = packageJson.dependencies?.vue || packageJson.devDependencies?.vue;
    } catch {}

    return {
      name: 'vue',
      version,
      configFiles,
      packageJsonKeys: ['vue', '@vue/cli-service'],
      devCommands: ['npm run serve', 'vite dev'],
      buildCommands: ['npm run build', 'vite build'],
      startCommands: ['npm run preview', 'vite preview'],
      detected: hasConfig || !!version,
    };
  }

  private async detectNuxt(cwd: string): Promise<FrameworkInfo> {
    const configFiles = ['nuxt.config.js', 'nuxt.config.ts', 'nuxt.config.mjs'];
    const hasConfig = await this.hasAnyFile(cwd, configFiles);

    let version: string | undefined;
    try {
      const packageJson = await this.readPackageJson(cwd);
      version = packageJson.dependencies?.nuxt || packageJson.devDependencies?.nuxt;
    } catch {}

    return {
      name: 'nuxt',
      version,
      configFiles,
      packageJsonKeys: ['nuxt'],
      devCommands: ['nuxt dev', 'npm run dev'],
      buildCommands: ['nuxt build', 'npm run build'],
      startCommands: ['nuxt start', 'npm run start'],
      detected: hasConfig || !!version,
    };
  }

  private async detectAngular(cwd: string): Promise<FrameworkInfo> {
    const configFiles = ['angular.json', 'ng.config.js', 'project.json'];
    const hasConfig = await this.hasAnyFile(cwd, configFiles);

    let version: string | undefined;
    try {
      const packageJson = await this.readPackageJson(cwd);
      version =
        packageJson.dependencies?.['@angular/core'] ||
        packageJson.devDependencies?.['@angular/core'];
    } catch {}

    return {
      name: 'angular',
      version,
      configFiles,
      packageJsonKeys: ['@angular/core', '@angular/cli'],
      devCommands: ['ng serve', 'npm run start'],
      buildCommands: ['ng build', 'npm run build'],
      startCommands: ['ng serve', 'npm run start'],
      detected: hasConfig || !!version,
    };
  }

  private async detectRemix(cwd: string): Promise<FrameworkInfo> {
    const configFiles = ['remix.config.js', 'remix.config.ts'];
    const hasConfig = await this.hasAnyFile(cwd, configFiles);

    let version: string | undefined;
    try {
      const packageJson = await this.readPackageJson(cwd);
      version =
        packageJson.dependencies?.['@remix-run/react'] ||
        packageJson.devDependencies?.['@remix-run/react'];
    } catch {}

    return {
      name: 'remix',
      version,
      configFiles,
      packageJsonKeys: ['@remix-run/react'],
      devCommands: ['remix dev', 'npm run dev'],
      buildCommands: ['remix build', 'npm run build'],
      startCommands: ['remix-serve', 'npm run start'],
      detected: hasConfig || !!version,
    };
  }

  private async detectGatsby(cwd: string): Promise<FrameworkInfo> {
    const configFiles = ['gatsby-config.js', 'gatsby-config.ts', 'gatsby-node.js'];
    const hasConfig = await this.hasAnyFile(cwd, configFiles);

    let version: string | undefined;
    try {
      const packageJson = await this.readPackageJson(cwd);
      version = packageJson.dependencies?.gatsby || packageJson.devDependencies?.gatsby;
    } catch {}

    return {
      name: 'gatsby',
      version,
      configFiles,
      packageJsonKeys: ['gatsby'],
      devCommands: ['gatsby develop', 'npm run develop'],
      buildCommands: ['gatsby build', 'npm run build'],
      startCommands: ['gatsby serve', 'npm run serve'],
      detected: hasConfig || !!version,
    };
  }

  private async hasAnyFile(cwd: string, files: string[]): Promise<boolean> {
    for (const file of files) {
      try {
        await access(join(cwd, file));
        return true;
      } catch {
        // Continue checking
      }
    }
    return false;
  }

  private async readPackageJson(cwd: string): Promise<any> {
    const packageJsonPath = join(cwd, 'package.json');
    const content = await readFile(packageJsonPath, 'utf8');
    return JSON.parse(content);
  }

  clearCache(): void {
    this.cache.clear();
  }
}
