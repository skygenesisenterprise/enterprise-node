# Module Guide

This guide provides detailed information about each module in the Enterprise SDK, including their features, configuration options, and best practices.

## AI Module

The AI module provides artificial intelligence capabilities including text generation, analysis, and machine learning functionalities.

### Features

- **Text Generation**: Generate human-like text using various AI models
- **Sentiment Analysis**: Analyze emotional tone of text
- **Entity Extraction**: Extract named entities from text
- **Text Classification**: Categorize text into predefined categories
- **Streaming Support**: Real-time text generation with streaming
- **Multiple Providers**: Support for OpenAI, Anthropic, and local models

### Configuration

```typescript
import { AI } from '@skygenesisenterprise/ai';

const ai = new AI({
  provider: 'openai',
  apiKey: 'your-api-key',
  model: 'gpt-3.5-turbo',
  maxTokens: 1000,
  temperature: 0.7,
});
```

### Provider Options

#### OpenAI

```typescript
{
  provider: 'openai',
  apiKey: 'sk-...',
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'text-davinci-003',
  maxTokens: 2048,
  temperature: 0.7
}
```

#### Anthropic

```typescript
{
  provider: 'anthropic',
  apiKey: 'sk-ant-...',
  model: 'claude-3-sonnet-20240229' | 'claude-3-opus-20240229',
  maxTokens: 4096,
  temperature: 0.7
}
```

#### Local Models

```typescript
{
  provider: 'local',
  model: 'llama2' | 'mistral' | 'custom',
  endpoint: 'http://localhost:8080',
  maxTokens: 2048,
  temperature: 0.7
}
```

### Usage Examples

#### Basic Text Generation

```typescript
const response = await ai.generate('Write a poem about autumn');
console.log(response);
```

#### Streaming Generation

```typescript
const stream = ai.generateStream('Tell me a story');
for await (const chunk of stream) {
  console.log(chunk);
}
```

#### Sentiment Analysis

```typescript
const sentiment = await ai.analyzeSentiment('I love this product!');
// Returns: { score: 0.8, label: 'positive', confidence: 0.95 }
```

#### Entity Extraction

```typescript
const entities = await ai.extractEntities('Apple Inc. is based in Cupertino, California');
// Returns: [
//   { text: 'Apple Inc.', type: 'ORGANIZATION', confidence: 0.98 },
//   { text: 'Cupertino', type: 'LOCATION', confidence: 0.95 },
//   { text: 'California', type: 'LOCATION', confidence: 0.97 }
// ]
```

#### Text Classification

```typescript
const categories = ['spam', 'ham', 'promotion'];
const result = await ai.classify('Limited time offer! Buy now!', categories);
// Returns: { category: 'promotion', confidence: 0.89, scores: { spam: 0.1, ham: 0.01, promotion: 0.89 } }
```

### Best Practices

1. **API Key Security**: Store API keys in environment variables, never in code
2. **Token Management**: Monitor token usage to avoid exceeding limits
3. **Error Handling**: Always wrap AI calls in try-catch blocks
4. **Temperature Settings**: Use lower temperatures (0.1-0.3) for factual content, higher (0.7-1.0) for creative content
5. **Prompt Engineering**: Craft clear, specific prompts for better results

## Storage Module

The Storage module provides unified storage capabilities across multiple providers with a consistent API.

### Features

- **Multiple Providers**: Local filesystem, AWS S3, Google Cloud Storage, Azure Blob Storage
- **Encryption**: Built-in encryption support for sensitive data
- **TTL Support**: Automatic expiration of stored data
- **File Operations**: Upload and download files with progress tracking
- **Metadata Support**: Store custom metadata with your data
- **Caching**: Intelligent caching for improved performance

### Configuration

```typescript
import { Storage } from '@skygenesisenterprise/storage';

// Local storage
const storage = new Storage({
  provider: 'local',
});

// AWS S3
const storage = new Storage({
  provider: 's3',
  bucket: 'my-bucket',
  region: 'us-west-2',
  credentials: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
  },
});
```

### Provider Options

#### Local Storage

```typescript
{
  provider: 'local',
  basePath: './data' // Optional base directory
}
```

#### AWS S3

```typescript
{
  provider: 's3',
  bucket: 'your-bucket-name',
  region: 'us-west-2',
  credentials: {
    accessKey: 'AKIA...',
    secretKey: '...',
    token: '...' // Optional for temporary credentials
  }
}
```

#### Google Cloud Storage

```typescript
{
  provider: 'gcs',
  bucket: 'your-bucket-name',
  credentials: {
    clientEmail: '...',
    privateKey: '...',
    projectId: 'your-project-id'
  }
}
```

#### Azure Blob Storage

```typescript
{
  provider: 'azure',
  bucket: 'your-container-name',
  credentials: {
    connectionString: 'DefaultEndpointsProtocol=...',
    sasToken: '...' // Optional
  }
}
```

### Usage Examples

#### Basic Storage Operations

```typescript
// Store data
await storage.store('user:123', { name: 'John', age: 30 });

// Retrieve data
const user = await storage.retrieve('user:123');
console.log(user); // { name: 'John', age: 30 }

// Delete data
await storage.delete('user:123');
```

#### Advanced Storage with Options

```typescript
// Store with TTL and encryption
await storage.store(
  'session:abc',
  { userId: 123 },
  {
    ttl: 3600, // 1 hour
    metadata: { type: 'session' },
    encryption: true,
  }
);

// Check if key exists
const exists = await storage.exists('user:123');

// List keys with prefix
const keys = await storage.list('user:');
console.log(keys); // ['user:123', 'user:456', ...]
```

#### File Operations

```typescript
// Upload file
const fileUrl = await storage.uploadFile('documents/report.pdf', fileBuffer);

// Download file
const fileData = await storage.downloadFile('documents/report.pdf');
```

### Best Practices

1. **Provider Selection**: Choose local storage for development, cloud providers for production
2. **Security**: Always use encryption for sensitive data
3. **TTL Management**: Set appropriate TTL for temporary data
4. **Error Handling**: Handle network errors gracefully with retries
5. **Performance**: Use batching for multiple operations

## UI Module

The UI module provides a comprehensive set of user interface components and theming capabilities.

### Features

- **Component Library**: Pre-built React components (Button, Input, Modal, etc.)
- **Theming System**: Light, dark, and auto themes with CSS variables
- **Branding Support**: Custom colors, logos, and styling
- **Responsive Design**: Mobile-first responsive components
- **Accessibility**: WCAG compliant components
- **Animation System**: Smooth transitions and micro-interactions

### Configuration

```typescript
import { UI } from '@skygenesisenterprise/ui';

const ui = new UI({
  theme: 'auto',
  components: {
    button: true,
    input: true,
    modal: true,
    notification: true,
  },
  animations: true,
  icons: true,
});
```

### Component Usage

#### Button Component

```typescript
import { Button } from '@skygenesisenterprise/ui';

<Button
  variant="primary"
  size="md"
  onClick={() => console.log('Clicked')}
  loading={false}
>
  Click me
</Button>
```

#### Input Component

```typescript
import { Input } from '@skygenesisenterprise/ui';

<Input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
  error={error}
  disabled={false}
/>
```

#### Modal Component

```typescript
import { Modal } from '@skygenesisenterprise/ui';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

### Theming

#### CSS Variables

```css
:root {
  --enterprise-primary-color: #3b82f6;
  --enterprise-secondary-color: #64748b;
  --enterprise-background-color: #ffffff;
  --enterprise-text-color: #1f2937;
  --enterprise-border-color: #e5e7eb;
  --enterprise-border-radius: 0.375rem;
  --enterprise-font-family: Inter, system-ui, sans-serif;
}
```

#### Programmatic Theming

```typescript
// Set theme
ui.setTheme('dark');

// Get current theme
const currentTheme = ui.getTheme();

// Apply custom branding
ui.applyBranding({
  name: 'My App',
  logo: '/logo.svg',
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
});
```

### Notifications

```typescript
// Show different types of notifications
ui.showNotification('Operation completed successfully!', 'success');
ui.showNotification('Warning: This action cannot be undone', 'warning');
ui.showNotification('Error: Failed to save data', 'error');
ui.showNotification('Info: New features available', 'info');
```

### Best Practices

1. **Consistency**: Use the provided components for consistent UI
2. **Accessibility**: Always include proper ARIA labels and semantic HTML
3. **Performance**: Lazy load components when possible
4. **Responsive**: Test components on all screen sizes
5. **Theme Support**: Ensure components work in all themes

## Project Module

The Project module provides project management and package.json manipulation capabilities.

### Features

- **Project Information**: Read and update project metadata
- **Dependency Management**: Add, remove, and analyze dependencies
- **Script Management**: Manage npm scripts programmatically
- **Version Management**: Handle semantic versioning
- **Repository Integration**: Git integration for project operations

### Configuration

```typescript
import { Project } from '@skygenesisenterprise/project';

const project = new Project({
  name: 'my-app',
  version: '1.0.0',
  description: 'My awesome application',
  author: 'John Doe',
  license: 'MIT',
});
```

### Usage Examples

#### Project Information

```typescript
// Get project info
const info = project.getInfo();
console.log(info);
// {
//   name: 'my-app',
//   version: '1.0.0',
//   description: 'My awesome application',
//   author: 'John Doe',
//   license: 'MIT',
//   dependencies: { ... },
//   scripts: { ... }
// }

// Update project info
project.updateInfo({
  description: 'Updated description',
  version: '1.1.0',
});
```

#### Dependency Management

```typescript
// Get all dependencies
const dependencies = await project.getDependencies();
console.log(dependencies);
// [
//   { name: 'react', version: '^18.0.0', type: 'dependencies' },
//   { name: 'typescript', version: '^5.0.0', type: 'devDependencies' }
// ]

// Add dependency
await project.addDependency('lodash', '^4.17.21');

// Remove dependency
await project.removeDependency('old-package');
```

#### Script Management

```typescript
// Get all scripts
const scripts = project.getScripts();
console.log(scripts);
// { build: 'webpack', dev: 'webpack serve', test: 'jest' }

// Add script
project.addScript('lint', 'eslint src/');

// Remove script
project.removeScript('old-script');
```

### Best Practices

1. **Version Control**: Always commit package.json changes
2. **Dependency Updates**: Regularly update dependencies for security
3. **Script Organization**: Keep scripts organized and well-documented
4. **Semantic Versioning**: Follow semantic versioning guidelines
5. **Backup**: Backup package.json before major changes

## Auth Module

The Auth module provides comprehensive authentication and authorization capabilities.

### Features

- **Multiple Providers**: JWT, OAuth, SAML, and custom authentication
- **Token Management**: JWT token generation, verification, and refresh
- **Password Security**: Secure password hashing and verification
- **User Management**: User registration, login, and profile management
- **Role-Based Access**: Role-based authorization system
- **Session Management**: Secure session handling

### Configuration

```typescript
import { Auth } from '@skygenesisenterprise/auth';

const auth = new Auth({
  provider: 'jwt',
  secret: 'your-secret-key',
  expiresIn: '1h',
  refreshExpiresIn: '7d',
  issuer: 'your-app',
  audience: 'your-users',
});
```

### Provider Options

#### JWT

```typescript
{
  provider: 'jwt',
  secret: 'your-secret-key',
  expiresIn: '1h',
  refreshExpiresIn: '7d',
  issuer: 'your-app',
  audience: 'your-users'
}
```

#### OAuth

```typescript
{
  provider: 'oauth',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'http://localhost:3000/auth/callback',
  scopes: ['profile', 'email']
}
```

#### SAML

```typescript
{
  provider: 'saml',
  entryPoint: 'https://idp.example.com/sso',
  issuer: 'your-app',
  cert: 'idp-certificate',
  privateKey: 'your-private-key'
}
```

### Usage Examples

#### User Registration and Login

```typescript
// Register new user
const result = await auth.register({
  email: 'user@example.com',
  password: 'securePassword123',
  name: 'John Doe',
});

// Login user
const loginResult = await auth.login({
  email: 'user@example.com',
  password: 'securePassword123',
});

console.log(loginResult);
// {
//   user: { id: '123', email: 'user@example.com', name: 'John Doe' },
//   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
//   refreshToken: 'def50200...',
//   expiresIn: 3600
// }
```

#### Token Management

```typescript
// Generate custom token
const token = await auth.generateToken({ userId: '123', role: 'admin' }, { expiresIn: '2h' });

// Verify token
const payload = await auth.verifyToken(token);
console.log(payload); // { userId: '123', role: 'admin', iat: ..., exp: ... }

// Refresh token
const newToken = await auth.refreshToken(refreshToken);
```

#### Password Security

```typescript
// Hash password
const hashedPassword = await auth.hashPassword('plainPassword');

// Verify password
const isValid = await auth.verifyPassword('plainPassword', hashedPassword);
console.log(isValid); // true
```

#### Current User

```typescript
// Get current authenticated user
const currentUser = await auth.getCurrentUser();
if (currentUser) {
  console.log(`Welcome, ${currentUser.name}!`);
}
```

### Best Practices

1. **Secret Management**: Store secrets in environment variables
2. **Token Security**: Use HTTPS for all token transmissions
3. **Password Policies**: Enforce strong password requirements
4. **Session Management**: Implement proper session timeout
5. **Rate Limiting**: Implement rate limiting for auth endpoints

## SDK Module

The SDK module provides self-referential capabilities and meta-programming features.

### Features

- **Self-Reference**: The SDK can reference and analyze itself
- **Module Inspection**: Get information about loaded modules
- **Capability Detection**: Discover available SDK capabilities
- **Metadata Access**: Access SDK metadata and configuration
- **Dynamic Analysis**: Runtime analysis of SDK state

### Configuration

```typescript
import { SDK } from '@skygenesisenterprise/sdk';

const sdk = new SDK({
  version: '1.0.0',
  metadata: {
    environment: 'production',
    features: ['ai', 'storage', 'ui'],
  },
  selfReference: true,
});
```

### Usage Examples

#### Basic SDK Information

```typescript
// Get SDK version
const version = sdk.getVersion();
console.log(version); // '1.0.0'

// Get SDK metadata
const metadata = sdk.getMetadata();
console.log(metadata);
// {
//   environment: 'production',
//   features: ['ai', 'storage', 'ui']
// }
```

#### Module Inspection

```typescript
// Get loaded modules
const modules = sdk.getLoadedModules();
console.log(modules); // ['ai', 'storage', 'ui', 'project', 'auth', 'sdk']

// Get specific module info
const aiInfo = sdk.getModuleInfo('ai');
console.log(aiInfo);
// {
//   name: 'ai',
//   version: '1.0.0',
//   loaded: true,
//   config: { provider: 'openai', model: 'gpt-3.5-turbo' }
// }
```

#### Self-Reference Features

```typescript
// Get self-reference
const self = sdk.getSelf();
console.log(self === sdk); // true

// Analyze SDK
const analysis = await sdk.analyzeSelf();
console.log(analysis);
// {
//   modules: [...],
//   capabilities: ['text-generation', 'storage', 'ui-components', ...],
//   dependencies: ['@skygenesisenterprise/shared', ...],
//   configuration: { ... }
// }

// Get capabilities
const capabilities = sdk.getCapabilities();
console.log(capabilities);
// ['text-generation', 'sentiment-analysis', 'file-storage', 'ui-theming', ...]
```

### Use Cases

1. **Dynamic Feature Detection**: Check if specific features are available
2. **Runtime Debugging**: Inspect SDK state at runtime
3. **Meta-Programming**: Write code that analyzes and modifies itself
4. **Plugin Systems**: Build dynamic plugin architectures
5. **Documentation Generation**: Auto-generate documentation from SDK state

### Best Practices

1. **Performance**: Use self-reference features sparingly in production
2. **Security**: Be careful with meta-programming in security-sensitive contexts
3. **Debugging**: Use analysis features for debugging and monitoring
4. **Documentation**: Leverage self-reference for auto-documentation
5. **Testing**: Use module inspection for comprehensive testing

Each module in the Enterprise SDK is designed to work seamlessly with others while maintaining independence and flexibility. Choose the modules that fit your needs and configure them according to your requirements.
