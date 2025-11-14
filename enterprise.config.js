/**
 * @fileoverview Enterprise Configuration
 * Configuration principale pour le SDK Enterprise
 */

const config = {
  modules: {
    ai: true,
    storage: true,
    ui: true,
    auth: true,
    project: true,
    sdk: true,
  },

  // Plugin System Configuration
  plugins: {
    // React Plugin Configuration
    react: {
      strictMode: true,
      concurrentMode: false,
      profiler: false,
      devTools: true,
      hotReload: true,
      components: {
        theme: 'auto',
        branding: true,
      },
    },

    // Next.js Plugin Configuration
    nextjs: {
      runtime: 'nodejs',
      swcMinify: true,
      experimental: {},
      images: {},
      features: {
        analytics: true,
        performance: true,
        errorBoundary: true,
      },
    },

    // Capacitor Plugin Configuration
    capacitor: {
      platforms: ['ios', 'android', 'web'],
      appId: 'com.enterprise.app',
      appName: 'Enterprise App',
      webDir: 'dist',
      server: {
        url: 'http://localhost:3000',
        cleartext: false,
      },
      plugins: {
        camera: false,
        geolocation: false,
        pushNotifications: false,
        storage: true,
      },
      features: {
        analytics: true,
        crashReporting: true,
        performance: true,
        offlineSupport: true,
      },
    },
  },

  runtime: {
    wasmPath: '/wasm/euse_core.wasm',
    enableWasm: true,
  },

  framework: 'auto',
  debug: false,

  branding: {
    logo: {
      path: './assets/enterprise.png',
      width: 200,
      height: 60,
      alt: 'Sky Genesis Enterprise',
      format: 'png',
    },

    companyName: 'Sky Genesis Enterprise',
    primaryColor: '#007acc',
    secondaryColor: '#004466',
    theme: 'auto',
  },
};

export default config;
