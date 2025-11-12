import { EnterpriseConfig } from './src/types';

const config: EnterpriseConfig = {
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
  debug: process.env.NODE_ENV === 'development'
};

export default config;