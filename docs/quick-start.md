# Quick Start Guide

Get up and running with Enterprise SDK in minutes! This guide will walk you through the essential steps to start building intelligent enterprise applications.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0.0 or higher
- **pnpm** 8.0.0 or higher (recommended) or npm/yarn
- **TypeScript** knowledge (optional but recommended)
- **Modern browser** support or Node.js environment

## 🚀 Installation

### Option 1: NPM (Recommended)

```bash
npm install @skygenesisenterprise/enterprise-node
```

### Option 2: Yarn

```bash
yarn add @skygenesisenterprise/enterprise-node
```

### Option 3: pnpm

```bash
pnpm add @skygenesisenterprise/enterprise-node
```

## ⚙️ Basic Setup

### 1. Create Configuration File

Create an `enterprise.config.ts` file in your project root:

```typescript
import { EnterpriseConfig } from '@skygenesisenterprise/enterprise-node';

const config: EnterpriseConfig = {
  modules: {
    ai: true, // Enable AI capabilities
    storage: true, // Enable file storage
    ui: true, // Enable UI components
    project: true, // Enable project management
    auth: true, // Enable authentication
    sdk: true, // Enable self-reference (unique feature!)
  },
  runtime: {
    wasmPath: '/wasm/euse_core.wasm',
    enableWasm: true,
  },
  framework: 'auto', // Auto-detect framework
  debug: process.env.NODE_ENV === 'development',
};

export default config;
```

### 2. Initialize the SDK

```typescript
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';
import config from './enterprise.config';

// Create SDK instance
const sdk = new EnterpriseSDK(config);

// Initialize all enabled modules
await sdk.initialize();

console.log('✅ Enterprise SDK initialized successfully!');
```

## 🎯 Your First Application

### Basic AI Example

```typescript
async function generateContent() {
  try {
    const response = await sdk.ai.generate('Write a professional email about project updates', {
      model: 'euse-generate-v0.1.0',
      maxTokens: 500,
      temperature: 0.7,
    });

    console.log('Generated content:', response.text);
    console.log('Tokens used:', response.usage.totalTokens);
  } catch (error) {
    console.error('AI generation failed:', error);
  }
}
```

### Storage Example

```typescript
async function handleFileUpload(file: File) {
  try {
    const result = await sdk.storage.save(file, {
      path: '/documents/my-file.pdf',
      metadata: {
        uploadedBy: 'user-123',
        category: 'documents',
      },
      encryption: true,
      cache: true,
    });

    console.log('File saved:', result.path);
    console.log('File size:', result.size);
  } catch (error) {
    console.error('File upload failed:', error);
  }
}
```

### Authentication Example

```typescript
async function authenticateUser(email: string, password: string) {
  try {
    const result = await sdk.auth.login({ email, password });

    if (result.token) {
      console.log('User authenticated successfully');
      console.log('User info:', result.user);

      // Store token for future requests
      localStorage.setItem('auth_token', result.token);
    }
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}
```

### Self-Reference Example (Unique Feature!)

```typescript
async function exploreSDK() {
  try {
    // Get SDK metadata
    const metaInfo = sdk.sdk.getMetaInfo();
    console.log('SDK Info:', {
      version: metaInfo.version,
      name: metaInfo.name,
      isSelfReferencing: metaInfo.isSelfReferencing,
    });

    // Get self-reference string
    const selfRef = sdk.sdk.getSelfReference();
    console.log('Self-reference:', selfRef);

    // Check if SDK module is initialized
    if (sdk.sdk.isInitialized()) {
      console.log('SDK self-reference is active! 🔄');
    }
  } catch (error) {
    console.error('SDK exploration failed:', error);
  }
}
```

## 🎨 Framework Integration

### React Application

```typescript
// App.tsx
import React from 'react';
import { EnterpriseProvider, useAi, useAuth } from '@skygenesisenterprise/react';

function App() {
  return (
    <EnterpriseProvider config={config}>
      <Dashboard />
    </EnterpriseProvider>
  );
}

function Dashboard() {
  const { generate } = useAi();
  const { user, login, logout } = useAuth();

  const handleGenerate = async () => {
    const result = await generate("Hello from React!");
    console.log(result.text);
  };

  return (
    <div>
      <h1>Welcome, {user?.name || 'Guest'}!</h1>
      <button onClick={handleGenerate}>Generate Content</button>
      {user && <button onClick={logout}>Logout</button>}
    </div>
  );
}
```

### Svelte Application

```typescript
// App.svelte
<script>
  import { onMount } from 'svelte';
  import { enterpriseStore, useAi } from '@skygenesisenterprise/svelte';

  const { generate } = useAi();

  onMount(() => {
    enterpriseStore.initialize();
  });

  async function handleGenerate() {
    const result = await generate("Hello from Svelte!");
    console.log(result.text);
  }
</script>

<main>
  <h1>Enterprise SDK + Svelte</h1>
  <button on:click={handleGenerate}>Generate Content</button>
</main>
```

### Next.js Application

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { EnterpriseProvider } from '@skygenesisenterprise/react';
import config from '../enterprise.config';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <EnterpriseProvider config={config}>
      <Component {...pageProps} />
    </EnterpriseProvider>
  );
}

// pages/index.tsx
import { useAi, useStorage } from '@skygenesisenterprise/react';

export default function HomePage() {
  const { generate } = useAi();
  const { save } = useStorage();

  return (
    <div>
      <h1>Enterprise SDK + Next.js</h1>
      <p>Building intelligent applications made easy!</p>
    </div>
  );
}
```

## 🔧 Development Setup

### Project Structure

```
my-enterprise-app/
├── enterprise.config.ts     # SDK configuration
├── src/
│   ├── components/         # React/Svelte components
│   ├── pages/            # Next.js pages
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main application
├── public/
│   └── wasm/             # WASM files (if using)
├── package.json
└── tsconfig.json
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",           # or your framework's dev command
    "build": "next build",       # or your framework's build command
    "start": "next start",       # or your framework's start command
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "vitest"
  },
  "dependencies": {
    "@skygenesisenterprise/enterprise-node": "^1.0.9",
    "@skygenesisenterprise/react": "^1.0.9"
  }
}
```

## 🧪 Testing Your Setup

### Create a Test File

```typescript
// test/sdk.test.ts
import { describe, it, expect } from 'vitest';
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

describe('Enterprise SDK Setup', () => {
  it('should initialize with all modules', async () => {
    const sdk = new EnterpriseSDK({
      modules: {
        ai: true,
        storage: true,
        ui: true,
        project: true,
        auth: true,
        sdk: true,
      },
    });

    await sdk.initialize();

    expect(sdk.ai).toBeDefined();
    expect(sdk.storage).toBeDefined();
    expect(sdk.ui).toBeDefined();
    expect(sdk.project).toBeDefined();
    expect(sdk.auth).toBeDefined();
    expect(sdk.sdk).toBeDefined();
  });
});
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test test/sdk.test.ts
```

## 🎯 Next Steps

Congratulations! You now have Enterprise SDK set up. Here's what to explore next:

1. **[API Reference](./api.md)** - Complete API documentation
2. **[Module Guide](./modules.md)** - Deep dive into each module
3. **[Configuration Guide](./configuration.md)** - Advanced configuration options
4. **[Examples](./examples.md)** - Real-world examples and tutorials

## 🆘 Need Help?

- **Documentation**: [https://wiki.skygenesisenterprise.com/](https://wiki.skygenesisenterprise.com/)

## 🎉 You're Ready!

You've successfully set up Enterprise SDK! Start building amazing intelligent applications with:

- 🤖 AI-powered features
- 💾 Advanced storage
- 🎨 Beautiful UI components
- 🔐 Secure authentication
- 📋 Project management
- 🔄 Self-reference capabilities

Happy coding! 🚀
