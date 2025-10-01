import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
  base: '/pl:frontline/widget/',
  server: {
    port: 5173,
    hmr: true
  },
  plugins: [react()],
  root: __dirname,
  build: {
    outDir: '../public/widget',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'messengerWidget.bundle.js',
        chunkFileNames: 'chunks/messengerWidget.bundle.js',
        assetFileNames: 'assets/messengerWidget.bundle.[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
