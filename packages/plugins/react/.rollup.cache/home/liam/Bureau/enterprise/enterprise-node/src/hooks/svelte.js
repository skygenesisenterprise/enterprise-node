import { writable, derived, get } from 'svelte/store';
import { brandingManager } from '../../packages/shared/src/branding';
function createEnterpriseStore() {
    const { subscribe, set, update } = writable({
        isInitialized: false,
        isLoading: false,
        error: null,
        enterprise: null,
    });
    return {
        subscribe,
        initialize: async (config) => {
            update((state) => ({ ...state, isLoading: true, error: null }));
            try {
                const Enterprise = (await import('../index')).Enterprise;
                const instance = new Enterprise(config);
                await instance.initialize();
                set({
                    isInitialized: true,
                    isLoading: false,
                    error: null,
                    enterprise: instance,
                });
            }
            catch (err) {
                update((state) => ({
                    ...state,
                    isLoading: false,
                    error: err instanceof Error ? err : new Error('Failed to initialize Enterprise'),
                }));
            }
        },
        reset: () => {
            set({
                isInitialized: false,
                isLoading: false,
                error: null,
                enterprise: null,
            });
        },
    };
}
export const enterpriseStore = createEnterpriseStore();
export const isInitialized = derived(enterpriseStore, ($enterprise) => $enterprise.isInitialized);
export const isLoading = derived(enterpriseStore, ($enterprise) => $enterprise.isLoading);
export const error = derived(enterpriseStore, ($enterprise) => $enterprise.error);
export const enterprise = derived(enterpriseStore, ($enterprise) => $enterprise.enterprise);
export function useAi() {
    const isProcessing = writable(false);
    return {
        isProcessing,
        enhance: async (image) => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                throw new Error('Enterprise not initialized');
            }
            isProcessing.set(true);
            try {
                return await $enterprise.ai.enhance(image);
            }
            finally {
                isProcessing.set(false);
            }
        },
        generate: async (prompt, options) => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                throw new Error('Enterprise not initialized');
            }
            isProcessing.set(true);
            try {
                return await $enterprise.ai.generate(prompt, options);
            }
            finally {
                isProcessing.set(false);
            }
        },
        isAvailable: derived([isInitialized, enterprise], ([$isInitialized, $enterprise]) => $isInitialized && !!$enterprise?.ai),
    };
}
export function useStorage() {
    const isUploading = writable(false);
    return {
        isUploading,
        save: async (file, options) => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                throw new Error('Enterprise not initialized');
            }
            isUploading.set(true);
            try {
                return await $enterprise.storage.save(file, options);
            }
            finally {
                isUploading.set(false);
            }
        },
        load: async (path) => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                throw new Error('Enterprise not initialized');
            }
            return await $enterprise.storage.load(path);
        },
        isAvailable: derived([isInitialized, enterprise], ([$isInitialized, $enterprise]) => $isInitialized && !!$enterprise?.storage),
    };
}
export function useAuth() {
    const isAuthenticating = writable(false);
    const user = derived(enterprise, ($enterprise) => $enterprise?.auth?.getCurrentUser?.() || null);
    const isAuthenticated = derived(enterprise, ($enterprise) => $enterprise?.auth?.isAuthenticated?.() || false);
    return {
        user,
        isAuthenticated,
        isAuthenticating,
        login: async (credentials) => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                throw new Error('Enterprise not initialized');
            }
            isAuthenticating.set(true);
            try {
                return await $enterprise.auth.login(credentials);
            }
            finally {
                isAuthenticating.set(false);
            }
        },
        logout: async () => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                throw new Error('Enterprise not initialized');
            }
            isAuthenticating.set(true);
            try {
                return await $enterprise.auth.logout();
            }
            finally {
                isAuthenticating.set(false);
            }
        },
        register: async (userData) => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                throw new Error('Enterprise not initialized');
            }
            isAuthenticating.set(true);
            try {
                return await $enterprise.auth.register(userData);
            }
            finally {
                isAuthenticating.set(false);
            }
        },
        isAvailable: derived([isInitialized, enterprise], ([$isInitialized, $enterprise]) => $isInitialized && !!$enterprise?.auth),
    };
}
export function useBranding() {
    const logoUrl = writable(null);
    const config = writable(null);
    const isLoading = writable(false);
    const loadBranding = async () => {
        isLoading.set(true);
        try {
            const logo = await brandingManager.getLogoUrl();
            const brandingConfig = brandingManager.getConfig();
            logoUrl.set(logo);
            config.set(brandingConfig);
            brandingManager.applyTheme();
        }
        catch (error) {
            console.error('Failed to load branding:', error);
        }
        finally {
            isLoading.set(false);
        }
    };
    const refreshLogo = async () => {
        isLoading.set(true);
        try {
            brandingManager.clearCache();
            const logo = await brandingManager.getLogoUrl();
            logoUrl.set(logo);
        }
        catch (error) {
            console.error('Failed to refresh logo:', error);
        }
        finally {
            isLoading.set(false);
        }
    };
    loadBranding();
    return {
        logoUrl,
        config,
        isLoading,
        refreshLogo,
        getTheme: () => brandingManager.getTheme(),
        getPrimaryColor: () => brandingManager.getPrimaryColor(),
        getSecondaryColor: () => brandingManager.getSecondaryColor(),
        getCompanyName: () => brandingManager.getCompanyName(),
        applyTheme: () => brandingManager.applyTheme(),
    };
}
export function useProject() {
    const currentProject = writable(null);
    const updateCurrentProject = () => {
        const $enterprise = get(enterprise);
        if ($enterprise?.project) {
            currentProject.set($enterprise.project.getCurrentProject());
        }
    };
    isInitialized.subscribe(updateCurrentProject);
    enterprise.subscribe(updateCurrentProject);
    return {
        currentProject,
        create: async (name, options) => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                throw new Error('Enterprise not initialized');
            }
            return await $enterprise.project.create(name, options);
        },
        open: async (projectIdOrName) => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                throw new Error('Enterprise not initialized');
            }
            const result = await $enterprise.project.open(projectIdOrName);
            currentProject.set(result.project);
            return result;
        },
        save: async (projectId) => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                throw new Error('Enterprise not initialized');
            }
            return await $enterprise.project.save(projectId);
        },
        isAvailable: derived([isInitialized, enterprise], ([$isInitialized, $enterprise]) => $isInitialized && !!$enterprise?.project),
    };
}
export function useUi() {
    return {
        notify: async (message, options) => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                console.warn('Enterprise not initialized, using fallback notification');
                console.log(message);
                return { id: 'fallback', shown: true };
            }
            return await $enterprise.ui.notify(message, options);
        },
        modal: async (options) => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                console.warn('Enterprise not initialized, using fallback modal');
                const result = window.confirm(options?.content || options?.title || 'Modal');
                return { id: 'fallback', opened: true, result };
            }
            return await $enterprise.ui.modal(options);
        },
        toast: async (message, type) => {
            const $enterprise = get(enterprise);
            if (!$enterprise) {
                console.log(`${type?.toUpperCase()}: ${message}`);
                return { id: 'fallback', shown: true };
            }
            return await $enterprise.ui.toast(message, type);
        },
        isAvailable: derived([isInitialized, enterprise], ([$isInitialized, $enterprise]) => $isInitialized && !!$enterprise?.ui),
    };
}
//# sourceMappingURL=svelte.js.map