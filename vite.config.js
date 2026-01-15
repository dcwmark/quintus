// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'src/client',     // Set the root directory for Vite to `src/client`
  plugins: [react()],     // Enable React support
  build: {
    outDir: '../../dist', // Output the build files to `dist` at the project root
    emptyOutDir: true,    // Clear the output directory before building
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@srcClient': path.resolve(__dirname, './src/client'),
      '@srcConstants': path.resolve(__dirname, './src/constants'),
      '@srcServer': path.resolve(__dirname, './src/server'),
    },
  },
  server: {
    port: 3000,           // Optional: Set the port for the dev server
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    },
  },
});

