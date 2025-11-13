import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default defineConfig([
  {
    input: 'dist/index.js',
    output: [
      {
        file: 'dist/index.bundle.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.bundle.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve({
        preferBuiltins: true,
      }),
    ],
    external: [
      '@skygenesisenterprise/shared',
      '@skygenesisenterprise/module-ai',
      '@skygenesisenterprise/module-storage',
      '@skygenesisenterprise/module-ui',
      '@skygenesisenterprise/module-project',
      '@skygenesisenterprise/module-auth',
    ],
  },
]);
