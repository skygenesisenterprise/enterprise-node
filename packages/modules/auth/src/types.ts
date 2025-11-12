export interface AuthConfig {
  provider: 'local' | 'oauth' | 'saml';
  credentials?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}