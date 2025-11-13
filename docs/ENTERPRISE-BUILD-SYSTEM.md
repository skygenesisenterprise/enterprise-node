# .enterprise Build System

The Enterprise SDK includes a custom build system that creates a distinctive `.enterprise` directory for build outputs, similar to how Next.js uses `.next`. This reinforces the SDK's brand identity and provides a unified build experience across all supported frameworks.

## Features

- **Unified Build Directory**: All build artifacts are stored in `.enterprise/`
- **Framework Detection**: Automatically detects your framework (Next.js, React, Vue, Angular, Svelte)
- **Build Metadata**: Tracks build information, artifacts, and timestamps
- **CLI Integration**: Full CLI support for build management
- **Clean Interface**: Easy cleanup and management of build artifacts

## Directory Structure

```
.enterprise/
├── static/          # Static assets (CSS, images, fonts)
├── server/           # Server-side build artifacts
├── client/           # Client-side build artifacts
├── cache/            # Build cache and temporary files
├── logs/             # Build logs and diagnostics
├── metadata/         # Build metadata and manifests
└── manifest.json     # Build system manifest
```

## Usage

### Programmatic API

```typescript
import { EnterpriseBuilder } from '@skygenesisenterprise/enterprise-node';

// Create builder with auto-detected framework
const builder = await EnterpriseBuilder.create({
  mode: 'production',
  environment: 'production',
  version: '1.0.0',
});

// Build the project
await builder.build();

// Get build information
const info = await builder.getInfo();
console.log(`Total artifacts: ${info.totalArtifacts}`);

// Clean build directory
await builder.clean();
```

### CLI Commands

```bash
# Initialize .enterprise build system
npx enterprise enterprise-builder init

# Build with .enterprise system
npx enterprise enterprise-builder build --mode production

# Build with specific framework
npx enterprise enterprise-builder build --framework nextjs

# Clean build directory
npx enterprise enterprise-builder clean

# Show build information
npx enterprise enterprise-builder info

# Build with config file
npx enterprise enterprise-builder build --config ./enterprise-build.json
```

## Configuration

### Build Config

```typescript
interface BuildConfig {
  mode: 'development' | 'production';
  framework: 'nextjs' | 'react' | 'vue' | 'angular' | 'svelte';
  environment: string;
  version: string;
  clean?: boolean;
}
```

### Config File (enterprise-build.json)

```json
{
  "mode": "production",
  "framework": "nextjs",
  "environment": "production",
  "version": "1.0.0",
  "clean": true
}
```

## Framework Support

The build system automatically detects and supports:

- **Next.js** - Detects `next.config.js/ts/mjs`
- **React** - Detects `package.json` with React dependencies
- **Vue** - Detects `vue.config.js` or `vite.config.ts`
- **Angular** - Detects `angular.json`
- **Svelte** - Detects `svelte.config.js` or `vite.config.ts`

## Build Artifacts

Each build creates artifacts with metadata:

```typescript
interface BuildArtifact {
  id: string;
  type: 'build' | 'asset' | 'cache' | 'metadata';
  framework?: string;
  timestamp: string;
  files: string[];
  metadata?: Record<string, any>;
}
```

## Integration with SDK

The `.enterprise` build system integrates seamlessly with the Enterprise SDK:

```typescript
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

const sdk = new EnterpriseSDK();
await sdk.initialize();

// Access build system through SDK
const builder = sdk.builder;
await builder.build();
```

## Benefits

1. **Brand Identity**: Reinforces the Enterprise SDK brand
2. **Consistency**: Unified build experience across frameworks
3. **Organization**: Clean separation of build artifacts
4. **Metadata**: Rich build information and tracking
5. **Flexibility**: Works with any JavaScript framework
6. **Performance**: Efficient caching and incremental builds

## Examples

### Basic Next.js Project

```typescript
import { EnterpriseBuilder } from '@skygenesisenterprise/enterprise-node';

const builder = await EnterpriseBuilder.create({
  mode: 'production',
  framework: 'nextjs',
  environment: 'production',
  version: '2.1.0',
});

await builder.build();
// Creates .enterprise/ with Next.js build artifacts
```

### React with Custom Config

```json
{
  "mode": "development",
  "framework": "react",
  "environment": "development",
  "version": "1.0.0",
  "clean": false
}
```

```bash
npx enterprise enterprise-builder build --config ./build-config.json
```

### Multi-Framework Workspace

```typescript
// Auto-detects framework for each package
const nextjsBuilder = await EnterpriseBuilder.create({
  mode: 'production',
}); // Detects Next.js

const reactBuilder = await EnterpriseBuilder.create({
  mode: 'production',
}); // Detects React
```

The `.enterprise` build system provides a professional, branded build experience that reinforces the Enterprise SDK identity while maintaining flexibility and performance across all supported frameworks.
