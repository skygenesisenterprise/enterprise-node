<div align="center">

# 🚀 Enterprise SDK Documentation

**Comprehensive documentation for the SkyGenesis Enterprise SDK**

[![Version](https://img.shields.io/badge/version-1.0.9-blue.svg)](https://github.com/skygenesisenterprise/enterprise-node)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

</div>

## 📖 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Core Concepts](#core-concepts)
- [Modules](#modules)
- [Debug System](#debug-system)
- [Plugin System](#plugin-system)
- [Configuration](#configuration)
- [Integrations](#integrations)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

The Enterprise SDK is a comprehensive, modular TypeScript SDK designed for building enterprise-grade applications. It provides a unified API for AI, storage, UI components, authentication, project management, and unique self-referential capabilities.

### Key Features

- 🧠 **AI Integration**: Support for OpenAI, Anthropic, and local AI models
- 💾 **Universal Storage**: Unified API for local, S3, GCS, and Azure storage
- 🎨 **UI Components**: Pre-built React components with theming support
- 🔐 **Authentication**: JWT, OAuth, and SAML authentication providers
- 📁 **Project Management**: Programmatic package.json and project management
- 🔄 **Self-Reference**: Unique meta-programming and introspection capabilities
- 🔍 **Debug System**: Comprehensive tracing and logging inspired by Rust's tracing
- 🔌 **Plugin System**: Modular architecture with lifecycle management
- ⚡ **Performance**: WASM runtime with JavaScript fallbacks
- 🎭 **Branding**: Comprehensive theming and branding system

## 🚀 Quick Start

### 1. Installation

```bash
npm install @skygenesisenterprise/core
# or
yarn add @skygenesisenterprise/core
# or
pnpm add @skygenesisenterprise/core
```

### 2. Basic Usage

```typescript
import { createEnterprise } from '@skygenesisenterprise/core';

// Initialize the SDK
const enterprise = await createEnterprise({
  modules: {
    ai: true,
    storage: true,
    ui: true,
    debug: true, // Enable debug system
  },
  branding: {
    name: 'My Application',
    theme: 'dark',
  },
});

// Use AI module
const response = await enterprise.ai.generate('Hello, world!');
console.log(response);

// Use Storage module
await enterprise.storage.store('user:123', { name: 'John', age: 30 });
const user = await enterprise.storage.retrieve('user:123');

// Use UI module
enterprise.ui.showNotification('Welcome to Enterprise SDK!', 'success');

// Use Debug module
const span = enterprise.debug.createSpan('user-operation');
enterprise.debug.info('Operation completed successfully');
span.end();
```

### 3. React Integration

```tsx
import { EnterpriseProvider, useAI } from '@skygenesisenterprise/core';

function App() {
  return (
    <EnterpriseProvider config={{ modules: { ai: true } }}>
      <MyComponent />
    </EnterpriseProvider>
  );
}

function MyComponent() {
  const ai = useAI();

  const generateText = async () => {
    const response = await ai.generate('Write a poem');
    console.log(response);
  };

  return <button onClick={generateText}>Generate Text</button>;
}
```

## 📦 Installation

### Prerequisites

- Node.js 18+
- TypeScript 5.0+ (recommended)
- Modern browser with ES2020 support (for frontend usage)

### Install Core Package

```bash
npm install @skygenesisenterprise/core
```

### Install Individual Modules

```bash
# AI Module
npm install @skygenesisenterprise/ai

# Storage Module
npm install @skygenesisenterprise/storage

# UI Module
npm install @skygenesisenterprise/ui

# Auth Module
npm install @skygenesisenterprise/auth

# Project Module
npm install @skygenesisenterprise/project

# SDK Module
npm install @skygenesisenterprise/sdk
```

### Framework Integrations

```bash
# React Integration
npm install @skygenesisenterprise/integrations-react

# Svelte Integration
npm install @skygenesisenterprise/integrations-svelte
```

## 🏗️ Core Concepts

### Modular Architecture

The Enterprise SDK follows a modular architecture where each module provides specific functionality:

```
@skygenesisenterprise/core
├── modules/
│   ├── ai/          # AI and machine learning
│   ├── storage/     # Data storage
│   ├── ui/          # UI components
│   ├── auth/        # Authentication
│   ├── project/     # Project management
│   ├── sdk/         # Self-reference capabilities
│   └── debug/       # Debug system and tracing
├── integrations/
│   ├── react/       # React integration
│   └── svelte/      # Svelte integration
├── plugins/         # Plugin system
└── shared/          # Shared utilities
```

### Configuration-Driven

All modules are configured through a unified configuration object:

```typescript
const config = {
  modules: {
    ai: { provider: 'openai', apiKey: '...' },
    storage: { provider: 's3', bucket: 'my-bucket' },
    ui: { theme: 'dark' },
    debug: { level: 'info', enableTracing: true },
  },
  branding: {
    name: 'My App',
    primaryColor: '#3b82f6',
  },
};
```

### Self-Reference Capability

The SDK can reference and analyze itself:

```typescript
const sdk = enterprise.sdk;
const analysis = await sdk.analyzeSelf();
console.log(analysis.modules); // All loaded modules
console.log(analysis.capabilities); // Available capabilities
```

## 📚 Modules

### AI Module (`@skygenesisenterprise/ai`)

Provides artificial intelligence capabilities including text generation, sentiment analysis, and entity extraction.

**Features:**

- Multiple AI providers (OpenAI, Anthropic, Local)
- Text generation and completion
- Sentiment analysis
- Entity extraction
- Text classification
- Streaming support

**Quick Example:**

```typescript
const ai = new AI({ provider: 'openai', apiKey: '...' });
const response = await ai.generate('Write a story about dragons');
const sentiment = await ai.analyzeSentiment('I love this product!');
```

[📖 Full AI Documentation](./module-guide.md#ai-module)

### Storage Module (`@skygenesisenterprise/storage`)

Unified storage interface supporting multiple providers with consistent API.

**Features:**

- Multiple providers (Local, S3, GCS, Azure)
- Encryption support
- TTL and metadata
- File operations
- Caching

**Quick Example:**

```typescript
const storage = new Storage({ provider: 's3', bucket: 'my-bucket' });
await storage.store('user:123', userData, { encryption: true });
const data = await storage.retrieve('user:123');
```

[📖 Full Storage Documentation](./module-guide.md#storage-module)

### UI Module (`@skygenesisenterprise/ui`)

Comprehensive UI component library with theming and branding support.

**Features:**

- React components (Button, Input, Modal, etc.)
- Theme system (light, dark, auto)
- Branding support
- Responsive design
- Accessibility

**Quick Example:**

```typescript
import { Button, Modal } from '@skygenesisenterprise/ui';

<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
```

[📖 Full UI Documentation](./module-guide.md#ui-module)

### Auth Module (`@skygenesisenterprise/auth`)

Authentication and authorization system with multiple providers.

**Features:**

- JWT, OAuth, SAML providers
- Password security
- Session management
- Role-based access
- Token management

**Quick Example:**

```typescript
const auth = new Auth({ provider: 'jwt', secret: 'my-secret' });
const result = await auth.login({ email, password });
const token = await auth.generateToken({ userId: '123' });
```

[📖 Full Auth Documentation](./module-guide.md#auth-module)

### Project Module (`@skygenesisenterprise/project`)

Project management and package.json manipulation utilities.

**Features:**

- Project information management
- Dependency management
- Script management
- Version control
- Repository integration

**Quick Example:**

```typescript
const project = new Project();
await project.addDependency('lodash', '^4.17.21');
project.addScript('build', 'webpack');
```

[📖 Full Project Documentation](./module-guide.md#project-module)

### SDK Module (`@skygenesisenterprise/sdk`)

Unique self-referential capabilities and meta-programming features.

**Features:**

- Self-reference and introspection
- Module inspection
- Capability detection
- Runtime analysis
- Meta-programming

**Quick Example:**

```typescript
const sdk = new SDK({ selfReference: true });
const modules = sdk.getLoadedModules();
const analysis = await sdk.analyzeSelf();
```

[📖 Full SDK Documentation](./module-guide.md#sdk-module)

## 🔍 Debug System

Comprehensive debugging and tracing system inspired by Rust's tracing ecosystem.

**Features:**

- 5-level logging (TRACE, DEBUG, INFO, WARN, ERROR)
- Distributed tracing with spans
- Performance monitoring and metrics
- Structured logging with JSON output
- Module-specific debug macros
- Real-time log filtering

**Quick Example:**

```typescript
// Enable debug module
const enterprise = await createEnterprise({
  modules: { debug: true },
});

// Create spans for tracing
const span = enterprise.debug.createSpan('user-operation', {
  userId: '123',
  operation: 'data-processing',
});

// Log at different levels
enterprise.debug.info('Processing user data', { recordCount: 1000 });
enterprise.debug.warn('Rate limit approaching', { currentRate: 95 });

// End span and get metrics
span.end();
const metrics = enterprise.debug.getMetrics();
console.log(`Operation completed in ${span.duration}ms`);
```

[📖 Full Debug Documentation](./debug-guide.md)

## 🔌 Plugin System

Modular plugin architecture with lifecycle management and debug integration.

**Features:**

- Plugin registration and discovery
- Lifecycle management (initialize, configure, destroy)
- Dependency resolution
- Performance monitoring
- Framework-specific plugins
- Debug integration for all plugin operations

**Quick Example:**

```typescript
// Create a plugin
class MyPlugin implements EnterprisePlugin {
  name = 'my-plugin';
  version = '1.0.0';

  async initialize(context: PluginContext) {
    context.debug.info('Initializing plugin');
    // Plugin setup logic
  }

  async execute(input: any) {
    const span = context.debug.createSpan('plugin-execution');
    try {
      // Plugin logic
      return { processed: true, data: input };
    } finally {
      span.end();
    }
  }
}

// Register and use plugin
await enterprise.plugins.register(new MyPlugin());
const result = await enterprise.plugins.execute('my-plugin', data);
```

[📖 Full Plugin Documentation](./plugin-guide.md)

## ⚙️ Configuration

### Basic Configuration

```typescript
import { createEnterprise } from '@skygenesisenterprise/core';

const enterprise = await createEnterprise({
  modules: {
    ai: {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
    },
    storage: {
      provider: 's3',
      bucket: 'my-bucket',
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
    debug: {
      level: 'info',
      enableTracing: true,
      enableConsole: true,
      maxLogEntries: 1000,
    },
  },
  branding: {
    name: 'My Application',
    primaryColor: '#3b82f6',
    theme: 'auto',
  },
  runtime: {
    wasm: true,
    fallback: true,
  },
});
```

### Environment Variables

```bash
# AI Configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Storage Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET=your_s3_bucket

# Auth Configuration
JWT_SECRET=your_jwt_secret

# Application Configuration
NODE_ENV=production
LOG_LEVEL=info
```

### Configuration File

Create `enterprise.config.ts` in your project root:

```typescript
import { EnterpriseConfig } from '@skygenesisenterprise/core';

export default {
  modules: {
    ai: {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
    },
    storage: {
      provider: 's3',
      bucket: process.env.S3_BUCKET,
    },
  },
  branding: {
    name: 'My App',
    theme: 'dark',
  },
} as EnterpriseConfig;
```

[📖 Full Configuration Guide](./configuration-guide.md)

## 🔗 Integrations

### React Integration

```typescript
import { EnterpriseProvider, useAI, useStorage } from '@skygenesisenterprise/core';

function App() {
  return (
    <EnterpriseProvider config={config}>
      <MyComponent />
    </EnterpriseProvider>
  );
}

function MyComponent() {
  const ai = useAI();
  const storage = useStorage();

  // Use modules...
}
```

### Svelte Integration

```svelte
<script>
  import { onMount } from 'svelte';
  import { ai, storage } from '@skygenesisenterprise/core/stores';

  onMount(async () => {
    const response = await $ai.generate('Hello world');
    console.log(response);
  });
</script>
```

### Next.js Integration

```typescript
// app/providers.tsx
'use client';

import { EnterpriseProvider } from '@skygenesisenterprise/core';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EnterpriseProvider config={config}>
      {children}
    </EnterpriseProvider>
  );
}
```

[📖 Full Integration Guide](./integration-guide.md)

## 📖 API Reference

### Core API

#### `createEnterprise(config?: EnterpriseConfig): Promise<EnterpriseSDK>`

Initialize the Enterprise SDK with optional configuration.

#### `EnterpriseSDK`

Main SDK instance containing all loaded modules.

```typescript
interface EnterpriseSDK {
  ai: AI;
  storage: Storage;
  ui: UI;
  auth: Auth;
  project: Project;
  sdk: SDK;
  debug: Debug;
  plugins: PluginManager;
}
```

### Module APIs

Each module provides its own API:

```typescript
// AI Module
class AI {
  generate(prompt: string): Promise<string>;
  analyzeSentiment(text: string): Promise<SentimentResult>;
  extractEntities(text: string): Promise<Entity[]>;
}

// Storage Module
class Storage {
  store(key: string, data: any): Promise<void>;
  retrieve<T>(key: string): Promise<T>;
  delete(key: string): Promise<void>;
}

// UI Module
class UI {
  showNotification(message: string, type: string): void;
  setTheme(theme: string): void;
  applyBranding(branding: BrandingConfig): void;
}
```

[📖 Full API Reference](./api-reference.md)

## 💡 Examples

### Basic AI Chat

```typescript
import { createEnterprise } from '@skygenesisenterprise/core';

const enterprise = await createEnterprise({ modules: { ai: true } });

async function chat(message: string) {
  const response = await enterprise.ai.generate(message);
  console.log('AI:', response);
}

chat('Hello, how are you?');
```

### File Storage with Encryption

```typescript
const enterprise = await createEnterprise({
  modules: {
    storage: {
      provider: 's3',
      bucket: 'secure-bucket',
      encryption: { enabled: true },
    },
  },
});

// Store encrypted data
await enterprise.storage.store('secret:123', sensitiveData, {
  encryption: true,
  ttl: 3600,
});
```

### React Dashboard

```tsx
import { EnterpriseProvider, useAI, useStorage, useUI } from '@skygenesisenterprise/core';

function Dashboard() {
  const ai = useAI();
  const storage = useStorage();
  const ui = useUI();

  const [insights, setInsights] = useState('');

  const generateInsights = async () => {
    const data = await storage.retrieve('analytics:data');
    const analysis = await ai.generate(`Analyze this data: ${JSON.stringify(data)}`);
    setInsights(analysis);
    ui.showNotification('Insights generated!', 'success');
  };

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <button onClick={generateInsights}>Generate Insights</button>
      <p>{insights}</p>
    </div>
  );
}
```

### Authentication Flow

```typescript
const enterprise = await createEnterprise({
  modules: {
    auth: {
      provider: 'jwt',
      secret: process.env.JWT_SECRET,
    },
  },
});

// Register user
const user = await enterprise.auth.register({
  email: 'user@example.com',
  password: 'securePassword123',
  name: 'John Doe',
});

// Login
const login = await enterprise.auth.login({
  email: 'user@example.com',
  password: 'securePassword123',
});

// Verify token
const payload = await enterprise.auth.verifyToken(login.token);
```

### Self-Reference Analysis

```typescript
const enterprise = await createEnterprise({
  modules: { sdk: true },
});

// Analyze SDK
const analysis = await enterprise.sdk.analyzeSelf();
console.log('Loaded modules:', analysis.modules);
console.log('Capabilities:', analysis.capabilities);

// Get module info
const aiInfo = enterprise.sdk.getModuleInfo('ai');
console.log('AI module:', aiInfo);
```

### Debug System Example

```typescript
import { createEnterprise } from '@skygenesisenterprise/core';

const enterprise = await createEnterprise({
  modules: {
    ai: true,
    debug: { level: 'info', enableTracing: true },
  },
});

// Create a span for user operation
const userSpan = enterprise.debug.createSpan('user-registration', {
  userId: 'user-123',
  email: 'user@example.com',
});

try {
  enterprise.debug.info('Starting user registration');

  // Simulate user registration
  const result = await enterprise.ai.generate('Welcome message for new user');

  enterprise.debug.info('User registration successful', {
    userId: 'user-123',
    messageLength: result.length,
  });
} catch (error) {
  enterprise.debug.error('User registration failed', {
    userId: 'user-123',
    error: error.message,
  });
} finally {
  userSpan.end();

  // Get performance metrics
  const metrics = enterprise.debug.getMetrics();
  console.log(`Registration completed in ${userSpan.duration}ms`);
  console.log('Total operations:', metrics.totalSpans);
}
```

### Plugin System Example

```typescript
import { EnterprisePlugin, PluginContext } from '@skygenesisenterprise/core';

class AnalyticsPlugin implements EnterprisePlugin {
  name = 'analytics-plugin';
  version = '1.0.0';

  async initialize(context: PluginContext) {
    context.debug.info('Initializing analytics plugin');

    // Setup analytics tracking
    this.setupTracking(context.debug);
  }

  trackEvent(event: string, data: any) {
    const span = enterprise.debug.createSpan('analytics-event', { event });

    try {
      // Send to analytics service
      this.sendToAnalytics(event, data);

      enterprise.debug.info('Event tracked', { event, dataKeys: Object.keys(data) });
    } catch (error) {
      enterprise.debug.error('Event tracking failed', { event, error: error.message });
    } finally {
      span.end();
    }
  }

  private setupTracking(debug: any) {
    debug.debug('Analytics tracking setup completed');
  }

  private sendToAnalytics(event: string, data: any) {
    // Analytics service integration
  }
}

// Register and use the plugin
await enterprise.plugins.register(new AnalyticsPlugin());
await enterprise.plugins.execute('analytics-plugin', {
  event: 'user_login',
  data: { userId: 'user-123', timestamp: Date.now() },
});
```

[📖 More Examples](./examples.md)

## 🔧 Troubleshooting

### Common Issues

#### Module Not Found Error

```bash
Error: Cannot find module '@skygenesisenterprise/ai'
```

**Solution:** Install the required module:

```bash
npm install @skygenesisenterprise/ai
```

#### Configuration Validation Error

```bash
Error: Invalid configuration: API key is required for OpenAI provider
```

**Solution:** Ensure all required configuration values are provided:

```typescript
const config = {
  modules: {
    ai: {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY, // Required
    },
  },
};
```

#### WASM Runtime Error

```bash
Error: WASM module failed to load
```

**Solution:** Enable fallback to JavaScript runtime:

```typescript
const config = {
  runtime: {
    wasm: true,
    fallback: true, // Enable JS fallback
  },
};
```

### Debug Mode

Enable debug logging for troubleshooting:

```typescript
const enterprise = await createEnterprise({
  logging: {
    level: 'debug',
    format: 'text',
  },
});
```

### Performance Issues

1. **Enable Caching:**

```typescript
const config = {
  runtime: {
    cache: {
      enabled: true,
      ttl: 300,
      maxSize: 100,
    },
  },
};
```

2. **Use Lazy Loading:**

```typescript
// Load modules only when needed
const enterprise = await createEnterprise({
  modules: {
    ai: false, // Disabled initially
    storage: true,
  },
});

// Enable AI module later
await enterprise.loadModule('ai', aiConfig);
```

### Getting Help

- 📖 [Documentation](https://wiki.skygenesisenterprise.com/)

[📖 Full Troubleshooting Guide](./troubleshooting.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/skygenesisenterprise/enterprise-node.git
cd enterprise-sdk

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development mode
pnpm dev
```

### Project Structure

```
enterprise-sdk/
├── packages/           # Individual packages
│   ├── core/          # Core SDK
│   ├── ai/            # AI module
│   ├── storage/       # Storage module
│   ├── ui/            # UI module
│   ├── auth/          # Auth module
│   ├── project/       # Project module
│   ├── sdk/           # SDK module
│   └── debug/         # Debug module
├── src/               # Source code
├── docs/              # Documentation
├── examples/          # Example projects
└── tests/             # Test files
```

### Code Style

- Use TypeScript with strict mode
- Follow ESLint configuration
- Write comprehensive tests
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for the amazing AI models
- The TypeScript team for the excellent language
- All contributors who help make this project better

---

<div align="center">

**Built with ❤️ by the SkyGenesis team**

[Documentation](https://wiki.skygenesisenterprise.com/)

</div>
