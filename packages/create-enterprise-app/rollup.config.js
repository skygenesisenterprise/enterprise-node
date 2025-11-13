import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default defineConfig([
  // Main build
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve({
        preferBuiltins: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
        rootDir: 'src',
      }),
    ],
    external: [
      'commander',
      'chalk',
      'inquirer',
      'ora',
      'fs-extra',
      'path',
      'cross-spawn',
      'semver',
    ],
  },
  // Binary build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/bin/create-enterprise-app.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        preferBuiltins: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
    ],
    external: [
      'commander',
      'chalk',
      'inquirer',
      'ora',
      'fs-extra',
      'path',
      'cross-spawn',
      'semver',
    ],
  },
]);
