import { brandingManager } from '../../packages/shared/src/branding';
import { runtime_log } from '../modules/debug/macros';
export class WasmRuntime {
    constructor() {
        this.wasmModule = null;
        this.wasmInstance = null;
        this.isInitialized = false;
    }
    async initialize() {
        if (this.isInitialized)
            return;
        return runtime_log.span('wasm_initialize', async () => {
            try {
                const wasmPath = '/wasm/euse_core.wasm';
                runtime_log.debug('Loading WASM module', { path: wasmPath });
                const response = await fetch(wasmPath);
                if (!response.ok) {
                    throw new Error(`Failed to load WASM module: ${response.statusText}`);
                }
                const wasmBytes = await response.arrayBuffer();
                runtime_log.debug('Compiling WASM module', { size: wasmBytes.byteLength });
                this.wasmModule = await WebAssembly.compile(wasmBytes);
                const importObject = this.createImportObject();
                runtime_log.debug('Instantiating WASM module');
                this.wasmInstance = await WebAssembly.instantiate(this.wasmModule, importObject);
                this.isInitialized = true;
                runtime_log.info('EUSE Core WASM runtime initialized successfully');
            }
            catch (error) {
                runtime_log.warn('WASM runtime initialization failed, falling back to JS simulation', {
                    error: error instanceof Error ? error.message : String(error),
                });
                this.isInitialized = false;
            }
        });
    }
    async call(method, ...args) {
        return runtime_log.span('wasm_call', async () => {
            if (!this.isInitialized || !this.wasmInstance) {
                runtime_log.debug('Using JS simulation for method', { method });
                return this.simulateCall(method, ...args);
            }
            try {
                const exports = this.wasmInstance.exports;
                if (exports[method] && typeof exports[method] === 'function') {
                    runtime_log.debug('Calling WASM method', { method, argsCount: args.length });
                    return exports[method](...args);
                }
                throw new Error(`Method '${method}' not found in WASM exports`);
            }
            catch (error) {
                runtime_log.warn(`WASM call failed for method '${method}', falling back to simulation`, {
                    error: error instanceof Error ? error.message : String(error),
                });
                return this.simulateCall(method, ...args);
            }
        }, { method, argsCount: args.length });
    }
    destroy() {
        runtime_log.span('wasm_destroy', () => {
            runtime_log.info('Destroying WASM runtime');
            this.wasmModule = null;
            this.wasmInstance = null;
            this.isInitialized = false;
        });
    }
    createImportObject() {
        return {
            env: {
                memory: new WebAssembly.Memory({ initial: 256 }),
                table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
                abort: () => {
                    runtime_log.error('WASM abort called');
                    throw new Error('Aborted');
                },
                log: (ptr, len) => {
                    runtime_log.debug('WASM Log', { ptr, len });
                },
                performance_now: () => {
                    const now = performance.now();
                    runtime_log.trace('WASM performance_now called', { now });
                    return now;
                },
            },
        };
    }
    simulateCall(method, ...args) {
        runtime_log.debug('Running JS simulation', { method, argsCount: args.length });
        const simulations = {
            ai_enhance: (image) => {
                runtime_log.trace('AI enhance simulation', { hasImage: !!image });
                return Promise.resolve({ enhanced: true, data: image });
            },
            ai_generate: (prompt) => {
                runtime_log.trace('AI generate simulation', { promptLength: prompt.length });
                return Promise.resolve({ text: `Generated: ${prompt}` });
            },
            storage_save: (file) => {
                runtime_log.trace('Storage save simulation', { hasFile: !!file });
                return Promise.resolve({ path: `/storage/${Date.now()}` });
            },
            storage_load: (path) => {
                runtime_log.trace('Storage load simulation', { path });
                return Promise.resolve({ data: `Loaded from ${path}` });
            },
            ui_notify: (message) => {
                runtime_log.trace('UI notify simulation', { message });
                return Promise.resolve({ shown: true });
            },
            ui_modal: (options) => {
                runtime_log.trace('UI modal simulation', { hasOptions: !!options });
                return Promise.resolve({ opened: true });
            },
            project_open: (name) => {
                runtime_log.trace('Project open simulation', { name });
                return Promise.resolve({ project: { name, id: Date.now() } });
            },
            project_save: (project) => {
                runtime_log.trace('Project save simulation', { hasProject: !!project });
                return Promise.resolve({ saved: true });
            },
            auth_login: (user) => {
                runtime_log.trace('Auth login simulation', { hasUser: !!user });
                return Promise.resolve({ token: 'mock-token', user });
            },
            auth_logout: () => {
                runtime_log.trace('Auth logout simulation');
                return Promise.resolve({ loggedOut: true });
            },
            branding_get_logo: () => {
                runtime_log.trace('Branding get logo simulation');
                return Promise.resolve({ url: brandingManager.getLogoUrl() });
            },
            branding_get_config: () => {
                runtime_log.trace('Branding get config simulation');
                return Promise.resolve({ config: brandingManager.getConfig() });
            },
            branding_apply_theme: () => {
                runtime_log.trace('Branding apply theme simulation');
                brandingManager.applyTheme();
                return Promise.resolve({ applied: true });
            },
        };
        const simulation = simulations[method];
        if (simulation) {
            return simulation(...args);
        }
        runtime_log.error('No simulation available for method', { method });
        throw new Error(`No simulation available for method: ${method}`);
    }
}
//# sourceMappingURL=runtime.js.map