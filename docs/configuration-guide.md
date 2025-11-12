# Configuration Guide

This comprehensive guide covers all configuration options available in the Enterprise SDK, from basic setup to advanced customization.

## Core Configuration

### EnterpriseConfig Interface

The main configuration object that controls SDK behavior:

```typescript
interface EnterpriseConfig {
  modules?: ModuleConfig;
  integrations?: IntegrationConfig;
  branding?: BrandingConfig;
  runtime?: RuntimeConfig;
  logging?: LoggingConfig;
  performance?: PerformanceConfig;
}
```

### Basic Configuration

```typescript
import { createEnterprise } from '@skygenesisenterprise/core';

const enterprise = await createEnterprise({
  modules: {
    ai: true,
    storage: true,
    ui: true,
    project: false,
    auth: false,
    sdk: true,
  },
  branding: {
    name: 'My Application',
    theme: 'dark',
    primaryColor: '#3b82f6',
  },
});
```

## Module Configuration

### ModuleConfig Interface

```typescript
interface ModuleConfig {
  ai?: boolean | AIConfig;
  storage?: boolean | StorageConfig;
  ui?: boolean | UIConfig;
  project?: boolean | ProjectConfig;
  auth?: boolean | AuthConfig;
  sdk?: boolean | SDKConfig;
}
```

### AI Module Configuration

```typescript
interface AIConfig {
  provider?: 'openai' | 'anthropic' | 'local';
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  timeout?: number;
  retries?: number;
  endpoint?: string; // For local providers
  headers?: Record<string, string>;
}
```

#### OpenAI Configuration

```typescript
const aiConfig: AIConfig = {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-3.5-turbo',
  maxTokens: 2048,
  temperature: 0.7,
  timeout: 30000,
  retries: 3,
  headers: {
    'User-Agent': 'MyApp/1.0',
  },
};
```

#### Anthropic Configuration

```typescript
const aiConfig: AIConfig = {
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-sonnet-20240229',
  maxTokens: 4096,
  temperature: 0.7,
  timeout: 60000,
  retries: 2,
};
```

#### Local Model Configuration

```typescript
const aiConfig: AIConfig = {
  provider: 'local',
  model: 'llama2',
  endpoint: 'http://localhost:8080/v1/completions',
  maxTokens: 2048,
  temperature: 0.7,
  headers: {
    Authorization: 'Bearer your-token',
  },
};
```

### Storage Module Configuration

```typescript
interface StorageConfig {
  provider?: 'local' | 's3' | 'gcs' | 'azure';
  bucket?: string;
  region?: string;
  basePath?: string; // For local storage
  credentials?: StorageCredentials;
  encryption?: EncryptionConfig;
  caching?: CachingConfig;
  timeout?: number;
  retries?: number;
}
```

#### Storage Credentials Interface

```typescript
interface StorageCredentials {
  // AWS S3
  accessKey?: string;
  secretKey?: string;
  token?: string;

  // Google Cloud Storage
  clientEmail?: string;
  privateKey?: string;
  projectId?: string;

  // Azure Blob Storage
  connectionString?: string;
  sasToken?: string;

  // Generic
  endpoint?: string;
}
```

#### AWS S3 Configuration

```typescript
const storageConfig: StorageConfig = {
  provider: 's3',
  bucket: 'my-app-storage',
  region: 'us-west-2',
  credentials: {
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  encryption: {
    enabled: true,
    algorithm: 'AES-256-GCM',
    keyId: process.env.ENCRYPTION_KEY_ID,
  },
  caching: {
    enabled: true,
    ttl: 300, // 5 minutes
    maxSize: 100, // MB
  },
  timeout: 30000,
  retries: 3,
};
```

#### Google Cloud Storage Configuration

```typescript
const storageConfig: StorageConfig = {
  provider: 'gcs',
  bucket: 'my-app-storage',
  credentials: {
    clientEmail: process.env.GCS_CLIENT_EMAIL,
    privateKey: process.env.GCS_PRIVATE_KEY,
    projectId: 'my-project-id',
  },
  encryption: {
    enabled: true,
    algorithm: 'AES-256',
  },
};
```

#### Local Storage Configuration

```typescript
const storageConfig: StorageConfig = {
  provider: 'local',
  basePath: './data',
  encryption: {
    enabled: true,
    algorithm: 'AES-256-GCM',
    key: 'your-encryption-key',
  },
  caching: {
    enabled: true,
    ttl: 600, // 10 minutes
  },
};
```

### UI Module Configuration

```typescript
interface UIConfig {
  theme?: 'light' | 'dark' | 'auto';
  components?: ComponentConfig;
  animations?: AnimationConfig;
  icons?: IconConfig;
  css?: CSSConfig;
  notifications?: NotificationConfig;
}
```

#### Component Configuration

```typescript
interface ComponentConfig {
  button?: boolean | ButtonConfig;
  input?: boolean | InputConfig;
  modal?: boolean | ModalConfig;
  notification?: boolean | NotificationComponentConfig;
  form?: boolean | FormConfig;
  table?: boolean | TableConfig;
}
```

#### Button Configuration

```typescript
interface ButtonConfig {
  variants?: string[];
  sizes?: string[];
  disabledOpacity?: number;
  loadingSpinner?: boolean;
  rippleEffect?: boolean;
}
```

#### Animation Configuration

```typescript
interface AnimationConfig {
  enabled?: boolean;
  duration?: number;
  easing?: string;
  reducedMotion?: boolean;
  customAnimations?: Record<string, AnimationKeyframes>;
}
```

#### Complete UI Configuration

```typescript
const uiConfig: UIConfig = {
  theme: 'auto',
  components: {
    button: {
      variants: ['primary', 'secondary', 'outline', 'ghost'],
      sizes: ['sm', 'md', 'lg'],
      disabledOpacity: 0.5,
      loadingSpinner: true,
      rippleEffect: true,
    },
    input: {
      variants: ['outline', 'filled', 'flushed'],
      sizes: ['sm', 'md', 'lg'],
      focusBorderColor: '#3b82f6',
    },
    modal: {
      sizes: ['sm', 'md', 'lg', 'xl', 'full'],
      closeOnOverlayClick: true,
      closeOnEsc: true,
      blockScrollOnMount: true,
    },
  },
  animations: {
    enabled: true,
    duration: 200,
    easing: 'ease-in-out',
    reducedMotion: true,
  },
  icons: {
    provider: 'lucide-react',
    size: 20,
    strokeWidth: 2,
  },
  notifications: {
    position: 'top-right',
    duration: 5000,
    maxVisible: 3,
    pauseOnHover: true,
  },
};
```

### Auth Module Configuration

```typescript
interface AuthConfig {
  provider?: 'jwt' | 'oauth' | 'saml' | 'custom';
  secret?: string;
  expiresIn?: string;
  refreshExpiresIn?: string;
  issuer?: string;
  audience?: string;
  algorithms?: string[];
  password?: PasswordConfig;
  session?: SessionConfig;
  oauth?: OAuthConfig;
  saml?: SAMLConfig;
}
```

#### Password Configuration

```typescript
interface PasswordConfig {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSymbols?: boolean;
  saltRounds?: number;
  hashingAlgorithm?: 'bcrypt' | 'scrypt' | 'argon2';
}
```

#### Session Configuration

```typescript
interface SessionConfig {
  storage?: 'memory' | 'redis' | 'database';
  timeout?: number;
  rolling?: boolean;
  cookie?: CookieConfig;
}
```

#### Complete Auth Configuration

```typescript
const authConfig: AuthConfig = {
  provider: 'jwt',
  secret: process.env.JWT_SECRET,
  expiresIn: '1h',
  refreshExpiresIn: '7d',
  issuer: 'my-app',
  audience: 'my-users',
  algorithms: ['HS256'],
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
    saltRounds: 12,
    hashingAlgorithm: 'bcrypt',
  },
  session: {
    storage: 'redis',
    timeout: 3600,
    rolling: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
    },
  },
};
```

### Project Module Configuration

```typescript
interface ProjectConfig {
  rootPath?: string;
  packageJsonPath?: string;
  autoSave?: boolean;
  backup?: BackupConfig;
  validation?: ValidationConfig;
}
```

#### Backup Configuration

```typescript
interface BackupConfig {
  enabled?: boolean;
  interval?: number;
  maxBackups?: number;
  location?: string;
}
```

#### Complete Project Configuration

```typescript
const projectConfig: ProjectConfig = {
  rootPath: process.cwd(),
  packageJsonPath: './package.json',
  autoSave: true,
  backup: {
    enabled: true,
    interval: 300000, // 5 minutes
    maxBackups: 10,
    location: './backups',
  },
  validation: {
    strict: true,
    schemaVersion: 'latest',
  },
};
```

### SDK Module Configuration

```typescript
interface SDKConfig {
  version?: string;
  metadata?: Record<string, any>;
  selfReference?: boolean;
  analysis?: AnalysisConfig;
  introspection?: IntrospectionConfig;
}
```

#### Analysis Configuration

```typescript
interface AnalysisConfig {
  enabled?: boolean;
  depth?: number;
  includePrivate?: boolean;
  cacheResults?: boolean;
}
```

#### Complete SDK Configuration

```typescript
const sdkConfig: SDKConfig = {
  version: '1.0.0',
  metadata: {
    environment: process.env.NODE_ENV,
    buildDate: new Date().toISOString(),
    features: ['ai', 'storage', 'ui'],
  },
  selfReference: true,
  analysis: {
    enabled: true,
    depth: 3,
    includePrivate: false,
    cacheResults: true,
  },
  introspection: {
    enabled: true,
    exposeInternals: false,
  },
};
```

## Integration Configuration

### IntegrationConfig Interface

```typescript
interface IntegrationConfig {
  react?: ReactConfig;
  svelte?: SvelteConfig;
  vue?: VueConfig;
  angular?: AngularConfig;
}
```

### React Configuration

```typescript
interface ReactConfig {
  strictMode?: boolean;
  concurrentMode?: boolean;
  suspense?: boolean;
  errorBoundary?: boolean;
  devTools?: boolean;
}
```

### Svelte Configuration

```typescript
interface SvelteConfig {
  devMode?: boolean;
  hydratable?: boolean;
  immutable?: boolean;
  legacy?: boolean;
}
```

## Branding Configuration

### BrandingConfig Interface

```typescript
interface BrandingConfig {
  name?: string;
  logo?: string;
  theme?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: string;
  borderRadius?: string;
  customCSS?: string;
  cssVariables?: Record<string, string>;
}
```

### Complete Branding Configuration

```typescript
const brandingConfig: BrandingConfig = {
  name: 'My Application',
  logo: '/logo.svg',
  theme: 'auto',
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  accentColor: '#f59e0b',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '16px',
  borderRadius: '0.375rem',
  customCSS: `
    .my-app {
      font-family: var(--enterprise-font-family);
    }
  `,
  cssVariables: {
    '--enterprise-custom-color': '#10b981',
    '--enterprise-custom-spacing': '1rem',
  },
};
```

## Runtime Configuration

### RuntimeConfig Interface

```typescript
interface RuntimeConfig {
  wasm?: boolean;
  fallback?: boolean;
  timeout?: number;
  retries?: number;
  cache?: CacheConfig;
  workers?: WorkerConfig;
}
```

### Cache Configuration

```typescript
interface CacheConfig {
  enabled?: boolean;
  ttl?: number;
  maxSize?: number;
  strategy?: 'lru' | 'fifo' | 'lfu';
}
```

### Worker Configuration

```typescript
interface WorkerConfig {
  enabled?: boolean;
  maxWorkers?: number;
  workerPath?: string;
}
```

## Logging Configuration

### LoggingConfig Interface

```typescript
interface LoggingConfig {
  level?: 'debug' | 'info' | 'warn' | 'error';
  format?: 'json' | 'text' | 'structured';
  output?: 'console' | 'file' | 'remote';
  file?: FileConfig;
  remote?: RemoteConfig;
}
```

### File Configuration

```typescript
interface FileConfig {
  path?: string;
  maxSize?: number;
  maxFiles?: number;
  rotation?: 'daily' | 'weekly' | 'monthly';
}
```

### Remote Configuration

```typescript
interface RemoteConfig {
  endpoint?: string;
  apiKey?: string;
  batchSize?: number;
  flushInterval?: number;
}
```

## Performance Configuration

### PerformanceConfig Interface

```typescript
interface PerformanceConfig {
  monitoring?: boolean;
  metrics?: MetricsConfig;
  profiling?: ProfilingConfig;
  optimization?: OptimizationConfig;
}
```

### Metrics Configuration

```typescript
interface MetricsConfig {
  enabled?: boolean;
  interval?: number;
  includeMemory?: boolean;
  includeCPU?: boolean;
  includeNetwork?: boolean;
}
```

## Environment-Specific Configuration

### Development Configuration

```typescript
const devConfig: EnterpriseConfig = {
  modules: {
    ai: true,
    storage: true,
    ui: true,
    project: true,
    auth: true,
    sdk: true,
  },
  logging: {
    level: 'debug',
    format: 'text',
    output: 'console',
  },
  performance: {
    monitoring: true,
    metrics: {
      enabled: true,
      interval: 5000,
    },
  },
};
```

### Production Configuration

```typescript
const prodConfig: EnterpriseConfig = {
  modules: {
    ai: true,
    storage: true,
    ui: true,
    project: false,
    auth: true,
    sdk: false,
  },
  logging: {
    level: 'warn',
    format: 'json',
    output: 'remote',
    remote: {
      endpoint: 'https://logs.example.com/api/logs',
      apiKey: process.env.LOG_API_KEY,
    },
  },
  runtime: {
    wasm: true,
    fallback: true,
    timeout: 30000,
    retries: 3,
  },
};
```

## Configuration Files

### enterprise.config.ts

```typescript
import { EnterpriseConfig } from '@skygenesisenterprise/core';

const config: EnterpriseConfig = {
  modules: {
    ai: {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
    },
    storage: {
      provider: 's3',
      bucket: process.env.S3_BUCKET,
      region: 'us-west-2',
    },
    ui: {
      theme: 'auto',
      components: {
        button: true,
        input: true,
        modal: true,
      },
    },
    auth: {
      provider: 'jwt',
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    },
  },
  branding: {
    name: 'My Application',
    primaryColor: '#3b82f6',
    theme: 'auto',
  },
};

export default config;
```

### Environment Variables

```bash
# .env.example
# AI Configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Storage Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET=your_s3_bucket
GCS_CREDENTIALS=your_gcs_credentials

# Auth Configuration
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Application Configuration
NODE_ENV=development
LOG_LEVEL=debug
API_ENDPOINT=https://api.example.com
```

## Configuration Validation

### Schema Validation

```typescript
import { validateConfig } from '@skygenesisenterprise/core';

const config = {
  modules: {
    ai: {
      provider: 'openai',
      // apiKey missing - will throw error
    },
  },
};

try {
  validateConfig(config);
  console.log('Configuration is valid');
} catch (error) {
  console.error('Configuration error:', error.message);
}
```

### Runtime Validation

```typescript
import { createEnterprise } from '@skygenesisenterprise/core';

const enterprise = await createEnterprise({
  modules: {
    ai: {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
    },
  },
  validateOnLoad: true, // Validate configuration at runtime
});
```

## Best Practices

### Security

1. **Environment Variables**: Never store secrets in configuration files
2. **Validation**: Always validate configuration in production
3. **Least Privilege**: Use minimal required permissions
4. **Encryption**: Encrypt sensitive configuration data

### Performance

1. **Lazy Loading**: Load configuration only when needed
2. **Caching**: Cache validated configuration
3. **Validation**: Validate configuration once at startup
4. **Monitoring**: Monitor configuration changes

### Maintainability

1. **TypeScript**: Use TypeScript for type safety
2. **Documentation**: Document all configuration options
3. **Defaults**: Provide sensible defaults
4. **Validation**: Validate all configuration inputs

This configuration guide provides comprehensive coverage of all configuration options in the Enterprise SDK. Use these configurations to customize the SDK behavior according to your specific requirements.
