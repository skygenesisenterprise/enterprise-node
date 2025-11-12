import { defineConfig } from 'rollup';

export default defineConfig([
  {
    input: 'index.js',
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
    plugins: [],
    external: []
  }
]);