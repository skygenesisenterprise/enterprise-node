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
export declare class AuthManager {
    constructor(_config: AuthConfig);
    authenticate(_credentials: Record<string, any>): Promise<User | null>;
    authorize(user: User, _resource: string, _action: string): Promise<boolean>;
}
export * from './types';
