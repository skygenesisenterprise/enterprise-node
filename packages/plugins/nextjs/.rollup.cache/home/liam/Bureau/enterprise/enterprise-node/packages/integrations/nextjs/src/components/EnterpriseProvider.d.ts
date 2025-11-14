import { ReactNode } from 'react';
interface EnterpriseProviderProps {
    children: ReactNode;
    config?: any;
    autoInitialize?: boolean;
    fallback?: ReactNode;
    errorComponent?: (error: Error) => ReactNode;
}
/**
 * Provider pour l'intégration Next.js avec Enterprise SDK
 * Gère l'initialisation et les erreurs automatiquement
 */
export declare function EnterpriseProvider({ children, config, autoInitialize, fallback, errorComponent, }: EnterpriseProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=EnterpriseProvider.d.ts.map