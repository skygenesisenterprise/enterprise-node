import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      nodeResolve({
        preferBuiltins: true
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: 'dist',
        rootDir: 'src'
      })
    ],
    external: [
      '@skygenesisenterprise/shared',
      '@skygenesisenterprise/module-ai',
      '@skygenesisenterprise/module-storage',
      '@skygenesisenterprise/module-ui',
      '@skygenesisenterprise/module-project',
      '@skygenesisenterprise/module-auth'
    ]
  }
]);