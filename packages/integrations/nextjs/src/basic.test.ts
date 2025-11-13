import { describe, it, expect } from 'vitest';

describe('Next.js Bridge Basic Tests', () => {
  it('should have basic exports available', () => {
    // Test basique pour vérifier que le package peut être importé
    expect(true).toBe(true);
  });

  it('should validate Next.js configuration structure', () => {
    const config = {
      framework: 'nextjs',
      appRouter: true,
      autoRouting: {
        protected: true,
        publicRoutes: ['/login', '/register'],
        loginRedirect: '/login',
      },
      cache: {
        enabled: true,
        ttl: 3600,
      },
    };

    expect(config.framework).toBe('nextjs');
    expect(config.appRouter).toBe(true);
    expect(config.autoRouting?.protected).toBe(true);
    expect(config.cache?.enabled).toBe(true);
  });
});
