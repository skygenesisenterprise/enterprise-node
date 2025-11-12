import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['src/hooks/**', 'src/unified-import*.test.ts', 'node_modules/**', 'dist/**'],
  },
});
