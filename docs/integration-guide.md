# Integration Guide

This guide covers how to integrate the Enterprise SDK with popular frameworks, platforms, and development tools.

## Framework Integrations

### React Integration

The Enterprise SDK provides seamless React integration with hooks and components.

#### Installation

```bash
npm install @skygenesisenterprise/core react react-dom
```

#### Setup

```typescript
// src/App.tsx
import React from 'react';
import { EnterpriseProvider, useEnterprise } from '@skygenesisenterprise/core';

function App() {
  return (
    <EnterpriseProvider config={{
      modules: {
        ai: true,
        storage: true,
        ui: true
      }
    }}>
      <MyComponent />
    </EnterpriseProvider>
  );
}

function MyComponent() {
  const enterprise = useEnterprise();

  React.useEffect(() => {
    // SDK is ready to use
    console.log('Enterprise SDK loaded:', enterprise);
  }, [enterprise]);

  return <div>My App</div>;
}

export default App;
```

#### Using Module Hooks

```typescript
import React from 'react';
import { useAI, useStorage, useUI, useDebug } from '@skygenesisenterprise/core';

function AIComponent() {
  const ai = useAI();
  const debug = useDebug();
  const [response, setResponse] = React.useState('');

  const generateText = async () => {
    const span = debug.createSpan('ai-generation');

    try {
      debug.info('Starting AI generation');
      const result = await ai.generate('Write a hello world message');
      setResponse(result);
      debug.info('AI generation successful', { length: result.length });
    } catch (error) {
      debug.error('AI generation failed', { error: error.message });
    } finally {
      span.end();
    }
  };

  return (
    <div>
      <button onClick={generateText}>Generate Text</button>
      <p>{response}</p>
    </div>
  );
}

function StorageComponent() {
  const storage = useStorage();
  const debug = useDebug();
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const loadData = async () => {
      const span = debug.createSpan('storage-load');

      try {
        debug.debug('Loading storage data', { key: 'user:123' });
        const result = await storage.retrieve('user:123');
        setData(result);
        debug.info('Storage data loaded successfully');
      } catch (error) {
        debug.error('Storage load failed', { error: error.message });
      } finally {
        span.end();
      }
    };
    loadData();
  }, [storage, debug]);

  return <div>{JSON.stringify(data)}</div>;
}

function UIComponent() {
  const ui = useUI();
  const debug = useDebug();

  const showNotification = () => {
    debug.debug('Showing notification', { type: 'success' });
    ui.showNotification('Hello from Enterprise SDK!', 'success');
  };

  return (
    <button onClick={showNotification}>
      Show Notification
    </button>
  );
}

function DebugComponent() {
  const debug = useDebug();
  const [metrics, setMetrics] = React.useState(null);

  React.useEffect(() => {
    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      setMetrics(debug.getMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, [debug]);

  const testLogging = () => {
    debug.trace('Trace message');
    debug.debug('Debug message');
    debug.info('Info message');
    debug.warn('Warning message');
    debug.error('Error message');
  };

  return (
    <div>
      <h3>Debug System</h3>
      <button onClick={testLogging}>Test Logging</button>
      <pre>{JSON.stringify(metrics, null, 2)}</pre>
    </div>
  );
}
```

#### TypeScript Support

```typescript
// src/types/enterprise.ts
import { EnterpriseConfig } from '@skygenesisenterprise/core';

export interface MyEnterpriseConfig extends EnterpriseConfig {
  customFeature?: boolean;
}

// src/hooks/useMyEnterprise.ts
import { useEnterprise } from '@skygenesisenterprise/core';
import { MyEnterpriseConfig } from '../types/enterprise';

export function useMyEnterprise() {
  return useEnterprise() as ReturnType<typeof useEnterprise<MyEnterpriseConfig>>;
}
```

### Next.js Integration

#### App Router Setup

```typescript
// app/providers.tsx
'use client';

import { EnterpriseProvider } from '@skygenesisenterprise/core';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EnterpriseProvider config={{
      modules: {
        ai: process.env.NODE_ENV === 'development',
        storage: true,
        ui: true
      }
    }}>
      {children}
    </EnterpriseProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### Server-Side Usage

```typescript
// app/api/ai/route.ts
import { createEnterprise } from '@skygenesisenterprise/core';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const enterprise = await createEnterprise({
    modules: { ai: true },
  });

  const response = await enterprise.ai.generate(prompt);

  return Response.json({ response });
}
```

### Svelte Integration

#### Installation

```bash
npm install @skygenesisenterprise/core
```

#### Setup with SvelteKit

```typescript
// src/lib/enterprise.ts
import { createEnterprise } from '@skygenesisenterprise/core';
import { enterprise, ai, storage, ui } from '@skygenesisenterprise/core/stores';

export async function initializeEnterprise() {
  const sdk = await createEnterprise({
    modules: {
      ai: true,
      storage: true,
      ui: true
    }
  });

  enterprise.set(sdk);
  ai.set(sdk.ai);
  storage.set(sdk.storage);
  ui.set(sdk.ui);

  return sdk;
}

// src/app.html
<script>
  import { initializeEnterprise } from '$lib/enterprise';

  initializeEnterprise();
</script>
```

#### Using Stores in Components

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { ai, storage, ui, debug } from '@skygenesisenterprise/core/stores';
  import { onMount } from 'svelte';

  let response = '';
  let data = null;
  let metrics = null;

  onMount(async () => {
    $debug.info('Svelte page mounted');

    // Use AI module with debug tracing
    const span = $debug.createSpan('svelte-page-load');

    try {
      // Use AI module
      const aiResult = await $ai.generate('Hello world');
      response = aiResult;
      $debug.info('AI generation completed', { length: response.length });

      // Use Storage module
      data = await $storage.retrieve('user:123');
      $debug.info('Storage data loaded', { hasData: !!data });
    } catch (error) {
      $debug.error('Page load failed', { error: error.message });
    } finally {
      span.end();
    }

    // Update metrics periodically
    const interval = setInterval(() => {
      metrics = $debug.getMetrics();
    }, 5000);

    return () => clearInterval(interval);
  });

  function showNotification() {
    $debug.debug('Showing notification from Svelte');
    $ui.showNotification('Hello from Svelte!', 'success');
  }

  function testDebugLevels() {
    $debug.trace('Trace level message');
    $debug.debug('Debug level message');
    $debug.info('Info level message');
    $debug.warn('Warning level message');
    $debug.error('Error level message');
  }
</script>

<h1>Enterprise SDK + Svelte</h1>
<p>AI Response: {response}</p>
<p>Storage Data: {JSON.stringify(data)}</p>
<button on:click={showNotification}>Show Notification</button>
<button on:click={testDebugLevels}>Test Debug Levels</button>

{#if metrics}
  <h3>Debug Metrics</h3>
  <pre>{JSON.stringify(metrics, null, 2)}</pre>
{/if}
```

### Vue Integration

#### Composition API Setup

```typescript
// src/plugins/enterprise.ts
import { App } from 'vue';
import { createEnterprise } from '@skygenesisenterprise/core';

export interface EnterprisePluginOptions {
  config?: any;
}

export const EnterprisePlugin = {
  async install(app: App, options: EnterprisePluginOptions = {}) {
    const enterprise = await createEnterprise(options.config);

    app.provide('enterprise', enterprise);
    app.config.globalProperties.$enterprise = enterprise;
  },
};

// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { EnterprisePlugin } from './plugins/enterprise';

const app = createApp(App);

app.use(EnterprisePlugin, {
  config: {
    modules: {
      ai: true,
      storage: true,
      ui: true,
    },
  },
});

app.mount('#app');
```

#### Using in Components

```vue
<!-- src/components/AIComponent.vue -->
<template>
  <div>
    <button @click="generateText">Generate Text</button>
    <p>{{ response }}</p>
    <button @click="testDebug">Test Debug</button>
    <div v-if="metrics">
      <h4>Debug Metrics:</h4>
      <pre>{{ JSON.stringify(metrics, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import type { EnterpriseSDK } from '@skygenesisenterprise/core';

const enterprise = inject<EnterpriseSDK>('enterprise');
const response = ref('');
const metrics = ref(null);

onMounted(() => {
  if (enterprise?.debug) {
    enterprise.debug.info('Vue component mounted');

    // Update metrics periodically
    const interval = setInterval(() => {
      metrics.value = enterprise.debug.getMetrics();
    }, 5000);

    onUnmounted(() => clearInterval(interval));
  }
});

const generateText = async () => {
  if (enterprise) {
    const span = enterprise.debug.createSpan('vue-ai-generation');

    try {
      enterprise.debug.info('Starting AI generation from Vue');
      response.value = await enterprise.ai.generate('Write a hello message');
      enterprise.debug.info('AI generation successful', {
        responseLength: response.value.length,
      });
    } catch (error) {
      enterprise.debug.error('AI generation failed', {
        error: error.message,
      });
    } finally {
      span.end();
    }
  }
};

const testDebug = () => {
  if (enterprise?.debug) {
    enterprise.debug.trace('Vue trace message');
    enterprise.debug.debug('Vue debug message');
    enterprise.debug.info('Vue info message');
    enterprise.debug.warn('Vue warning message');
    enterprise.debug.error('Vue error message');
  }
};
</script>
```

## Platform Integrations

### Node.js Backend Integration

#### Express.js Setup

```typescript
// src/server.ts
import express from 'express';
import { createEnterprise } from '@skygenesisenterprise/core';

const app = express();
app.use(express.json());

let enterprise: EnterpriseSDK;

// Initialize SDK
async function initializeSDK() {
  enterprise = await createEnterprise({
    modules: {
      ai: true,
      storage: true,
      auth: true,
      debug: true, // Enable debug system
    },
  });
}

// AI Endpoint
app.post('/api/ai/generate', async (req, res) => {
  const span = enterprise.debug.createSpan('express-ai-endpoint');

  try {
    const { prompt } = req.body;
    enterprise.debug.info('AI generation request', {
      promptLength: prompt?.length,
      ip: req.ip,
    });

    const response = await enterprise.ai.generate(prompt);

    enterprise.debug.info('AI generation successful', {
      responseLength: response.length,
    });
    res.json({ response });
  } catch (error) {
    enterprise.debug.error('AI generation failed', {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  } finally {
    span.end();
  }
});

// Storage Endpoint
app.get('/api/storage/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const data = await enterprise.storage.retrieve(key);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await enterprise.auth.login({ email, password });
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

initializeSDK().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});
```

#### Fastify Setup

```typescript
// src/server.ts
import Fastify from 'fastify';
import { createEnterprise } from '@skygenesisenterprise/core';

const fastify = Fastify({ logger: true });

let enterprise: EnterpriseSDK;

// Initialize SDK
fastify.register(async function (instance) {
  enterprise = await createEnterprise({
    modules: {
      ai: true,
      storage: true,
      auth: true,
    },
  });
});

// AI Route
fastify.post('/api/ai/generate', async (request, reply) => {
  const { prompt } = request.body as { prompt: string };
  const response = await enterprise.ai.generate(prompt);
  return { response };
});

// Storage Route
fastify.get('/api/storage/:key', async (request, reply) => {
  const { key } = request.params as { key: string };
  const data = await enterprise.storage.retrieve(key);
  return data;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

### Cloud Platform Integration

#### Vercel Deployment

```typescript
// api/enterprise.ts
import { createEnterprise } from '@skygenesisenterprise/core';

let enterprise: EnterpriseSDK;

async function getEnterprise() {
  if (!enterprise) {
    enterprise = await createEnterprise({
      modules: {
        ai: true,
        storage: true,
        ui: true,
      },
    });
  }
  return enterprise;
}

export default async function handler(req: any, res: any) {
  const enterprise = await getEnterprise();

  if (req.method === 'POST' && req.url === '/api/ai') {
    const { prompt } = req.body;
    const response = await enterprise.ai.generate(prompt);
    return res.json({ response });
  }

  res.status(404).json({ error: 'Not found' });
}
```

#### AWS Lambda Integration

```typescript
// lambda/enterprise-handler.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createEnterprise } from '@skygenesisenterprise/core';

let enterprise: EnterpriseSDK;

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!enterprise) {
    enterprise = await createEnterprise({
      modules: {
        ai: true,
        storage: true,
        auth: true,
      },
    });
  }

  try {
    const { httpMethod, path, body } = event;

    if (httpMethod === 'POST' && path === '/ai') {
      const { prompt } = JSON.parse(body || '{}');
      const response = await enterprise.ai.generate(prompt);

      return {
        statusCode: 200,
        body: JSON.stringify({ response }),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

#### Docker Integration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - AI_API_KEY=${AI_API_KEY}
      - STORAGE_BUCKET=${STORAGE_BUCKET}
    volumes:
      - ./data:/app/data
```

## Development Tool Integration

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["@skygenesisenterprise/core"],
    "paths": {
      "@skygenesisenterprise/*": ["./node_modules/@skygenesisenterprise/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: ['@skygenesisenterprise/eslint-config', '@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
  },
};
```

### Jest Testing Setup

```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@skygenesisenterprise/(.*)$': '<rootDir>/node_modules/@skygenesisenterprise/$1',
  },
};

// src/setupTests.ts
import '@skygenesisenterprise/core/test-utils';
```

### Vite Integration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@skygenesisenterprise/core'],
  },
});
```

## Best Practices

### Performance Optimization

1. **Lazy Loading**: Load modules only when needed
2. **Caching**: Cache SDK initialization and responses
3. **Bundle Splitting**: Split bundles by module usage
4. **Tree Shaking**: Only import used functionality

### Security Considerations

1. **API Keys**: Store in environment variables
2. **CORS**: Configure proper CORS settings
3. **Authentication**: Implement proper auth flows
4. **Validation**: Validate all inputs

### Error Handling

1. **Global Error Handler**: Implement centralized error handling
2. **Retry Logic**: Add retry for network operations
3. **Logging**: Log errors for debugging
4. **User Feedback**: Provide user-friendly error messages

### Monitoring and Debugging

1. **Performance Monitoring**: Track SDK performance with built-in debug spans
2. **Error Tracking**: Monitor SDK errors with structured logging
3. **Usage Analytics**: Track module usage and performance metrics
4. **Health Checks**: Implement health check endpoints
5. **Debug System**: Use the integrated debug module for comprehensive tracing and logging

#### Debug System Integration

The Enterprise SDK includes a comprehensive debug system inspired by Rust's tracing ecosystem:

```typescript
// Enable debug module in configuration
const config = {
  modules: {
    debug: true, // Enable debug system
    // ... other modules
  },
};

// Use debug in your application
const debug = enterprise.debug;

// Create spans for tracing operations
const span = debug.createSpan('user-operation', { userId: '123' });

// Log at different levels
debug.trace('Detailed trace information');
debug.debug('Debug information');
debug.info('General information');
debug.warn('Warning message');
debug.error('Error occurred', { error: error.message });

// Get performance metrics
const metrics = debug.getMetrics();
console.log('Active spans:', metrics.activeSpans);
console.log('Total operations:', metrics.totalOperations);
```

#### Framework-Specific Debug Integration

- **React**: Use `useDebug()` hook for component-level debugging
- **Svelte**: Access debug via `$debug` store
- **Vue**: Use injected debug instance from enterprise SDK
- **Next.js**: Debug spans automatically track API route performance
- **Express**: Middleware integration for request tracing

This integration guide provides comprehensive information for integrating the Enterprise SDK with various frameworks and platforms. Choose the integration that best fits your development stack and requirements.
