import { ModuleInterface } from '../../types';
import { WasmRuntime } from '../../core/runtime';
export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    roles?: string[];
    metadata?: any;
}
export interface AuthSession {
    token: string;
    user: User;
    expiresAt: number;
    refreshToken?: string;
}
export declare class Auth implements ModuleInterface {
    name: string;
    version: string;
    private runtime;
    private currentSession;
    constructor(runtime: WasmRuntime);
    init(): Promise<void>;
    destroy(): Promise<void>;
    login(credentials: {
        email: string;
        password?: string;
        provider?: string;
        token?: string;
    }): Promise<{
        user: User;
        token: string;
        session: AuthSession;
    }>;
    logout(): Promise<{
        loggedOut: boolean;
    }>;
    register(userData: {
        email: string;
        password?: string;
        name?: string;
        metadata?: any;
    }): Promise<{
        user: User;
        token: string;
        session: AuthSession;
    }>;
    refreshToken(): Promise<{
        token: string;
        session: AuthSession;
    }>;
    getCurrentUser(): User | null;
    getCurrentSession(): AuthSession | null;
    isAuthenticated(): boolean;
    hasRole(role: string): boolean;
    updateProfile(updates: Partial<User>): Promise<{
        user: User;
        updated: boolean;
    }>;
    private generateToken;
    private saveSession;
    private restoreSession;
    private clearSession;
}
export default Auth;
//# sourceMappingURL=index.d.ts.map