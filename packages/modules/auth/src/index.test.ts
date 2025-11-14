import { describe, it, expect } from 'vitest';
import { AuthManager, User } from './index';

describe('AuthManager', () => {
  it('should create an instance with config', () => {
    const authManager = new AuthManager({ provider: 'local' });
    expect(authManager).toBeInstanceOf(AuthManager);
  });

  it('should return null for invalid credentials', async () => {
    const authManager = new AuthManager({ provider: 'local' });
    const result = await authManager.authenticate({});
    expect(result).toBeNull();
  });

  it('should authorize admin users', async () => {
    const authManager = new AuthManager({ provider: 'local' });
    const adminUser: User = {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin',
      roles: ['admin'],
    };

    const result = await authManager.authorize(adminUser, 'resource', 'action');
    expect(result).toBe(true);
  });

  it('should not authorize non-admin users', async () => {
    const authManager = new AuthManager({ provider: 'local' });
    const regularUser: User = {
      id: '2',
      email: 'user@example.com',
      name: 'User',
      roles: ['user'],
    };

    const result = await authManager.authorize(regularUser, 'resource', 'action');
    expect(result).toBe(false);
  });
});
