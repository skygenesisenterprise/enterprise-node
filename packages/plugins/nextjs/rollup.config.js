import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import commonjs from '@rollup/plugin-commonjs';

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
      // TypeScript plugin must come first to handle .ts files
      typescript({
        tsconfig: './tsconfig.build.json',
        noEmitOnError: false,
        declaration: false,
        // Ensure proper TypeScript compilation
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'node',
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          skipLibCheck: true,
          importHelpers: false,
          // Important: allow type-only imports
          importsNotUsedAsValues: 'remove',
          // Fix for TypeScript compilation
          isolatedModules: true,
          noEmit: false,
        },
      }),
      // Then resolve modules
      nodeResolve({
        preferBuiltins: true,
        extensions: ['.js', '.ts'],
      }),
      // Handle CommonJS modules
      commonjs(),
    ],
    external: [
      'next',
      'react',
      'react-dom',
      '@skygenesisenterprise/enterprise-node',
      // Remove relative path from external to allow TypeScript plugin to process it
    ],
  },
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        compilerOptions: {
          skipLibCheck: true,
        },
      }),
    ],
    external: [
      'next',
      'react',
      'react-dom',
      '@skygenesisenterprise/enterprise-node',
      '../../../core/src/plugin-system/types',
    ],
  },
]);
