import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// 'use client' - This directive is for Next.js App Router
import { useEffect } from 'react';
import { useNextjsEnterprise } from '../hooks';
/**
 * Provider pour l'intégration Next.js avec Enterprise SDK
 * Gère l'initialisation et les erreurs automatiquement
 */
export function EnterpriseProvider({ children, config, autoInitialize = true, fallback = _jsx("div", { children: "Chargement de Enterprise..." }), errorComponent, }) {
    const { isInitialized, isLoading, error, initialize } = useNextjsEnterprise(config);
    useEffect(() => {
        if (autoInitialize && !isInitialized && !isLoading) {
            initialize();
        }
    }, [autoInitialize, isInitialized, isLoading, initialize]);
    if (error) {
        return errorComponent ? (_jsx(_Fragment, { children: errorComponent(error) })) : (_jsxs("div", { className: "enterprise-error", children: [_jsx("h2", { children: "Erreur d'initialisation" }), _jsx("p", { children: error.message })] }));
    }
    if (isLoading) {
        return _jsx(_Fragment, { children: fallback });
    }
    if (!isInitialized) {
        return _jsx(_Fragment, { children: fallback });
    }
    return _jsx(_Fragment, { children: children });
}
//# sourceMappingURL=EnterpriseProvider.js.map