export interface BuildArtifact {
  id: string;
  type: 'build' | 'asset' | 'cache' | 'metadata';
  framework?: string;
  timestamp: string;
  files: string[];
  metadata?: Record<string, any>;
}

export interface BuildConfig {
  mode: 'development' | 'production';
  framework: string;
  environment: string;
  version: string;
  clean?: boolean;
}

export interface BuildManifest {
  version: string;
  created: string;
  structure: Record<string, string>;
}

export interface BuildInfo {
  totalArtifacts: number;
  lastBuild: string | null;
}
