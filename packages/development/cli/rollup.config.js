import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        banner: '#!/usr/bin/env node'
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
        declaration: true,
        declarationDir: 'dist',
        rootDir: 'src'
      })
    ],
    external: Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.peerDependencies || {}))
  }
]);