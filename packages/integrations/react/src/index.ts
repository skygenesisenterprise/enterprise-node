import { useEffect, useState, useCallback, useRef } from 'react';
import { EnterpriseSDK, EnterpriseConfig } from '@skygenesisenterprise/core';

export interface UseEnterpriseOptions {
  autoInitialize?: boolean;
  config?: EnterpriseConfig;
  onInitialized?: (sdk: EnterpriseSDK) => void;
  onError?: (error: Error) => void;
}

export function useEnterprise(options: UseEnterpriseOptions = {}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sdk, setSdk] = useState<EnterpriseSDK | null>(null);
  const sdkRef = useRef<EnterpriseSDK | null>(null);

  const initialize = useCallback(async () => {
    if (isInitialized || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const enterpriseSdk = new EnterpriseSDK(options.config);
      await enterpriseSdk.initialize();
      
      sdkRef.current = enterpriseSdk;
      setSdk(enterpriseSdk);
      setIsInitialized(true);
      
      options.onInitialized?.(enterpriseSdk);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize Enterprise');
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, isLoading, options]);

  const destroy = useCallback(async () => {
    if (sdkRef.current) {
      await sdkRef.current.destroy();
      sdkRef.current = null;
      setSdk(null);
      setIsInitialized(false);
      setError(null);
    }
  }, []);

  useEffect(() => {
    if (options.autoInitialize !== false) {
      initialize();
    }

    return () => {
      destroy();
    };
  }, [initialize, destroy, options.autoInitialize]);

  return {
    isInitialized,
    isLoading,
    error,
    sdk,
    initialize,
    destroy
  };
}

export function useAi() {
  const { sdk, isInitialized } = useEnterprise();
  const [isProcessing, setIsProcessing] = useState(false);

  const enhance = useCallback(async (image: any, options?: any) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    setIsProcessing(true);
    try {
      return await sdk.ai.enhance(image, options);
    } finally {
      setIsProcessing(false);
    }
  }, [sdk, isInitialized]);

  const generate = useCallback(async (prompt: string, options?: any) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    setIsProcessing(true);
    try {
      return await sdk.ai.generate(prompt, options);
    } finally {
      setIsProcessing(false);
    }
  }, [sdk, isInitialized]);

  const analyze = useCallback(async (data: any, options?: any) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    setIsProcessing(true);
    try {
      return await sdk.ai.analyze(data, options);
    } finally {
      setIsProcessing(false);
    }
  }, [sdk, isInitialized]);

  return {
    enhance,
    generate,
    analyze,
    isProcessing,
    isAvailable: isInitialized && !!sdk?.ai
  };
}

export function useStorage() {
  const { sdk, isInitialized } = useEnterprise();
  const [isUploading, setIsUploading] = useState(false);

  const save = useCallback(async (file: any, options?: any) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    setIsUploading(true);
    try {
      return await sdk.storage.save(file, options);
    } finally {
      setIsUploading(false);
    }
  }, [sdk, isInitialized]);

  const load = useCallback(async (path: string, options?: any) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    return await sdk.storage.load(path, options);
  }, [sdk, isInitialized]);

  const remove = useCallback(async (path: string) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    return await sdk.storage.delete(path);
  }, [sdk, isInitialized]);

  const list = useCallback(async (directory?: string) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    return await sdk.storage.list(directory);
  }, [sdk, isInitialized]);

  return {
    save,
    load,
    remove,
    list,
    isUploading,
    isAvailable: isInitialized && !!sdk?.storage
  };
}

export function useAuth() {
  const { sdk, isInitialized } = useEnterprise();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (credentials: any) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    setIsAuthenticating(true);
    try {
      const result = await sdk.auth.login(credentials);
      setUser(result.user);
      setIsAuthenticated(true);
      return result;
    } finally {
      setIsAuthenticating(false);
    }
  }, [sdk, isInitialized]);

  const logout = useCallback(async () => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    setIsAuthenticating(true);
    try {
      await sdk.auth.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsAuthenticating(false);
    }
  }, [sdk, isInitialized]);

  const register = useCallback(async (userData: any) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    setIsAuthenticating(true);
    try {
      const result = await sdk.auth.register(userData);
      setUser(result.user);
      setIsAuthenticated(true);
      return result;
    } finally {
      setIsAuthenticating(false);
    }
  }, [sdk, isInitialized]);

  useEffect(() => {
    if (isInitialized && sdk?.auth) {
      const currentUser = sdk.auth.getCurrentUser?.();
      const authenticated = sdk.auth.isAuthenticated?.();
      setUser(currentUser);
      setIsAuthenticated(authenticated || false);
    }
  }, [isInitialized, sdk]);

  return {
    login,
    logout,
    register,
    user,
    isAuthenticated,
    isAuthenticating,
    isAvailable: isInitialized && !!sdk?.auth
  };
}

export function useProject() {
  const { sdk, isInitialized } = useEnterprise();
  const [currentProject, setCurrentProject] = useState<any>(null);

  const create = useCallback(async (name: string, options?: any) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    return await sdk.project.create(name, options);
  }, [sdk, isInitialized]);

  const open = useCallback(async (projectIdOrName: string) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    const result = await sdk.project.open(projectIdOrName);
    setCurrentProject(result.project);
    return result;
  }, [sdk, isInitialized]);

  const save = useCallback(async (projectId?: string) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    return await sdk.project.save(projectId);
  }, [sdk, isInitialized]);

  const remove = useCallback(async (projectId: string) => {
    if (!isInitialized || !sdk) {
      throw new Error('Enterprise not initialized');
    }

    const result = await sdk.project.delete(projectId);
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
    return result;
  }, [sdk, isInitialized, currentProject]);

  useEffect(() => {
    if (isInitialized && sdk?.project) {
      const current = sdk.project.getCurrentProject?.();
      setCurrentProject(current);
    }
  }, [isInitialized, sdk]);

  return {
    create,
    open,
    save,
    remove,
    currentProject,
    isAvailable: isInitialized && !!sdk?.project
  };
}

export function useUi() {
  const { sdk, isInitialized } = useEnterprise();

  const notify = useCallback(async (message: string, options?: any) => {
    if (!isInitialized || !sdk) {
      console.warn('Enterprise not initialized, using fallback notification');
      console.log(message);
      return { id: 'fallback', shown: true };
    }

    return await sdk.ui.notify(message, options);
  }, [sdk, isInitialized]);

  const modal = useCallback(async (options?: any) => {
    if (!isInitialized || !sdk) {
      console.warn('Enterprise not initialized, using fallback modal');
      const result = window.confirm(options?.content || options?.title || 'Modal');
      return { id: 'fallback', opened: true, result };
    }

    return await sdk.ui.modal(options);
  }, [sdk, isInitialized]);

  const toast = useCallback(async (message: string, type?: any) => {
    if (!isInitialized || !sdk) {
      console.log(`${type?.toUpperCase()}: ${message}`);
      return { id: 'fallback', shown: true };
    }

    return await sdk.ui.toast(message, type);
  }, [sdk, isInitialized]);

  return {
    notify,
    modal,
    toast,
    isAvailable: isInitialized && !!sdk?.ui
  };
}

// Context Provider
import { createContext, useContext as useReactContext, ReactNode } from 'react';

interface EnterpriseContextValue {
  sdk: EnterpriseSDK | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  initialize: () => Promise<void>;
  destroy: () => Promise<void>;
}

const EnterpriseContext = createContext<EnterpriseContextValue | null>(null);

export interface EnterpriseProviderProps {
  children: ReactNode;
  config?: EnterpriseConfig;
  autoInitialize?: boolean;
  onInitialized?: (sdk: EnterpriseSDK) => void;
  onError?: (error: Error) => void;
}

export function EnterpriseProvider({
  children,
  config,
  autoInitialize = true,
  onInitialized,
  onError
}: EnterpriseProviderProps) {
  const enterprise = useEnterprise({ config, autoInitialize, onInitialized, onError });

  return (
    <EnterpriseContext.Provider value={enterprise}>
      {children}
    </EnterpriseContext.Provider>
  );
}

export function useContext() {
  const context = useReactContext(EnterpriseContext);
  if (!context) {
    throw new Error('useContext must be used within an EnterpriseProvider');
  }
  return context;
}