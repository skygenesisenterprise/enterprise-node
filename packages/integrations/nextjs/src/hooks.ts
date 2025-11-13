import { useEffect, useState, useCallback, useMemo } from 'react';
import { EnterpriseSDK, EnterpriseConfig } from '@skygenesisenterprise/enterprise-node';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useRouter as usePagesRouter } from 'next/router';

// Types pour le bridge Next.js
export interface NextjsEnterpriseOptions extends EnterpriseConfig {
  /** Activer le mode App Router (défaut: true) */
  appRouter?: boolean;
  /** Configuration des routes automatiques */
  autoRouting?: {
    /** Activer les routes protégées automatiquement */
    protected?: boolean;
    /** Routes publiques (ne nécessitent pas d'auth) */
    publicRoutes?: string[];
    /** Page de redirection pour auth */
    loginRedirect?: string;
  };
  /** Configuration du cache Next.js */
  cache?: {
    /** Activer le cache intelligent */
    enabled?: boolean;
    /** Durée du cache en secondes */
    ttl?: number;
  };
  /** Modules Next.js à charger */
  nextjsModules?: string[];
}

export interface UseNextjsEnterpriseReturn {
  /** SDK Enterprise initialisé */
  sdk: EnterpriseSDK | null;
  /** État d'initialisation */
  isInitialized: boolean;
  /** État de chargement */
  isLoading: boolean;
  /** Erreur d'initialisation */
  error: Error | null;
  /** Router Next.js (App Router ou Pages Router) */
  router: any;
  /** Informations sur la page actuelle */
  pageInfo: {
    pathname: string;
    query: Record<string, string>;
    params?: Record<string, string>;
  };
  /** Fonctions utilitaires Next.js */
  utils: {
    /** Navigation programmatique */
    navigate: (href: string, options?: any) => Promise<void>;
    /** Rechargement de la page */
    reload: () => void;
    /** Retour en arrière */
    back: () => void;
  };
  /** Initialiser manuellement le SDK */
  initialize: () => Promise<void>;
  /** Détruire le SDK */
  destroy: () => Promise<void>;
}

/**
 * Hook principal pour Next.js Enterprise Bridge
 * Fournit un accès transparent au SDK Enterprise avec les fonctionnalités Next.js
 */
export function useNextjsEnterprise(options: NextjsEnterpriseOptions): UseNextjsEnterpriseReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sdk, setSdk] = useState<EnterpriseSDK | null>(null);

  // Détection du type de router
  const isAppRouter = options.appRouter !== false;

  // Hooks Next.js selon le type de router
  const appRouter = isAppRouter ? useRouter() : null;
  const pagesRouter = !isAppRouter ? usePagesRouter() : null;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Router unifié
  const router = useMemo(() => {
    return isAppRouter ? appRouter : pagesRouter;
  }, [isAppRouter, appRouter, pagesRouter]);

  // Informations sur la page actuelle
  const pageInfo = useMemo(() => {
    if (isAppRouter && pathname && searchParams) {
      const query: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        query[key] = value;
      });

      return {
        pathname,
        query,
        params: {}, // À extraire des params dynamiques si nécessaire
      };
    } else if (!isAppRouter && pagesRouter) {
      return {
        pathname: pagesRouter.pathname,
        query: pagesRouter.query as Record<string, string>,
        params: {},
      };
    }

    return { pathname: '', query: {}, params: {} };
  }, [isAppRouter, pathname, searchParams, pagesRouter]);

  // Initialisation du SDK
  const initialize = useCallback(async () => {
    if (isInitialized || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const enterpriseSdk = new EnterpriseSDK(options);
      await enterpriseSdk.initialize();

      setSdk(enterpriseSdk);
      setIsInitialized(true);

      // Configuration des routes protégées si activé
      if (options.autoRouting?.protected && enterpriseSdk.auth) {
        const isPublicRoute = options.autoRouting.publicRoutes?.includes(pageInfo.pathname);
        const isAuthenticated = await (enterpriseSdk.auth as any).isAuthenticated?.();

        if (!isPublicRoute && !isAuthenticated) {
          const loginRedirect = options.autoRouting.loginRedirect || '/login';
          if (isAppRouter) {
            await appRouter?.push(loginRedirect);
          } else {
            await pagesRouter?.push(loginRedirect);
          }
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize Enterprise SDK');
      setError(error);
      console.error('Enterprise SDK initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, isLoading, options, pageInfo.pathname, isAppRouter, appRouter, pagesRouter]);

  // Destruction du SDK
  const destroy = useCallback(async () => {
    if (sdk) {
      await sdk.destroy();
      setSdk(null);
      setIsInitialized(false);
      setError(null);
    }
  }, [sdk]);

  // Fonctions utilitaires Next.js
  const utils = useMemo(
    () => ({
      navigate: async (href: string, options?: any) => {
        if (isAppRouter) {
          await appRouter?.push(href);
        } else {
          await pagesRouter?.push(href, options?.as, options);
        }
      },
      reload: () => {
        if (isAppRouter) {
          appRouter?.refresh();
        } else {
          pagesRouter?.reload();
        }
      },
      back: () => {
        if (isAppRouter) {
          window.history.back();
        } else {
          pagesRouter?.back();
        }
      },
    }),
    [isAppRouter, appRouter, pagesRouter]
  );

  // Initialisation automatique
  useEffect(() => {
    initialize();

    return () => {
      destroy();
    };
  }, []);

  return {
    sdk,
    isInitialized,
    isLoading,
    error,
    router,
    pageInfo,
    utils,
    initialize,
    destroy,
  };
}

/**
 * Hook simplifié pour l'authentification Next.js
 */
export function useNextjsAuth() {
  const { sdk, isInitialized, utils } = useNextjsEnterprise({
    modules: {},
    autoRouting: {
      protected: true,
      publicRoutes: ['/login', '/register', '/forgot-password'],
      loginRedirect: '/login',
    },
  });

  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isInitialized && sdk?.auth) {
      const currentUser = (sdk.auth as any).getCurrentUser?.();
      const authenticated = (sdk.auth as any).isAuthenticated?.();
      setUser(currentUser);
      setIsAuthenticated(authenticated || false);
    }
  }, [isInitialized, sdk]);

  const login = useCallback(
    async (credentials: any) => {
      if (!sdk?.auth) throw new Error('Auth module not available');

      const result = await (sdk.auth as any).login(credentials);
      setUser(result.user);
      setIsAuthenticated(true);

      // Redirection vers la page précédente ou dashboard
      const returnUrl =
        new URLSearchParams(window.location.search).get('returnUrl') || '/dashboard';
      await utils.navigate(returnUrl);

      return result;
    },
    [sdk, utils]
  );

  const logout = useCallback(async () => {
    if (!sdk?.auth) throw new Error('Auth module not available');

    await (sdk.auth as any).logout();
    setUser(null);
    setIsAuthenticated(false);

    // Redirection vers la page de login
    await utils.navigate('/login');
  }, [sdk, utils]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    isAvailable: isInitialized && !!sdk?.auth,
  };
}

/**
 * Hook pour le stockage avec cache Next.js
 */
export function useNextjsStorage() {
  const { sdk, isInitialized } = useNextjsEnterprise({ modules: {} });
  const [isUploading, setIsUploading] = useState(false);

  const save = useCallback(
    async (file: any, options?: any) => {
      if (!isInitialized || !sdk) {
        throw new Error('Enterprise SDK not initialized');
      }

      setIsUploading(true);
      try {
        const result = await (sdk.storage as any).save(file, options);

        // Invalider le cache Next.js si nécessaire
        if (typeof window !== 'undefined' && 'next' in window) {
          // Cache invalidation logic here
        }

        return result;
      } finally {
        setIsUploading(false);
      }
    },
    [sdk, isInitialized]
  );

  const load = useCallback(
    async (path: string, options?: any) => {
      if (!isInitialized || !sdk) {
        throw new Error('Enterprise SDK not initialized');
      }

      return await (sdk.storage as any).load(path, options);
    },
    [sdk, isInitialized]
  );

  return {
    save,
    load,
    isUploading,
    isAvailable: isInitialized && !!sdk?.storage,
  };
}

/**
 * Hook pour l'IA avec streaming Next.js
 */
export function useNextjsAI() {
  const { sdk, isInitialized } = useNextjsEnterprise({ modules: {} });
  const [isProcessing, setIsProcessing] = useState(false);

  const generateStream = useCallback(
    async (prompt: string, options?: any) => {
      if (!isInitialized || !sdk) {
        throw new Error('Enterprise SDK not initialized');
      }

      setIsProcessing(true);
      try {
        // Utiliser le streaming si disponible dans Next.js
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt, ...options }),
        });

        if (!response.body) {
          throw new Error('Streaming not supported');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          result += chunk;

          // Callback pour le streaming
          options?.onChunk?.(chunk);
        }

        return result;
      } finally {
        setIsProcessing(false);
      }
    },
    [sdk, isInitialized]
  );

  const generate = useCallback(
    async (prompt: string, options?: any) => {
      if (!isInitialized || !sdk) {
        throw new Error('Enterprise SDK not initialized');
      }

      setIsProcessing(true);
      try {
        return await (sdk.ai as any).generate(prompt, options);
      } finally {
        setIsProcessing(false);
      }
    },
    [sdk, isInitialized]
  );

  return {
    generate,
    generateStream,
    isProcessing,
    isAvailable: isInitialized && !!sdk?.ai,
  };
}
