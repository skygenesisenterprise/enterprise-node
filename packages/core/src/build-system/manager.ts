import { mkdir, writeFile, access, rm, readFile } from 'fs/promises';
import { join } from 'path';
import type { BuildConfig, BuildArtifact } from './types';

export class EnterpriseBuildManager {
  private buildDir: string;
  private artifacts: Map<string, BuildArtifact> = new Map();

  constructor(baseDir: string = process.cwd()) {
    this.buildDir = join(baseDir, '.enterprise');
  }

  async initialize(): Promise<void> {
    try {
      await access(this.buildDir);
    } catch {
      await mkdir(this.buildDir, { recursive: true });
    }

    // Create subdirectories
    const subdirs = ['static', 'server', 'client', 'cache', 'logs', 'metadata'];
    await Promise.all(subdirs.map((dir) => mkdir(join(this.buildDir, dir), { recursive: true })));

    // Create build manifest
    await this.createBuildManifest();
  }

  async addArtifact(artifact: BuildArtifact): Promise<void> {
    this.artifacts.set(artifact.id, artifact);
    await this.writeArtifact(artifact);
  }

  async getArtifact(id: string): Promise<BuildArtifact | null> {
    const artifact = this.artifacts.get(id);
    if (artifact) return artifact;

    // Try to load from disk
    try {
      const artifactPath = join(this.buildDir, 'metadata', `${id}.json`);
      const content = await readFile(artifactPath, 'utf-8');
      const loadedArtifact = JSON.parse(content) as BuildArtifact;
      this.artifacts.set(id, loadedArtifact);
      return loadedArtifact;
    } catch {
      return null;
    }
  }

  async build(config: BuildConfig): Promise<void> {
    await this.initialize();

    console.log(`🏗️  Building ${config.mode} mode...`);

    // Clear previous build if clean build
    if (config.clean) {
      await this.clean();
    }

    // Add build metadata
    const buildArtifact: BuildArtifact = {
      id: `build-${Date.now()}`,
      type: 'build',
      framework: config.framework,
      timestamp: new Date().toISOString(),
      files: [],
      metadata: {
        mode: config.mode,
        environment: config.environment,
        version: config.version,
      },
    };

    await this.addArtifact(buildArtifact);

    console.log(`✅ Build completed in ${this.buildDir}`);
  }

  async clean(): Promise<void> {
    try {
      await rm(this.buildDir, { recursive: true, force: true });
      this.artifacts.clear();
      console.log(`🧹 Cleaned ${this.buildDir}`);
    } catch (error) {
      console.error(`Failed to clean build directory:`, error);
    }
  }

  async getBuildInfo(): Promise<{ totalArtifacts: number; lastBuild: string | null }> {
    const totalArtifacts = this.artifacts.size;
    const builds = Array.from(this.artifacts.values())
      .filter((a) => a.type === 'build')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      totalArtifacts,
      lastBuild: builds[0]?.timestamp || null,
    };
  }

  private async createBuildManifest(): Promise<void> {
    const manifest = {
      version: '1.0.0',
      created: new Date().toISOString(),
      structure: {
        static: 'Static assets (CSS, images, fonts)',
        server: 'Server-side build artifacts',
        client: 'Client-side build artifacts',
        cache: 'Build cache and temporary files',
        logs: 'Build logs and diagnostics',
        metadata: 'Build metadata and manifests',
      },
    };

    await writeFile(join(this.buildDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  }

  private async writeArtifact(artifact: BuildArtifact): Promise<void> {
    const artifactPath = join(this.buildDir, 'metadata', `${artifact.id}.json`);
    await writeFile(artifactPath, JSON.stringify(artifact, null, 2));
  }
}
