// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/login': {
        target: 'http://horas_backend:4000',
        changeOrigin: true,
        secure: false,
      },
      '/usuarios': {
        target: 'http://horas_backend:4000',
        changeOrigin: true,
        secure: false,
      },
      '/vacaciones': {
        target: 'http://horas_backend:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
