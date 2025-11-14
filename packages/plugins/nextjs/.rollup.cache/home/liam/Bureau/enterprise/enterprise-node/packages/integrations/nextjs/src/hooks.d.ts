import { EnterpriseSDK, EnterpriseConfig } from '@skygenesisenterprise/enterprise-node';
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
export declare function useNextjsEnterprise(options: NextjsEnterpriseOptions): UseNextjsEnterpriseReturn;
/**
 * Hook simplifié pour l'authentification Next.js
 */
export declare function useNextjsAuth(): {
    user: any;
    isAuthenticated: boolean;
    login: (credentials: any) => Promise<any>;
    logout: () => Promise<void>;
    isAvailable: boolean;
};
/**
 * Hook pour le stockage avec cache Next.js
 */
export declare function useNextjsStorage(): {
    save: (file: any, options?: any) => Promise<any>;
    load: (path: string, options?: any) => Promise<any>;
    isUploading: boolean;
    isAvailable: boolean;
};
/**
 * Hook pour l'IA avec streaming Next.js
 */
export declare function useNextjsAI(): {
    generate: (prompt: string, options?: any) => Promise<any>;
    generateStream: (prompt: string, options?: any) => Promise<string>;
    isProcessing: boolean;
    isAvailable: boolean;
};
//# sourceMappingURL=hooks.d.ts.map