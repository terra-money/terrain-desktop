import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'src/nested/index.html'),
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@terra-money/terra.js': '@terra-money/terra.js/dist/bundle.js',
      process: path.resolve(__dirname, 'src/polyfills/process-es6.js'),
      'readable-stream': 'vite-compatible-readable-stream',
    },
  },
  plugins: [react(), tsconfigPaths(), svgr()],
});
