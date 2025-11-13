import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
      }),
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
