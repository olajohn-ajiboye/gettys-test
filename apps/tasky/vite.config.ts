import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false, // Disable CSS handling during tests
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [...configDefaults.exclude, 'src/test/'],
    },
  },
});
