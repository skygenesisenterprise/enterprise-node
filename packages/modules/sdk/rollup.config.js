import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default {
  input: resolve(__dirname, 'src/index.ts'),
  output: [
    {
      file: resolve(__dirname, 'dist/index.js'),
      format: 'cjs',
      exports: 'named',
    },
    {
      file: resolve(__dirname, 'dist/index.esm.js'),
      format: 'es',
    },
  ],
  plugins: [
    require('@rollup/plugin-node-resolve')(),
    require('@rollup/plugin-typescript')({
      tsconfig: resolve(__dirname, 'tsconfig.json'),
    }),
  ],
  external: ['@skygenesisenterprise/shared', '@skygenesisenterprise/enterprise-node'],
};
