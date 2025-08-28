import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

import * as path from 'path';

export default defineConfig({
  plugins: [react()],
  root: __dirname, // Set root to `src/widget`
  base: '/pl:payment/widget/',
  build: {
    outDir: '../public/widget',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
});