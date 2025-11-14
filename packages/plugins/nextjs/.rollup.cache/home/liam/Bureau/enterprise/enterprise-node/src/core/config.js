let config = null;
export function loadConfig() {
    if (config) {
        return config;
    }
    const defaultConfig = {
        modules: {
            ai: true,
            storage: true,
            ui: true,
            project: true,
            auth: true
        },
        runtime: {
            wasmPath: '/wasm/euse_core.wasm',
            enableWasm: true
        },
        framework: 'auto',
        debug: false
    };
    try {
        if (typeof window !== 'undefined' && window.enterpriseConfig) {
            config = { ...defaultConfig, ...window.enterpriseConfig };
        }
        else if (typeof require !== 'undefined') {
            try {
                const userConfig = require('../../../enterprise.config');
                config = { ...defaultConfig, ...userConfig.default || userConfig };
            }
            catch (e) {
                config = defaultConfig;
            }
        }
        else {
            config = defaultConfig;
        }
    }
    catch (error) {
        console.warn('Failed to load enterprise config, using defaults:', error);
        config = defaultConfig;
    }
    return config;
}
export function setConfig(userConfig) {
    config = { ...loadConfig(), ...userConfig };
}
//# sourceMappingURL=config.js.map