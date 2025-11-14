import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  server: {
    port: 8000,
    open: true
  },
  build: {
    outDir: 'dist-build',
    emptyOutDir: true
  }
});

