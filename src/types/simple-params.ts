/**
 * @fileoverview Paramètres simplifiés pour les modules du SDK Enterprise
 * Interfaces facilitées avec presets et configurations rapides
 */

// ========================================
// MODULE AI - Paramètres Simplifiés
// ========================================

export interface SimpleAIOptions {
  /** Qualité rapide : 'fast', 'good', 'best' */
  quality?: 'fast' | 'good' | 'best';
  /** Mode : 'auto', 'creative', 'precise' */
  mode?: 'auto' | 'creative' | 'precise';
  /** Longueur du résultat : 'short', 'medium', 'long' */
  length?: 'short' | 'medium' | 'long';
}

export interface SimpleImageOptions {
  /** Taille de sortie : 'small', 'medium', 'large', 'original' */
  size?: 'small' | 'medium' | 'large' | 'original';
  /** Format : 'auto', 'webp', 'jpeg', 'png' */
  format?: 'auto' | 'webp' | 'jpeg' | 'png';
  /** Optimisation automatique */
  optimize?: boolean;
}

export interface SimpleAnalysisOptions {
  /** Type d'analyse : 'auto', 'text', 'image', 'data' */
  type?: 'auto' | 'text' | 'image' | 'data';
  /** Niveau de détail : 'quick', 'standard', 'deep' */
  depth?: 'quick' | 'standard' | 'deep';
}

// ========================================
// MODULE STORAGE - Paramètres Simplifiés
// ========================================

export interface SimpleStorageOptions {
  /** Niveau de sécurité : 'public', 'private', 'secure' */
  security?: 'public' | 'private' | 'secure';
  /** Performance : 'fast', 'balanced', 'reliable' */
  performance?: 'fast' | 'balanced' | 'reliable';
  /** Durée de vie : 'temp', 'session', 'permanent' */
  ttl?: 'temp' | 'session' | 'permanent';
}

export interface SimpleUploadOptions {
  /** Type de fichier : 'auto', 'image', 'document', 'video', 'data' */
  type?: 'auto' | 'image' | 'document' | 'video' | 'data';
  /** Compression automatique */
  compress?: boolean;
  /** Redimensionnement automatique pour les images */
  resize?: boolean;
}

// ========================================
// MODULE AUTH - Paramètres Simplifiés
// ========================================

export interface SimpleAuthOptions {
  /** Méthode : 'auto', 'email', 'social', 'enterprise' */
  method?: 'auto' | 'email' | 'social' | 'enterprise';
  /** Niveau de sécurité : 'basic', 'standard', 'high' */
  level?: 'basic' | 'standard' | 'high';
  /** Session : 'short', 'day', 'week', 'month' */
  session?: 'short' | 'day' | 'week' | 'month';
}

export interface SimpleUserOptions {
  /** Rôle par défaut */
  role?: 'user' | 'admin' | 'moderator' | 'guest';
  /** Vérification automatique */
  verify?: boolean;
}

// ========================================
// MODULE PROJECT - Paramètres Simplifiés
// ========================================

export interface SimpleProjectOptions {
  /** Type de projet : 'web', 'mobile', 'desktop', 'api', 'ml' */
  type?: 'web' | 'mobile' | 'desktop' | 'api' | 'ml';
  /** Template : 'blank', 'starter', 'fullstack', 'minimal' */
  template?: 'blank' | 'starter' | 'fullstack' | 'minimal';
  /** Complexité : 'simple', 'standard', 'advanced' */
  complexity?: 'simple' | 'standard' | 'advanced';
}

export interface SimpleTaskOptions {
  /** Priorité : 'low', 'normal', 'high', 'urgent' */
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  /** Assignation : 'auto', 'manual', 'roundrobin' */
  assign?: 'auto' | 'manual' | 'roundrobin';
}

// ========================================
// MODULE UI - Paramètres Simplifiés
// ========================================

export interface SimpleUIOptions {
  /** Thème : 'auto', 'light', 'dark', 'custom' */
  theme?: 'auto' | 'light' | 'dark' | 'custom';
  /** Style : 'minimal', 'modern', 'classic', 'playful' */
  style?: 'minimal' | 'modern' | 'classic' | 'playful';
  /** Animation : 'none', 'subtle', 'normal', 'rich' */
  animation?: 'none' | 'subtle' | 'normal' | 'rich';
}

export interface SimpleNotificationOptions {
  /** Type : 'auto', 'info', 'success', 'warning', 'error' */
  type?: 'auto' | 'info' | 'success' | 'warning' | 'error';
  /** Durée : 'short', 'medium', 'long', 'sticky' */
  duration?: 'short' | 'medium' | 'long' | 'sticky';
  /** Position : 'auto', 'top', 'bottom', 'center' */
  position?: 'auto' | 'top' | 'bottom' | 'center';
}

// ========================================
// PRESETS CONFIGURATIONS
// ========================================

export interface ModulePresets {
  /** Presets AI */
  ai: {
    /** Génération de texte rapide */
    fastText: SimpleAIOptions;
    /** Analyse d'image complète */
    deepImage: SimpleImageOptions & SimpleAnalysisOptions;
    /** Création de contenu */
    contentCreation: SimpleAIOptions;
  };

  /** Presets Storage */
  storage: {
    /** Upload d'images optimisé */
    imageUpload: SimpleStorageOptions & SimpleUploadOptions;
    /** Stockage sécurisé */
    secureStorage: SimpleStorageOptions;
    /** Cache rapide */
    fastCache: SimpleStorageOptions;
  };

  /** Presets Auth */
  auth: {
    /** Authentification rapide */
    quickAuth: SimpleAuthOptions;
    /** Sécurité entreprise */
    enterpriseAuth: SimpleAuthOptions & SimpleUserOptions;
    /** Session invité */
    guestSession: SimpleAuthOptions;
  };

  /** Presets Project */
  project: {
    /** Démarrage rapide */
    quickStart: SimpleProjectOptions;
    /** Application web complète */
    webApp: SimpleProjectOptions;
    /** API REST */
    restApi: SimpleProjectOptions;
  };

  /** Presets UI */
  ui: {
    /** Interface moderne */
    modernUI: SimpleUIOptions;
    /** Mode sombre */
    darkMode: SimpleUIOptions;
    /** Interface minimale */
    minimalUI: SimpleUIOptions;
  };
}

// ========================================
// CONFIGURATIONS PRÉDÉFINIES
// ========================================

export const PRESETS: ModulePresets = {
  ai: {
    fastText: {
      quality: 'fast',
      mode: 'auto',
      length: 'short',
    },
    deepImage: {
      size: 'large',
      format: 'auto',
      optimize: true,
      type: 'image',
      depth: 'deep',
    },
    contentCreation: {
      quality: 'best',
      mode: 'creative',
      length: 'medium',
    },
  },

  storage: {
    imageUpload: {
      security: 'public',
      performance: 'fast',
      ttl: 'permanent',
      type: 'image',
      compress: true,
      resize: true,
    },
    secureStorage: {
      security: 'secure',
      performance: 'reliable',
      ttl: 'permanent',
    },
    fastCache: {
      security: 'private',
      performance: 'fast',
      ttl: 'temp',
    },
  },

  auth: {
    quickAuth: {
      method: 'auto',
      level: 'basic',
      session: 'day',
    },
    enterpriseAuth: {
      method: 'enterprise',
      level: 'high',
      session: 'week',
      role: 'user',
      verify: true,
    },
    guestSession: {
      method: 'auto',
      level: 'basic',
      session: 'short',
    },
  },

  project: {
    quickStart: {
      type: 'web',
      template: 'starter',
      complexity: 'simple',
    },
    webApp: {
      type: 'web',
      template: 'fullstack',
      complexity: 'standard',
    },
    restApi: {
      type: 'api',
      template: 'minimal',
      complexity: 'simple',
    },
  },

  ui: {
    modernUI: {
      theme: 'auto',
      style: 'modern',
      animation: 'subtle',
    },
    darkMode: {
      theme: 'dark',
      style: 'modern',
      animation: 'normal',
    },
    minimalUI: {
      theme: 'light',
      style: 'minimal',
      animation: 'none',
    },
  },
};

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

/**
 * Convertit des options simples vers options complètes
 */
export function expandOptions<T extends Record<string, any>>(simple: T, preset?: T): T {
  return {
    ...preset,
    ...simple,
  };
}

/**
 * Crée une configuration de module avec presets
 */
export function createModuleConfig<T>(
  module: keyof ModulePresets,
  presetName: keyof ModulePresets[keyof ModulePresets],
  overrides?: Partial<T>
): T {
  const preset = PRESETS[module][presetName] as any;
  return expandOptions(overrides || {}, preset);
}

/**
 * Obtient un preset par nom
 */
export function getPreset(
  module: keyof ModulePresets,
  presetName: keyof ModulePresets[keyof ModulePresets]
) {
  return PRESETS[module][presetName];
}

/**
 * Liste tous les presets disponibles pour un module
 */
export function listPresets(module: keyof ModulePresets): string[] {
  return Object.keys(PRESETS[module]);
}
