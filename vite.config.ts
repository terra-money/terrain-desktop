import react from '@vitejs/plugin-react'
import * as path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      '@terra-money/terra.js': '@terra-money/terra.js/dist/bundle.js',
      'process': path.resolve(__dirname, 'src/polyfills/process-es6.js'),
      'readable-stream': 'vite-compatible-readable-stream',
    },
  },
  plugins: [react(), tsconfigPaths(), svgr()],
});