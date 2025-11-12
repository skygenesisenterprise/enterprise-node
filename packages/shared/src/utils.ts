import { FrameworkType } from './types';

export function detectFramework(): FrameworkType {
  if (typeof window !== 'undefined') {
    // Next.js detection
    if ((window as any).__NEXT_DATA__) {
      return 'nextjs';
    }

    // React detection
    if ((window as any).React || (window as any).ReactDOM) {
      return 'react';
    }

    // Vue detection
    if ((window as any).Vue) {
      return 'vue';
    }

    // Svelte detection (more complex, might need runtime check)
    if (document.querySelector('[data-svelte-h]')) {
      return 'svelte';
    }
  }

  if (typeof process !== 'undefined' && process.versions?.node) {
    return 'vanilla';
  }

  return 'vanilla';
}

export function generateId(prefix = 'enterprise'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || ({} as any), source[key] as any);
    } else {
      result[key] = source[key] as any;
    }
  }

  return result;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function sanitizeString(str: string): string {
  return str.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function getEnvironment(): 'development' | 'production' | 'test' {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env.NODE_ENV as any;
  }

  if (typeof location !== 'undefined') {
    const hostname = location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
  }

  return 'production';
}
