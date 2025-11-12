# Enterprise SDK

The universal web runtime SDK **Enterprise** by Sky Genesis Enterprise, version 0.1.0.

## 🚀 Monorepo Architecture

This project uses a Next.js-inspired monorepo architecture with the following packages:

### 📦 Core Packages
- **`@skygenesisenterprise/shared`** - Common types and utilities
- **`@skygenesisenterprise/core`** - Main runtime and module loader

### 🧩 Module Packages
- **`@skygenesisenterprise/module-ai`** - Artificial intelligence and generation
- **`@skygenesisenterprise/module-storage`** - File management and storage
- **`@skygenesisenterprise/module-ui`** - UI components and notifications
- **`@skygenesisenterprise/module-project`** - Project management
- **`@skygenesisenterprise/module-auth`** - Authentication and users

### 🔗 Integration Packages
- **`@skygenesisenterprise/react`** - React hooks and components
- **`@skygenesisenterprise/svelte`** - Svelte stores and components
- **`@skygenesisenterprise/nextjs`** - Next.js integration

### 🛠️ Development Packages
- **`@skygenesisenterprise/cli`** - Command line tools
- **`@skygenesisenterprise/eslint-config`** - ESLint configuration

## 🏗️ Project Structure

```
enterprise-node/
├── packages/
│   ├── shared/                    # Shared types and utilities
│   ├── core/                     # Main runtime
│   ├── modules/                   # Functional modules
│   │   ├── ai/                   # AI Module
│   │   ├── storage/              # Storage Module
│   │   ├── ui/                   # UI Module
│   │   ├── project/              # Project Module
│   │   └── auth/                 # Auth Module
│   ├── integrations/             # Framework integrations
│   │   ├── react/                # React Hooks
│   │   ├── svelte/               # Svelte Stores
│   │   └── nextjs/               # Next.js integration
│   └── development/              # Development tools
│       ├── cli/                  # Enterprise CLI
│       └── eslint-config/        # ESLint Configuration
├── examples/                     # Usage examples
├── docs/                        # Documentation
├── turbo.json                   # Turbo Configuration
├── pnpm-workspace.yaml          # PNPM Workspace
└── package.json                 # Root Package
```

## 🚀 Installation

### Prerequisites
- Node.js 18+
- pnpm 8+

### Install dependencies
```bash
pnpm install
```

### Build all packages
```bash
pnpm build
```

### Development
```bash
pnpm dev
```

## 📖 Usage

### Install the SDK
```bash
npm install @skygenesisenterprise/enterprise
```

### Configuration
Create an `enterprise.config.ts` file:

```typescript
import { EnterpriseConfig } from '@skygenesisenterprise/enterprise';

const config: EnterpriseConfig = {
  modules: {
    ai: true,
    storage: true,
    ui: true,
    project: true,
    auth: true
  },
  runtime: {
    wasmPath: '/wasm/euse_core.wasm',
    enableWasm: true,
    maxMemoryMB: 512
  },
  framework: 'auto',
  debug: process.env.NODE_ENV === 'development'
};

export default config;
```

### React Usage
```typescript
import { EnterpriseProvider, useAi, useAuth } from '@skygenesisenterprise/react';

function App() {
  return (
    <EnterpriseProvider>
      <MyComponent />
    </EnterpriseProvider>
  );
}

function MyComponent() {
  const { generate } = useAi();
  const { user, login } = useAuth();

  const handleGenerate = async () => {
    const result = await generate("Hello Enterprise!");
    console.log(result);
  };

  return (
    <div>
      <button onClick={handleGenerate}>Generate</button>
      {user && <p>Welcome, {user.name}!</p>}
    </div>
  );
}
```

### Svelte Usage
```typescript
import { enterpriseStore, useAi } from '@skygenesisenterprise/svelte';

import { onMount } from 'svelte';

onMount(() => {
  enterpriseStore.initialize();
});

// In a component
const { generate } = useAi();
```

### Core SDK Usage
```typescript
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise';

const sdk = new EnterpriseSDK();
await sdk.initialize();

// Use modules
const aiResult = await sdk.ai.generate("Hello world");
const storageResult = await sdk.storage.save(file);
const authResult = await sdk.auth.login({ email, password });
```

## 🛠️ Enterprise CLI

### Installation
```bash
npm install -g @skygenesisenterprise/cli
```

### Available Commands
```bash
# Create a new project
enterprise create my-app

# Initialize Enterprise in existing project
enterprise init

# Start development server
enterprise dev

# Build for production
enterprise build

# Project diagnostics
enterprise doctor

# SDK information
enterprise info
```

## 🧪 Testing

### Run all tests
```bash
pnpm test
```

### Test specific package
```bash
pnpm test --filter=@skygenesisenterprise/core
```

### Watch mode tests
```bash
pnpm test --watch
```

## 🔧 Development

### Available Scripts
- `pnpm build` - Build all packages
- `pnpm dev` - Development mode (watch)
- `pnpm test` - Run tests
- `pnpm typecheck` - Type checking
- `pnpm lint` - Code linting
- `pnpm clean` - Clean builds

### Add a new package
1. Create directory in `packages/`
2. Add `package.json` with workspace dependencies
3. Configure `rollup.config.js` and `tsconfig.json`
4. Add to `pnpm-workspace.yaml` if needed

### Contribution Workflow
1. Fork the project
2. Create a feature branch
3. Make changes
4. Run tests and linting
5. Submit a PR

## 📚 Documentation

- [Quick Start Guide](./docs/quickstart.md)
- [API Reference](./docs/api.md)
- [Module Guide](./docs/modules.md)
- [Framework Integrations](./docs/integrations.md)

## 🤝 Contributing

We appreciate contributions! Please see our [contributing guide](./CONTRIBUTING.md).

## 📄 License

MIT © Sky Genesis Enterprise

## 🔗 Links

- [Full Documentation](https://wiki.skygenesisenterprise.com)
- [GitHub](https://github.com/skygenesisenterprise/enterprise)
- [Issues](https://github.com/skygenesisenterprise/enterprise/issues)
- [Discussions](https://github.com/skygenesisenterprise/enterprise/discussions)