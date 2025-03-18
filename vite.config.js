import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Usando o @ para facilitar os imports
    },
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Substitua pela URL do seu backend se necessário
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
