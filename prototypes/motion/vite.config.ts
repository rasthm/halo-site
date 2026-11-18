// Isolated motion prototype: its own entry and port; nothing in the live site imports from here.
import {defineConfig} from 'vite';
import {resolve} from 'node:path';

export default defineConfig({
  root: __dirname,
  server: {port: 3032, strictPort: true},
  build: {target: 'es2022', rollupOptions: {input: {home: resolve(__dirname, 'index.html'), brain: resolve(__dirname, 'brain.html')}}},
});
