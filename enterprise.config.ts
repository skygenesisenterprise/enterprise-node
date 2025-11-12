import { EnterpriseConfig } from './src/types';

const config: EnterpriseConfig = {
  modules: {
    ai: true,
    storage: true,
    ui: true,
    project: true,
    auth: true,
    sdk: true,
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
