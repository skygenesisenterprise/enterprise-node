export interface UseEnterpriseOptions {
    autoInitialize?: boolean;
    config?: any;
}
export declare function useEnterprise(options?: UseEnterpriseOptions): {
    isInitialized: any;
    isLoading: any;
    error: any;
    enterprise: any;
    initialize: any;
};
export declare function useAi(): {
    enhance: any;
    generate: any;
    isProcessing: any;
    isAvailable: any;
};
export declare function useStorage(): {
    save: any;
    load: any;
    isUploading: any;
    isAvailable: any;
};
export declare function useAuth(): {
    login: any;
    logout: any;
    register: any;
    user: any;
    isAuthenticated: any;
    isAuthenticating: any;
    isAvailable: any;
};
export declare function useBranding(): {
    logoUrl: any;
    config: any;
    isLoading: any;
    refreshLogo: any;
    getTheme: any;
    getPrimaryColor: any;
    getSecondaryColor: any;
    getCompanyName: any;
    applyTheme: () => void;
};
export declare function useProject(): {
    create: any;
    open: any;
    save: any;
    currentProject: any;
    isAvailable: any;
};
export declare function useUi(): {
    notify: any;
    modal: any;
    toast: any;
    isAvailable: any;
};
