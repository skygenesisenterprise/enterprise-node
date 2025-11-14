import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';

export default defineConfig([
  // JS/ESM build
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
      nodeResolve({
        preferBuiltins: true,
      }),
      typescript({
        tsconfig: './tsconfig.build.json',
        noEmitOnError: false,
        // Override rootDir behavior
        rootDir: undefined,
      }),
    ],
    external: ['next', 'react', 'react-dom', '@skygenesisenterprise/enterprise-node'],
  },
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
    external: ['next', 'react', 'react-dom', '@skygenesisenterprise/enterprise-node'],
  },
]);
