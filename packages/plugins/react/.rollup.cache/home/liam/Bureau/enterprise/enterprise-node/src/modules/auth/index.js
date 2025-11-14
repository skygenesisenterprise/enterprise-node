export class Auth {
    constructor(runtime) {
        this.name = 'auth';
        this.version = '0.1.0';
        this.currentSession = null;
        this.runtime = runtime;
    }
    async init() {
        console.log('Auth Module initialized');
        await this.restoreSession();
    }
    async destroy() {
        await this.logout();
        console.log('Auth Module destroyed');
    }
    async login(credentials) {
        try {
            const result = await this.runtime.call('auth_login', credentials);
            const user = {
                id: result.user?.id || `user_${Date.now()}`,
                email: credentials.email,
                name: result.user?.name || credentials.email.split('@')[0],
                avatar: result.user?.avatar,
                roles: result.user?.roles || ['user'],
                metadata: result.user?.metadata || {}
            };
            const session = {
                token: result.token || this.generateToken(),
                user,
                expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
                refreshToken: result.refreshToken
            };
            this.currentSession = session;
            await this.saveSession(session);
            return {
                user,
                token: session.token,
                session
            };
        }
        catch (error) {
            console.error('Auth login failed:', error);
            throw new Error('Login failed');
        }
    }
    async logout() {
        try {
            if (this.currentSession) {
                await this.runtime.call('auth_logout', this.currentSession.token);
            }
            this.currentSession = null;
            await this.clearSession();
            return { loggedOut: true };
        }
        catch (error) {
            console.error('Auth logout failed:', error);
            return { loggedOut: false };
        }
    }
    async register(userData) {
        try {
            const result = await this.runtime.call('auth_register', userData);
            const user = {
                id: result.user?.id || `user_${Date.now()}`,
                email: userData.email,
                name: userData.name || userData.email.split('@')[0],
                roles: ['user'],
                metadata: userData.metadata || {}
            };
            const session = {
                token: result.token || this.generateToken(),
                user,
                expiresAt: Date.now() + (24 * 60 * 60 * 1000),
                refreshToken: result.refreshToken
            };
            this.currentSession = session;
            await this.saveSession(session);
            return {
                user,
                token: session.token,
                session
            };
        }
        catch (error) {
            console.error('Auth register failed:', error);
            throw new Error('Registration failed');
        }
    }
    async refreshToken() {
        if (!this.currentSession?.refreshToken) {
            throw new Error('No refresh token available');
        }
        try {
            const result = await this.runtime.call('auth_refresh', this.currentSession.refreshToken);
            const session = {
                ...this.currentSession,
                token: result.token || this.generateToken(),
                expiresAt: Date.now() + (24 * 60 * 60 * 1000),
                refreshToken: result.refreshToken || this.currentSession.refreshToken
            };
            this.currentSession = session;
            await this.saveSession(session);
            return {
                token: session.token,
                session
            };
        }
        catch (error) {
            console.error('Auth refresh failed:', error);
            throw new Error('Token refresh failed');
        }
    }
    getCurrentUser() {
        return this.currentSession?.user || null;
    }
    getCurrentSession() {
        return this.currentSession;
    }
    isAuthenticated() {
        return this.currentSession !== null && this.currentSession.expiresAt > Date.now();
    }
    hasRole(role) {
        if (!this.currentSession?.user?.roles) {
            return false;
        }
        return this.currentSession.user.roles.includes(role);
    }
    async updateProfile(updates) {
        if (!this.currentSession) {
            throw new Error('No active session');
        }
        try {
            const updatedUser = { ...this.currentSession.user, ...updates };
            const result = await this.runtime.call('auth_update_profile', updatedUser);
            this.currentSession.user = updatedUser;
            await this.saveSession(this.currentSession);
            return {
                user: updatedUser,
                updated: result.updated !== false
            };
        }
        catch (error) {
            console.error('Profile update failed:', error);
            throw new Error('Profile update failed');
        }
    }
    generateToken() {
        return btoa(`${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
    async saveSession(session) {
        try {
            localStorage.setItem('enterprise_auth_session', JSON.stringify(session));
        }
        catch (error) {
            console.warn('Failed to save session:', error);
        }
    }
    async restoreSession() {
        try {
            const stored = localStorage.getItem('enterprise_auth_session');
            if (stored) {
                const session = JSON.parse(stored);
                if (session.expiresAt > Date.now()) {
                    this.currentSession = session;
                }
                else {
                    await this.clearSession();
                }
            }
        }
        catch (error) {
            console.warn('Failed to restore session:', error);
            await this.clearSession();
        }
    }
    async clearSession() {
        try {
            localStorage.removeItem('enterprise_auth_session');
        }
        catch (error) {
            console.warn('Failed to clear session:', error);
        }
    }
}
export default Auth;
//# sourceMappingURL=index.js.map