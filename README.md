# Enterprise SDK

[![npm version](https://badge.fury.io/js/%40skygenesisenterprise%2Fenterprise-node.svg)](https://badge.fury.io/js/%40skygenesisenterprise%2Fenterprise-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

The universal web runtime SDK **Enterprise** by Sky Genesis Enterprise. A comprehensive, modular SDK for building intelligent enterprise applications with self-referential capabilities.

## ✨ Features

- 🧩 **Modular Architecture** - Use only what you need
- 🤖 **AI Integration** - Built-in artificial intelligence capabilities
- 💾 **Storage Management** - Advanced file and data storage
- 🎨 **UI Components** - Beautiful, customizable components
- 🔐 **Authentication** - Secure user management
- 📋 **Project Management** - Complete project lifecycle
- 🔄 **Self-Reference** - Unique auto-referential SDK capabilities
- ⚡ **WASM Runtime** - High-performance WebAssembly support
- 🎯 **Framework Agnostic** - Works with React, Svelte, Next.js, and more

## 🚀 Quick Start

### Installation

```bash
npm install @skygenesisenterprise/enterprise-node
# or
yarn add @skygenesisenterprise/enterprise-node
# or
pnpm add @skygenesisenterprise/enterprise-node
```

### Basic Usage

```typescript
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

// Create SDK instance
const sdk = new EnterpriseSDK({
  modules: {
    ai: true,
    storage: true,
    ui: true,
    project: true,
    auth: true,
    sdk: true, // Enable self-reference
  },
  branding: {
    logo: {
      path: './assets/logo.png',
      width: 200,
      height: 60,
    },
    companyName: 'Your Company',
    primaryColor: '#007acc',
  },
});

// Initialize the SDK
await sdk.initialize();

// Use modules
const aiResponse = await sdk.ai.generate('Hello, Enterprise!');
const file = await sdk.storage.save(myFile);
const user = await sdk.auth.login({ email, password });

// Self-reference capabilities
const metaInfo = sdk.sdk.getMetaInfo();
console.log('SDK is self-referencing:', metaInfo.isSelfReferencing);
```

## 📚 Documentation

- **[Quick Start Guide](./docs/quick-start.md)** - Get up and running in minutes
- **[API Reference](./docs/api.md)** - Complete API documentation
- **[Module Guide](./docs/modules.md)** - Detailed module documentation
- **[Configuration Guide](./docs/configuration.md)** - Configuration options
- **[Integration Guide](./docs/integrations.md)** - Framework integrations
- **[Examples](./docs/examples.md)** - Code examples and tutorials
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues and solutions

## 🧩 Modules

### AI Module (`@skygenesisenterprise/module-ai`)

- Text generation and completion
- Image enhancement and processing
- Data analysis and insights
- Multiple model support

### Storage Module (`@skygenesisenterprise/module-storage`)

- File upload and management
- Cloud storage integration
- Caching and optimization
- Encryption support

### UI Module (`@skygenesisenterprise/module-ui`)

- Reusable components
- Theme system
- Branding support
- Notification system

### Project Module (`@skygenesisenterprise/module-project`)

- Project creation and management
- Task tracking
- Team collaboration
- Resource allocation

### Auth Module (`@skygenesisenterprise/module-auth`)

- User authentication
- Role-based access control
- OAuth integration
- Session management

### SDK Module (`@skygenesisenterprise/module-sdk`)

- **Self-referential capabilities**
- Meta-programming
- SDK introspection
- Hierarchical instances

## 🎯 Framework Integrations

### React

```typescript
import { EnterpriseProvider, useAi, useAuth } from '@skygenesisenterprise/react';

function App() {
  return (
    <EnterpriseProvider config={config}>
      <MyComponent />
    </EnterpriseProvider>
  );
}

function MyComponent() {
  const { generate } = useAi();
  const { user, login } = useAuth();
  // ...
}
```

### Svelte

```typescript
import { enterpriseStore, useAi } from '@skygenesisenterprise/svelte';

import { onMount } from 'svelte';

onMount(() => {
  enterpriseStore.initialize();
});

const { generate } = useAi();
```

### Next.js

```typescript
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

// pages/_app.tsx
export default function App({ Component, pageProps }) {
  return (
    <EnterpriseProvider config={config}>
      <Component {...pageProps} />
    </EnterpriseProvider>
  );
}
```

## ⚙️ Configuration

Create an `enterprise.config.ts` file in your project root:

```typescript
import { EnterpriseConfig } from '@skygenesisenterprise/enterprise-node';

const config: EnterpriseConfig = {
  modules: {
    ai: true,
    storage: true,
    ui: true,
    project: true,
    auth: true,
    sdk: true,
  },
  runtime: {
    wasmPath: '/wasm/euse_core.wasm',
    enableWasm: true,
    maxMemoryMB: 512,
  },
  framework: 'auto', // 'react' | 'svelte' | 'nextjs' | 'auto'
  debug: process.env.NODE_ENV === 'development',
  branding: {
    logo: {
      path: './assets/logo.png',
      width: 200,
      height: 60,
      alt: 'Company Logo',
    },
    companyName: 'Your Company',
    primaryColor: '#007acc',
    secondaryColor: '#004466',
    theme: 'auto',
  },
};

export default config;
```

## 🏗️ Architecture

```
Enterprise SDK
├── Core Runtime
│   ├── Module Loader
│   ├── WASM Runtime
│   └── Configuration
├── Modules
│   ├── AI (text generation, image processing)
│   ├── Storage (file management, cloud sync)
│   ├── UI (components, theming)
│   ├── Project (management, collaboration)
│   ├── Auth (users, security)
│   └── SDK (self-reference, meta-programming)
├── Framework Integrations
│   ├── React (hooks, components)
│   ├── Svelte (stores, components)
│   └── Next.js (pages, middleware)
└── Development Tools
    ├── CLI (project management)
    └── ESLint Config (code quality)
```

## 🧪 Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/skygenesisenterprise/enterprise.git
cd enterprise

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development mode
pnpm dev
```

### Scripts

- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm test --filter=@skygenesisenterprise/core` - Run specific package tests
- `pnpm typecheck` - Type check all packages
- `pnpm lint` - Lint all packages
- `pnpm dev` - Development mode with watch

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the test suite
6. Submit a pull request

## 📄 License

MIT © [Sky Genesis Enterprise](https://skygenesisenterprise.com)

## 🔗 Links

- [Full Documentation](https://docs.skygenesisenterprise.com)
- [GitHub Repository](https://github.com/skygenesisenterprise/enterprise)
- [NPM Package](https://www.npmjs.com/package/@skygenesisenterprise/enterprise-node)
- [Issues](https://github.com/skygenesisenterprise/enterprise/issues)
- [Discussions](https://github.com/skygenesisenterprise/enterprise/discussions)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=skygenesisenterprise/enterprise&type=Date)](https://star-history.com/#skygenesisenterprise/enterprise&Date)

---

**Enterprise SDK** - The universal web runtime for intelligent applications. 🚀
