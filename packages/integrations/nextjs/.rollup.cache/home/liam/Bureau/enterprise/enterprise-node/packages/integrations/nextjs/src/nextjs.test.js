import { describe, it, expect, vi } from 'vitest';
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';
// Mock Next.js modules
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        refresh: vi.fn(),
        back: vi.fn(),
    }),
    usePathname: () => '/test',
    useSearchParams: () => new URLSearchParams(),
}));
vi.mock('next/router', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        reload: vi.fn(),
        back: vi.fn(),
        pathname: '/test',
        query: {},
    }),
}));
describe('Next.js Bridge', () => {
    it('should create SDK with Next.js configuration', () => {
        const enterprise = new EnterpriseSDK({
            framework: 'nextjs',
            appRouter: true,
            autoRouting: {
                protected: true,
                publicRoutes: ['/login', '/register'],
                loginRedirect: '/login',
            },
        });
        expect(enterprise).toBeDefined();
        expect(enterprise.getConfig().framework).toBe('nextjs');
    });
    it('should have framework configuration available', () => {
        const enterprise = new EnterpriseSDK({
            framework: 'nextjs',
        });
        const config = enterprise.getConfig();
        expect(config).toBeDefined();
        // Note: nextjs-specific properties would be available through integrations
    });
    it('should handle Next.js specific options', () => {
        const enterprise = new EnterpriseSDK({
            framework: 'nextjs',
            appRouter: false,
            cache: {
                enabled: true,
                ttl: 3600,
            },
        });
        const config = enterprise.getConfig();
        expect(config.framework).toBe('nextjs');
    });
    it('should initialize without errors', async () => {
        const enterprise = new EnterpriseSDK({
            framework: 'nextjs',
            debug: false,
        });
        await expect(enterprise.initialize()).resolves.not.toThrow();
    });
});
//# sourceMappingURL=nextjs.test.js.map