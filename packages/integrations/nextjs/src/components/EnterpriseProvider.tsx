'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useNextjsEnterprise } from '../hooks';

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
export function EnterpriseProvider({
  children,
  config,
  autoInitialize = true,
  fallback = <div>Chargement de Enterprise...</div>,
  errorComponent,
}: EnterpriseProviderProps) {
  const { isInitialized, isLoading, error, initialize } = useNextjsEnterprise(config);

  useEffect(() => {
    if (autoInitialize && !isInitialized && !isLoading) {
      initialize();
    }
  }, [autoInitialize, isInitialized, isLoading, initialize]);

  if (error) {
    return errorComponent ? (
      <>{errorComponent(error)}</>
    ) : (
      <div className="enterprise-error">
        <h2>Erreur d'initialisation</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isInitialized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
