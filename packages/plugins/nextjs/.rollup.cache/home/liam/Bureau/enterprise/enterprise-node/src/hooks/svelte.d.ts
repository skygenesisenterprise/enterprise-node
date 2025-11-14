export declare const enterpriseStore: {
    subscribe: any;
    initialize: (config?: any) => Promise<void>;
    reset: () => void;
};
export declare const isInitialized: any;
export declare const isLoading: any;
export declare const error: any;
export declare const enterprise: any;
export declare function useAi(): {
    isProcessing: any;
    enhance: (image: any) => Promise<any>;
    generate: (prompt: string, options?: any) => Promise<any>;
    isAvailable: any;
};
export declare function useStorage(): {
    isUploading: any;
    save: (file: any, options?: any) => Promise<any>;
    load: (path: string) => Promise<any>;
    isAvailable: any;
};
export declare function useAuth(): {
    user: any;
    isAuthenticated: any;
    isAuthenticating: any;
    login: (credentials: any) => Promise<any>;
    logout: () => Promise<any>;
    register: (userData: any) => Promise<any>;
    isAvailable: any;
};
export declare function useBranding(): {
    logoUrl: any;
    config: any;
    isLoading: any;
    refreshLogo: () => Promise<void>;
    getTheme: () => "light" | "dark" | "auto";
    getPrimaryColor: () => string;
    getSecondaryColor: () => string;
    getCompanyName: () => string;
    applyTheme: () => void;
};
export declare function useProject(): {
    currentProject: any;
    create: (name: string, options?: any) => Promise<any>;
    open: (projectIdOrName: string) => Promise<any>;
    save: (projectId?: string) => Promise<any>;
    isAvailable: any;
};
export declare function useUi(): {
    notify: (message: string, options?: any) => Promise<any>;
    modal: (options?: any) => Promise<any>;
    toast: (message: string, type?: any) => Promise<any>;
    isAvailable: any;
};
//# sourceMappingURL=svelte.d.ts.map