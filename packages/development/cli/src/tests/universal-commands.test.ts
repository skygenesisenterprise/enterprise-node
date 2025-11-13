import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FrameworkDetector } from '../utils/framework-detector';
import { UniversalDevCommand } from '../commands/universal-dev';
import { UniversalBuildCommand } from '../commands/universal-build';
import { UniversalStartCommand } from '../commands/universal-start';
import { UniversalPreviewCommand } from '../commands/universal-preview';
import { UniversalLintCommand } from '../commands/universal-lint';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

describe('Framework Detection', () => {
  let detector: FrameworkDetector;
  let testDir: string;

  beforeEach(() => {
    detector = new FrameworkDetector();
    testDir = join(process.cwd(), 'test-project');
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true });
    }
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true });
    }
  });

  it('should detect Next.js project', async () => {
    const packageJson = {
      name: 'test-nextjs-app',
      dependencies: {
        next: '14.0.0',
        react: '^18.0.0',
        'react-dom': '^18.0.0',
      },
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
      },
    };

    writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    writeFileSync(join(testDir, 'next.config.js'), 'module.exports = {}');

    const framework = await detector.detectFramework(testDir);

    expect(framework.name).toBe('nextjs');
    expect(framework.version).toBe('14.0.0');
    expect(framework.detected).toBe(true);
    expect(framework.devCommands).toContain('next dev');
    expect(framework.buildCommands).toContain('next build');
    expect(framework.startCommands).toContain('next start');
  });

  it('should detect React/Vite project', async () => {
    const packageJson = {
      name: 'test-react-app',
      dependencies: {
        react: '^18.0.0',
        'react-dom': '^18.0.0',
      },
      devDependencies: {
        vite: '^5.0.0',
      },
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
    };

    writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    writeFileSync(join(testDir, 'vite.config.ts'), 'export default {}');

    const framework = await detector.detectFramework(testDir);

    expect(framework.name).toBe('react');
    expect(framework.detected).toBe(true);
    expect(framework.devCommands).toContain('vite');
    expect(framework.buildCommands).toContain('vite build');
  });

  it('should detect Vue project', async () => {
    const packageJson = {
      name: 'test-vue-app',
      dependencies: {
        vue: '^3.0.0',
      },
      devDependencies: {
        '@vitejs/plugin-vue': '^4.0.0',
        vite: '^5.0.0',
      },
      scripts: {
        dev: 'vite',
        build: 'vite build',
      },
    };

    writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    writeFileSync(join(testDir, 'vite.config.js'), 'export default {}');

    const framework = await detector.detectFramework(testDir);

    expect(framework.name).toBe('vue');
    expect(framework.detected).toBe(true);
  });

  it('should return generic for no framework', async () => {
    const packageJson = {
      name: 'test-generic-app',
      scripts: {
        start: 'node index.js',
      },
    };

    writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    const framework = await detector.detectFramework(testDir);

    expect(framework.name).toBe('generic');
    expect(framework.detected).toBe(true);
    expect(framework.devCommands).toContain('npm run dev');
    expect(framework.buildCommands).toContain('npm run build');
  });
});

describe('Universal Commands', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(process.cwd(), 'test-project');
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true });
    }
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true });
    }
  });

  describe('UniversalDevCommand', () => {
    it('should create dev command for Next.js', async () => {
      const packageJson = {
        dependencies: { next: '14.0.0' },
      };
      writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson));

      const command = new UniversalDevCommand({ port: '3000' }, {});
      const framework = await command['detectFramework']();
      const devCommand = command['getDevCommand'](framework, { port: '3000' });

      expect(devCommand).toBe('next dev -p 3000');
    });

    it('should create dev command for React/Vite', async () => {
      const packageJson = {
        dependencies: { react: '^18.0.0' },
        devDependencies: { vite: '^5.0.0' },
      };
      writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson));
      writeFileSync(join(testDir, 'vite.config.js'), '');

      const command = new UniversalDevCommand({ port: '8080' }, {});
      const framework = await command['detectFramework']();
      const devCommand = command['getDevCommand'](framework, { port: '8080' });

      expect(devCommand).toBe('vite --port 8080');
    });
  });

  describe('UniversalBuildCommand', () => {
    it('should create build command for Next.js', async () => {
      const packageJson = {
        dependencies: { next: '14.0.0' },
      };
      writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson));

      const command = new UniversalBuildCommand({ analyze: true }, {});
      const framework = await command['detectFramework']();
      const buildCommand = command['getBuildCommand'](framework, { analyze: true });

      expect(buildCommand).toBe('next build --analyze');
    });

    it('should create build command for React/Vite', async () => {
      const packageJson = {
        dependencies: { react: '^18.0.0' },
        devDependencies: { vite: '^5.0.0' },
      };
      writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson));
      writeFileSync(join(testDir, 'vite.config.js'), '');

      const command = new UniversalBuildCommand({ output: 'build' }, {});
      const framework = await command['detectFramework']();
      const buildCommand = command['getBuildCommand'](framework, { output: 'build' });

      expect(buildCommand).toBe('vite build --outDir build');
    });
  });

  describe('UniversalStartCommand', () => {
    it('should create start command for Next.js', async () => {
      const packageJson = {
        dependencies: { next: '14.0.0' },
      };
      writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson));

      const command = new UniversalStartCommand({ port: '3000' }, {});
      const framework = await command['detectFramework']();
      const startCommand = command['getStartCommand'](framework, { port: '3000' });

      expect(startCommand).toBe('next start -p 3000');
    });
  });

  describe('UniversalPreviewCommand', () => {
    it('should create preview command for React/Vite', async () => {
      const packageJson = {
        dependencies: { react: '^18.0.0' },
        devDependencies: { vite: '^5.0.0' },
      };
      writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson));
      writeFileSync(join(testDir, 'vite.config.js'), '');

      const command = new UniversalPreviewCommand({ port: '4173' }, {});
      const framework = await command['detectFramework']();
      const previewCommand = command['getPreviewCommand'](framework, { port: '4173' });

      expect(previewCommand).toBe('vite preview --port 4173');
    });
  });

  describe('UniversalLintCommand', () => {
    it('should create lint command for Next.js', async () => {
      const packageJson = {
        dependencies: { next: '14.0.0' },
      };
      writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson));

      const command = new UniversalLintCommand({ fix: true }, {});
      const framework = await command['detectFramework']();
      const lintCommand = command['getLintCommand'](framework, { fix: true });

      expect(lintCommand).toBe('next lint --fix');
    });

    it('should create generic lint command for unknown framework', async () => {
      const packageJson = {
        name: 'test-app',
      };
      writeFileSync(join(testDir, 'package.json'), JSON.stringify(packageJson));

      const command = new UniversalLintCommand({ fix: true }, {});
      const framework = await command['detectFramework']();
      const lintCommand = command['getLintCommand'](framework, { fix: true });

      expect(lintCommand).toBe('eslint . --fix');
    });
  });
});
