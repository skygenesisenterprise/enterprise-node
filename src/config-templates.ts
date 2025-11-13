/**
 * @fileoverview Configuration Templates for Different Use Cases
 * Templates prédéfinis pour différents scénarios d'utilisation
 */

import { createConfig } from './config-builder';

/**
 * Template pour application React avec TypeScript
 */
export const reactTypeScriptTemplate = createConfig
  .custom()
  .enableModules(['ai', 'storage', 'ui', 'auth'])
  .setFramework('react')
  .enableDebug(false)
  .setBranding({
    companyName: 'React App',
    primaryColor: '#61dafb',
    secondaryColor: '#282c34',
    theme: 'light',
  })
  .setRuntime({
    wasmPath: '/wasm/euse_core.wasm',
    enableWasm: true,
  })
  .build();

/**
 * Template pour application Next.js full-stack
 */
export const nextJsFullStackTemplate = createConfig
  .fullstack()
  .setFramework('nextjs')
  .enableDebug(false) // Configurez selon vos besoins
  .configureModule('ai', {
    defaultModel: 'euse-generate-v0.1.0',
    maxTokens: 2000,
    temperature: 0.7,
  })
  .configureModule('storage', {
    defaultEncryption: true,
    compressionLevel: 'medium',
  })
  .setBranding({
    companyName: 'Next.js Enterprise',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    theme: 'auto',
  })
  .build();

/**
 * Template pour application orientée IA/Machine Learning
 */
export const aiFirstTemplate = createConfig
  .aiFirst()
  .enableDebug(true)
  .configureModule('ai', {
    models: {
      text: 'euse-generate-v0.1.0',
      image: 'euse-enhance-v0.1.0',
      analysis: 'euse-analyze-v0.1.0',
    },
    cache: {
      enabled: true,
      ttl: 3600,
      maxSize: '100MB',
    },
    fallback: {
      enabled: true,
      provider: 'openai',
    },
  })
  .configureModule('storage', {
    vectorStorage: true,
    embeddingsCache: true,
  })
  .setFramework('react')
  .setBranding({
    companyName: 'AI Company',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    theme: 'dark',
  })
  .build();

/**
 * Template pour application mobile (React Native)
 */
export const mobileTemplate = createConfig
  .custom()
  .enableModules(['ai', 'storage', 'auth'])
  .setFramework('react')
  .enableDebug(false)
  .setRuntime({
    wasmPath: './wasm/euse_core.wasm',
    enableWasm: false, // Désactivé pour mobile
  })
  .configureModule('storage', {
    localStorage: true,
    offlineSync: true,
    encryption: true,
  })
  .configureModule('auth', {
    biometric: true,
    offlineMode: true,
    sessionTimeout: 86400, // 24h
  })
  .setBranding({
    companyName: 'Mobile App',
    primaryColor: '#007aff',
    secondaryColor: '#5856d6',
    theme: 'auto',
  })
  .build();

/**
 * Template pour application e-commerce
 */
export const ecommerceTemplate = createConfig
  .custom()
  .enableModules(['ai', 'storage', 'ui', 'auth', 'project'])
  .setFramework('nextjs')
  .enableDebug(false)
  .configureModule('ai', {
    productRecommendations: true,
    sentimentAnalysis: true,
    chatbot: true,
    searchOptimization: true,
  })
  .configureModule('storage', {
    productImages: true,
    userProfiles: true,
    orderHistory: true,
    cacheStrategy: 'redis',
  })
  .configureModule('auth', {
    socialLogin: ['google', 'facebook', 'apple'],
    twoFactorAuth: true,
    guestCheckout: true,
  })
  .configureModule('ui', {
    themeSystem: true,
    internationalization: true,
    accessibility: true,
  })
  .setBranding({
    companyName: 'E-Commerce Store',
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    theme: 'light',
  })
  .build();

/**
 * Template pour dashboard d'analyse
 */
export const analyticsDashboardTemplate = createConfig
  .custom()
  .enableModules(['ai', 'storage', 'ui'])
  .setFramework('react')
  .enableDebug(false)
  .configureModule('ai', {
    dataAnalysis: true,
    predictions: true,
    anomalyDetection: true,
    reportGeneration: true,
  })
  .configureModule('storage', {
    timeSeries: true,
    aggregation: true,
    realTime: true,
  })
  .configureModule('ui', {
    charts: true,
    widgets: true,
    exportOptions: ['pdf', 'excel', 'csv'],
  })
  .setBranding({
    companyName: 'Analytics Platform',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    theme: 'dark',
  })
  .build();

/**
 * Template pour application de gestion de projet
 */
export const projectManagementTemplate = createConfig
  .fullstack()
  .setFramework('nextjs')
  .enableDebug(false)
  .configureModule('project', {
    ganttCharts: true,
    kanbanBoards: true,
    timeTracking: true,
    teamCollaboration: true,
    notifications: true,
  })
  .configureModule('ai', {
    taskSuggestion: true,
    riskAnalysis: true,
    resourceOptimization: true,
  })
  .configureModule('auth', {
    roleBasedAccess: true,
    teamManagement: true,
    permissions: ['admin', 'manager', 'member', 'viewer'],
  })
  .setBranding({
    companyName: 'Project Manager',
    primaryColor: '#8b5cf6',
    secondaryColor: '#7c3aed',
    theme: 'light',
  })
  .build();

/**
 * Template pour application éducative
 */
export const educationalTemplate = createConfig
  .custom()
  .enableModules(['ai', 'storage', 'ui', 'auth'])
  .setFramework('nextjs')
  .enableDebug(false)
  .configureModule('ai', {
    tutoring: true,
    quizGeneration: true,
    contentCreation: true,
    progressTracking: true,
    adaptiveLearning: true,
  })
  .configureModule('storage', {
    courseMaterials: true,
    studentProgress: true,
    multimediaContent: true,
  })
  .configureModule('auth', {
    studentProfiles: true,
    instructorRoles: true,
    parentAccess: true,
  })
  .setBranding({
    companyName: 'EduPlatform',
    primaryColor: '#f59e0b',
    secondaryColor: '#d97706',
    theme: 'light',
  })
  .build();

/**
 * Template pour application de santé/medical
 */
export const healthcareTemplate = createConfig
  .custom()
  .enableModules(['ai', 'storage', 'auth'])
  .setFramework('react')
  .enableDebug(false)
  .configureModule('ai', {
    medicalAnalysis: true,
    diagnosisAssistance: true,
    drugInteractions: true,
    patientRiskAssessment: true,
  })
  .configureModule('storage', {
    hipaaCompliance: true,
    encryptedStorage: true,
    auditLogs: true,
    backupStrategy: 'daily',
  })
  .configureModule('auth', {
    hipaaCompliance: true,
    twoFactorAuth: true,
    sessionManagement: true,
    roleBasedAccess: ['doctor', 'nurse', 'admin', 'patient'],
  })
  .setBranding({
    companyName: 'Healthcare Platform',
    primaryColor: '#ef4444',
    secondaryColor: '#dc2626',
    theme: 'light',
  })
  .build();

/**
 * Template pour développement rapide (MVP)
 */
export const mvpTemplate = createConfig
  .minimal()
  .enableDebug(true)
  .setFramework('auto')
  .setBranding({
    companyName: 'MVP Startup',
    primaryColor: '#06b6d4',
    theme: 'auto',
  })
  .build();

/**
 * Template pour microservice
 */
export const microserviceTemplate = createConfig
  .custom()
  .enableModules(['ai', 'storage'])
  .setFramework('auto')
  .enableDebug(false)
  .setRuntime({
    wasmPath: './wasm/euse_core.wasm',
    enableWasm: false, // Désactivé pour microservice léger
  })
  .configureModule('storage', {
    databaseIntegration: true,
    caching: true,
    connectionPooling: true,
  })
  .build();

/**
 * Map des templates avec descriptions
 */
export const ConfigTemplates = {
  'react-typescript': {
    name: 'React + TypeScript',
    description: 'Application React moderne avec TypeScript',
    template: reactTypeScriptTemplate,
    tags: ['react', 'typescript', 'frontend'],
  },

  'nextjs-fullstack': {
    name: 'Next.js Full-Stack',
    description: 'Application Next.js complète avec SSR et API routes',
    template: nextJsFullStackTemplate,
    tags: ['nextjs', 'fullstack', 'ssr'],
  },

  'ai-first': {
    name: 'AI-First Application',
    description: "Application optimisée pour l'intelligence artificielle",
    template: aiFirstTemplate,
    tags: ['ai', 'machine-learning', 'automation'],
  },

  mobile: {
    name: 'Mobile Application',
    description: 'Application mobile (React Native) avec support offline',
    template: mobileTemplate,
    tags: ['mobile', 'react-native', 'offline'],
  },

  ecommerce: {
    name: 'E-Commerce Platform',
    description: 'Plateforme e-commerce complète avec paiements et gestion',
    template: ecommerceTemplate,
    tags: ['ecommerce', 'payments', 'inventory'],
  },

  'analytics-dashboard': {
    name: 'Analytics Dashboard',
    description: "Dashboard d'analyse de données avec graphiques et rapports",
    template: analyticsDashboardTemplate,
    tags: ['analytics', 'dashboard', 'data-visualization'],
  },

  'project-management': {
    name: 'Project Management',
    description: "Outil de gestion de projet avec collaboration d'équipe",
    template: projectManagementTemplate,
    tags: ['project-management', 'collaboration', 'productivity'],
  },

  educational: {
    name: 'Educational Platform',
    description: 'Plateforme éducative avec apprentissage adaptatif',
    template: educationalTemplate,
    tags: ['education', 'e-learning', 'adaptive-learning'],
  },

  healthcare: {
    name: 'Healthcare Platform',
    description: 'Application médicale avec conformité HIPAA',
    template: healthcareTemplate,
    tags: ['healthcare', 'medical', 'hipaa'],
  },

  mvp: {
    name: 'MVP (Minimum Viable Product)',
    description: 'Configuration minimale pour démarrer rapidement',
    template: mvpTemplate,
    tags: ['mvp', 'startup', 'minimal'],
  },

  microservice: {
    name: 'Microservice',
    description: 'Configuration légère pour microservice',
    template: microserviceTemplate,
    tags: ['microservice', 'api', 'backend'],
  },
} as const;

/**
 * Fonction helper pour obtenir un template par nom
 */
export function getConfigTemplate(name: string) {
  return ConfigTemplates[name as keyof typeof ConfigTemplates];
}

/**
 * Fonction helper pour lister tous les templates
 */
export function listConfigTemplates() {
  return Object.entries(ConfigTemplates).map(([key, value]) => ({
    key,
    ...value,
  }));
}

/**
 * Fonction helper pour rechercher des templates par tags
 */
export function searchConfigTemplatesByTag(tag: string) {
  return Object.entries(ConfigTemplates).filter(([_, template]) =>
    (template.tags as readonly string[]).includes(tag)
  );
}

export default ConfigTemplates;
