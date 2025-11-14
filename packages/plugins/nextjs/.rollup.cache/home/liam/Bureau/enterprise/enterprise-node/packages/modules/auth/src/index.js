export class AuthManager {
    constructor(_config) { }
    async authenticate(_credentials) {
        // Implementation placeholder
        return null;
    }
    async authorize(user, _resource, _action) {
        // Implementation placeholder
        return user.roles.includes('admin');
    }
}
export * from './types';
//# sourceMappingURL=index.js.map