import { useEffect, useState, useCallback } from 'react';
import { brandingManager } from '../../packages/shared/src/branding';

export interface UseEnterpriseOptions {
  autoInitialize?: boolean;
  config?: any;
}

export function useEnterprise(options: UseEnterpriseOptions = {}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [enterprise, setEnterprise] = useState<any>(null);

  const initialize = useCallback(async () => {
    if (isInitialized || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const Enterprise = (await import('../index')).Enterprise;
      const instance = new Enterprise(options.config);
      await instance.initialize();

      setEnterprise(instance);
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize Enterprise'));
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, isLoading, options.config]);

  useEffect(() => {
    if (options.autoInitialize !== false) {
      initialize();
    }
  }, [initialize, options.autoInitialize]);

  return {
    isInitialized,
    isLoading,
    error,
    enterprise,
    initialize,
  };
}

export function useAi() {
  const { enterprise, isInitialized } = useEnterprise();
  const [isProcessing, setIsProcessing] = useState(false);

  const enhance = useCallback(
    async (image: any) => {
      if (!isInitialized || !enterprise) {
        throw new Error('Enterprise not initialized');
      }

      setIsProcessing(true);
      try {
        return await enterprise.ai.enhance(image);
      } finally {
        setIsProcessing(false);
      }
    },
    [enterprise, isInitialized]
  );

  const generate = useCallback(
    async (prompt: string, options?: any) => {
      if (!isInitialized || !enterprise) {
        throw new Error('Enterprise not initialized');
      }

      setIsProcessing(true);
      try {
        return await enterprise.ai.generate(prompt, options);
      } finally {
        setIsProcessing(false);
      }
    },
    [enterprise, isInitialized]
  );

  return {
    enhance,
    generate,
    isProcessing,
    isAvailable: isInitialized && !!enterprise?.ai,
  };
}

export function useStorage() {
  const { enterprise, isInitialized } = useEnterprise();
  const [isUploading, setIsUploading] = useState(false);

  const save = useCallback(
    async (file: any, options?: any) => {
      if (!isInitialized || !enterprise) {
        throw new Error('Enterprise not initialized');
      }

      setIsUploading(true);
      try {
        return await enterprise.storage.save(file, options);
      } finally {
        setIsUploading(false);
      }
    },
    [enterprise, isInitialized]
  );

  const load = useCallback(
    async (path: string) => {
      if (!isInitialized || !enterprise) {
        throw new Error('Enterprise not initialized');
      }

      return await enterprise.storage.load(path);
    },
    [enterprise, isInitialized]
  );

  return {
    save,
    load,
    isUploading,
    isAvailable: isInitialized && !!enterprise?.storage,
  };
}

export function useAuth() {
  const { enterprise, isInitialized } = useEnterprise();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = useCallback(
    async (credentials: any) => {
      if (!isInitialized || !enterprise) {
        throw new Error('Enterprise not initialized');
      }

      setIsAuthenticating(true);
      try {
        return await enterprise.auth.login(credentials);
      } finally {
        setIsAuthenticating(false);
      }
    },
    [enterprise, isInitialized]
  );

  const logout = useCallback(async () => {
    if (!isInitialized || !enterprise) {
      throw new Error('Enterprise not initialized');
    }

    setIsAuthenticating(true);
    try {
      return await enterprise.auth.logout();
    } finally {
      setIsAuthenticating(false);
    }
  }, [enterprise, isInitialized]);

  const register = useCallback(
    async (userData: any) => {
      if (!isInitialized || !enterprise) {
        throw new Error('Enterprise not initialized');
      }

      setIsAuthenticating(true);
      try {
        return await enterprise.auth.register(userData);
      } finally {
        setIsAuthenticating(false);
      }
    },
    [enterprise, isInitialized]
  );

  const user = enterprise?.auth?.getCurrentUser?.() || null;
  const isAuthenticated = enterprise?.auth?.isAuthenticated?.() || false;

  return {
    login,
    logout,
    register,
    user,
    isAuthenticated,
    isAuthenticating,
    isAvailable: isInitialized && !!enterprise?.auth,
  };
}

export function useBranding() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBranding = async () => {
      setIsLoading(true);
      try {
        const logo = await brandingManager.getLogoUrl();
        const brandingConfig = brandingManager.getConfig();

        setLogoUrl(logo);
        setConfig(brandingConfig);
        brandingManager.applyTheme();
      } catch (error) {
        console.error('Failed to load branding:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBranding();
  }, []);

  const refreshLogo = useCallback(async () => {
    setIsLoading(true);
    try {
      brandingManager.clearCache();
      const logo = await brandingManager.getLogoUrl();
      setLogoUrl(logo);
    } catch (error) {
      console.error('Failed to refresh logo:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTheme = useCallback(() => brandingManager.getTheme(), []);
  const getPrimaryColor = useCallback(() => brandingManager.getPrimaryColor(), []);
  const getSecondaryColor = useCallback(() => brandingManager.getSecondaryColor(), []);
  const getCompanyName = useCallback(() => brandingManager.getCompanyName(), []);

  return {
    logoUrl,
    config,
    isLoading,
    refreshLogo,
    getTheme,
    getPrimaryColor,
    getSecondaryColor,
    getCompanyName,
    applyTheme: () => brandingManager.applyTheme(),
  };
}

export function useProject() {
  const { enterprise, isInitialized } = useEnterprise();
  const [currentProject, setCurrentProject] = useState<any>(null);

  const create = useCallback(
    async (name: string, options?: any) => {
      if (!isInitialized || !enterprise) {
        throw new Error('Enterprise not initialized');
      }

      return await enterprise.project.create(name, options);
    },
    [enterprise, isInitialized]
  );

  const open = useCallback(
    async (projectIdOrName: string) => {
      if (!isInitialized || !enterprise) {
        throw new Error('Enterprise not initialized');
      }

      const result = await enterprise.project.open(projectIdOrName);
      setCurrentProject(result.project);
      return result;
    },
    [enterprise, isInitialized]
  );

  const save = useCallback(
    async (projectId?: string) => {
      if (!isInitialized || !enterprise) {
        throw new Error('Enterprise not initialized');
      }

      return await enterprise.project.save(projectId);
    },
    [enterprise, isInitialized]
  );

  useEffect(() => {
    if (isInitialized && enterprise?.project) {
      const current = enterprise.project.getCurrentProject();
      setCurrentProject(current);
    }
  }, [isInitialized, enterprise]);

  return {
    create,
    open,
    save,
    currentProject,
    isAvailable: isInitialized && !!enterprise?.project,
  };
}

export function useUi() {
  const { enterprise, isInitialized } = useEnterprise();

  const notify = useCallback(
    async (message: string, options?: any) => {
      if (!isInitialized || !enterprise) {
        console.warn('Enterprise not initialized, using fallback notification');
        console.log(message);
        return { id: 'fallback', shown: true };
      }

      return await enterprise.ui.notify(message, options);
    },
    [enterprise, isInitialized]
  );

  const modal = useCallback(
    async (options?: any) => {
      if (!isInitialized || !enterprise) {
        console.warn('Enterprise not initialized, using fallback modal');
        const result = window.confirm(options?.content || options?.title || 'Modal');
        return { id: 'fallback', opened: true, result };
      }

      return await enterprise.ui.modal(options);
    },
    [enterprise, isInitialized]
  );

  const toast = useCallback(
    async (message: string, type?: any) => {
      if (!isInitialized || !enterprise) {
        console.log(`${type?.toUpperCase()}: ${message}`);
        return { id: 'fallback', shown: true };
      }

      return await enterprise.ui.toast(message, type);
    },
    [enterprise, isInitialized]
  );

  return {
    notify,
    modal,
    toast,
    isAvailable: isInitialized && !!enterprise?.ui,
  };
}
