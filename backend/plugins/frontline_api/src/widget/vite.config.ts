import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
  base: '/pl:frontline/widget/',
  server: {
    port: 3001,
    hmr: true
  },
  plugins: [react()],
  root: __dirname,
  build: {
    outDir: '../public/widget',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
