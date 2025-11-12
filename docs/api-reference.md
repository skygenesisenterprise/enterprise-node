# API Reference

This section provides detailed API documentation for all modules and components of the Enterprise SDK.

## Core API

### EnterpriseConfig

The main configuration interface for the SDK.

```typescript
interface EnterpriseConfig {
  modules?: {
    ai?: boolean;
    storage?: boolean;
    ui?: boolean;
    project?: boolean;
    auth?: boolean;
    sdk?: boolean;
  };
  integrations?: {
    react?: boolean;
    svelte?: boolean;
  };
  branding?: {
    name?: string;
    logo?: string;
    theme?: 'light' | 'dark' | 'auto';
    primaryColor?: string;
    secondaryColor?: string;
  };
  runtime?: {
    wasm?: boolean;
    fallback?: boolean;
  };
}
```

### createEnterprise

The main function to initialize the Enterprise SDK.

```typescript
function createEnterprise(config?: EnterpriseConfig): Promise<EnterpriseSDK>;
```

**Parameters:**

- `config` (optional): Configuration object for the SDK

**Returns:**

- `Promise<EnterpriseSDK>`: Initialized SDK instance

**Example:**

```typescript
import { createEnterprise } from '@skygenesisenterprise/core';

const enterprise = await createEnterprise({
  modules: {
    ai: true,
    storage: true,
    ui: true,
  },
  branding: {
    name: 'My App',
    theme: 'dark',
  },
});
```

## Module APIs

### AI Module (`@skygenesisenterprise/ai`)

#### AIConfig

```typescript
interface AIConfig {
  provider?: 'openai' | 'anthropic' | 'local';
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}
```

#### AI Class

```typescript
class AI {
  constructor(config?: AIConfig);

  // Generate text completion
  generate(prompt: string, options?: GenerateOptions): Promise<string>;

  // Generate streaming completion
  generateStream(prompt: string, options?: GenerateOptions): AsyncGenerator<string>;

  // Analyze sentiment
  analyzeSentiment(text: string): Promise<SentimentResult>;

  // Extract entities
  extractEntities(text: string): Promise<Entity[]>;

  // Classify text
  classify(text: string, categories: string[]): Promise<ClassificationResult>;
}
```

#### Types

```typescript
interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
  stopSequences?: string[];
  stream?: boolean;
}

interface SentimentResult {
  score: number; // -1 to 1
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

interface Entity {
  text: string;
  type: string;
  confidence: number;
}

interface ClassificationResult {
  category: string;
  confidence: number;
  scores: Record<string, number>;
}
```

### Storage Module (`@skygenesisenterprise/storage`)

#### StorageConfig

```typescript
interface StorageConfig {
  provider?: 'local' | 's3' | 'gcs' | 'azure';
  bucket?: string;
  region?: string;
  credentials?: {
    accessKey?: string;
    secretKey?: string;
    token?: string;
  };
}
```

#### Storage Class

```typescript
class Storage {
  constructor(config?: StorageConfig);

  // Store data
  store(key: string, data: any, options?: StoreOptions): Promise<void>;

  // Retrieve data
  retrieve<T = any>(key: string): Promise<T | null>;

  // Delete data
  delete(key: string): Promise<void>;

  // List keys
  list(prefix?: string): Promise<string[]>;

  // Check if key exists
  exists(key: string): Promise<boolean>;

  // Upload file
  uploadFile(path: string, file: File | Buffer): Promise<string>;

  // Download file
  downloadFile(path: string): Promise<Buffer>;
}
```

#### Types

```typescript
interface StoreOptions {
  ttl?: number; // Time to live in seconds
  metadata?: Record<string, any>;
  encryption?: boolean;
}
```

### UI Module (`@skygenesisenterprise/ui`)

#### UIConfig

```typescript
interface UIConfig {
  theme?: 'light' | 'dark' | 'auto';
  components?: {
    button?: boolean;
    input?: boolean;
    modal?: boolean;
    notification?: boolean;
  };
  animations?: boolean;
  icons?: boolean;
}
```

#### UI Class

```typescript
class UI {
  constructor(config?: UIConfig);

  // Show notification
  showNotification(message: string, type?: 'info' | 'success' | 'warning' | 'error'): void;

  // Show modal
  showModal(content: ReactNode | string, options?: ModalOptions): void;

  // Hide modal
  hideModal(): void;

  // Set theme
  setTheme(theme: 'light' | 'dark' | 'auto'): void;

  // Get current theme
  getTheme(): 'light' | 'dark' | 'auto';

  // Apply branding
  applyBranding(branding: BrandingConfig): void;

  // Get CSS variables
  getCSSVariables(): Record<string, string>;
}
```

#### React Components

```typescript
// Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

// Input Component
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

### Project Module (`@skygenesisenterprise/project`)

#### ProjectConfig

```typescript
interface ProjectConfig {
  name?: string;
  version?: string;
  description?: string;
  author?: string;
  license?: string;
  repository?: string;
  bugs?: string;
  homepage?: string;
}
```

#### Project Class

```typescript
class Project {
  constructor(config?: ProjectConfig);

  // Get project info
  getInfo(): ProjectInfo;

  // Update project info
  updateInfo(info: Partial<ProjectInfo>): void;

  // Get dependencies
  getDependencies(): Promise<Dependency[]>;

  // Add dependency
  addDependency(name: string, version: string): Promise<void>;

  // Remove dependency
  removeDependency(name: string): Promise<void>;

  // Get scripts
  getScripts(): Record<string, string>;

  // Add script
  addScript(name: string, command: string): void;

  // Remove script
  removeScript(name: string): void;
}
```

#### Types

```typescript
interface ProjectInfo {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  repository?: string;
  bugs?: string;
  homepage?: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}

interface Dependency {
  name: string;
  version: string;
  type: 'dependencies' | 'devDependencies' | 'peerDependencies';
}
```

### Auth Module (`@skygenesisenterprise/auth`)

#### AuthConfig

```typescript
interface AuthConfig {
  provider?: 'jwt' | 'oauth' | 'saml' | 'custom';
  secret?: string;
  expiresIn?: string;
  refreshExpiresIn?: string;
  issuer?: string;
  audience?: string;
}
```

#### Auth Class

```typescript
class Auth {
  constructor(config?: AuthConfig);

  // Generate token
  generateToken(payload: any, options?: TokenOptions): Promise<string>;

  // Verify token
  verifyToken(token: string): Promise<any>;

  // Refresh token
  refreshToken(refreshToken: string): Promise<string>;

  // Hash password
  hashPassword(password: string): Promise<string>;

  // Verify password
  verifyPassword(password: string, hash: string): Promise<boolean>;

  // Get current user
  getCurrentUser(): Promise<User | null>;

  // Login
  login(credentials: LoginCredentials): Promise<AuthResult>;

  // Logout
  logout(): Promise<void>;

  // Register
  register(userData: RegisterData): Promise<AuthResult>;
}
```

#### Types

```typescript
interface TokenOptions {
  expiresIn?: string;
  issuer?: string;
  audience?: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  roles?: string[];
  metadata?: Record<string, any>;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
  metadata?: Record<string, any>;
}

interface AuthResult {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}
```

### SDK Module (`@skygenesisenterprise/sdk`)

#### SDKConfig

```typescript
interface SDKConfig {
  version?: string;
  metadata?: Record<string, any>;
  selfReference?: boolean;
}
```

#### SDK Class

```typescript
class SDK {
  constructor(config?: SDKConfig);

  // Get SDK version
  getVersion(): string;

  // Get SDK metadata
  getMetadata(): Record<string, any>;

  // Get loaded modules
  getLoadedModules(): string[];

  // Get module info
  getModuleInfo(moduleName: string): ModuleInfo | null;

  // Self-reference: get SDK instance
  getSelf(): SDK;

  // Self-reference: analyze SDK
  analyzeSelf(): Promise<SDKAnalysis>;

  // Self-reference: get SDK capabilities
  getCapabilities(): string[];
}
```

#### Types

```typescript
interface ModuleInfo {
  name: string;
  version: string;
  loaded: boolean;
  config: Record<string, any>;
}

interface SDKAnalysis {
  modules: ModuleInfo[];
  capabilities: string[];
  dependencies: string[];
  configuration: Record<string, any>;
}
```

## Framework Integrations

### React Integration

#### Hooks

```typescript
// useEnterprise hook
function useEnterprise(config?: EnterpriseConfig): EnterpriseSDK;

// useAI hook
function useAI(config?: AIConfig): AI;

// useStorage hook
function useStorage(config?: StorageConfig): Storage;

// useUI hook
function useUI(config?: UIConfig): UI;

// useProject hook
function useProject(config?: ProjectConfig): Project;

// useAuth hook
function useAuth(config?: AuthConfig): Auth;

// useSDK hook
function useSDK(config?: SDKConfig): SDK;
```

#### Provider

```typescript
// EnterpriseProvider
interface EnterpriseProviderProps {
  config?: EnterpriseConfig;
  children: ReactNode;
}

function EnterpriseProvider(props: EnterpriseProviderProps): JSX.Element;
```

### Svelte Integration

#### Stores

```typescript
// Enterprise store
const enterprise: Writable<EnterpriseSDK>;

// AI store
const ai: Writable<AI>;

// Storage store
const storage: Writable<Storage>;

// UI store
const ui: Writable<UI>;

// Project store
const project: Writable<Project>;

// Auth store
const auth: Writable<Auth>;

// SDK store
const sdk: Writable<SDK>;
```

## Error Handling

### Error Types

```typescript
// Base error class
class EnterpriseError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any);
}

// Specific error types
class AIError extends EnterpriseError;
class StorageError extends EnterpriseError;
class UIError extends EnterpriseError;
class ProjectError extends EnterpriseError;
class AuthError extends EnterpriseError;
class SDKError extends EnterpriseError;
```

### Error Codes

| Module  | Error Code            | Description                    |
| ------- | --------------------- | ------------------------------ |
| Core    | `INIT_FAILED`         | SDK initialization failed      |
| Core    | `MODULE_NOT_FOUND`    | Requested module not found     |
| Core    | `CONFIG_INVALID`      | Invalid configuration provided |
| AI      | `API_KEY_MISSING`     | API key not provided           |
| AI      | `MODEL_NOT_FOUND`     | Specified model not available  |
| AI      | `QUOTA_EXCEEDED`      | API quota exceeded             |
| Storage | `CREDENTIALS_INVALID` | Invalid storage credentials    |
| Storage | `BUCKET_NOT_FOUND`    | Storage bucket not found       |
| Storage | `FILE_NOT_FOUND`      | File not found                 |
| Auth    | `TOKEN_INVALID`       | Invalid authentication token   |
| Auth    | `TOKEN_EXPIRED`       | Authentication token expired   |
| Auth    | `CREDENTIALS_INVALID` | Invalid login credentials      |

## Utilities

### Logger

```typescript
interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}
```

### Utils

```typescript
// Common utility functions
export const utils = {
  // Deep clone object
  clone<T>(obj: T): T;

  // Debounce function
  debounce<T extends (...args: any[]) => any>(func: T, wait: number): T;

  // Throttle function
  throttle<T extends (...args: any[]) => any>(func: T, limit: number): T;

  // Generate unique ID
  generateId(): string;

  // Format date
  formatDate(date: Date, format?: string): string;

  // Validate email
  isValidEmail(email: string): boolean;

  // Validate URL
  isValidUrl(url: string): boolean;

  // Parse JSON safely
  safeParseJSON<T>(json: string, fallback?: T): T | null;
};
```

This API reference provides comprehensive documentation for all modules, components, and utilities available in the Enterprise SDK. For more examples and use cases, see the [Examples](./examples.md) documentation.
